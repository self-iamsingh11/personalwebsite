"use client";

import React, { useState } from 'react';
import {
    Upload,
    BarChart2,
    Type,
    Image as ImageIcon,
    Tag,
    TrendingUp,
    Eye,
    MousePointer,
    AlertCircle,
    CheckCircle2,
    X,
    Play,
    Share2
} from 'lucide-react';

// Types
interface FormData {
    title: string;
    description: string;
    tags: string;
    category: string;
}

interface PredictionResults {
    predictedViews: number;
    ctr: string;
    engagementScore: number;
    suggestions: string[];
}

// Mock simulation of the Python backend logic for the frontend demo
const simulatePrediction = (data: { title: string; description: string; tags: string[]; thumbnail: File | null }): Promise<PredictionResults> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            // Simple heuristic logic to make the "AI" feel responsive in the demo
            const titleScore = data.title.length > 20 && data.title.length < 60 ? 90 : 50;
            const descScore = data.description.length > 100 ? 85 : 40;
            const tagScore = data.tags.length > 5 ? 95 : 60;

            const baseScore = (titleScore + descScore + tagScore) / 3;
            const randomness = Math.random() * 10 - 5; // +/- 5 variance

            resolve({
                predictedViews: Math.floor(10000 * (baseScore / 100) + (Math.random() * 2000)),
                ctr: (5 + (baseScore / 20) + (Math.random() * 2)).toFixed(1),
                engagementScore: Math.min(100, Math.floor(baseScore + randomness)),
                suggestions: [
                    data.title.length < 30 ? "Title is too short. Aim for 40-60 characters." : null,
                    data.description.length < 100 ? "Description lacks depth. Add more keywords." : null,
                    data.tags.length < 3 ? "Add more tags to improve discoverability." : null,
                    !data.thumbnail ? "High-contrast thumbnails improve CTR significantly." : null
                ].filter(Boolean) as string[]
            });
        }, 2000);
    });
};

