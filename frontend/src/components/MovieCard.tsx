'use client';

import React from 'react';
import { ExternalLink, Bookmark, Check, Play, Sparkles } from 'lucide-react';
import { Movie } from '../types/movie';

interface MovieCardProps {
  movie: Movie;
  onSelect: (movie: Movie) => void;
  isWatchlisted: boolean;
  onToggleWatchlist: (movie: Movie) => void;
  onPlayLicensed?: (movie: Movie) => void;
}

export const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  onSelect,
  isWatchlisted,
  onToggleWatchlist,
  onPlayLicensed
}) => {
  const primaryProvider = movie.providers?.[0];

  const handleCardClick = () => {
    onSelect(movie);
  };

  const handleWatchClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (movie.is_licensed_stream && onPlayLicensed) {
      onPlayLicensed(movie);
    } else if (primaryProvider?.watch_url) {
      window.open(primaryProvider.watch_url, '_blank', 'noopener,noreferrer');
    } else {
      onSelect(movie);
    }
  };

  const handleWatchlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleWatchlist(movie);
  };

  // Provider branding styling
  const getProviderColor = (name: string = '') => {
    const n = name.toLowerCase();
    if (n.includes('netflix')) return 'bg-red-600/90 text-white';
    if (n.includes('prime')) return 'bg-sky-600/90 text-white';
    if (n.includes('hotstar')) return 'bg-blue-600/90 text-white';
    if (n.includes('zee5')) return 'bg-amber-600/90 text-white';
    if (n.includes('sony')) return 'bg-purple-600/90 text-white';
    return 'bg-emerald-600/90 text-white';
  };

  return (
    <div 
      onClick={handleCardClick}
      className="group relative flex-shrink-0 w-44 sm:w-52 bg-[#151922] rounded-2xl overflow-hidden border border-gray-800/80 hover:border-gray-600 hover:shadow-2xl hover:shadow-red-950/20 transition-all duration-300 cursor-pointer flex flex-col justify-between"
    >
      {/* Poster Container */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-gray-900">
        <img
          src={movie.poster_path || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&q=80'}
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Top Floating Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
          {/* Rating */}
          <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-black/75 text-amber-400 backdrop-blur-md border border-white/10 shadow">
            ★ {movie.vote_average.toFixed(1)}
          </span>

          {/* AI Match Badge (if provided) */}
          {movie.ai_match_percentage ? (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-emerald-600/90 text-white backdrop-blur-md shadow">
              <Sparkles className="w-3 h-3" />
              {movie.ai_match_percentage}%
            </span>
          ) : (
            <button
              onClick={handleWatchlistClick}
              className="pointer-events-auto p-1.5 rounded-lg bg-black/70 hover:bg-red-600 text-white backdrop-blur-md transition-colors"
              title="Save to Watchlist"
            >
              {isWatchlisted ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Bookmark className="w-3.5 h-3.5" />
              )}
            </button>
          )}
        </div>

        {/* OTT Provider Pill on bottom of poster */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5">
          {primaryProvider ? (
            <div className={`px-2 py-1 rounded-lg text-[10px] font-bold flex items-center justify-between shadow-lg backdrop-blur-md ${getProviderColor(primaryProvider.provider_name)}`}>
              <span className="truncate">{primaryProvider.provider_name}</span>
              <ExternalLink className="w-3 h-3 flex-shrink-0" />
            </div>
          ) : movie.is_licensed_stream ? (
            <div className="px-2 py-1 rounded-lg text-[10px] font-bold flex items-center justify-between shadow-lg bg-emerald-600/95 text-white">
              <span>STREAMVERSE Play</span>
              <Play className="w-3 h-3 fill-white" />
            </div>
          ) : null}
        </div>
      </div>

      {/* Info Section */}
      <div className="p-3.5 flex flex-col justify-between flex-grow">
        <div>
          <h3 className="text-sm font-bold text-gray-100 group-hover:text-red-400 transition-colors line-clamp-1">
            {movie.title}
          </h3>

          <div className="flex items-center gap-2 mt-1 text-[11px] text-gray-400">
            <span>{movie.release_year}</span>
            <span>•</span>
            <span className="uppercase font-semibold">
              {movie.original_language === 'ta' ? 'Tamil' : movie.original_language}
            </span>
          </div>

          <p className="mt-1.5 text-[11px] text-gray-400 line-clamp-1">
            {movie.genres?.slice(0, 2).join(', ')}
          </p>

          {movie.recommendation_reason && (
            <p className="mt-1 text-[10px] text-amber-400 font-medium line-clamp-1">
              {movie.recommendation_reason}
            </p>
          )}
        </div>

        {/* Bottom Watch Button */}
        <button
          onClick={handleWatchClick}
          className="mt-3 w-full py-1.5 px-3 rounded-lg bg-gray-800 hover:bg-red-600 text-gray-200 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
        >
          <Play className="w-3 h-3 fill-current" />
          <span>{movie.is_licensed_stream ? 'Stream' : 'Watch Now'}</span>
        </button>
      </div>
    </div>
  );
};

