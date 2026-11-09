'use client';

import React, { useState, useEffect } from 'react';
import { Search, X, SlidersHorizontal, ExternalLink, Play, Film, Sparkles } from 'lucide-react';
import { Movie } from '../types/movie';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectMovie: (movie: Movie) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectMovie
}) => {
  const [query, setQuery] = useState('');
  const [language, setLanguage] = useState('all');
  const [ottPlatform, setOttPlatform] = useState('all');
  const [minRating, setMinRating] = useState(0);
  const [results, setResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const performSearch = async () => {
      setLoading(true);
      try {
        const res = await fetch('http://localhost:8000/api/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query,
            language: language === 'all' ? null : language,
            ott_platform: ottPlatform === 'all' ? null : ottPlatform,
            min_rating: minRating,
            page: 1
          })
        });
        if (res.ok) {
          const data = await res.json();
          setResults(data);
        }
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(performSearch, 250);
    return () => clearTimeout(debounce);
  }, [query, language, ottPlatform, minRating, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-start justify-center pt-12 sm:pt-20 p-4">
      <div 
        className="w-full max-w-3xl bg-[#11141c] border border-gray-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header / Search Input */}
        <div className="p-4 sm:p-6 border-b border-gray-800/80">
          <div className="flex items-center gap-3">
            <Search className="w-5 h-5 text-red-500 flex-shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search across Netflix, Prime, Hotstar (e.g. Leo, Vikram, Oppenheimer)..."
              autoFocus
              className="w-full bg-transparent text-white placeholder-gray-500 text-base sm:text-lg focus:outline-none"
            />
            {query && (
              <button onClick={() => setQuery('')} className="text-gray-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-gray-800 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Filters */}
          <div className="mt-4 pt-3 border-t border-gray-800/60 flex flex-wrap items-center gap-2 text-xs">
            {/* Language filter */}
            <span className="text-gray-400 font-medium">Lang:</span>
            {['all', 'ta', 'en', 'hi'].map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`px-2.5 py-1 rounded-lg uppercase font-bold transition-all ${
                  language === lang
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-900 text-gray-400 hover:text-white'
                }`}
              >
                {lang === 'all' ? 'All' : lang === 'ta' ? 'Tamil' : lang}
              </button>
            ))}

            <div className="h-4 w-px bg-gray-800 mx-1" />

            {/* OTT Platform filter */}
            <span className="text-gray-400 font-medium">Platform:</span>
            {['all', 'netflix', 'prime', 'hotstar', 'zee5'].map((platform) => (
              <button
                key={platform}
                onClick={() => setOttPlatform(platform)}
                className={`px-2.5 py-1 rounded-lg capitalize font-semibold transition-all ${
                  ottPlatform === platform
                    ? 'bg-white text-gray-950 font-bold'
                    : 'bg-gray-900 text-gray-400 hover:text-white'
                }`}
              >
                {platform}
              </button>
            ))}
          </div>
        </div>

        {/* Results Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
          {loading ? (
            <div className="py-12 text-center text-gray-500">Searching all platforms...</div>
          ) : results.length > 0 ? (
            results.map((movie) => {
              const provider = movie.providers?.[0];
              return (
                <div
                  key={movie.id}
                  onClick={() => {
                    onSelectMovie(movie);
                    onClose();
                  }}
                  className="flex items-center justify-between p-3 rounded-2xl bg-gray-900/60 hover:bg-gray-800/80 border border-gray-800/80 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={movie.poster_path}
                      alt={movie.title}
                      className="w-12 h-16 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <h4 className="font-bold text-sm text-gray-100 group-hover:text-red-400 truncate">
                        {movie.title}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-gray-400 mt-0.5">
                        <span>{movie.release_year}</span>
                        <span>•</span>
                        <span className="uppercase">{movie.original_language === 'ta' ? 'Tamil' : movie.original_language}</span>
                        <span>•</span>
                        <span className="text-amber-400 font-semibold">★ {movie.vote_average.toFixed(1)}</span>
                      </div>
                      <p className="text-xs text-gray-400 truncate max-w-md mt-1">
                        {movie.genres?.join(', ')}
                      </p>
                    </div>
                  </div>

                  {/* Provider Action */}
                  <div className="flex-shrink-0 ml-3">
                    {provider ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-red-600/90 text-white shadow group-hover:scale-105 transition-transform">
                        <span>{provider.provider_name}</span>
                        <ExternalLink className="w-3 h-3" />
                      </span>
                    ) : movie.is_licensed_stream ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 text-white shadow">
                        <Play className="w-3 h-3 fill-white" />
                        <span>STREAMVERSE</span>
                      </span>
                    ) : (
                      <span className="text-xs text-gray-500">Details</span>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-12 text-center text-gray-500">
              No movies found matching your search. Try searching for "Leo", "Vikram", or "Oppenheimer".
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

