'use client';

import React, { useRef, useState, useEffect } from 'react';
import { 
  ArrowLeft, Play, Pause, RotateCcw, RotateCw, Volume2, VolumeX, 
  Maximize, Minimize, MessageSquare, Gauge, Sparkles 
} from 'lucide-react';
import { Movie } from '../types/movie';

interface NetflixPlayerProps {
  movie: Movie | null;
  onClose: () => void;
}

export const NetflixPlayer: React.FC<NetflixPlayerProps> = ({ movie, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [showAudioMenu, setShowAudioMenu] = useState(false);
  const [selectedAudio, setSelectedAudio] = useState('Tamil [Original] (5.1)');
  const [selectedSubtitle, setSelectedSubtitle] = useState('English');

  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-hide controls on mouse idle
  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
  };

  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    };
  }, [isPlaying]);

  if (!movie) return null;

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
      setShowControls(true);
    }
  };

  const skip = (seconds: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime += seconds;
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    setCurrentTime(videoRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    setDuration(videoRef.current.duration);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      videoRef.current.muted = val === 0;
      setIsMuted(val === 0);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const changeSpeed = (speed: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
      setPlaybackSpeed(speed);
      setShowSpeedMenu(false);
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const formatTime = (secs: number) => {
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="fixed inset-0 z-50 bg-black flex items-center justify-center select-none overflow-hidden cursor-default"
    >
      {/* HTML5 Video Element */}
      <video
        ref={videoRef}
        src={movie.stream_url || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"}
        className="w-full h-full object-contain"
        autoPlay
        playsInline
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onClick={togglePlay}
      />

      {/* OVERLAY CONTROLS */}
      <div
        className={`absolute inset-0 flex flex-col justify-between p-6 sm:p-10 transition-opacity duration-300 pointer-events-none ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between pointer-events-auto">
          <button
            onClick={onClose}
            className="flex items-center gap-3 text-white hover:text-red-500 transition-colors p-2 rounded-full hover:bg-white/10"
          >
            <ArrowLeft className="w-8 h-8" />
            <div className="text-left">
              <h2 className="text-lg sm:text-2xl font-black tracking-wide text-white drop-shadow">
                {movie.title}
              </h2>
              <div className="flex items-center gap-2 text-xs text-gray-300">
                <span className="bg-red-600 px-1.5 py-0.2 text-[10px] font-black rounded uppercase">
                  STREAMVERSE Original
                </span>
                <span>•</span>
                <span>4K Ultra HD</span>
                <span>•</span>
                <span>Dolby Atmos 5.1</span>
              </div>
            </div>
          </button>

          <div className="hidden sm:flex items-center gap-3">
            <span className="px-3 py-1 rounded bg-black/60 border border-white/20 text-xs font-semibold text-gray-200">
              U/A 16+
            </span>
          </div>
        </div>

        {/* Bottom Bar Controls */}
        <div className="space-y-4 pointer-events-auto bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 rounded-2xl">
          {/* Netflix Red Scrubber */}
          <div className="relative group/timeline flex items-center">
            <input
              type="range"
              min={0}
              max={duration || 100}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-1.5 bg-gray-600/70 rounded-lg appearance-none cursor-pointer accent-red-600 hover:h-2.5 transition-all"
            />
          </div>

          <div className="flex items-center justify-between">
            {/* Left Action Buttons */}
            <div className="flex items-center gap-4 sm:gap-6">
              {/* Play/Pause */}
              <button
                onClick={togglePlay}
                className="text-white hover:text-red-500 transition-colors"
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7 fill-white" />}
              </button>

              {/* 10s Rewind */}
              <button
                onClick={() => skip(-10)}
                className="text-white hover:text-gray-300 transition-colors"
                title="Rewind 10 seconds"
              >
                <RotateCcw className="w-6 h-6" />
              </button>

              {/* 10s Fast-Forward */}
              <button
                onClick={() => skip(10)}
                className="text-white hover:text-gray-300 transition-colors"
                title="Forward 10 seconds"
              >
                <RotateCw className="w-6 h-6" />
              </button>

              {/* Volume & Mute */}
              <div className="flex items-center gap-2 group/volume">
                <button onClick={toggleMute} className="text-white hover:text-gray-300">
                  {isMuted || volume === 0 ? (
                    <VolumeX className="w-6 h-6 text-red-500" />
                  ) : (
                    <Volume2 className="w-6 h-6" />
                  )}
                </button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-0 group-hover/volume:w-20 transition-all h-1 bg-gray-500 rounded accent-white"
                />
              </div>

              {/* Time Display */}
              <span className="text-xs sm:text-sm font-medium text-gray-300">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            {/* Right Action Buttons */}
            <div className="flex items-center gap-4 sm:gap-5 relative">
              {/* Audio & Subtitles Selector */}
              <div className="relative">
                <button
                  onClick={() => setShowAudioMenu(!showAudioMenu)}
                  className={`text-white hover:text-gray-300 transition-colors ${showAudioMenu ? 'text-red-500' : ''}`}
                  title="Audio & Subtitles"
                >
                  <MessageSquare className="w-5 h-5" />
                </button>

                {showAudioMenu && (
                  <div className="absolute bottom-10 right-0 w-64 bg-black/95 border border-gray-800 rounded-xl p-4 text-xs space-y-3 shadow-2xl backdrop-blur-md">
                    <div>
                      <span className="text-gray-400 font-bold uppercase text-[10px]">Audio</span>
                      {['Tamil [Original] (5.1)', 'English (5.1)', 'Hindi (5.1)'].map((a) => (
                        <div
                          key={a}
                          onClick={() => setSelectedAudio(a)}
                          className={`py-1 px-2 rounded cursor-pointer mt-1 ${
                            selectedAudio === a ? 'bg-red-600 text-white font-bold' : 'text-gray-300 hover:bg-gray-800'
                          }`}
                        >
                          {a}
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-gray-800">
                      <span className="text-gray-400 font-bold uppercase text-[10px]">Subtitles</span>
                      {['English', 'Tamil', 'Off'].map((s) => (
                        <div
                          key={s}
                          onClick={() => setSelectedSubtitle(s)}
                          className={`py-1 px-2 rounded cursor-pointer mt-1 ${
                            selectedSubtitle === s ? 'bg-red-600 text-white font-bold' : 'text-gray-300 hover:bg-gray-800'
                          }`}
                        >
                          {s}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Playback Speed */}
              <div className="relative">
                <button
                  onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                  className="flex items-center gap-1 text-xs font-bold text-gray-300 hover:text-white"
                  title="Playback Speed"
                >
                  <Gauge className="w-5 h-5" />
                  <span>{playbackSpeed}x</span>
                </button>

                {showSpeedMenu && (
                  <div className="absolute bottom-10 right-0 bg-black/95 border border-gray-800 rounded-xl p-2 text-xs shadow-2xl">
                    {[0.75, 1.0, 1.25, 1.5].map((s) => (
                      <div
                        key={s}
                        onClick={() => changeSpeed(s)}
                        className={`py-1.5 px-3 rounded cursor-pointer ${
                          playbackSpeed === s ? 'bg-red-600 text-white font-bold' : 'text-gray-300 hover:bg-gray-800'
                        }`}
                      >
                        {s}x
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Fullscreen */}
              <button
                onClick={toggleFullscreen}
                className="text-white hover:text-gray-300 transition-colors"
                title="Fullscreen"
              >
                {isFullscreen ? <Minimize className="w-6 h-6" /> : <Maximize className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

