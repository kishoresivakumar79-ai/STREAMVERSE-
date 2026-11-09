'use client';

import React from 'react';
import { Film, Sparkles, Tv } from 'lucide-react';

interface OTTFilterBarProps {
  selectedPlatform: string;
  onSelectPlatform: (platform: string) => void;
}

const PLATFORMS = [
  { id: 'all', label: 'All Platforms', icon: Film, color: 'hover:border-gray-500' },
  { id: 'netflix', label: 'Netflix', color: 'hover:border-red-600' },
  { id: 'prime', label: 'Prime Video', color: 'hover:border-sky-500' },
  { id: 'hotstar', label: 'JioHotstar', color: 'hover:border-blue-600' },
  { id: 'sonyliv', label: 'Sony LIV', color: 'hover:border-purple-600' },
  { id: 'zee5', label: 'ZEE5', color: 'hover:border-amber-500' },
  { id: 'licensed', label: 'Own Stream', icon: Tv, color: 'hover:border-emerald-500' },
];

export const OTTFilterBar: React.FC<OTTFilterBarProps> = ({
  selectedPlatform,
  onSelectPlatform
}) => {
  return (
    <div className="w-full overflow-x-auto py-4 scrollbar-none">
      <div className="flex items-center gap-2.5 min-w-max px-4 sm:px-6 lg:px-8">
        <span className="text-xs uppercase tracking-widest text-gray-500 font-bold mr-2">
          Filter OTT:
        </span>
        {PLATFORMS.map((platform) => {
          const isSelected = selectedPlatform === platform.id;
          return (
            <button
              key={platform.id}
              onClick={() => onSelectPlatform(platform.id)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 border ${
                isSelected
                  ? 'bg-white text-gray-950 border-white shadow-lg shadow-white/10 scale-105'
                  : `bg-[#151922] text-gray-300 border-gray-800 ${platform.color} hover:bg-gray-800`
              }`}
            >
              {platform.icon && <platform.icon className="w-3.5 h-3.5" />}
              <span>{platform.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

