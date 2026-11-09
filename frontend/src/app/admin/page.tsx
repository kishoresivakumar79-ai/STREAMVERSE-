'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, Users, Play, DollarSign, Activity, Film, 
  Trash2, Plus, ExternalLink, HardDrive, CheckCircle2, AlertCircle 
} from 'lucide-react';
import { Movie } from '../../types/movie';
import { ContentStudioModal } from '../../components/ContentStudioModal';

interface AnalyticsData {
  overview: {
    total_users: number;
    monthly_active_streamers: number;
    total_watch_hours: number;
    estimated_affiliate_revenue_inr: number;
    total_titles_cataloged: number;
    licensed_originals: number;
    external_aggregated: number;
  };
  ott_redirect_share: Array<{
    platform: string;
    share_percentage: number;
    color: string;
  }>;
  top_searched_titles: Array<{
    query: string;
    searches: number;
    dominant_ott: string;
  }>;
  streaming_server_health: {
    cdn_egress_gb: number;
    hls_cache_hit_ratio: string;
    average_bitrate: string;
    active_hls_connections: number;
  };
}

export default function AdminDashboardPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isStudioOpen, setIsStudioOpen] = useState(false);
  const [deleteStatus, setDeleteStatus] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [analyticsRes, moviesRes] = await Promise.all([
          fetch('http://localhost:8000/api/admin/analytics'),
          fetch('http://localhost:8000/api/movies/trending')
        ]);

        if (analyticsRes.ok) {
          const aData = await analyticsRes.json();
          setAnalytics(aData);
        }

        if (moviesRes.ok) {
          const mData = await moviesRes.json();
          setMovies(mData);
        }
      } catch (err) {
        console.error('Error fetching admin data:', err);
      }
    };

    fetchData();
  }, []);

  const handleDeleteMovie = async (movieId: number, title: string) => {
    if (!confirm(`Are you sure you want to remove "${title}" from the catalog?`)) return;

    try {
      const res = await fetch(`http://localhost:8000/api/admin/movies/${movieId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setMovies((prev) => prev.filter((m) => m.id !== movieId));
        setDeleteStatus(`Movie "${title}" removed.`);
        setTimeout(() => setDeleteStatus(null), 3000);
      }
    } catch (err) {
      // Local fallback removal
      setMovies((prev) => prev.filter((m) => m.id !== movieId));
      setDeleteStatus(`Movie "${title}" removed.`);
      setTimeout(() => setDeleteStatus(null), 3000);
    }
  };

  const handleAddMovie = (newMovie: Movie) => {
    setMovies((prev) => [newMovie, ...prev]);
  };

  return (
    <div className="min-h-screen bg-[#0d0f15] text-gray-100 p-4 sm:p-8 lg:p-12">
      {/* Top Header */}
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 border-b border-gray-800">
        <div>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2 rounded-xl bg-gray-900 hover:bg-gray-800 text-gray-400 hover:text-white transition-colors border border-gray-800"
              title="Return to STREAMVERSE App"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              STREAMVERSE Executive Console
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-gray-400 mt-1 pl-12">
            Centralized Command for OTT Aggregator Traffic, Video CDN & Licensing
          </p>
        </div>

        <button
          onClick={() => setIsStudioOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm shadow-lg shadow-red-600/30 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Publish New Movie</span>
        </button>
      </div>

      {deleteStatus && (
        <div className="max-w-7xl mx-auto mt-4 p-3 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{deleteStatus}</span>
        </div>
      )}

      {/* METRIC CARDS */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        <div className="p-5 rounded-2xl bg-[#141824] border border-gray-800/80 shadow">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Registered</span>
            <Users className="w-5 h-5 text-red-500" />
          </div>
          <div className="text-3xl font-black text-white">
            {analytics?.overview.total_users.toLocaleString() || '28,450'}
          </div>
          <div className="text-xs text-emerald-400 mt-1">↑ +14.2% this month</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#141824] border border-gray-800/80 shadow">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Streamers</span>
            <Play className="w-5 h-5 text-sky-400" />
          </div>
          <div className="text-3xl font-black text-white">
            {analytics?.overview.monthly_active_streamers.toLocaleString() || '19,200'}
          </div>
          <div className="text-xs text-gray-400 mt-1">Live active sessions</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#141824] border border-gray-800/80 shadow">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Watch Hours</span>
            <Activity className="w-5 h-5 text-purple-400" />
          </div>
          <div className="text-3xl font-black text-white">
            {analytics?.overview.total_watch_hours.toLocaleString() || '158,400'} hrs
          </div>
          <div className="text-xs text-gray-400 mt-1">Across all platforms</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#141824] border border-gray-800/80 shadow">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Affiliate Revenue</span>
            <DollarSign className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-white">
            ₹{analytics?.overview.estimated_affiliate_revenue_inr.toLocaleString() || '1,84,500'}
          </div>
          <div className="text-xs text-emerald-400 mt-1">OTT conversion referral</div>
        </div>
      </div>

      {/* TRAFFIC & STREAMING SERVER STATS */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        {/* OTT Platform Traffic Share */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-[#141824] border border-gray-800/80 shadow space-y-4">
          <h3 className="text-base font-bold text-white">
            Indian OTT Redirect Traffic Distribution
          </h3>

          <div className="space-y-3">
            {(analytics?.ott_redirect_share || [
              { platform: 'Netflix India', share_percentage: 39, color: '#E50914' },
              { platform: 'JioHotstar', share_percentage: 28, color: '#001E80' },
              { platform: 'Amazon Prime Video', share_percentage: 19, color: '#00A8E1' },
              { platform: 'STREAMVERSE Own Streams', share_percentage: 10, color: '#10B981' },
              { platform: 'ZEE5 & Sony LIV', share_percentage: 4, color: '#F59E0B' }
            ]).map((item) => (
              <div key={item.platform} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-medium">
                  <span className="text-gray-300">{item.platform}</span>
                  <span className="font-bold text-white">{item.share_percentage}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-gray-900 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${item.share_percentage}%`,
                      backgroundColor: item.color
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Video Streaming Engine Health */}
        <div className="p-6 rounded-2xl bg-[#141824] border border-gray-800/80 shadow space-y-4">
          <div className="flex items-center gap-2">
            <HardDrive className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-white">
              HLS Video CDN Health
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 bg-gray-900/60 rounded-xl border border-gray-800">
              <span className="text-gray-400">Cache Hit Ratio</span>
              <span className="font-bold text-emerald-400">
                {analytics?.streaming_server_health.hls_cache_hit_ratio || '96.4%'}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-900/60 rounded-xl border border-gray-800">
              <span className="text-gray-400">CDN Egress</span>
              <span className="font-bold text-white">
                {analytics?.streaming_server_health.cdn_egress_gb || '4,820'} GB
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-900/60 rounded-xl border border-gray-800">
              <span className="text-gray-400">Active HLS Viewers</span>
              <span className="font-bold text-sky-400">
                {analytics?.streaming_server_health.active_hls_connections || '142'} live
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-900/60 rounded-xl border border-gray-800">
              <span className="text-gray-400">Average Bitrate</span>
              <span className="font-bold text-white">
                {analytics?.streaming_server_health.average_bitrate || '4.8 Mbps (1080p)'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* CATALOG INVENTORY TABLE */}
      <div className="max-w-7xl mx-auto mt-8 bg-[#141824] border border-gray-800/80 rounded-2xl overflow-hidden shadow">
        <div className="p-5 border-b border-gray-800 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">
              Movie & Streaming Catalog ({movies.length} Titles)
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Manage licensed video manifests, TMDB mappings, and OTT partner links
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-900/80 text-gray-400 uppercase tracking-wider font-semibold border-b border-gray-800">
              <tr>
                <th className="py-3.5 px-4">Title</th>
                <th className="py-3.5 px-4">Distribution Type</th>
                <th className="py-3.5 px-4">Language / Year</th>
                <th className="py-3.5 px-4">Primary Platform</th>
                <th className="py-3.5 px-4">Rating</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60">
              {movies.map((movie) => {
                const primaryProvider = movie.providers?.[0];
                return (
                  <tr key={movie.id} className="hover:bg-gray-800/40 transition-colors">
                    <td className="py-3 px-4 flex items-center gap-3">
                      <img
                        src={movie.poster_path}
                        alt={movie.title}
                        className="w-10 h-14 rounded object-cover bg-gray-950 flex-shrink-0"
                      />
                      <div>
                        <div className="font-bold text-white text-sm">{movie.title}</div>
                        <div className="text-[11px] text-gray-400 line-clamp-1 max-w-xs">
                          {movie.genres?.join(', ')}
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      {movie.is_licensed_stream ? (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-800/60">
                          STREAMVERSE Stream
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-sky-950/80 text-sky-300 border border-sky-800/60">
                          External OTT Link
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-gray-300">
                      <span className="uppercase font-semibold">{movie.original_language}</span> • {movie.release_year}
                    </td>

                    <td className="py-3 px-4 font-medium text-gray-200">
                      {primaryProvider?.provider_name || (movie.is_licensed_stream ? 'Built-in Stream' : 'None')}
                    </td>

                    <td className="py-3 px-4 font-bold text-amber-400">
                      ★ {movie.vote_average.toFixed(1)}
                    </td>

                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() => handleDeleteMovie(movie.id, movie.title)}
                        className="p-1.5 rounded-lg bg-gray-900 hover:bg-red-600 text-gray-400 hover:text-white transition-colors"
                        title="Delete from Catalog"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Creator Studio Modal */}
      <ContentStudioModal
        isOpen={isStudioOpen}
        onClose={() => setIsStudioOpen(false)}
        onAddMovie={handleAddMovie}
      />
    </div>
  );
}

