'use client';

import React from 'react';
import { X, Film, ExternalLink } from 'lucide-react';
import { Movie } from '../types/movie';

interface TrailerModalProps {
  movie: Movie | null;
  onClose: () => void;
}

export const TrailerModal: React.FC<TrailerModalProps> = ({ movie, onClose }) => {
  if (!movie) return null;

  // Extract YouTube video ID
  const getEmbedUrl = (url?: string) => {
    if (!url) return 'https://www.youtube.com/embed/Po3jStA673E?autoplay=1'; // Fallback to Leo trailer
    if (url.includes('embed/')) return `${url}?autoplay=1`;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11
      ? `https://www.youtube.com/embed/${match[2]}?autoplay=1`
      : 'https://www.youtube.com/embed/Po3jStA673E?autoplay=1';
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-4xl bg-[#11141c] border border-gray-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between p-4 bg-gray-950/80 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <Film className="w-5 h-5 text-red-500" />
            <span className="font-bold text-sm sm:text-base text-white">
              Official HD Trailer — {movie.title}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-gray-900 hover:bg-red-600 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Embed */}
        <div className="relative aspect-video w-full bg-black">
          <iframe
            src={getEmbedUrl(movie.trailer_url)}
            title={`${movie.title} Trailer`}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        {/* Footer info */}
        <div className="p-4 bg-gray-950/60 flex items-center justify-between text-xs text-gray-400">
          <div>
            <span>Director: <strong className="text-gray-200">{movie.director || 'N/A'}</strong></span>
            <span className="mx-2">•</span>
            <span>Language: <strong className="text-gray-200 uppercase">{movie.original_language}</strong></span>
          </div>

          {movie.providers?.[0] && (
            <a
              href={movie.providers[0].watch_url || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-400 hover:text-red-300 font-bold flex items-center gap-1"
            >
              <span>Stream full movie on {movie.providers[0].provider_name}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

