'use client';

import React from 'react';
import { Play, Info, ExternalLink, Bookmark, Check, Sparkles, Film } from 'lucide-react';
import { Movie } from '../types/movie';

interface HeroBannerProps {
  movie: Movie;
  onSelectMovie: (movie: Movie) => void;
  isWatchlisted: boolean;
  onToggleWatchlist: (movie: Movie) => void;
  onPlayLicensed?: (movie: Movie) => void;
  onWatchTrailer?: (movie: Movie) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  movie,
  onSelectMovie,
  isWatchlisted,
  onToggleWatchlist,
  onPlayLicensed,
  onWatchTrailer
}) => {
  const primaryProvider = movie.providers?.[0];

  const handlePrimaryWatch = () => {
    if (movie.is_licensed_stream && onPlayLicensed) {
      onPlayLicensed(movie);
    } else if (primaryProvider?.watch_url) {
      window.open(primaryProvider.watch_url, '_blank', 'noopener,noreferrer');
    } else {
      onSelectMovie(movie);
    }
  };

  return (
    <div className="relative w-full h-[75vh] min-h-[520px] max-h-[720px] overflow-hidden">
      {/* Backdrop Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 scale-105"
        style={{
          backgroundImage: `url(${movie.backdrop_path || movie.poster_path})`
        }}
      />

      {/* Gradients */}
      <div className="absolute inset-0 hero-side-gradient" />
      <div className="absolute inset-0 hero-vignette" />

      {/* Content */}
      <div className="relative max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-16 z-20">
        <div className="max-w-2xl space-y-4">
          {/* OTT Availability Badge */}
          <div className="flex flex-wrap items-center gap-2">
            {primaryProvider ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-600/90 text-white shadow-lg backdrop-blur-sm border border-red-500/30">
                <ExternalLink className="w-3.5 h-3.5" />
                Stream on {primaryProvider.provider_name}
              </span>
            ) : movie.is_licensed_stream ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-600/90 text-white shadow-lg border border-blue-400/30">
                <Sparkles className="w-3.5 h-3.5" />
                STREAMVERSE Premiere
              </span>
            ) : null}

            <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              ⭐ {movie.vote_average.toFixed(1)} / 10
            </span>
            <span className="text-xs text-gray-400 font-medium px-2 py-1 bg-black/40 rounded border border-white/10">
              {movie.release_year}
            </span>
            <span className="text-xs text-gray-300 uppercase tracking-wider font-semibold px-2 py-1 bg-black/40 rounded border border-white/10">
              {movie.original_language === 'ta' ? 'Tamil' : movie.original_language.toUpperCase()}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white drop-shadow-md">
            {movie.title}
          </h1>

          {/* Synopsis */}
          <p className="text-gray-300 text-sm sm:text-base line-clamp-3 leading-relaxed drop-shadow">
            {movie.overview}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={handlePrimaryWatch}
              className="flex items-center space-x-2.5 px-6 py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-sm shadow-xl shadow-red-600/40 hover:scale-105 transition-all"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>
                {movie.is_licensed_stream
                  ? 'Watch Now (STREAMVERSE)'
                  : `Watch on ${primaryProvider?.provider_name || 'OTT'}`}
              </span>
            </button>

            <button
              onClick={() => onSelectMovie(movie)}
              className="flex items-center space-x-2 px-5 py-3 rounded-xl bg-gray-900/80 hover:bg-gray-800 text-white font-semibold text-sm border border-gray-700/80 backdrop-blur-md hover:scale-105 transition-all"
            >
              <Info className="w-4 h-4 text-gray-400" />
              <span>All OTT Options</span>
            </button>

            {onWatchTrailer && (
              <button
                onClick={() => onWatchTrailer(movie)}
                className="flex items-center space-x-2 px-5 py-3 rounded-xl bg-gray-900/80 hover:bg-red-950/60 text-white font-semibold text-sm border border-gray-700/80 hover:border-red-600/50 backdrop-blur-md hover:scale-105 transition-all"
                title="Watch Official HD Trailer"
              >
                <Film className="w-4 h-4 text-red-500" />
                <span>Trailer</span>
              </button>
            )}

            <button
              onClick={() => onToggleWatchlist(movie)}
              className="p-3 rounded-xl bg-gray-900/80 hover:bg-gray-800 text-gray-300 hover:text-white border border-gray-700/80 backdrop-blur-md transition-all"
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
      </div>
    </div>
  );
};

