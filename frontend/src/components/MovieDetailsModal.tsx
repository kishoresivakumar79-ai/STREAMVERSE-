'use client';

import React, { useEffect, useState } from 'react';
import { X, ExternalLink, Bookmark, Check, Play, Film, Sparkles, User, Clapperboard } from 'lucide-react';
import { Movie } from '../types/movie';

interface MovieDetailsModalProps {
  movie: Movie | null;
  onClose: () => void;
  isWatchlisted: boolean;
  onToggleWatchlist: (movie: Movie) => void;
  onSelectMovie: (movie: Movie) => void;
  onPlayLicensed?: (movie: Movie) => void;
}

export const MovieDetailsModal: React.FC<MovieDetailsModalProps> = ({
  movie,
  onClose,
  isWatchlisted,
  onToggleWatchlist,
  onSelectMovie,
  onPlayLicensed
}) => {
  const [similarMovies, setSimilarMovies] = useState<Movie[]>([]);
  const [loadingSimilar, setLoadingSimilar] = useState(false);

  useEffect(() => {
    if (!movie) return;

    // Fetch Content-based AI recommendations for this movie
    const fetchSimilar = async () => {
      setLoadingSimilar(true);
      try {
        const res = await fetch(`http://localhost:8000/api/recommendations/content-based/${movie.id}?limit=4`);
        if (res.ok) {
          const data = await res.json();
          setSimilarMovies(data);
        }
      } catch (err) {
        // Fallback gracefully
        setSimilarMovies([]);
      } finally {
        setLoadingSimilar(false);
      }
    };

    fetchSimilar();
  }, [movie]);

  if (!movie) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-4xl bg-[#11141c] border border-gray-800 rounded-3xl overflow-hidden shadow-2xl text-gray-100 my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-gray-300 hover:text-white border border-white/10 backdrop-blur-md transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Hero Banner */}
        <div className="relative h-64 sm:h-80 w-full overflow-hidden">
          <img
            src={movie.backdrop_path || movie.poster_path}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#11141c] via-[#11141c]/50 to-transparent" />
          
          <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  ★ {movie.vote_average.toFixed(1)} / 10
                </span>
                <span className="text-xs text-gray-300 px-2 py-0.5 bg-black/50 rounded">
                  {movie.release_year}
                </span>
                <span className="text-xs text-gray-300 uppercase px-2 py-0.5 bg-black/50 rounded">
                  {movie.original_language === 'ta' ? 'Tamil' : movie.original_language}
                </span>
                {movie.runtime_minutes && (
                  <span className="text-xs text-gray-400">
                    {Math.floor(movie.runtime_minutes / 60)}h {movie.runtime_minutes % 60}m
                  </span>
                )}
              </div>

              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                {movie.title}
              </h2>
            </div>

            <button
              onClick={() => onToggleWatchlist(movie)}
              className="p-3 rounded-2xl bg-gray-900/90 hover:bg-gray-800 border border-gray-700 text-gray-300 hover:text-white transition-all"
              title="Add to Watchlist"
            >
              {isWatchlisted ? (
                <Check className="w-5 h-5 text-emerald-400" />
              ) : (
                <Bookmark className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-8">
          {/* OTT AVAILABILITY SECTION (Core Feature) */}
          <div className="bg-[#181d28] border border-gray-800 rounded-2xl p-5 shadow-inner">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Film className="w-5 h-5 text-red-500" />
                <h3 className="text-base sm:text-lg font-bold text-white">
                  Where to Watch (India / Region IN)
                </h3>
              </div>
              <span className="text-xs text-gray-400 font-medium">
                Verified Legal Providers
              </span>
            </div>

            {movie.is_licensed_stream ? (
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-emerald-950/30 border border-emerald-800/40 rounded-xl gap-3">
                <div>
                  <h4 className="font-bold text-emerald-300 text-sm">
                    STREAMVERSE Original & Licensed Stream
                  </h4>
                  <p className="text-xs text-gray-300 mt-0.5">
                    Streamable directly in high-definition without leaving the platform.
                  </p>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    if (onPlayLicensed) onPlayLicensed(movie);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>Play In Player</span>
                </button>
              </div>
            ) : movie.providers && movie.providers.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {movie.providers.map((p, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3.5 bg-gray-900/80 rounded-xl border border-gray-800 hover:border-gray-700 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      {p.logo_path ? (
                        <img
                          src={p.logo_path}
                          alt={p.provider_name}
                          className="w-8 h-8 rounded-lg object-contain bg-black/40 p-1"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-lg bg-red-600/20 text-red-400 flex items-center justify-center font-bold text-xs">
                          {p.provider_name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <div className="font-bold text-sm text-gray-200">
                          {p.provider_name}
                        </div>
                        <div className="text-[11px] text-gray-400 capitalize">
                          {p.type === 'flatrate' ? 'Included with Subscription' : p.type} • {p.quality || 'HD'}
                        </div>
                      </div>
                    </div>

                    <a
                      href={p.watch_url || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center gap-1.5 shadow transition-transform hover:scale-105"
                    >
                      <span>Watch</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 bg-gray-900/60 rounded-xl text-center text-xs text-gray-400">
                Currently not available for digital streaming in India. Check back soon for licensing updates.
              </div>
            )}
          </div>

          {/* Synopsis & Credits */}
          <div className="space-y-4">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                Storyline
              </h4>
              <p className="text-gray-300 text-sm leading-relaxed">
                {movie.overview}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs">
              {movie.director && (
                <div className="flex items-center gap-2">
                  <Clapperboard className="w-4 h-4 text-red-500" />
                  <span className="text-gray-400">Director:</span>
                  <span className="font-semibold text-gray-200">{movie.director}</span>
                </div>
              )}
              {movie.cast && movie.cast.length > 0 && (
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-amber-500" />
                  <span className="text-gray-400">Starring:</span>
                  <span className="font-semibold text-gray-200 truncate">
                    {movie.cast.join(', ')}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* AI Similar Recommendations */}
          {similarMovies.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <h4 className="text-sm font-bold text-gray-200">
                  AI Recommends (Based on Genre, Cast & Director)
                </h4>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {similarMovies.map((sim) => (
                  <div
                    key={sim.id}
                    onClick={() => onSelectMovie(sim)}
                    className="p-2 bg-gray-900/60 hover:bg-gray-800/80 rounded-xl cursor-pointer border border-gray-800 transition-colors group"
                  >
                    <div className="aspect-[2/3] w-full rounded-lg overflow-hidden bg-gray-950 mb-2">
                      <img
                        src={sim.poster_path}
                        alt={sim.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="text-xs font-bold text-gray-200 truncate group-hover:text-red-400">
                      {sim.title}
                    </div>
                    <div className="text-[10px] text-amber-400 font-medium">
                      {sim.recommendation_reason || `★ ${sim.vote_average.toFixed(1)}`}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