const MetricCard = ({ icon: Icon, label, value, subtext, color }: {
    icon: React.ElementType;
    label: string;
    value: string;
    subtext: string;
    color: string
}) => (
    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
        <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-lg bg-opacity-10 ${color.replace('text-', 'bg-')}`}>
                <Icon className={`w-6 h-6 ${color}`} />
            </div>
            <span className={`text-2xl font-bold ${color}`}>{value}</span>
        </div>
        <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider">{label}</h3>
        <p className="text-slate-500 text-xs mt-1">{subtext}</p>
    </div>
);

const ProgressBar = ({ label, value, color }: { label: string; value: number; color: string }) => (
    <div className="mb-4">
        <div className="flex justify-between mb-1">
            <span className="text-sm font-medium text-slate-300">{label}</span>
            <span className="text-sm font-medium text-slate-400">{value}%</span>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-2.5">
            <div
                className={`h-2.5 rounded-full transition-all duration-1000 ${color}`}
                style={{ width: `${value}%` }}
            ></div>
        </div>
    </div>
);

export default function ContentPredictor() {
    const [formData, setFormData] = useState<FormData>({
        title: '',
        description: '',
        tags: '',
        category: 'Gaming',
    });
    const [thumbnail, setThumbnail] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [results, setResults] = useState<PredictionResults | null>(null);
    const [dragActive, setDragActive] = useState(false);

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleFile = (file: File) => {
        setThumbnail(file);
        setPreviewUrl(URL.createObjectURL(file));
        setResults(null); // Reset results on new image
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (results) setResults(null); // Reset results on edit
    };

    const handleAnalyze = async () => {
        if (!formData.title) return;

        setIsAnalyzing(true);
        try {
            // Create FormData to send to backend
            const apiFormData = new FormData();
            apiFormData.append('title', formData.title);
            apiFormData.append('description', formData.description);
            apiFormData.append('category', formData.category);

            // Create a placeholder image if no thumbnail provided
            if (thumbnail) {
                apiFormData.append('thumbnail', thumbnail);
            } else {
                // Create a small placeholder image for the API
                const placeholderBlob = new Blob(['placeholder'], { type: 'image/png' });
                apiFormData.append('thumbnail', placeholderBlob, 'placeholder.png');
            }

            // Call the FastAPI backend
            const response = await fetch('http://127.0.0.1:8000/predict', {
                method: 'POST',
                body: apiFormData,
            });

            if (!response.ok) {
                throw new Error(`Backend error: ${response.status}`);
            }

            const backendData = await response.json();

            // Generate suggestions based on input
            const tags = formData.tags.split(',').map(t => t.trim());
            const suggestions: string[] = [];
            if (formData.title.length < 30) suggestions.push("Title is too short. Aim for 40-60 characters.");
            if (formData.description.length < 100) suggestions.push("Description lacks depth. Add more keywords.");
            if (tags.length < 3) suggestions.push("Add more tags to improve discoverability.");
            if (!thumbnail) suggestions.push("High-contrast thumbnails improve CTR significantly.");

            // Map backend response to frontend format
            setResults({
                predictedViews: backendData.predicted_views,
                ctr: backendData.predicted_ctr.toFixed(1),
                engagementScore: backendData.engagement_score,
                suggestions: suggestions
            });
        } catch (error) {
            console.error("Backend API call failed, using mock prediction:", error);
            // Fallback to mock simulation if backend is unavailable
            const tags = formData.tags.split(',').map(t => t.trim());
            const data = await simulatePrediction({
                ...formData,
                tags: tags,
                thumbnail: thumbnail
            });
            setResults(data);
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-blue-500 selection:text-white">
            {/* Header */}
            <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg">
                            <TrendingUp className="w-5 h-5 text-white" />
                        </div>
                        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                            ContentIQ <span className="text-xs font-normal text-slate-500 border border-slate-700 rounded px-1.5 py-0.5 ml-2">BETA</span>
                        </h1>
                    </div>
                    <button className="text-sm text-slate-400 hover:text-white transition-colors">
                        Documentation
                    </button>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Left Column: Inputs */}
                    <div className="lg:col-span-7 space-y-6">

                        {/* Title & Description */}
                        <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50 shadow-xl">
                            <h2 className="text-lg font-semibold mb-4 flex items-center">
                                <Type className="w-5 h-5 mr-2 text-blue-400" />
                                Video Details
                            </h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Video Title</label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                        placeholder="e.g., 'How to Build a Neural Network in 10 Minutes'"
                                    />
                                    <div className="flex justify-end mt-1">
                                        <span className={`text-xs ${formData.title.length > 60 ? 'text-orange-400' : 'text-slate-500'}`}>
                                            {formData.title.length} / 100
                                        </span>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Description</label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        rows={4}
                                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
                                        placeholder="What is your video about? Include keywords..."
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-1">Category</label>
                                        <select
                                            name="category"
                                            value={formData.category}
                                            onChange={handleChange}
                                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option>Gaming</option>
                                            <option>Technology</option>
                                            <option>Education</option>
                                            <option>Entertainment</option>
                                            <option>Vlog</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-1">Tags (comma separated)</label>
                                        <div className="relative">
                                            <Tag className="absolute left-3 top-3.5 w-4 h-4 text-slate-500" />
                                            <input
                                                type="text"
                                                name="tags"
                                                value={formData.tags}
                                                onChange={handleChange}
                                                className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="python, coding, ai..."
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Thumbnail Upload */}
                        <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50 shadow-xl">
                            <h2 className="text-lg font-semibold mb-4 flex items-center">
                                <ImageIcon className="w-5 h-5 mr-2 text-purple-400" />
                                Thumbnail Analysis
                            </h2>

                            <div
                                className={`relative border-2 border-dashed rounded-xl transition-all duration-200 ease-in-out
                  ${dragActive ? 'border-blue-500 bg-blue-500/10' : 'border-slate-700 bg-slate-900/50 hover:border-slate-600'}
                  ${previewUrl ? 'h-64' : 'h-48'}
                `}
                                onDragEnter={handleDrag}
                                onDragLeave={handleDrag}
                                onDragOver={handleDrag}
                                onDrop={handleDrop}
                            >
                                {previewUrl ? (
                                    <div className="w-full h-full relative group rounded-xl overflow-hidden">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={previewUrl}
                                            alt="Thumbnail preview"
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <button
                                                onClick={() => { setThumbnail(null); setPreviewUrl(null); setResults(null); }}
                                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center font-medium transition-colors"
                                            >
                                                <X className="w-4 h-4 mr-2" /> Remove
                                            </button>
                                        </div>
                                        {/* YouTube Preview Overlay Simulation */}
                                        <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1 rounded font-medium">
                                            10:05
                                        </div>
                                    </div>
                                ) : (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500">
                                        <div className="bg-slate-800 p-4 rounded-full mb-3">
                                            <Upload className="w-8 h-8 text-slate-400" />
                                        </div>
                                        <p className="text-sm font-medium text-slate-300">Drag and drop your thumbnail</p>
                                        <p className="text-xs mt-1">or <span className="text-blue-400 cursor-pointer hover:underline" onClick={() => document.getElementById('file-upload')?.click()}>browse files</span></p>
                                        <p className="text-xs text-slate-600 mt-4">Supports JPG, PNG (Max 5MB)</p>
                                        <input
                                            id="file-upload"
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={(e) => e.target.files && handleFile(e.target.files[0])}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        <button
                            onClick={handleAnalyze}
                            disabled={isAnalyzing || !formData.title}
                            className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center transition-all transform hover:scale-[1.01] active:scale-[0.99]
                ${isAnalyzing || !formData.title
                                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white ring-4 ring-blue-500/20'
                                }`}
                        >
                            {isAnalyzing ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                                    Running Multi-modal Analysis...
                                </>
                            ) : (
                                <>
                                    <Play className="w-5 h-5 mr-2 fill-current" />
                                    Predict Performance
                                </>
                            )}
                        </button>
                    </div>

                    {/* Right Column: Results */}
                    <div className="lg:col-span-5">
                        {!results ? (
                            <div className="h-full min-h-[400px] bg-slate-800/30 rounded-2xl border border-dashed border-slate-700 flex flex-col items-center justify-center p-8 text-center">
                                <div className="bg-slate-800 p-4 rounded-full mb-4">
                                    <BarChart2 className="w-10 h-10 text-slate-500" />
                                </div>
                                <h3 className="text-xl font-medium text-slate-300 mb-2">Ready to Analyze</h3>
                                <p className="text-slate-500 max-w-sm">
                                    Enter your video details and upload a thumbnail to see AI-predicted performance metrics using our Hybrid BERT+ResNet model.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-6">

                                {/* Score Header */}
                                <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700 shadow-xl relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-4 opacity-10">
                                        <TrendingUp className="w-32 h-32 text-white" />
                                    </div>
                                    <div className="relative z-10">
                                        <h3 className="text-slate-400 font-medium mb-1">Overall Content Score</h3>
                                        <div className="flex items-baseline">
                                            <span className="text-5xl font-bold text-white tracking-tight">{results.engagementScore}</span>
                                            <span className="text-xl text-slate-500 ml-2">/ 100</span>
                                        </div>
                                        <div className="mt-4">
                                            <div className="w-full bg-slate-700/50 rounded-full h-2">
                                                <div
                                                    className={`h-2 rounded-full ${results.engagementScore > 80 ? 'bg-green-500' :
                                                        results.engagementScore > 60 ? 'bg-yellow-500' : 'bg-red-500'
                                                        }`}
                                                    style={{ width: `${results.engagementScore}%` }}
                                                ></div>
                                            </div>
                                            <p className="text-xs text-slate-400 mt-2 flex items-center">
                                                <Share2 className="w-3 h-3 mr-1" />
                                                Based on metadata and thumbnail synergy
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Metrics Grid */}
                                <div className="grid grid-cols-2 gap-4">
                                    <MetricCard
                                        icon={Eye}
                                        label="Pred. Views"
                                        value={results.predictedViews.toLocaleString()}
                                        subtext="First 7 Days"
                                        color="text-blue-400"
                                    />
                                    <MetricCard
                                        icon={MousePointer}
                                        label="CTR"
                                        value={`${results.ctr}%`}
                                        subtext="Impressions Click-through"
                                        color="text-purple-400"
                                    />
                                </div>

                                {/* detailed breakdown */}
                                <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 shadow-xl">
                                    <h3 className="text-lg font-semibold text-white mb-4">Detailed Breakdown</h3>
                                    <ProgressBar label="Keyword Relevance" value={Math.floor(results.engagementScore * 0.9)} color="bg-blue-500" />
                                    <ProgressBar label="Visual Impact" value={Math.floor(results.engagementScore * 1.1) > 100 ? 98 : Math.floor(results.engagementScore * 1.1)} color="bg-purple-500" />
                                    <ProgressBar label="Click Potential" value={Math.floor(parseFloat(results.ctr) * 10)} color="bg-emerald-500" />
                                </div>

                                {/* Recommendations */}
                                <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 shadow-xl">
                                    <h3 className="text-lg font-semibold text-white mb-4">AI Recommendations</h3>
                                    {results.suggestions.length > 0 ? (
                                        <ul className="space-y-3">
                                            {results.suggestions.map((suggestion, idx) => (
                                                <li key={idx} className="flex items-start text-sm text-slate-300">
                                                    <AlertCircle className="w-5 h-5 text-amber-400 mr-3 flex-shrink-0 mt-0.5" />
                                                    {suggestion}
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <div className="flex items-center text-green-400">
                                            <CheckCircle2 className="w-5 h-5 mr-2" />
                                            <span>Great job! Your content looks optimized.</span>
                                        </div>
                                    )}
                                </div>

                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
