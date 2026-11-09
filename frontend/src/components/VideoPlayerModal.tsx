'use client';

import React, { useRef, useState } from 'react';
import { X, Play, Pause, Volume2, VolumeX, Maximize, Film } from 'lucide-react';
import { Movie } from '../types/movie';

interface VideoPlayerModalProps {
  movie: Movie | null;
  onClose: () => void;
}

export const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({ movie, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);

  if (!movie) return null;

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  const handleFullscreen = () => {
    if (!videoRef.current) return;
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-2 sm:p-6 animate-in fade-in duration-300">
      {/* Top Bar */}
      <div className="w-full max-w-5xl flex items-center justify-between py-3 px-4 text-white">
        <div className="flex items-center gap-2">
          <Film className="w-5 h-5 text-red-500" />
          <span className="font-bold text-sm sm:text-base">
            STREAMVERSE Player — {movie.title}
          </span>
          <span className="text-[10px] font-bold uppercase bg-emerald-600 px-2 py-0.5 rounded ml-2">
            1080p Full HD
          </span>
        </div>

        <button
          onClick={onClose}
          className="p-2 rounded-full bg-gray-800 hover:bg-red-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Video Container */}
      <div className="relative w-full max-w-5xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-gray-800 flex items-center justify-center">
        <video
          ref={videoRef}
          src={movie.stream_url || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"}
          className="w-full h-full object-contain"
          autoPlay
          controls
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />
      </div>

      {/* Disclaimer / Licensing note */}
      <div className="w-full max-w-5xl mt-3 text-center text-xs text-gray-500">
        Streaming under STREAMVERSE digital distribution rights. Audio: 5.1 Surround • Subtitles: English, Tamil.
      </div>
    </div>
  );
};

