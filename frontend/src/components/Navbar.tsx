'use client';

import React, { useState, useEffect } from 'react';
import { Film, Search, Bookmark, Sparkles, Tv, ShieldCheck, PlusCircle, Users, Bell } from 'lucide-react';
import { UserProfile } from './ProfileSelector';

interface NavbarProps {
  onOpenSearch: () => void;
  watchlistCount: number;
  onOpenWatchlist: () => void;
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
  currentProfile: UserProfile | null;
  onSwitchProfile: () => void;
  onOpenStudio: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenSearch,
  watchlistCount,
  onOpenWatchlist,
  activeFilter,
  setActiveFilter,
  currentProfile,
  onSwitchProfile,
  onOpenStudio
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-colors duration-500 ${
        isScrolled ? 'bg-[#141414]/95 shadow-2xl backdrop-blur-md' : 'bg-gradient-to-b from-black/80 via-black/40 to-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 h-16 sm:h-20 flex items-center justify-between">
        {/* Left: Netflix-style Brand & Links */}
        <div className="flex items-center space-x-6 sm:space-x-10">
          <div
            onClick={() => setActiveFilter('all')}
            className="flex items-center space-x-2 cursor-pointer group"
          >
            <span className="text-2xl sm:text-3xl font-black tracking-tighter text-red-600 drop-shadow-md group-hover:scale-105 transition-transform">
              STREAMVERSE
            </span>
          </div>

          <nav className="hidden md:flex items-center space-x-5 text-xs sm:text-sm text-gray-300">
            <button
              onClick={() => setActiveFilter('all')}
              className={`hover:text-white transition-colors ${activeFilter === 'all' ? 'text-white font-bold' : ''}`}
            >
              Home
            </button>
            <button
              onClick={() => setActiveFilter('ta')}
              className={`hover:text-white transition-colors ${activeFilter === 'ta' ? 'text-white font-bold' : ''}`}
            >
              Tamil Cinema
            </button>
            <button
              onClick={() => setActiveFilter('ai')}
              className={`flex items-center gap-1 hover:text-white transition-colors ${activeFilter === 'ai' ? 'text-amber-400 font-bold' : ''}`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI For You</span>
            </button>
            <button
              onClick={() => setActiveFilter('licensed')}
              className={`flex items-center gap-1 hover:text-white transition-colors ${activeFilter === 'licensed' ? 'text-red-500 font-bold' : ''}`}
            >
              <Tv className="w-3.5 h-3.5" />
              <span>STREAMVERSE Originals</span>
            </button>
            <button
              onClick={onOpenWatchlist}
              className="hover:text-white transition-colors"
            >
              My List ({watchlistCount})
            </button>
          </nav>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center space-x-4 sm:space-x-6">
          {/* Creator Studio / Add Content */}
          <button
            onClick={onOpenStudio}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white border border-red-600/40 text-xs font-semibold transition-all"
            title="Publish Own Licensed Movie or OTT Link"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Creator Studio</span>
          </button>

          {/* Search Trigger */}
          <button
            onClick={onOpenSearch}
            className="text-gray-300 hover:text-white transition-colors"
            title="Search across all OTT"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Notifications */}
          <button className="text-gray-300 hover:text-white transition-colors">
            <Bell className="w-5 h-5" />
          </button>

          {/* Profile Dropdown */}
          <div className="relative">
            <div
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 cursor-pointer"
            >
              <img
                src={currentProfile?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
                alt="Profile"
                className="w-8 h-8 rounded-md object-cover border border-gray-600 hover:border-white transition-colors"
              />
            </div>

            {showProfileMenu && (
              <div className="absolute right-0 top-12 w-48 bg-[#141414] border border-gray-800 rounded-lg shadow-2xl py-2 text-xs text-gray-300 z-50">
                <div className="px-3 py-2 border-b border-gray-800">
                  <div className="font-bold text-white">{currentProfile?.name || 'Current User'}</div>
                  <div className="text-[10px] text-gray-400">Personalized AI Profile</div>
                </div>

                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    onSwitchProfile();
                  }}
                  className="w-full px-3 py-2 text-left hover:bg-gray-800 hover:text-white flex items-center gap-2"
                >
                  <Users className="w-4 h-4 text-gray-400" />
                  <span>Switch Profile</span>
                </button>

                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    onOpenStudio();
                  }}
                  className="w-full px-3 py-2 text-left hover:bg-gray-800 hover:text-white flex items-center gap-2"
                >
                  <PlusCircle className="w-4 h-4 text-red-500" />
                  <span>Creator Studio</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
