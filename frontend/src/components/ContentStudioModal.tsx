'use client';

import React, { useState } from 'react';
import { X, Upload, Film, Link2, Plus, Sparkles, Check } from 'lucide-react';
import { Movie } from '../types/movie';

interface ContentStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddMovie: (newMovie: Movie) => void;
}

export const ContentStudioModal: React.FC<ContentStudioModalProps> = ({
  isOpen,
  onClose,
  onAddMovie
}) => {
  const [title, setTitle] = useState('');
  const [overview, setOverview] = useState('');
  const [language, setLanguage] = useState('ta');
  const [genres, setGenres] = useState('Action, Thriller');
  const [director, setDirector] = useState('');
  const [cast, setCast] = useState('');
  const [streamUrl, setStreamUrl] = useState('');
  const [posterUrl, setPosterUrl] = useState('');
  const [backdropUrl, setBackdropUrl] = useState('');
  const [isLicensed, setIsLicensed] = useState(true);
  const [primaryOTT, setPrimaryOTT] = useState('STREAMVERSE');
  const [ottWatchUrl, setOttWatchUrl] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !overview) return;

    const newMovie: Movie = {
      id: Math.floor(Date.now() / 1000),
      title,
      original_title: title,
      overview,
      original_language: language,
      genres: genres.split(',').map((g) => g.trim()),
      director: director || 'STREAMVERSE Studios',
      cast: cast.split(',').map((c) => c.trim()),
      release_year: 2026,
      release_date: '2026-03-01',
      vote_average: 8.5,
      vote_count: 50,
      popularity: 80.0,
      runtime_minutes: 120,
      is_licensed_stream: isLicensed,
      stream_url: streamUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      poster_path: posterUrl || 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&q=80',
      backdrop_path: backdropUrl || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1600&q=80',
      providers: primaryOTT !== 'STREAMVERSE' ? [
        {
          provider_id: 888,
          provider_name: primaryOTT,
          watch_url: ottWatchUrl || 'https://www.netflix.com',
          type: 'flatrate',
          quality: '4K Ultra HD'
        }
      ] : [
        {
          provider_id: 999,
          provider_name: 'STREAMVERSE Original',
          watch_url: 'internal://stream',
          type: 'free',
          quality: '4K HDR'
        }
      ]
    };

    onAddMovie(newMovie);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div 
        className="w-full max-w-2xl bg-[#141414] border border-gray-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-white relative my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center">
            <Upload className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight">
              STREAMVERSE Creator & OTT Studio
            </h2>
            <p className="text-xs text-gray-400">
              Publish your own licensed cinema or add external OTT links
            </p>
          </div>
        </div>

        {success ? (
          <div className="py-12 flex flex-col items-center justify-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Check className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-emerald-400">
              Movie Published Successfully!
            </h3>
            <p className="text-xs text-gray-400">
              Live on STREAMVERSE catalog & AI Recommender.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-400 mb-1">Movie Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Masterstroke"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-red-600"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1">Original Language</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-red-600"
                >
                  <option value="ta">Tamil</option>
                  <option value="en">English</option>
                  <option value="hi">Hindi</option>
                  <option value="te">Telugu</option>
                  <option value="ml">Malayalam</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-gray-400 mb-1">Synopsis / Overview *</label>
              <textarea
                required
                rows={3}
                placeholder="Story summary..."
                value={overview}
                onChange={(e) => setOverview(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-red-600"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-400 mb-1">Genres (comma-separated)</label>
                <input
                  type="text"
                  value={genres}
                  onChange={(e) => setGenres(e.target.value)}
                  placeholder="Action, Sci-Fi, Thriller"
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-red-600"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1">Director</label>
                <input
                  type="text"
                  value={director}
                  onChange={(e) => setDirector(e.target.value)}
                  placeholder="Director Name"
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-red-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-400 mb-1">Poster Image URL</label>
                <input
                  type="url"
                  value={posterUrl}
                  onChange={(e) => setPosterUrl(e.target.value)}
                  placeholder="https://.../poster.jpg"
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-red-600"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1">Backdrop Image URL</label>
                <input
                  type="url"
                  value={backdropUrl}
                  onChange={(e) => setBackdropUrl(e.target.value)}
                  placeholder="https://.../backdrop.jpg"
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-red-600"
                />
              </div>
            </div>

            {/* Distribution Choice: Own OTT Player vs External OTT Aggregator */}
            <div className="p-4 bg-gray-900/60 rounded-2xl border border-gray-800 space-y-3">
              <span className="font-bold text-gray-200">Distribution Type</span>
              
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="dist"
                    checked={isLicensed}
                    onChange={() => setIsLicensed(true)}
                    className="accent-red-600"
                  />
                  <span>Stream on STREAMVERSE (Built-in Player)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="dist"
                    checked={!isLicensed}
                    onChange={() => setIsLicensed(false)}
                    className="accent-red-600"
                  />
                  <span>Aggregated External OTT (Netflix, Prime, etc.)</span>
                </label>
              </div>

              {isLicensed ? (
                <div>
                  <label className="block text-gray-400 mb-1">
                    Direct Video Stream URL (.mp4 or HLS .m3u8)
                  </label>
                  <input
                    type="text"
                    value={streamUrl}
                    onChange={(e) => setStreamUrl(e.target.value)}
                    placeholder="https://.../movie.mp4 or /streams/master.m3u8"
                    className="w-full bg-gray-950 border border-gray-700 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-red-600"
                  />
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-gray-400 mb-1">Platform Name</label>
                    <select
                      value={primaryOTT}
                      onChange={(e) => setPrimaryOTT(e.target.value)}
                      className="w-full bg-gray-950 border border-gray-700 rounded-xl px-3.5 py-2 text-white"
                    >
                      <option value="Netflix">Netflix</option>
                      <option value="Amazon Prime Video">Amazon Prime Video</option>
                      <option value="JioHotstar">JioHotstar</option>
                      <option value="Sony LIV">Sony LIV</option>
                      <option value="ZEE5">ZEE5</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-1">Official Watch URL</label>
                    <input
                      type="url"
                      value={ottWatchUrl}
                      onChange={(e) => setOttWatchUrl(e.target.value)}
                      placeholder="https://www.netflix.com/title/..."
                      className="w-full bg-gray-950 border border-gray-700 rounded-xl px-3.5 py-2 text-white"
                    />
                  </div>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl shadow-lg shadow-red-600/40 transition-all flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Publish to STREAMVERSE</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

