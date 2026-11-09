export interface WatchProvider {
  provider_id: number;
  provider_name: string;
  logo_path?: string;
  watch_url?: string;
  type: 'flatrate' | 'rent' | 'buy' | 'free';
  quality?: string;
}

export interface Movie {
  id: number;
  title: string;
  original_title?: string;
  overview: string;
  poster_path?: string;
  backdrop_path?: string;
  release_date?: string;
  release_year?: number;
  original_language: string;
  genres: string[];
  vote_average: number;
  vote_count: number;
  popularity: number;
  runtime_minutes?: number;
  director?: string;
  cast?: string[];
  trailer_url?: string;
  is_licensed_stream?: boolean;
  stream_url?: string;
  providers?: WatchProvider[];
  ai_match_percentage?: number;
  recommendation_reason?: string;
}

