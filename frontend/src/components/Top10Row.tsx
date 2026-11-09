'use client';

import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, Play, ExternalLink } from 'lucide-react';
import { Movie } from '../types/movie';

interface Top10RowProps {
  movies: Movie[];
  onSelectMovie: (movie: Movie) => void;
  onPlayLicensed?: (movie: Movie) => void;
}

export const Top10Row: React.FC<Top10RowProps> = ({ movies, onSelectMovie, onPlayLicensed }) => {
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

  const top10List = movies.slice(0, 10);

  return (
    <div className="relative group/row my-8">
      {/* Row Header with Netflix Top 10 Badge */}
      <div className="flex items-center gap-2.5 px-4 sm:px-6 lg:px-12 mb-3">
        <div className="w-6 h-6 rounded bg-red-600 flex items-center justify-center font-black text-white text-xs">
          TOP
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-wide">
          Top 10 Movies Today in India
        </h2>
      </div>

      {/* Left Scroll Arrow */}
      <button
        onClick={() => scroll('left')}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-30 h-44 w-10 sm:w-12 bg-black/60 hover:bg-black/90 text-white flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity backdrop-blur-sm rounded-r-lg"
      >
        <ChevronLeft className="w-8 h-8" />
      </button>

      {/* Horizontal Carousel */}
      <div
        ref={rowRef}
        className="flex items-center gap-2 sm:gap-4 overflow-x-auto scrollbar-none px-4 sm:px-6 lg:px-12 py-4 scroll-smooth"
      >
        {top10List.map((movie, index) => {
          const rank = index + 1;
          const primaryProvider = movie.providers?.[0];

          return (
            <div
              key={movie.id}
              onClick={() => onSelectMovie(movie)}
              className="relative flex-shrink-0 flex items-end cursor-pointer group/card transition-transform duration-300 hover:scale-105"
            >
              {/* Giant Stylized Number */}
              <div className="relative -mr-6 sm:-mr-8 select-none pointer-events-none z-0">
                <svg
                  className="h-36 sm:h-48 w-20 sm:w-28 overflow-visible"
                  viewBox="0 0 100 100"
                >
                  <text
                    x="50%"
                    y="80%"
                    textAnchor="middle"
                    fill="#141414"
                    stroke="#595959"
                    strokeWidth="4"
                    className="font-black text-8xl"
                    style={{
                      fontFamily: 'Impact, Arial Black, sans-serif'
                    }}
                  >
                    {rank}
                  </text>
                </svg>
              </div>

              {/* Movie Poster Card */}
              <div className="relative z-10 w-28 sm:w-36 aspect-[2/3] rounded-md overflow-hidden shadow-2xl bg-gray-900 border border-gray-800 group-hover/card:border-gray-500 transition-all">
                <img
                  src={movie.poster_path}
                  alt={movie.title}
                  className="w-full h-full object-cover"
                />

                {/* Platform Badge Overlay */}
                <div className="absolute top-1.5 left-1.5">
                  {primaryProvider ? (
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-black/80 text-white border border-white/20 backdrop-blur-sm">
                      {primaryProvider.provider_name.split(' ')[0]}
                    </span>
                  ) : movie.is_licensed_stream ? (
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-red-600 text-white">
                      SV
                    </span>
                  ) : null}
                </div>

                {/* Rating Pill */}
                <div className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded text-[10px] font-bold bg-black/80 text-amber-400 border border-white/10">
                  ★ {movie.vote_average.toFixed(1)}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Right Scroll Arrow */}
      <button
        onClick={() => scroll('right')}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-30 h-44 w-10 sm:w-12 bg-black/60 hover:bg-black/90 text-white flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity backdrop-blur-sm rounded-l-lg"
      >
        <ChevronRight className="w-8 h-8" />
      </button>
    </div>
  );
};

