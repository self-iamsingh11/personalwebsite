"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Film,
    Search,
    Star,
    Clock,
    TrendingUp,
    Sparkles,
    Heart,
    Zap,
    Coffee,
    Flame,
    Ghost,
    X,
    Play,
    ChevronRight,
    User,
    RefreshCw,
    AlertCircle
} from 'lucide-react';

// ============== Types ==============

interface Movie {
    id: number;
    title: string;
    year: number;
    genres: string[];
    rating: number;
    poster_url: string;
    description: string;
    director: string;
    cast: string[];
    runtime: number;
    popularity: number;
    release_date: string;
}

interface MovieRecommendation {
    movie: Movie;
    score: number;
    explanation: string;
    algorithm: string;
    diversity_tag: string;
}

type Mood = 'happy' | 'chill' | 'adventurous' | 'romantic' | 'thrilling' | null;

// ============== API Configuration ==============

const API_BASE_URL = 'http://127.0.0.1:8001';

// ============== Mood Configuration ==============

const MOODS = [
    { id: 'happy', label: 'Happy', icon: Sparkles, color: 'from-yellow-400 to-orange-500', bg: 'bg-yellow-500/20' },
    { id: 'chill', label: 'Chill', icon: Coffee, color: 'from-blue-400 to-cyan-500', bg: 'bg-blue-500/20' },
    { id: 'adventurous', label: 'Adventurous', icon: Zap, color: 'from-green-400 to-emerald-500', bg: 'bg-green-500/20' },
    { id: 'romantic', label: 'Romantic', icon: Heart, color: 'from-pink-400 to-rose-500', bg: 'bg-pink-500/20' },
    { id: 'thrilling', label: 'Thrilling', icon: Ghost, color: 'from-purple-400 to-violet-500', bg: 'bg-purple-500/20' },
] as const;

const GENRES = [
    'Action', 'Comedy', 'Drama', 'Thriller', 'Romance',
    'Sci-Fi', 'Horror', 'Adventure', 'Animation'
];

// ============== Components ==============

// Loading Skeleton
const MovieCardSkeleton = () => (
    <div className="animate-pulse">
        <div className="w-48 h-72 bg-slate-700 rounded-xl"></div>
        <div className="mt-3 h-4 bg-slate-700 rounded w-3/4"></div>
        <div className="mt-2 h-3 bg-slate-700 rounded w-1/2"></div>
    </div>
);

