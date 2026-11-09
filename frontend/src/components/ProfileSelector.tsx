'use client';

import React from 'react';
import { Plus, Edit2, Film } from 'lucide-react';

export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  isKid: boolean;
  preferences: {
    languages: string[];
    genres: string[];
  };
}

export const PRESET_PROFILES: UserProfile[] = [
  {
    id: 'user-1',
    name: 'Vijay',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop&crop=faces',
    isKid: false,
    preferences: {
      languages: ['ta', 'en'],
      genres: ['Action', 'Thriller']
    }
  },
  {
    id: 'user-2',
    name: 'Tamil Cinema Fan',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200&h=200&fit=crop&crop=faces',
    isKid: false,
    preferences: {
      languages: ['ta'],
      genres: ['Action', 'Drama', 'Crime']
    }
  },
  {
    id: 'user-3',
    name: 'Binge Watcher',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&crop=faces',
    isKid: false,
    preferences: {
      languages: ['en', 'hi', 'ta'],
      genres: ['Sci-Fi', 'Mystery', 'Drama']
    }
  },
  {
    id: 'user-kids',
    name: 'Kids & Family',
    avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=200&h=200&fit=crop&crop=faces',
    isKid: true,
    preferences: {
      languages: ['ta', 'en'],
      genres: ['Animation', 'Adventure', 'Comedy']
    }
  }
];

interface ProfileSelectorProps {
  onSelectProfile: (profile: UserProfile) => void;
}

export const ProfileSelector: React.FC<ProfileSelectorProps> = ({ onSelectProfile }) => {
  return (
    <div className="fixed inset-0 z-50 bg-[#141414] flex flex-col items-center justify-center p-6 animate-in fade-in duration-500">
      {/* Brand Watermark */}
      <div className="absolute top-8 left-8 sm:left-14 flex items-center space-x-2">
        <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center font-black text-white text-lg shadow-lg shadow-red-600/50">
          N
        </div>
        <span className="text-xl font-black tracking-widest text-red-600">
          STREAMVERSE
        </span>
      </div>

      <div className="max-w-4xl w-full text-center space-y-10">
        <h1 className="text-3xl sm:text-5xl font-medium text-white tracking-wide">
          Who's watching?
        </h1>

        {/* Profile Avatars Grid */}
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
          {PRESET_PROFILES.map((profile) => (
            <div
              key={profile.id}
              onClick={() => onSelectProfile(profile)}
              className="group flex flex-col items-center cursor-pointer transition-all duration-300"
            >
              <div className="relative w-24 h-24 sm:w-36 sm:h-36 rounded-xl overflow-hidden border-2 border-transparent group-hover:border-white transition-all duration-300 group-hover:scale-105 shadow-xl">
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="w-full h-full object-cover"
                />
                {profile.isKid && (
                  <span className="absolute bottom-1 right-1 text-[10px] font-bold uppercase bg-amber-500 text-black px-1.5 py-0.5 rounded shadow">
                    Kids
                  </span>
                )}
              </div>
              <span className="mt-4 text-sm sm:text-base font-normal text-gray-400 group-hover:text-white transition-colors">
                {profile.name}
              </span>
            </div>
          ))}

          {/* Add Profile Tile */}
          <div className="group flex flex-col items-center cursor-pointer">
            <div className="w-24 h-24 sm:w-36 sm:h-36 rounded-xl border-2 border-dashed border-gray-600 group-hover:border-white flex items-center justify-center group-hover:scale-105 transition-all duration-300 bg-gray-900/40">
              <Plus className="w-10 h-10 text-gray-500 group-hover:text-white transition-colors" />
            </div>
            <span className="mt-4 text-sm sm:text-base font-normal text-gray-400 group-hover:text-white transition-colors">
              Add Profile
            </span>
          </div>
        </div>

        {/* Manage Profiles Button */}
        <div className="pt-6">
          <button className="px-6 py-2 border border-gray-600 hover:border-white text-gray-400 hover:text-white uppercase tracking-widest text-xs sm:text-sm font-semibold transition-all">
            Manage Profiles
          </button>
        </div>
      </div>
    </div>
  );
};

