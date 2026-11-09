'use client';

import React from 'react';
import { Zap, Brain, Flame, Sparkles, Rocket } from 'lucide-react';

export interface MoodOption {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  tag: string;
  color: string;
}

export const MOODS: MoodOption[] = [
  { id: 'high-octane', label: 'High-Octane Action', icon: Zap, tag: 'high-octane', color: 'hover:border-red-500' },
  { id: 'mind-bending', label: 'Mind-Bending Thrillers', icon: Brain, tag: 'mind-bending', color: 'hover:border-purple-500' },
  { id: 'tamil-mass', label: 'Tamil Mass Blockbusters', icon: Flame, tag: 'tamil-mass', color: 'hover:border-amber-500' },
  { id: 'inspirational', label: 'Inspirational & Real Stories', icon: Sparkles, tag: 'inspirational', color: 'hover:border-emerald-500' },
  { id: 'sci-fi', label: 'Cosmic Sci-Fi Odyssey', icon: Rocket, tag: 'sci-fi', color: 'hover:border-sky-500' }
];

interface MoodRecommenderBarProps {
  selectedMood: string | null;
  onSelectMood: (moodTag: string) => void;
}

export const MoodRecommenderBar: React.FC<MoodRecommenderBarProps> = ({
  selectedMood,
  onSelectMood
}) => {
  return (
    <div className="my-6 px-4 sm:px-6 lg:px-12">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-4 h-4 text-amber-400" />
        <h3 className="text-sm sm:text-base font-bold text-gray-200">
          How are you feeling today? (AI Mood Recommender)
        </h3>
      </div>

      <div className="flex items-center gap-2.5 overflow-x-auto scrollbar-none pb-2">
        {MOODS.map((mood) => {
          const isSelected = selectedMood === mood.tag;
          const Icon = mood.icon;

          return (
            <button
              key={mood.id}
              onClick={() => onSelectMood(mood.tag)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all border ${
                isSelected
                  ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white border-red-500 shadow-lg shadow-red-600/30 scale-105'
                  : `bg-[#181d28] text-gray-300 border-gray-800 ${mood.color} hover:bg-gray-800`
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{mood.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

