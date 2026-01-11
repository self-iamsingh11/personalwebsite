import torch
import torch.nn as nn
from torchvision import models, transforms
from transformers import DistilBertModel, DistilBertTokenizer
from PIL import Image
from typing import List, Optional
import io

# --- Backend API Setup (FastAPI) ---
# To run this: pip install fastapi uvicorn torch torchvision transformers pillow
# uvicorn backend:app --reload

try:
    from fastapi import FastAPI, UploadFile, File, Form, HTTPException
    from fastapi.middleware.cors import CORSMiddleware
    from pydantic import BaseModel
except ImportError:
    print("FastAPI or Pydantic not installed. This script defines the model architecture.")
    FastAPI = None
    CORSMiddleware = None

# --- Model Configuration ---
CONFIG = {
    "bert_model": "distilbert-base-uncased",
    "image_model": "resnet50",
    "hidden_size": 256,
    "dropout": 0.3,
    "num_outputs": 3  # Views, CTR, Engagement Score
}

# --- Multi-Modal Neural Network Architecture ---

class TextEncoder(nn.Module):
    """
    Encodes the Title and Description using DistilBERT.
    Freezes early layers to speed up training if needed.
    """
    def __init__(self, model_name=CONFIG["bert_model"]):
        super(TextEncoder, self).__init__()
        self.bert = DistilBertModel.from_pretrained(model_name)
        
    def forward(self, input_ids, attention_mask):
        output = self.bert(input_ids=input_ids, attention_mask=attention_mask)
        # Use the [CLS] token embedding (first token) as the sentence representation
        return output.last_hidden_state[:, 0, :]

class ImageEncoder(nn.Module):
    """
    Encodes the Thumbnail using a pre-trained ResNet.
    Removes the final classification layer to get feature vectors.
    """
    def __init__(self, model_name=CONFIG["image_model"]):
        super(ImageEncoder, self).__init__()
        # Load pretrained ResNet
        resnet = models.resnet50(pretrained=True)
        # Remove the final fully connected layer
        modules = list(resnet.children())[:-1]
        self.resnet = nn.Sequential(*modules)
        self.output_dim = 2048 # ResNet50 output size

    def forward(self, images):
        features = self.resnet(images)
        # Flatten: (Batch, 2048, 1, 1) -> (Batch, 2048)
        return features.view(features.size(0), -1)

class ContentPredictor(nn.Module):
    """
    Fusion Network: Combines Text and Image features to predict performance.
    """
    def __init__(self):
        super(ContentPredictor, self).__init__()
        self.text_encoder = TextEncoder()
        self.image_encoder = ImageEncoder()
        
        # Dimensions
        text_dim = 768  # DistilBERT output
        image_dim = 2048 # ResNet50 output
        
        # Fusion Layer (Concatenation + MLP)
        self.fusion = nn.Sequential(
            nn.Linear(text_dim + image_dim, 1024),
            nn.BatchNorm1d(1024),
            nn.ReLU(),
            nn.Dropout(CONFIG["dropout"]),
            nn.Linear(1024, CONFIG["hidden_size"]),
            nn.ReLU()
        )
        
        # Regression Heads for different metrics
        self.views_head = nn.Linear(CONFIG["hidden_size"], 1)
        self.ctr_head = nn.Linear(CONFIG["hidden_size"], 1)
        self.score_head = nn.Linear(CONFIG["hidden_size"], 1)

    def forward(self, input_ids, attention_mask, images):
        # 1. Get Text Embeddings
        text_features = self.text_encoder(input_ids, attention_mask)
        
        # 2. Get Image Embeddings
        image_features = self.image_encoder(images)
        
        # 3. Fuse
        combined = torch.cat((text_features, image_features), dim=1)
        fused = self.fusion(combined)
        
        # 4. Predict
        views = self.views_head(fused)
        ctr = torch.sigmoid(self.ctr_head(fused)) * 100 # Scale to 0-100%
        score = torch.sigmoid(self.score_head(fused)) * 100 # Scale 0-100
        
        return views, ctr, score

# --- Inference Utilities ---

def transform_image(image_bytes):
    """Preprocess image for ResNet"""
    my_transforms = transforms.Compose([
        transforms.Resize(256),
        transforms.CenterCrop(224),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], 
                             std=[0.229, 0.224, 0.225])
    ])
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    return my_transforms(image).unsqueeze(0) # Add batch dim

def transform_text(text, tokenizer, max_len=128):
    """Preprocess text for BERT"""
    encoding = tokenizer(
        text,
        add_special_tokens=True,
        max_length=max_len,
        return_token_type_ids=False,
        padding='max_length',
        truncation=True,
        return_attention_mask=True,
        return_tensors='pt',
    )
    return encoding['input_ids'], encoding['attention_mask']

# --- API Implementation ---

if FastAPI:
    app = FastAPI(title="Content Performance API")
    
    # CORS middleware to allow frontend to call the API
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    
    # Initialize model (In production, load weights here)
    # device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    # model = ContentPredictor().to(device)
    # model.eval()
    # tokenizer = DistilBertTokenizer.from_pretrained(CONFIG["bert_model"])

    @app.post("/predict")
    async def predict(
        title: str = Form(...),
        description: str = Form(...),
        category: str = Form(...),
        thumbnail: UploadFile = File(...)
    ):
        """
        Endpoint to predict video performance based on multimodal input.
        """
        try:
            # 1. Process Image
            image_data = await thumbnail.read()
            # image_tensor = transform_image(image_data).to(device)
            
            # 2. Process Text (Combine title + desc + category)
            full_text = f"{category} : {title} . {description}"
            # input_ids, attention_mask = transform_text(full_text, tokenizer)
            # input_ids = input_ids.to(device)
            # attention_mask = attention_mask.to(device)
            
            # 3. Inference
            # with torch.no_grad():
            #     views, ctr, score = model(input_ids, attention_mask, image_tensor)
            
            # MOCK RESPONSE (Since we don't have trained weights loaded)
            import random
            return {
                "predicted_views": int(random.uniform(5000, 50000)),
                "predicted_ctr": round(random.uniform(2.5, 12.0), 2),
                "engagement_score": int(random.uniform(40, 95)),
                "status": "success",
                "meta": {
                    "text_length": len(full_text),
                    "image_size": len(image_data)
                }
            }
            
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    # Example usage of the architecture
    print("Initializing Multi-Modal Architecture...")
    model = ContentPredictor()
    print("Model Architecture Created Successfully.")
    print(model)
    print("\nReady for training or inference.")