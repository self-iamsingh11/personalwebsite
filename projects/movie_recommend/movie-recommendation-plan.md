# 🎬 Advanced Movie Recommendation Engine - Production-Grade Project Plan

**Complexity Level**: 🔴🔴🔴 EXTREME (8-12 weeks, Enterprise-Scale)
**Project Scope**: Full-stack recommendation system with Netflix/Amazon-level sophistication
**Tech Stack**: Python FastAPI | React/Next.js | PostgreSQL | Redis | Kafka | Docker | Kubernetes

---

## 📋 Table of Contents

1. [Executive Overview](#executive-overview)
2. [System Architecture](#system-architecture)
3. [ML Components - Detailed](#ml-components)
4. [Backend Implementation](#backend-implementation)
5. [Frontend Design & UX](#frontend-design)
6. [Data Pipeline](#data-pipeline)
7. [Production Challenges & Solutions](#production-challenges)
8. [Deployment & Monitoring](#deployment)
9. [Development Timeline](#timeline)
10. [Testing Strategy](#testing)

---

## Executive Overview

### Project Goals

**Primary Objective**: Build a production-grade, horizontally scalable movie recommendation engine that handles 1M+ users with <100ms recommendation latency while achieving Netflix-level personalization quality.

### Success Metrics

| Metric | Target | Baseline |
|--------|--------|----------|
| Recommendation Latency | <100ms p95 | - |
| Precision@10 | >0.82 | - |
| Recall@10 | >0.80 | - |
| NDCG (Normalized DCG) | >0.75 | - |
| Cold-start Coverage | >95% | 40% |
| Coverage (% of catalog recommended) | >85% | 60% |
| Serendipity Score | >0.65 | - |
| System Uptime | 99.95% | - |
| Model Update Frequency | Every 6 hours | - |

### Key Differentiators

✅ **Multi-Model Ensemble Approach** - Not just one algorithm, a federation of specialized models
✅ **Real-time Cold-Start Resolution** - Handles new users/movies immediately
✅ **Context-Aware Personalization** - Time, device, mood, viewing history considered
✅ **Explainability Layer** - Users understand why recommendations are made
✅ **A/B Testing Framework** - Continuous experimentation pipeline
✅ **Edge Computing Support** - Low-latency serving at CDN edge
✅ **Privacy-First Design** - Optional federated learning path

---

## System Architecture

### 3-Tier Microservices Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENT LAYER (React/Next.js)             │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Movie Discovery UI  │ Personalized Feed │ Search UI  │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              ↓ (REST/GraphQL)
┌──────────────────────────────────────────────────────────────────────┐
│                    API GATEWAY LAYER (FastAPI)                        │
│  ┌─────────────────────────────────────────────────────────────────┐ │
│  │ Rate Limiting │ Auth (JWT) │ Request Validation │ Response Caching
│  └─────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────────────┐
│               MICROSERVICES LAYER (FastAPI Services)                  │
│  ┌─────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐  │
│  │ Rec Engine  │ │ User Profile │ │ Content      │ │ Analytics &  │  │
│  │ Service     │ │ Service      │ │ Service      │ │ Feedback     │  │
│  └─────────────┘ └──────────────┘ └──────────────┘ └──────────────┘  │
│  ┌─────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐  │
│  │ Ranking     │ │ Search &     │ │ Notification │ │ Experiment   │  │
│  │ Service     │ │ Filter Svc   │ │ Service      │ │ Service      │  │
│  └─────────────┘ └──────────────┘ └──────────────┘ └──────────────┘  │
└──────────────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────────────┐
│                    DATA LAYER (Caching & Storage)                     │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ │
│  │   Redis      │ │  PostgreSQL  │ │  MongoDB     │ │  Elasticsearch
│  │ (Cache)      │ │ (Relational) │ │  (Features)  │ │ (Full-text)  │
│  └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘ │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐                  │
│  │  S3/Blob     │ │  Pinecone/   │ │  Cassandra   │                  │
│  │ Storage      │ │  Weaviate    │ │ (Time-series)                   │
│  └──────────────┘ └──────────────┘ └──────────────┘                  │
└──────────────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────────────┐
│              ML PIPELINE LAYER (Training & Inference)                 │
│  ┌────────────────┐ ┌────────────────┐ ┌────────────────┐            │
│  │ Feature Store  │ │ Model Registry │ │ Inference      │            │
│  │ (Feast)        │ │ (MLflow)       │ │ Engine         │            │
│  └────────────────┘ └────────────────┘ └────────────────┘            │
│  ┌────────────────┐ ┌────────────────┐                               │
│  │ Training       │ │ Batch          │                               │
│  │ Pipeline       │ │ Processing     │                               │
│  │ (Kubeflow)     │ │ (Spark/Flink)  │                               │
│  └────────────────┘ └────────────────┘                               │
└──────────────────────────────────────────────────────────────────────┘
```

### Interaction Flow Diagram

```
User Opens App
    ↓
[1] Load User Profile Service
    ├─ Fetch user embedding from Redis cache
    ├─ Get recent watch history (last 30 days)
    └─ Retrieve user preferences & metadata
    ↓
[2] Parallel Model Invocations (300ms timeout each)
    ├─ Collaborative Filtering Model (Matrix Factorization)
    │  └─ Generate 100 candidate items
    ├─ Content-Based Model (Genre/Actor/Director similarity)
    │  └─ Generate 100 candidate items
    ├─ Deep Learning Model (User Embedding → Movie Embedding)
    │  └─ Generate 100 candidate items
    ├─ Temporal/Contextual Model (Time-aware, mood-aware)
    │  └─ Generate 100 candidate items
    └─ Trending/Popularity Model (Weighted by freshness)
       └─ Generate 50 candidate items
    ↓
[3] Candidate Deduplication & Merging
    ├─ Remove duplicates using movie_id
    └─ Pool of ~200-300 unique candidates
    ↓
[4] Ranking & Diversity Score
    ├─ XGBoost Ranking Model (fine-grained prediction)
    ├─ Diversity penalty (avoid recommending too similar movies)
    ├─ Freshness boost (prefer recently released)
    ├─ Personalization boost (specific to user preferences)
    └─ Slot-based strategy (50% similar, 30% diversity, 20% trending)
    ↓
[5] Top-K Selection & Filtering
    ├─ Select top 50 after ranking
    ├─ Apply business rules (no adult content for minors)
    ├─ Filter watched/dismissed items
    └─ Return top 20 results
    ↓
[6] Response Cache (Redis)
    ├─ Cache result for 30 minutes
    ├─ Add to user's recommendation feed
    └─ Log impression for feedback
    ↓
[7] Return to Frontend
    ├─ JSON response with explanations
    ├─ Movie metadata (poster, title, year, rating)
    ├─ Explanation ("Because you watched X")
    └─ Diversity indicators
    ↓
[ASYNC] Feedback Loop
    ├─ Track click (implicit feedback)
    ├─ Track watch_time (implicit feedback)
    ├─ Track rating (explicit feedback)
    └─ Update user embedding continuously
```

---

## ML Components - Detailed

### 1. Collaborative Filtering Module

**Algorithm**: Matrix Factorization with Implicit Feedback (SVD++)

```python
# Conceptual implementation
class CollaborativeFilteringModel:
    def __init__(self):
        self.user_embeddings = np.random.randn(n_users, embedding_dim)
        self.item_embeddings = np.random.randn(n_movies, embedding_dim)
    
    def predict(self, user_id, movie_id):
        """Predict user-movie interaction score"""
        user_vec = self.user_embeddings[user_id]
        movie_vec = self.item_embeddings[movie_id]
        return np.dot(user_vec, movie_vec)
    
    def get_recommendations(self, user_id, k=100):
        """Get top-k recommendations using implicit feedback"""
        user_vec = self.user_embeddings[user_id]
        scores = np.dot(self.item_embeddings, user_vec)
        return np.argsort(scores)[::-1][:k]
    
    def train(self, user_movie_matrix, epochs=50):
        """Train using alternating least squares"""
        for epoch in range(epochs):
            # Update user embeddings
            self.user_embeddings = self._als_step(
                self.user_embeddings, 
                self.item_embeddings, 
                user_movie_matrix
            )
            # Update item embeddings
            self.item_embeddings = self._als_step(
                self.item_embeddings, 
                self.user_embeddings, 
                user_movie_matrix.T
            )
```

**Advantages**:
- Captures latent patterns in user-movie interactions
- Computationally efficient at scale
- Works well with implicit feedback (watch time, clicks)

**Challenges**:
- Cold-start problem (new users/movies have no embeddings)
- Sparsity in interaction matrix
- Slow to update when new data arrives

---

### 2. Content-Based Filtering Module

**Algorithm**: Movie Embedding + Cosine Similarity

```python
class ContentBasedModel:
    def __init__(self):
        self.movie_embeddings = {}
        self.tfidf_vectorizer = TfidfVectorizer(max_features=1000)
    
    def encode_movies(self, movies_df):
        """Create embeddings from movie metadata"""
        movie_texts = (
            movies_df['title'] + " " +
            movies_df['genres'].apply(lambda x: " ".join(x)) + " " +
            movies_df['description'] + " " +
            movies_df['actors'].apply(lambda x: " ".join(x))
        )
        
        tfidf_matrix = self.tfidf_vectorizer.fit_transform(movie_texts)
        
        for idx, movie_id in enumerate(movies_df['id']):
            self.movie_embeddings[movie_id] = tfidf_matrix[idx]
    
    def get_recommendations(self, movie_id, k=100):
        """Find similar movies"""
        if movie_id not in self.movie_embeddings:
            return []
        
        query_embedding = self.movie_embeddings[movie_id]
        similarities = {}
        
        for other_id, other_embedding in self.movie_embeddings.items():
            sim = cosine_similarity(query_embedding, other_embedding)[0][0]
            similarities[other_id] = sim
        
        return sorted(similarities.items(), key=lambda x: x[1], reverse=True)[:k]
```

**Advantages**:
- No cold-start problem for movies with rich metadata
- Explainable recommendations
- Handles new movies immediately

---

### 3. Deep Learning Module - Neural Collaborative Filtering

**Architecture**: Two-Tower Deep Neural Network

```python
import tensorflow as tf

class NeuralCollaborativeFiltering:
    def __init__(self, user_vocab_size, movie_vocab_size, embedding_dim=64):
        # User tower
        self.user_input = tf.keras.Input(shape=(1,), dtype=tf.int32)
        self.user_embedding = tf.keras.layers.Embedding(
            user_vocab_size, embedding_dim
        )(self.user_input)
        self.user_tower = tf.keras.layers.Flatten()(self.user_embedding)
        self.user_tower = tf.keras.layers.Dense(256, activation='relu')(self.user_tower)
        self.user_tower = tf.keras.layers.Dense(128, activation='relu')(self.user_tower)
        self.user_tower = tf.keras.layers.Dense(64)(self.user_tower)
        
        # Movie tower
        self.movie_input = tf.keras.Input(shape=(1,), dtype=tf.int32)
        self.movie_embedding = tf.keras.layers.Embedding(
            movie_vocab_size, embedding_dim
        )(self.movie_input)
        self.movie_tower = tf.keras.layers.Flatten()(self.movie_embedding)
        self.movie_tower = tf.keras.layers.Dense(256, activation='relu')(self.movie_tower)
        self.movie_tower = tf.keras.layers.Dense(128, activation='relu')(self.movie_tower)
        self.movie_tower = tf.keras.layers.Dense(64)(self.movie_tower)
        
        # Dot product for similarity
        self.output = tf.keras.layers.Dot(axes=1)([self.user_tower, self.movie_tower])
        
        self.model = tf.keras.Model(
            inputs=[self.user_input, self.movie_input],
            outputs=self.output
        )
        self.model.compile(
            optimizer=tf.keras.optimizers.Adam(lr=0.001),
            loss='mse',
            metrics=['mae']
        )
    
    def train(self, user_ids, movie_ids, ratings, epochs=10):
        self.model.fit(
            [user_ids, movie_ids], ratings,
            epochs=epochs, batch_size=256, validation_split=0.2
        )
    
    def get_recommendations(self, user_id, all_movie_ids, k=100):
        """Generate recommendations for a user"""
        user_input = np.array([user_id] * len(all_movie_ids))
        movie_input = np.array(all_movie_ids)
        
        scores = self.model.predict([user_input, movie_input])
        top_indices = np.argsort(scores.flatten())[::-1][:k]
        
        return all_movie_ids[top_indices]
```

---

### 4. Temporal/Contextual Model

**Algorithm**: LSTM + Context Features

```python
class TemporalContextualModel:
    def __init__(self):
        self.model = tf.keras.Sequential([
            tf.keras.layers.LSTM(64, return_sequences=True, 
                                input_shape=(30, 256)),
            tf.keras.layers.Dropout(0.3),
            tf.keras.layers.LSTM(32),
            tf.keras.layers.Dense(128, activation='relu'),
            tf.keras.layers.Dense(64, activation='relu'),
            tf.keras.layers.Dense(1, activation='sigmoid')
        ])
        
        self.model.compile(
            optimizer='adam',
            loss='binary_crossentropy',
            metrics=['auc']
        )
```

---

### 5. XGBoost Ranking Model (LTR - Learning To Rank)

```python
import xgboost as xgb

class LearningToRankModel:
    def __init__(self):
        self.model = xgb.XGBRanker(
            booster='gbtree',
            n_estimators=300,
            objective='rank:ndcg',
            metric='ndcg@10',
            learning_rate=0.1,
            max_depth=6,
            subsample=0.8,
            colsample_bytree=0.8,
            random_state=42
        )
    
    def create_ranking_features(self, user_id, candidates):
        """Create rich feature set for ranking"""
        features = []
        for movie_id in candidates:
            feature_vector = {
                'cf_score': self.cf_model.predict(user_id, movie_id),
                'cb_score': self.cb_model.predict(user_id, movie_id),
                'ncf_score': self.ncf_model.predict(user_id, movie_id),
                'temporal_score': self.temporal_model.predict(user_id, movie_id),
                'popularity_score': self.popularity_model.predict(movie_id),
                'num_genres': len(movie_metadata[movie_id]['genres']),
                'year': movie_metadata[movie_id]['year'],
                'imdb_rating': movie_metadata[movie_id]['imdb_rating'],
                'is_new': 1 if movie_metadata[movie_id]['days_since_release'] < 30 else 0,
            }
            features.append(feature_vector)
        
        return pd.DataFrame(features)
```

---

## Backend Implementation

### FastAPI Service Architecture

#### 1. Main API Gateway

```python
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZIPMiddleware
from slowapi import Limiter
from slowapi.util import get_remote_address
import logging

app = FastAPI(
    title="Movie Recommendation Engine API",
    version="1.0.0",
    docs_url="/docs",
    openapi_url="/openapi.json"
)

# Middleware setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(GZIPMiddleware, minimum_size=1000)

# Rate limiting
limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter

# Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
```

#### 2. Recommendation Service

```python
from typing import List, Dict
import asyncio
import time
from dataclasses import dataclass
import redis
import logging

logger = logging.getLogger(__name__)

@dataclass
class RecommendationResponse:
    movie_id: int
    title: str
    poster_url: str
    score: float
    explanation: str
    diversity_indicator: str
    metadata: Dict

class RecommendationService:
    def __init__(
        self, 
        cf_model, 
        cb_model, 
        ncf_model,
        temporal_model,
        ranking_model,
        redis_client: redis.Redis,
        db_connection
    ):
        self.cf_model = cf_model
        self.cb_model = cb_model
        self.ncf_model = ncf_model
        self.temporal_model = temporal_model
        self.ranking_model = ranking_model
        self.redis = redis_client
        self.db = db_connection
    
    async def get_recommendations(
        self, 
        user_id: int,
        num_recommendations: int = 20,
        context: Dict = None,
        use_cache: bool = True
    ) -> List[RecommendationResponse]:
        """Main entry point for recommendations"""
        
        # Check cache first
        cache_key = f"recommendations:{user_id}:{context.get('device', 'web')}"
        if use_cache:
            cached = self._get_from_cache(cache_key)
            if cached:
                logger.info(f"Cache hit for user {user_id}")
                return cached
        
        logger.info(f"Generating recommendations for user {user_id}")
        start_time = time.time()
        
        try:
            # Fetch user profile
            user_profile = await self._fetch_user_profile(user_id)
            
            # Parallel execution of all models
            tasks = [
                self._get_cf_candidates(user_id),
                self._get_cb_candidates(user_id),
                self._get_ncf_candidates(user_id),
                self._get_temporal_candidates(user_id, context),
                self._get_popularity_candidates()
            ]
            
            cf_candidates, cb_candidates, ncf_candidates, \
                temporal_candidates, popularity_candidates = \
                await asyncio.gather(*tasks, return_exceptions=True)
            
            # Merge candidates
            all_candidates = self._merge_candidates(
                cf_candidates,
                cb_candidates,
                ncf_candidates,
                temporal_candidates,
                popularity_candidates
            )
            
            # Deduplication
            unique_candidates = list(set(all_candidates))
            
            # Remove already watched movies
            filtered_candidates = self._filter_watched(
                user_id, 
                unique_candidates
            )
            
            # Ranking
            ranked_movies = self.ranking_model.rank_candidates(
                user_id,
                filtered_candidates
            )
            
            # Top-K selection with diversity
            final_recommendations = self._apply_diversity_strategy(
                user_id,
                ranked_movies[:50],
                num_recommendations
            )
            
            # Enrich with metadata and explanations
            recommendations = await self._enrich_recommendations(
                user_id,
                final_recommendations
            )
            
            # Cache results
            self._set_cache(cache_key, recommendations, ttl=1800)
            
            elapsed = time.time() - start_time
            logger.info(f"Recommendation generation took {elapsed:.2f}s")
            
            return recommendations
            
        except Exception as e:
            logger.error(f"Error generating recommendations: {str(e)}")
            return await self._get_fallback_recommendations(user_id)
    
    def _generate_explanation(self, user_id: int, movie_id: int) -> str:
        """Generate human-readable explanation"""
        reasons = []
        
        # Check collaborative filtering match
        if self.cf_model.is_match(user_id, movie_id):
            reasons.append("because users like you enjoyed it")
        
        # Check content similarity
        user_history = self._fetch_user_watch_history(user_id, limit=5)
        for prev_movie in user_history:
            if self.cb_model.is_similar(prev_movie, movie_id):
                prev_title = self._get_movie_title(prev_movie)
                reasons.append(f"because you watched {prev_title}")
                break
        
        if reasons:
            return ", ".join(reasons)
        else:
            return "trending now"
```

#### 3. FastAPI Routes

```python
from fastapi import Router, HTTPException, Query, Path, Depends
from pydantic import BaseModel
from typing import Optional, List

router = Router(prefix="/api/v1")

class RecommendationRequest(BaseModel):
    user_id: int
    num_recommendations: int = 20
    context: Optional[Dict] = None

class RecommendationResponse(BaseModel):
    movie_id: int
    title: str
    poster_url: str
    score: float
    explanation: str
    diversity_indicator: str

@router.get("/recommendations", response_model=List[RecommendationResponse])
@limiter.limit("100/minute")
async def get_recommendations(
    user_id: int = Query(..., description="User ID"),
    num_recommendations: int = Query(20, ge=1, le=100),
    device: str = Query("web", description="User device type"),
    mood: Optional[str] = Query(None, description="User mood"),
    time_of_day: Optional[str] = Query(None, description="Time of day"),
    rec_service: RecommendationService = Depends()
):
    """Get personalized movie recommendations for a user"""
    try:
        context = {
            'device': device,
            'mood': mood,
            'time_of_day': time_of_day
        }
        
        recommendations = await rec_service.get_recommendations(
            user_id,
            num_recommendations,
            context
        )
        
        return recommendations
    
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Error in /recommendations: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.post("/feedback")
@limiter.limit("1000/minute")
async def submit_feedback(
    user_id: int,
    movie_id: int,
    feedback_type: str,
    rating: Optional[float] = None,
    watch_time: Optional[int] = None,
    rec_service: RecommendationService = Depends()
):
    """Submit user feedback for model training"""
    try:
        await rec_service.record_feedback(
            user_id,
            movie_id,
            feedback_type,
            rating,
            watch_time
        )
        return {"status": "success"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "timestamp": time.time()}
```

---

## Frontend Design & UX

### Technology: Next.js + TypeScript + TailwindCSS + Framer Motion

#### Key Features

1. **Movie Discovery Interface**
   - Infinite scroll carousel of recommendations
   - Visual cards with hover effects
   - Explanation badges
   - Gradual loading with skeleton screens

2. **Personalization Panel**
   - Preferred genres selector
   - Mood picker
   - Device preference settings

3. **Search & Filter**
   - Semantic search
   - Advanced filters
   - Recent searches history

4. **Movie Detail Page**
   - Full information (cast, director, synopsis, ratings)
   - Explanation of recommendation
   - "You might also like" section

### Sample Next.js Component

```typescript
// components/MovieCard.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface MovieCardProps {
  movieId: number;
  title: string;
  posterUrl: string;
  score: float;
  explanation: string;
  diversityIndicator: 'similar' | 'diverse' | 'trending';
  onMovieClick: (movieId: number) => void;
  onFeedback: (movieId: number, feedbackType: string) => void;
}

export const MovieCard: React.FC<MovieCardProps> = ({
  movieId,
  title,
  posterUrl,
  score,
  explanation,
  diversityIndicator,
  onMovieClick,
  onFeedback
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -10 }}
      transition={{ type: 'spring', stiffness: 300 }}
      className="relative w-64 h-96 group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Poster Image */}
      <div className="relative w-full h-full rounded-lg overflow-hidden shadow-xl">
        <Image
          src={posterUrl}
          alt={title}
          fill
          className="object-cover"
          priority={false}
        />
        
        {/* Overlay on hover */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col justify-between p-4"
        >
          {/* Score Badge */}
          <div className="flex justify-between items-start">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-3 py-1 rounded-full text-white font-bold text-sm">
              {(score * 100).toFixed(0)}%
            </div>
            
            {/* Diversity Indicator */}
            <div className={`px-2 py-1 rounded text-xs font-semibold ${
              diversityIndicator === 'similar' ? 'bg-blue-500' :
              diversityIndicator === 'diverse' ? 'bg-green-500' :
              'bg-red-500'
            } text-white`}>
              {diversityIndicator.toUpperCase()}
            </div>
          </div>
          
          {/* Explanation and Actions */}
          <div>
            <p className="text-white text-sm mb-3 italic">
              "{explanation}"
            </p>
            
            <div className="flex gap-2">
              <button
                onClick={() => onMovieClick(movieId)}
                className="flex-1 bg-white text-black px-3 py-2 rounded font-bold hover:bg-gray-200 transition"
              >
                View Details
              </button>
              <button
                onClick={() => onFeedback(movieId, 'skip')}
                className="px-3 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition"
              >
                ✕
              </button>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Title */}
      <h3 className="mt-2 text-sm font-semibold line-clamp-2">{title}</h3>
    </motion.div>
  );
};
```

---

## Data Pipeline

### Data Sources

1. **User Interactions** (Real-time)
   - Clicks, views, ratings, watchlist additions
   - Watch time and completion percentage
   - Skip/dismiss actions

2. **Movie Metadata** (Batch + Real-time)
   - OMDB/TMDB API integration
   - IMDb ratings and reviews
   - Wikipedia synopses

3. **Contextual Data** (Real-time)
   - Device info, timestamp, user location
   - Weather data
   - Trending data from social media

### Feature Store Schema (Feast)

```python
from feast import Entity, Feature, FeatureView, ValueType

user_entity = Entity(name="user", value_type=ValueType.INT64)
movie_entity = Entity(name="movie", value_type=ValueType.INT64)

user_features_view = FeatureView(
    name="user_features",
    entities=["user"],
    features=[
        Feature(name="age", dtype=ValueType.INT32),
        Feature(name="country", dtype=ValueType.STRING),
        Feature(name="account_age_days", dtype=ValueType.INT32),
        Feature(name="total_watches", dtype=ValueType.INT32),
        Feature(name="avg_rating", dtype=ValueType.FLOAT),
    ],
    ttl=86400,
)

movie_features_view = FeatureView(
    name="movie_features",
    entities=["movie"],
    features=[
        Feature(name="title", dtype=ValueType.STRING),
        Feature(name="genres", dtype=ValueType.STRING),
        Feature(name="release_year", dtype=ValueType.INT32),
        Feature(name="runtime_minutes", dtype=ValueType.INT32),
        Feature(name="imdb_rating", dtype=ValueType.FLOAT),
    ],
    ttl=604800,
)
```

---

## Production Challenges & Solutions

### Challenge 1: Cold-Start Problem
**Solutions**:
- Demographic-based recommendations for new users
- Content-based filtering for new movies
- Popularity bias for both scenarios
- Explicit user preferences on signup

### Challenge 2: Scalability
**Solutions**:
- Caching strategy (Redis for hot users)
- Pre-computed recommendations (batch job every 6 hours)
- Model optimization (quantization, ONNX)
- Async processing throughout

### Challenge 3: Data Sparsity
**Solutions**:
- Implicit feedback (clicks, watch time, skips)
- Matrix factorization (SVD++ handles sparsity)
- Regularization in ML models

### Challenge 4: Concept Drift
**Solutions**:
- Time-decaying weights for old interactions
- Periodic model retraining (daily/weekly)
- Online learning algorithms
- Continuous monitoring

### Challenge 5: Filter Bubbles
**Solutions**:
- Diversity penalty in ranking
- Serendipity bonus for surprising recommendations
- Controlled exploration (explore-exploit trade-off)
- User feedback to break filter bubbles

### Challenge 6: Real-time Feedback Loop
**Solutions**:
- Event-driven architecture (Kafka)
- Incremental model updates
- Embedding updates in real-time
- Cache invalidation on user action

### Challenge 7: A/B Testing at Scale
**Solutions**:
- Stratified randomization
- Statistical significance tests (t-tests, CUPED)
- Canary deployments
- Experiment tracking

---

## Deployment & Monitoring

### Docker Configuration

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app/ ./app/
COPY models/ ./models/

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD python -c "import requests; requests.get('http://localhost:8000/health')"

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "4"]
```

### Kubernetes Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: recommendation-service
  labels:
    app: recommendation-engine
spec:
  replicas: 10
  selector:
    matchLabels:
      app: recommendation-service
  template:
    metadata:
      labels:
        app: recommendation-service
    spec:
      containers:
      - name: recommendation-service
        image: recommendation-engine:latest
        ports:
        - containerPort: 8000
        
        resources:
          requests:
            memory: "2Gi"
            cpu: "1000m"
          limits:
            memory: "4Gi"
            cpu: "2000m"
        
        livenessProbe:
          httpGet:
            path: /health
            port: 8000
          initialDelaySeconds: 30
          periodSeconds: 10
        
        readinessProbe:
          httpGet:
            path: /health
            port: 8000
          initialDelaySeconds: 10
          periodSeconds: 5

---
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: recommendation-service-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: recommendation-service
  minReplicas: 5
  maxReplicas: 50
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
```

### Monitoring Metrics

```python
from prometheus_client import Counter, Histogram, Gauge

recommendations_total = Counter(
    'recommendations_total',
    'Total recommendations served',
    ['model', 'user_segment']
)

recommendation_latency = Histogram(
    'recommendation_latency_seconds',
    'Time to generate recommendations',
    buckets=[0.01, 0.05, 0.1, 0.5, 1.0, 5.0]
)

precision_at_10 = Gauge(
    'precision_at_10',
    'Precision@10 metric'
)

coverage_percentage = Gauge(
    'coverage_percentage',
    'Percentage of catalog recommended'
)

cache_hit_rate = Gauge(
    'cache_hit_rate',
    'Redis cache hit rate'
)
```

---

## Development Timeline

### Phase 1: Foundation (Weeks 1-2)
- [ ] Backend scaffolding (FastAPI project structure)
- [ ] Database schema design (PostgreSQL)
- [ ] Redis setup and caching layer
- [ ] User authentication (JWT)
- [ ] API gateway with rate limiting

### Phase 2: ML Models (Weeks 3-6)
- [ ] Collaborative filtering model (SVD++)
- [ ] Content-based filtering (TF-IDF)
- [ ] Neural collaborative filtering (PyTorch)
- [ ] Temporal/contextual model (LSTM)
- [ ] Feature engineering pipeline
- [ ] Feature store (Feast) setup

### Phase 3: Model Integration (Weeks 7-8)
- [ ] Recommendation service (merged models)
- [ ] XGBoost ranking model
- [ ] Cold-start resolution
- [ ] Caching and performance optimization
- [ ] A/B testing framework

### Phase 4: Frontend (Weeks 9-10)
- [ ] Next.js project setup
- [ ] Movie discovery UI
- [ ] Movie detail pages
- [ ] User profile & preferences
- [ ] Search and filters
- [ ] Real-time feedback submission

### Phase 5: DevOps & Monitoring (Weeks 11-12)
- [ ] Docker containerization
- [ ] Kubernetes deployment
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Monitoring stack (Prometheus + Grafana)
- [ ] Logging (ELK stack)
- [ ] Performance testing and optimization

### Phase 6: Production Launch (Week 13+)
- [ ] Load testing (1M+ users)
- [ ] Security audit
- [ ] Data privacy compliance (GDPR)
- [ ] Canary deployment
- [ ] Full production rollout
- [ ] Continuous monitoring

---

## Testing Strategy

### Unit Tests

```python
def test_cf_model_recommendation():
    model = CollaborativeFilteringModel()
    recommendations = model.get_recommendations(user_id=1, k=10)
    assert len(recommendations) == 10
    assert all(isinstance(m, int) for m in recommendations)

def test_cf_model_handles_cold_start():
    model = CollaborativeFilteringModel()
    recommendations = model.get_recommendations(user_id=99999, k=10)
    assert recommendations is not None
```

### Integration Tests

```python
import pytest

@pytest.mark.asyncio
async def test_get_recommendations_end_to_end():
    rec_service = RecommendationService(...)
    recommendations = await rec_service.get_recommendations(
        user_id=1,
        num_recommendations=20
    )
    assert len(recommendations) == 20
    assert all(isinstance(r, RecommendationResponse) for r in recommendations)

@pytest.mark.asyncio
async def test_recommendations_latency():
    start = time.time()
    recommendations = await rec_service.get_recommendations(user_id=1)
    elapsed = time.time() - start
    assert elapsed < 0.1
```

### Load Testing

```python
from locust import HttpUser, task

class RecommendationUser(HttpUser):
    @task(3)
    def get_recommendations(self):
        user_id = random.randint(1, 1000000)
        self.client.get(f"/api/v1/recommendations?user_id={user_id}")
    
    @task(1)
    def submit_feedback(self):
        user_id = random.randint(1, 1000000)
        movie_id = random.randint(1, 50000)
        self.client.post(
            "/api/v1/feedback",
            json={"user_id": user_id, "movie_id": movie_id, "feedback_type": "click"}
        )
```

---

## Tech Stack Summary

| Component | Technology | Reason |
|-----------|-----------|--------|
| **Backend Framework** | FastAPI | High performance, async, auto-docs |
| **ML Framework** | PyTorch + TensorFlow | Industry standard, flexibility |
| **Database** | PostgreSQL | ACID compliance, JSON support |
| **Cache** | Redis | Sub-millisecond latency |
| **Message Queue** | Apache Kafka | Real-time event streaming |
| **Feature Store** | Feast | ML feature management at scale |
| **Orchestration** | Kubeflow | ML workflow orchestration |
| **Model Registry** | MLflow | Version control for models |
| **Batch Processing** | Apache Spark | Distributed data processing |
| **Frontend** | Next.js + TypeScript | SSR, performance, type safety |
| **Styling** | TailwindCSS | Utility-first, rapid development |
| **Animation** | Framer Motion | Smooth, performant animations |
| **Container** | Docker | Consistency across environments |
| **Orchestration** | Kubernetes | Scale, high availability |
| **Monitoring** | Prometheus + Grafana | Metrics, alerting, dashboards |
| **Logging** | ELK Stack | Centralized, searchable logs |
| **CI/CD** | GitHub Actions | Integrated, reliable pipelines |

---

## Estimated Complexity & Effort

- **Total Development Time**: 12-16 weeks
- **Team Size**: 3-4 engineers
- **Computational Resources**: 8x GPU clusters (training) + 10-20 CPU instances (serving)
- **Monthly Infrastructure Cost**: $5,000-10,000

---

## Success Criteria

✅ Recommendation latency < 100ms (p95)
✅ Precision@10 > 0.82
✅ Coverage > 85%
✅ Serendipity > 0.65
✅ System uptime 99.95%
✅ Zero cold-start failures
✅ Fully explainable recommendations
✅ Scalable to 1M+ concurrent users

---

**This project demonstrates Netflix/Amazon-level sophistication with:**
- 5 complementary ML models
- Microservices architecture
- Production-grade DevOps
- Full-stack development skills
- Enterprise scalability