// Movie Card Component
const MovieCard = ({
    recommendation,
    onClick
}: {
    recommendation: MovieRecommendation;
    onClick: () => void;
}) => {
    const { movie, score, explanation, diversity_tag } = recommendation;
    const [imageError, setImageError] = useState(false);

    const tagColors: Record<string, string> = {
        trending: 'bg-red-500',
        new: 'bg-green-500',
        similar: 'bg-blue-500',
        diverse: 'bg-purple-500'
    };

    return (
        <motion.div
            whileHover={{ scale: 1.05, y: -8 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="relative w-48 flex-shrink-0 cursor-pointer group"
            onClick={onClick}
        >
            {/* Poster */}
            <div className="relative w-full h-72 rounded-xl overflow-hidden shadow-xl">
                {imageError ? (
                    <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center">
                        <Film className="w-12 h-12 text-slate-500" />
                    </div>
                ) : (
                    <img
                        src={movie.poster_url}
                        alt={movie.title}
                        className="w-full h-full object-cover"
                        onError={() => setImageError(true)}
                    />
                )}

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Score badge */}
                <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    <span className="text-white text-xs font-bold">{movie.rating.toFixed(1)}</span>
                </div>

                {/* Diversity tag */}
                <div className={`absolute top-2 left-2 ${tagColors[diversity_tag] || 'bg-slate-500'} px-2 py-0.5 rounded text-[10px] font-bold text-white uppercase`}>
                    {diversity_tag}
                </div>

                {/* Hover overlay with info */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col justify-end p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                >
                    <p className="text-white/80 text-xs italic mb-2 line-clamp-2">"{explanation}"</p>
                    <div className="flex items-center gap-2">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span className="text-slate-300 text-xs">{movie.runtime} min</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                        {movie.genres.slice(0, 2).map((genre) => (
                            <span key={genre} className="bg-white/10 px-2 py-0.5 rounded text-[10px] text-white">
                                {genre}
                            </span>
                        ))}
                    </div>
                    <button className="mt-3 w-full bg-white text-black py-2 rounded-lg font-bold text-sm flex items-center justify-center gap-1 hover:bg-gray-200 transition">
                        <Play className="w-4 h-4 fill-current" /> View Details
                    </button>
                </motion.div>
            </div>

            {/* Title */}
            <h3 className="mt-3 text-sm font-semibold text-white line-clamp-1">{movie.title}</h3>
            <p className="text-slate-400 text-xs">{movie.year} • {movie.genres[0]}</p>
        </motion.div>
    );
};

// Movie Detail Modal
const MovieModal = ({
    movie,
    onClose
}: {
    movie: Movie;
    onClose: () => void;
}) => {
    const [imageError, setImageError] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-slate-800 rounded-2xl overflow-hidden max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header with poster */}
                <div className="relative h-64 md:h-80">
                    {imageError ? (
                        <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center">
                            <Film className="w-24 h-24 text-slate-600" />
                        </div>
                    ) : (
                        <img
                            src={movie.poster_url}
                            alt={movie.title}
                            className="w-full h-full object-cover"
                            onError={() => setImageError(true)}
                        />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-800 via-slate-800/50 to-transparent" />

                    {/* Close button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 p-2 rounded-full transition"
                    >
                        <X className="w-5 h-5 text-white" />
                    </button>

                    {/* Title overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">{movie.title}</h2>
                        <div className="flex items-center gap-4 text-sm text-slate-300">
                            <span className="flex items-center gap-1">
                                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                {movie.rating.toFixed(1)}
                            </span>
                            <span>{movie.year}</span>
                            <span>{movie.runtime} min</span>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    {/* Genres */}
                    <div className="flex flex-wrap gap-2 mb-4">
                        {movie.genres.map((genre) => (
                            <span
                                key={genre}
                                className="bg-gradient-to-r from-purple-600 to-pink-600 px-3 py-1 rounded-full text-sm font-medium text-white"
                            >
                                {genre}
                            </span>
                        ))}
                    </div>

                    {/* Description */}
                    <p className="text-slate-300 mb-6 leading-relaxed">{movie.description}</p>

                    {/* Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div>
                            <h4 className="text-slate-400 text-sm font-medium mb-1">Director</h4>
                            <p className="text-white">{movie.director}</p>
                        </div>
                        <div>
                            <h4 className="text-slate-400 text-sm font-medium mb-1">Release Date</h4>
                            <p className="text-white">{movie.release_date}</p>
                        </div>
                    </div>

                    {/* Cast */}
                    <div className="mb-6">
                        <h4 className="text-slate-400 text-sm font-medium mb-2">Cast</h4>
                        <div className="flex flex-wrap gap-2">
                            {movie.cast.map((actor) => (
                                <span
                                    key={actor}
                                    className="bg-slate-700 px-3 py-1 rounded-lg text-sm text-white"
                                >
                                    {actor}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-3">
                        <button className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition">
                            <Play className="w-5 h-5 fill-current" /> Watch Now
                        </button>
                        <button className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-xl font-bold transition">
                            <Heart className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

// Carousel Section
const RecommendationSection = ({
    title,
    icon: Icon,
    recommendations,
    loading,
    onMovieClick
}: {
    title: string;
    icon: React.ElementType;
    recommendations: MovieRecommendation[];
    loading: boolean;
    onMovieClick: (movie: Movie) => void;
}) => (
    <section className="mb-10">
        <div className="flex items-center gap-2 mb-4">
            <Icon className="w-5 h-5 text-purple-400" />
            <h2 className="text-xl font-bold text-white">{title}</h2>
            <ChevronRight className="w-5 h-5 text-slate-500" />
        </div>

        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {loading ? (
                Array(6).fill(0).map((_, i) => <MovieCardSkeleton key={i} />)
            ) : recommendations.length === 0 ? (
                <div className="flex items-center gap-2 text-slate-400 py-8">
                    <AlertCircle className="w-5 h-5" />
                    <span>No recommendations found. Try different filters!</span>
                </div>
            ) : (
                recommendations.map((rec) => (
                    <MovieCard
                        key={rec.movie.id}
                        recommendation={rec}
                        onClick={() => onMovieClick(rec.movie)}
                    />
                ))
            )}
        </div>
    </section>
);

// ============== Main Page Component ==============

export default function MovieRecommender() {
    const [recommendations, setRecommendations] = useState<MovieRecommendation[]>([]);
    const [trending, setTrending] = useState<MovieRecommendation[]>([]);
    const [searchResults, setSearchResults] = useState<Movie[]>([]);
    const [selectedMood, setSelectedMood] = useState<Mood>(null);
    const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [searchLoading, setSearchLoading] = useState(false);
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [userId] = useState(1); // Simulated user

    // Fetch recommendations
    const fetchRecommendations = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const params = new URLSearchParams();
            params.append('user_id', userId.toString());
            params.append('limit', '20');

            if (selectedMood) {
                params.append('mood', selectedMood);
            }
            if (selectedGenres.length > 0) {
                params.append('genres', selectedGenres.join(','));
            }

            const response = await fetch(`${API_BASE_URL}/recommendations?${params}`);
            if (!response.ok) throw new Error('Failed to fetch recommendations');

            const data = await response.json();
            setRecommendations(data);
        } catch (err) {
            console.error('Error fetching recommendations:', err);
            setError('Failed to load recommendations. Make sure the backend is running.');
        } finally {
            setLoading(false);
        }
    }, [userId, selectedMood, selectedGenres]);

    // Fetch trending
    const fetchTrending = useCallback(async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/trending?limit=10`);
            if (!response.ok) throw new Error('Failed to fetch trending');

            const data = await response.json();
            setTrending(data);
        } catch (err) {
            console.error('Error fetching trending:', err);
        }
    }, []);

    // Search movies
    const searchMovies = useCallback(async (query: string) => {
        if (!query.trim()) {
            setSearchResults([]);
            return;
        }

        setSearchLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/search?query=${encodeURIComponent(query)}&limit=10`);
            if (!response.ok) throw new Error('Search failed');

            const data = await response.json();
            setSearchResults(data);
        } catch (err) {
            console.error('Search error:', err);
        } finally {
            setSearchLoading(false);
        }
    }, []);

    // Initial load
    useEffect(() => {
        fetchRecommendations();
        fetchTrending();
    }, [fetchRecommendations, fetchTrending]);

    // Debounced search
    useEffect(() => {
        const timer = setTimeout(() => {
            searchMovies(searchQuery);
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery, searchMovies]);

    // Handle mood selection
    const handleMoodSelect = (mood: Mood) => {
        setSelectedMood(selectedMood === mood ? null : mood);
    };

    // Handle genre toggle
    const handleGenreToggle = (genre: string) => {
        setSelectedGenres(prev =>
            prev.includes(genre)
                ? prev.filter(g => g !== genre)
                : [...prev, genre]
        );
    };

    // Refetch when filters change
    useEffect(() => {
        fetchRecommendations();
    }, [selectedMood, selectedGenres, fetchRecommendations]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-purple-900/30 text-white">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-2 rounded-xl">
                                <Film className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold">CineMatch</h1>
                                <p className="text-xs text-slate-400">AI Movie Recommendations</p>
                            </div>
                        </div>

                        {/* Search bar */}
                        <div className="relative w-80 hidden md:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search movies, actors, directors..."
                                className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                            />

                            {/* Search results dropdown */}
                            {searchQuery && (
                                <div className="absolute top-full left-0 right-0 mt-2 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-50">
                                    {searchLoading ? (
                                        <div className="p-4 text-center text-slate-400">Searching...</div>
                                    ) : searchResults.length === 0 ? (
                                        <div className="p-4 text-center text-slate-400">No results found</div>
                                    ) : (
                                        searchResults.slice(0, 5).map((movie) => (
                                            <button
                                                key={movie.id}
                                                onClick={() => {
                                                    setSelectedMovie(movie);
                                                    setSearchQuery('');
                                                }}
                                                className="w-full flex items-center gap-3 p-3 hover:bg-slate-700 transition text-left"
                                            >
                                                <div className="w-10 h-14 bg-slate-700 rounded overflow-hidden flex-shrink-0">
                                                    <img
                                                        src={movie.poster_url}
                                                        alt={movie.title}
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => (e.currentTarget.style.display = 'none')}
                                                    />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-white">{movie.title}</p>
                                                    <p className="text-xs text-slate-400">{movie.year} • {movie.genres[0]}</p>
                                                </div>
                                            </button>
                                        ))
                                    )}
                                </div>
                            )}
                        </div>

                        {/* User avatar */}
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => {
                                    setSelectedMood(null);
                                    setSelectedGenres([]);
                                    fetchRecommendations();
                                }}
                                className="p-2 hover:bg-slate-800 rounded-lg transition"
                                title="Refresh recommendations"
                            >
                                <RefreshCw className="w-5 h-5 text-slate-400" />
                            </button>
                            <div className="w-9 h-9 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                                <User className="w-5 h-5 text-white" />
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Error state */}
                {error && (
                    <div className="mb-6 bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-center gap-3 text-red-400">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        <div>
                            <p className="font-medium">{error}</p>
                            <p className="text-sm text-red-400/70">
                                Run: <code className="bg-red-500/20 px-1 rounded">uvicorn backend:app --port 8001</code>
                            </p>
                        </div>
                        <button
                            onClick={() => {
                                setError(null);
                                fetchRecommendations();
                            }}
                            className="ml-auto px-3 py-1 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-sm font-medium transition"
                        >
                            Retry
                        </button>
                    </div>
                )}

                {/* Mood Selector */}
                <section className="mb-8">
                    <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-purple-400" />
                        How are you feeling today?
                    </h2>
                    <div className="flex flex-wrap gap-3">
                        {MOODS.map(({ id, label, icon: MoodIcon, color, bg }) => (
                            <motion.button
                                key={id}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleMoodSelect(id as Mood)}
                                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all ${selectedMood === id
                                        ? `bg-gradient-to-r ${color} text-white shadow-lg`
                                        : `${bg} text-slate-300 hover:text-white`
                                    }`}
                            >
                                <MoodIcon className="w-4 h-4" />
                                {label}
                            </motion.button>
                        ))}
                    </div>
                </section>

                {/* Genre Filters */}
                <section className="mb-8">
                    <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <Film className="w-5 h-5 text-purple-400" />
                        Genres
                    </h2>
                    <div className="flex flex-wrap gap-2">
                        {GENRES.map((genre) => (
                            <button
                                key={genre}
                                onClick={() => handleGenreToggle(genre)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedGenres.includes(genre)
                                        ? 'bg-purple-600 text-white'
                                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                                    }`}
                            >
                                {genre}
                            </button>
                        ))}
                    </div>
                </section>

                {/* Recommendations */}
                <RecommendationSection
                    title="Recommended For You"
                    icon={Sparkles}
                    recommendations={recommendations}
                    loading={loading}
                    onMovieClick={setSelectedMovie}
                />

                {/* Trending */}
                <RecommendationSection
                    title="Trending Now"
                    icon={TrendingUp}
                    recommendations={trending}
                    loading={loading}
                    onMovieClick={setSelectedMovie}
                />

                {/* Top Rated Section */}
                <RecommendationSection
                    title="Top Rated Picks"
                    icon={Flame}
                    recommendations={recommendations.filter(r => r.movie.rating >= 8.5).slice(0, 10)}
                    loading={loading}
                    onMovieClick={setSelectedMovie}
                />
            </main>

            {/* Movie Detail Modal */}
            <AnimatePresence>
                {selectedMovie && (
                    <MovieModal
                        movie={selectedMovie}
                        onClose={() => setSelectedMovie(null)}
                    />
                )}
            </AnimatePresence>

            {/* Custom scrollbar styles */}
            <style jsx global>{`
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </div>
    );
}
