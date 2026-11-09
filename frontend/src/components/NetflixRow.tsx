'use client';

import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, Play, Plus, Check, ThumbsUp, ChevronDown, ExternalLink } from 'lucide-react';
import { Movie } from '../types/movie';

interface NetflixRowProps {
  title: string;
  movies: Movie[];
  onSelectMovie: (movie: Movie) => void;
  watchlist: number[];
  onToggleWatchlist: (movie: Movie) => void;
  onPlayLicensed?: (movie: Movie) => void;
  badge?: string;
}

export const NetflixRow: React.FC<NetflixRowProps> = ({
  title,
  movies,
  onSelectMovie,
  watchlist,
  onToggleWatchlist,
  onPlayLicensed,
  badge
}) => {
  const rowRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (!rowRef.current) return;
    const { scrollLeft, clientWidth } = rowRef.current;
    const scrollAmount = clientWidth * 0.75;
    rowRef.current.scrollTo({
      left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
      behavior: 'smooth'
    });
  };

  const getProviderColor = (name: string = '') => {
    const n = name.toLowerCase();
    if (n.includes('netflix')) return 'bg-red-600';
    if (n.includes('prime')) return 'bg-sky-500';
    if (n.includes('hotstar')) return 'bg-blue-600';
    if (n.includes('zee5')) return 'bg-amber-500';
    if (n.includes('sony')) return 'bg-purple-600';
    return 'bg-emerald-600';
  };

  if (!movies || movies.length === 0) return null;

  return (
    <div className="relative group/row my-6">
      {/* Row Header */}
      <div className="flex items-center gap-3 px-4 sm:px-6 lg:px-12 mb-2">
        <h2 className="text-lg sm:text-xl font-bold text-white tracking-wide hover:text-red-400 transition-colors cursor-pointer">
          {title}
        </h2>
        {badge && (
          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-red-600/30 text-red-400 border border-red-500/40">
            {badge}
          </span>
        )}
      </div>

      {/* Left Scroll Arrow */}
      <button
        onClick={() => scroll('left')}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-30 h-36 sm:h-44 w-10 sm:w-12 bg-black/60 hover:bg-black/90 text-white flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity backdrop-blur-sm rounded-r-lg"
      >
        <ChevronLeft className="w-8 h-8" />
      </button>

      {/* Horizontal Cards Scroller */}
      <div
        ref={rowRef}
        className="flex items-center gap-2.5 sm:gap-3.5 overflow-x-auto scrollbar-none px-4 sm:px-6 lg:px-12 py-3 scroll-smooth"
      >
        {movies.map((movie) => {
          const isWatchlisted = watchlist.includes(movie.id);
          const primaryProvider = movie.providers?.[0];

          return (
            <div
              key={movie.id}
              onClick={() => onSelectMovie(movie)}
              className="relative flex-shrink-0 w-36 sm:w-48 aspect-[2/3] rounded-md overflow-hidden bg-gray-900 cursor-pointer shadow-lg transition-all duration-300 hover:scale-105 group/card border border-gray-800/80 hover:border-gray-500"
            >
              {/* Poster Image */}
              <img
                src={movie.poster_path}
                alt={movie.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-110"
                loading="lazy"
              />

              {/* Gradient Scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity flex flex-col justify-between p-2.5 sm:p-3">
                {/* Top Badge: Platform */}
                <div className="flex items-center justify-between">
                  {primaryProvider ? (
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase text-white shadow ${getProviderColor(primaryProvider.provider_name)}`}>
                      {primaryProvider.provider_name.split(' ')[0]}
                    </span>
                  ) : movie.is_licensed_stream ? (
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-red-600 text-white shadow">
                      STREAMVERSE
                    </span>
                  ) : null}

                  <span className="text-[10px] font-bold text-amber-400">
                    ★ {movie.vote_average.toFixed(1)}
                  </span>
                </div>

                {/* Bottom Quick Action Cluster */}
                <div className="space-y-1.5">
                  <div className="text-xs font-bold text-white truncate drop-shadow">
                    {movie.title}
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Play Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (movie.is_licensed_stream && onPlayLicensed) {
                          onPlayLicensed(movie);
                        } else if (primaryProvider?.watch_url) {
                          window.open(primaryProvider.watch_url, '_blank', 'noopener,noreferrer');
                        } else {
                          onSelectMovie(movie);
                        }
                      }}
                      className="w-7 h-7 rounded-full bg-white text-black hover:bg-red-600 hover:text-white flex items-center justify-center transition-colors shadow"
                      title={movie.is_licensed_stream ? 'Stream Movie' : 'Watch on OTT'}
                    >
                      <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                    </button>

                    {/* Add to List */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleWatchlist(movie);
                      }}
                      className="w-7 h-7 rounded-full border border-gray-400 hover:border-white bg-black/60 text-white flex items-center justify-center transition-colors"
                      title="Add to My List"
                    >
                      {isWatchlisted ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Plus className="w-3.5 h-3.5" />}
                    </button>

                    {/* Like Button */}
                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="w-7 h-7 rounded-full border border-gray-400 hover:border-white bg-black/60 text-white flex items-center justify-center transition-colors"
                      title="I like this"
                    >
                      <ThumbsUp className="w-3 h-3" />
                    </button>

                    {/* More Info */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectMovie(movie);
                      }}
                      className="ml-auto w-7 h-7 rounded-full border border-gray-400 hover:border-white bg-black/60 text-white flex items-center justify-center transition-colors"
                      title="Episode & OTT Details"
                    >
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2 text-[10px] text-gray-300">
                    <span>{movie.release_year}</span>
                    <span>•</span>
                    <span className="uppercase">{movie.original_language === 'ta' ? 'Tamil' : movie.original_language}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Right Scroll Arrow */}
      <button
        onClick={() => scroll('right')}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-30 h-36 sm:h-44 w-10 sm:w-12 bg-black/60 hover:bg-black/90 text-white flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity backdrop-blur-sm rounded-l-lg"
      >
        <ChevronRight className="w-8 h-8" />
      </button>
    </div>
  );
};

