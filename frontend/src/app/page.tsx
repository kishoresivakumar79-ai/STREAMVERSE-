'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { HeroBanner } from '../components/HeroBanner';
import { Top10Row } from '../components/Top10Row';
import { NetflixRow } from '../components/NetflixRow';
import { ProfileSelector, UserProfile, PRESET_PROFILES } from '../components/ProfileSelector';
import { NetflixPlayer } from '../components/NetflixPlayer';
import { MovieDetailsModal } from '../components/MovieDetailsModal';
import { SearchModal } from '../components/SearchModal';
import { ContentStudioModal } from '../components/ContentStudioModal';
import { TrailerModal } from '../components/TrailerModal';
import { MoodRecommenderBar } from '../components/MoodRecommenderBar';
import { OTTFilterBar } from '../components/OTTFilterBar';
import { Movie } from '../types/movie';
import { Sparkles, Film, Flame, Bookmark, Tv } from 'lucide-react';

const INITIAL_CATALOG: Movie[] = [
  {
    id: 1072790,
    title: "Leo",
    original_title: "Leo - Bloody Sweet",
    overview: "Parthiban is a mild-mannered cafe owner in Kashmir, who fends off a gang of murderous thugs and gains attention from a drug cartel claiming he was once their dangerous enforcer, Leo Das.",
    poster_path: "https://image.tmdb.org/t/p/w500/b14qqgzYrr4zX7zN2J1G2Q2Qp6i.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/original/t5zCBSB5xMDKcDqe91qahCOUYVV.jpg",
    release_date: "2023-10-19",
    release_year: 2023,
    original_language: "ta",
    genres: ["Action", "Crime", "Thriller"],
    vote_average: 7.3,
    vote_count: 480,
    popularity: 92.5,
    runtime_minutes: 164,
    director: "Lokesh Kanagaraj",
    cast: ["Thalapathy Vijay", "Sanjay Dutt", "Arjun Sarja", "Trisha Krishnan"],
    trailer_url: "https://www.youtube.com/watch?v=Po3jStA673E",
    is_licensed_stream: false,
    providers: [
      {
        provider_id: 8,
        provider_name: "Netflix",
        logo_path: "https://assets.nflxext.com/ffe/siteui/common/icons/monogram_n.svg",
        watch_url: "https://www.netflix.com/title/81639323",
        type: "flatrate",
        quality: "4K Dolby Vision"
      }
    ]
  },
  {
    id: 872954,
    title: "Vikram",
    original_title: "Vikram",
    overview: "A special investigator discovers a case of serial killings is not what it seems to be, leading him to an undercover black-ops commander and a shadowy drug syndicate.",
    poster_path: "https://image.tmdb.org/t/p/w500/t0b13hB36W943Q55xQ8oI3x0w5j.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/original/70Xqamtn1gQe7eSviXJ03uEec9J.jpg",
    release_date: "2022-06-03",
    release_year: 2022,
    original_language: "ta",
    genres: ["Action", "Thriller", "Crime"],
    vote_average: 8.1,
    vote_count: 620,
    popularity: 88.0,
    runtime_minutes: 175,
    director: "Lokesh Kanagaraj",
    cast: ["Kamal Haasan", "Vijay Sethupathi", "Fahadh Faasil", "Suriya"],
    trailer_url: "https://www.youtube.com/watch?v=OKBMCL-frPU",
    is_licensed_stream: false,
    providers: [
      {
        provider_id: 122,
        provider_name: "JioHotstar",
        logo_path: "https://img10.hotstar.com/image/upload/f_auto,q_90,w_384/v1656431456/web-images/logo-d-plus.svg",
        watch_url: "https://www.hotstar.com/in/movies/vikram/1260105315",
        type: "flatrate",
        quality: "4K UHD"
      },
      {
        provider_id: 5,
        provider_name: "ZEE5",
        logo_path: "https://www.zee5.com/images/ZEE5_logo.svg",
        watch_url: "https://www.zee5.com/movies/details/vikram/0-0-1z5170366",
        type: "flatrate",
        quality: "1080p HD"
      }
    ]
  },
  {
    id: 940551,
    title: "Jailer",
    original_title: "Jailer",
    overview: "Muthuvel Pandian, a retired strict jailer, goes on a merciless manhunt to track down the syndicate responsible for his police officer son's disappearance.",
    poster_path: "https://image.tmdb.org/t/p/w500/pTmMxAHqX4vsIDE6HPPxOR0Q6TN.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/original/e2duwRzB3tY8F4z94b2E3Kq6y1P.jpg",
    release_date: "2023-08-10",
    release_year: 2023,
    original_language: "ta",
    genres: ["Action", "Comedy", "Crime"],
    vote_average: 7.2,
    vote_count: 390,
    popularity: 85.2,
    runtime_minutes: 168,
    director: "Nelson Dilipkumar",
    cast: ["Rajinikanth", "Vinayakan", "Ramya Krishnan", "Mohanlal"],
    trailer_url: "https://www.youtube.com/watch?v=xenOE1Tma0A",
    is_licensed_stream: false,
    providers: [
      {
        provider_id: 9,
        provider_name: "Amazon Prime Video",
        logo_path: "https://m.media-amazon.com/images/G/01/digital/video/web/logo-min-remake.png",
        watch_url: "https://www.primevideo.com/detail/Jailer/0SZW5F2G3W5F7D3T4M6B9K",
        type: "flatrate",
        quality: "4K UHD"
      }
    ]
  },
  {
    id: 1118224,
    title: "Maharaja",
    original_title: "Maharaja",
    overview: "A quiet barber files an unusual police complaint demanding the retrieval of his missing dustbin 'Lakshmi', disguising a much deeper, chilling vendetta against ruthless criminals.",
    poster_path: "https://image.tmdb.org/t/p/w500/s0m4TM1XRAftQStgKpw024RvkJo.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/original/ot1UteJ1TL3xWuhkLRNzBULw4KJ.jpg",
    release_date: "2024-06-14",
    release_year: 2024,
    original_language: "ta",
    genres: ["Action", "Thriller", "Drama"],
    vote_average: 8.4,
    vote_count: 510,
    popularity: 95.8,
    runtime_minutes: 141,
    director: "Nithilan Saminathan",
    cast: ["Vijay Sethupathi", "Anurag Kashyap", "Mamta Mohandas"],
    trailer_url: "https://www.youtube.com/watch?v=1F3X04J54vU",
    is_licensed_stream: false,
    providers: [
      {
        provider_id: 8,
        provider_name: "Netflix",
        logo_path: "https://assets.nflxext.com/ffe/siteui/common/icons/monogram_n.svg",
        watch_url: "https://www.netflix.com/title/81775743",
        type: "flatrate",
        quality: "4K UHD"
      }
    ]
  },
  {
    id: 660046,
    title: "Ponniyin Selvan: Part I",
    original_title: "Ponniyin Selvan: I",
    overview: "Vandiyathevan sets out to cross the Chola land to deliver a secret message from Crown Prince Aditha Karikalan, unraveling political conspiracy, love, and treason.",
    poster_path: "https://image.tmdb.org/t/p/w500/nrVpYaBw0kqm2ySiwbxo33LnRkr.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/original/t5zCBSB5xMDKcDqe91qahCOUYVV.jpg",
    release_date: "2022-09-30",
    release_year: 2022,
    original_language: "ta",
    genres: ["Action", "Adventure", "Drama"],
    vote_average: 7.7,
    vote_count: 310,
    popularity: 79.0,
    runtime_minutes: 167,
    director: "Mani Ratnam",
    cast: ["Vikram", "Aishwarya Rai Bachchan", "Jayam Ravi", "Karthi", "Trisha"],
    trailer_url: "https://www.youtube.com/watch?v=D4qAQYlgZVM",
    is_licensed_stream: false,
    providers: [
      {
        provider_id: 9,
        provider_name: "Amazon Prime Video",
        logo_path: "https://m.media-amazon.com/images/G/01/digital/video/web/logo-min-remake.png",
        watch_url: "https://www.primevideo.com/detail/Ponniyin-Selvan-Part-1/0G128H7654321",
        type: "flatrate",
        quality: "4K UHD"
      }
    ]
  },
  {
    id: 585244,
    title: "Master",
    original_title: "Master",
    overview: "An alcoholic professor is sent to a juvenile school, where he clashes with a ruthless gangster who uses the children as pawns for his criminal empire.",
    poster_path: "https://image.tmdb.org/t/p/w500/wit1VRI9sAbCstuwm3KPgxfYYqo.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/original/70Xqamtn1gQe7eSviXJ03uEec9J.jpg",
    release_date: "2021-01-13",
    release_year: 2021,
    original_language: "ta",
    genres: ["Action", "Crime", "Thriller"],
    vote_average: 7.4,
    vote_count: 290,
    popularity: 86.4,
    runtime_minutes: 179,
    director: "Lokesh Kanagaraj",
    cast: ["Thalapathy Vijay", "Vijay Sethupathi", "Malavika Mohanan"],
    trailer_url: "https://www.youtube.com/watch?v=1_iU7rJiZ_g",
    is_licensed_stream: false,
    providers: [
      {
        provider_id: 9,
        provider_name: "Amazon Prime Video",
        logo_path: "https://m.media-amazon.com/images/G/01/digital/video/web/logo-min-remake.png",
        watch_url: "https://www.primevideo.com/detail/Master/0SZW5F2G3",
        type: "flatrate",
        quality: "4K UHD"
      }
    ]
  },
  {
    id: 634492,
    title: "Kaithi",
    original_title: "Kaithi",
    overview: "Dilli, an ex-convict, endeavors to meet his daughter for the first time after leaving prison. However, his attempts are interrupted by a drug raid led by inspector Bejoy.",
    poster_path: "https://image.tmdb.org/t/p/w500/g4oKq6v1wAkwX9y9lUa25V66yA0.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/original/e2duwRzB3tY8F4z94b2E3Kq6y1P.jpg",
    release_date: "2019-10-25",
    release_year: 2019,
    original_language: "ta",
    genres: ["Action", "Thriller", "Crime"],
    vote_average: 8.0,
    vote_count: 310,
    popularity: 84.0,
    runtime_minutes: 145,
    director: "Lokesh Kanagaraj",
    cast: ["Karthi", "Narain", "Arjun Das"],
    trailer_url: "https://www.youtube.com/watch?v=g79Awe0F8hg",
    is_licensed_stream: false,
    providers: [
      {
        provider_id: 122,
        provider_name: "JioHotstar",
        logo_path: "https://img10.hotstar.com/image/upload/f_auto,q_90,w_384/v1656431456/web-images/logo-d-plus.svg",
        watch_url: "https://www.hotstar.com/in/movies/kaithi/1260014022",
        type: "flatrate",
        quality: "1080p HD"
      }
    ]
  },
  {
    id: 872585,
    title: "Oppenheimer",
    original_title: "Oppenheimer",
    overview: "The story of J. Robert Oppenheimer's role in the development of the atomic bomb during World War II.",
    poster_path: "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/original/fm6K9vYqq0nG9SOo9psh697w09.jpg",
    release_date: "2023-07-21",
    release_year: 2023,
    original_language: "en",
    genres: ["Drama", "History"],
    vote_average: 8.1,
    vote_count: 13400,
    popularity: 99.4,
    runtime_minutes: 180,
    director: "Christopher Nolan",
    cast: ["Cillian Murphy", "Emily Blunt", "Matt Damon", "Robert Downey Jr."],
    trailer_url: "https://www.youtube.com/watch?v=uYPbbksJxIg",
    is_licensed_stream: false,
    providers: [
      {
        provider_id: 122,
        provider_name: "JioHotstar",
        logo_path: "https://img10.hotstar.com/image/upload/f_auto,q_90,w_384/v1656431456/web-images/logo-d-plus.svg",
        watch_url: "https://www.hotstar.com/in/movies/oppenheimer/1260172355",
        type: "flatrate",
        quality: "4K Dolby Atmos"
      }
    ]
  },
  {
    id: 157336,
    title: "Interstellar",
    original_title: "Interstellar",
    overview: "The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel.",
    poster_path: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/original/xJHokMbljvjADYdit5fK5VQsXEG.jpg",
    release_date: "2014-11-05",
    release_year: 2014,
    original_language: "en",
    genres: ["Adventure", "Drama", "Sci-Fi"],
    vote_average: 8.4,
    vote_count: 35200,
    popularity: 94.1,
    runtime_minutes: 169,
    director: "Christopher Nolan",
    cast: ["Matthew McConaughey", "Anne Hathaway"],
    trailer_url: "https://www.youtube.com/watch?v=zSWdZVtXT7E",
    is_licensed_stream: false,
    providers: [
      {
        provider_id: 9,
        provider_name: "Amazon Prime Video",
        logo_path: "https://m.media-amazon.com/images/G/01/digital/video/web/logo-min-remake.png",
        watch_url: "https://www.primevideo.com/detail/Interstellar/0I905YF9",
        type: "flatrate",
        quality: "4K UHD"
      }
    ]
  },
  {
    id: 1163258,
    title: "12th Fail",
    original_title: "12th Fail",
    overview: "Based on the true story of Manoj Kumar Sharma, who overcomes extreme poverty to crack the IPS exam.",
    poster_path: "https://image.tmdb.org/t/p/w500/eebUPRI4Z5e1Z7Hev4JZAwMIFkX.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/original/v5e4T1Q7u3p9a7K6a8m2.jpg",
    release_date: "2023-10-27",
    release_year: 2023,
    original_language: "hi",
    genres: ["Drama", "Biography"],
    vote_average: 8.5,
    vote_count: 780,
    popularity: 87.5,
    runtime_minutes: 147,
    director: "Vidhu Vinod Chopra",
    cast: ["Vikrant Massey", "Medha Shankr"],
    trailer_url: "https://www.youtube.com/watch?v=we33P9b4zH8",
    is_licensed_stream: false,
    providers: [
      {
        provider_id: 122,
        provider_name: "JioHotstar",
        logo_path: "https://img10.hotstar.com/image/upload/f_auto,q_90,w_384/v1656431456/web-images/logo-d-plus.svg",
        watch_url: "https://www.hotstar.com/in/movies/12th-fail/1260163351",
        type: "flatrate",
        quality: "4K UHD"
      }
    ]
  },
  {
    id: 781732,
    title: "Animal",
    original_title: "Animal",
    overview: "A son undergoes a remarkable transformation as the bond with his father begins to fracture, leading him down a dangerous path of unchecked vengeance.",
    poster_path: "https://image.tmdb.org/t/p/w500/lprsAHkwMxk2iC6VZxNmV0H7g1t.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/original/3m4G9X0F4v93vE6K9G1v2W8K0L.jpg",
    release_date: "2023-12-01",
    release_year: 2023,
    original_language: "hi",
    genres: ["Action", "Crime", "Drama"],
    vote_average: 7.0,
    vote_count: 410,
    popularity: 93.2,
    runtime_minutes: 201,
    director: "Sandeep Reddy Vanga",
    cast: ["Ranbir Kapoor", "Anil Kapoor", "Rashmika Mandanna"],
    trailer_url: "https://www.youtube.com/watch?v=YD7b4gUatR4",
    is_licensed_stream: false,
    providers: [
      {
        provider_id: 8,
        provider_name: "Netflix",
        logo_path: "https://assets.nflxext.com/ffe/siteui/common/icons/monogram_n.svg",
        watch_url: "https://www.netflix.com/title/81436990",
        type: "flatrate",
        quality: "4K UHD"
      }
    ]
  },
  {
    id: 999001,
    title: "The Last Horizon (STREAMVERSE Original)",
    original_title: "The Last Horizon - Indie Sci-Fi Short",
    overview: "A solo astronaut on a deep-space satellite station detects an unearthly musical broadcast emanating from the edge of the Kuiper belt.",
    poster_path: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&q=80",
    backdrop_path: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1600&q=80",
    release_date: "2025-01-15",
    release_year: 2025,
    original_language: "en",
    genres: ["Sci-Fi", "Drama", "Mystery"],
    vote_average: 8.8,
    vote_count: 140,
    popularity: 91.0,
    runtime_minutes: 24,
    director: "K. R. Vasanth",
    cast: ["Elena Ross", "Arun Kumar"],
    trailer_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    is_licensed_stream: true,
    stream_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    providers: [
      {
        provider_id: 999,
        provider_name: "STREAMVERSE Original",
        logo_path: "/favicon.ico",
        watch_url: "internal://stream/999001",
        type: "free",
        quality: "4K HDR"
      }
    ]
  }
];

export default function NetflixPage() {
  const [currentProfile, setCurrentProfile] = useState<UserProfile | null>(PRESET_PROFILES[0]);
  const [isSelectingProfile, setIsSelectingProfile] = useState(false);
  const [movies, setMovies] = useState<Movie[]>(INITIAL_CATALOG);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [streamingMovie, setStreamingMovie] = useState<Movie | null>(null);
  const [trailerMovie, setTrailerMovie] = useState<Movie | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isStudioOpen, setIsStudioOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedOTT, setSelectedOTT] = useState('all');
  const [watchlist, setWatchlist] = useState<number[]>([1072790, 872954]);
  const [aiRecs, setAiRecs] = useState<Movie[]>([]);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [moodMovies, setMoodMovies] = useState<Movie[]>([]);

  // Fetch backend data & personalized AI suggestions
  useEffect(() => {
    const fetchLive = async () => {
      try {
        const [trendingRes, aiRes] = await Promise.all([
          fetch('http://localhost:8000/api/movies/trending'),
          fetch('http://localhost:8000/api/recommendations/personalized', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              preferred_languages: currentProfile?.preferences.languages || ['ta', 'en'],
              preferred_genres: currentProfile?.preferences.genres || ['Action', 'Thriller'],
              limit: 8
            })
          })
        ]);

        if (trendingRes.ok) {
          const tData = await trendingRes.json();
          setMovies(tData);
        }

        if (aiRes.ok) {
          const aData = await aiRes.json();
          setAiRecs(aData);
        }
      } catch (err) {
        console.log('Using local dataset');
      }
    };

    fetchLive();
  }, [currentProfile]);

  const toggleWatchlist = (movie: Movie) => {
    setWatchlist((prev) =>
      prev.includes(movie.id) ? prev.filter((id) => id !== movie.id) : [...prev, movie.id]
    );
  };

  const handleAddMovie = (newMovie: Movie) => {
    setMovies((prev) => [newMovie, ...prev]);
  };

  const handleSelectMood = async (moodTag: string) => {
    if (selectedMood === moodTag) {
      setSelectedMood(null);
      setMoodMovies([]);
      return;
    }
    setSelectedMood(moodTag);
    try {
      const res = await fetch(`http://localhost:8000/api/recommendations/mood/${moodTag}?limit=6`);
      if (res.ok) {
        const data = await res.json();
        setMoodMovies(data);
      }
    } catch (err) {
      console.error('Mood fetch error:', err);
    }
  };

  const heroMovie = movies[0] || INITIAL_CATALOG[0];

  // Filters
  const tamilMovies = movies.filter((m) => m.original_language === 'ta');
  const licensedMovies = movies.filter((m) => m.is_licensed_stream);
  const netflixMovies = movies.filter((m) =>
    m.providers?.some((p) => p.provider_name.toLowerCase().includes('netflix'))
  );
  const primeMovies = movies.filter((m) =>
    m.providers?.some((p) => p.provider_name.toLowerCase().includes('prime'))
  );
  const hotstarMovies = movies.filter((m) =>
    m.providers?.some((p) => p.provider_name.toLowerCase().includes('hotstar'))
  );
  const myWatchlistMovies = movies.filter((m) => watchlist.includes(m.id));

  // If user triggered "Switch Profile"
  if (isSelectingProfile) {
    return (
      <ProfileSelector
        onSelectProfile={(profile) => {
          setCurrentProfile(profile);
          setIsSelectingProfile(false);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#141414] text-white selection:bg-red-600 selection:text-white">
      {/* Sticky Netflix Navigation */}
      <Navbar
        onOpenSearch={() => setIsSearchOpen(true)}
        watchlistCount={watchlist.length}
        onOpenWatchlist={() => {
          const el = document.getElementById('my-list-section');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        currentProfile={currentProfile}
        onSwitchProfile={() => setIsSelectingProfile(true)}
        onOpenStudio={() => setIsStudioOpen(true)}
      />

      {/* Main Netflix Content Feed */}
      <main className="pb-24">
        {/* Netflix Billboard Hero Banner */}
        <HeroBanner
          movie={heroMovie}
          onSelectMovie={(m) => setSelectedMovie(m)}
          isWatchlisted={watchlist.includes(heroMovie.id)}
          onToggleWatchlist={toggleWatchlist}
          onPlayLicensed={(m) => setStreamingMovie(m)}
          onWatchTrailer={(m) => setTrailerMovie(m)}
        />

        {/* Quick OTT Filter Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 -mt-6 relative z-30">
          <OTTFilterBar
            selectedPlatform={selectedOTT}
            onSelectPlatform={setSelectedOTT}
          />
        </div>

        {/* AI Mood Recommender Bar */}
        <div className="max-w-7xl mx-auto">
          <MoodRecommenderBar
            selectedMood={selectedMood}
            onSelectMood={handleSelectMood}
          />
        </div>

        {/* DYNAMIC ROW: AI Mood Curated Row (if mood active) */}
        {selectedMood && moodMovies.length > 0 && (
          <NetflixRow
            title={`AI Mood: ${selectedMood.replace('-', ' ').toUpperCase()}`}
            badge="Mood-Based Curation"
            movies={moodMovies}
            onSelectMovie={setSelectedMovie}
            watchlist={watchlist}
            onToggleWatchlist={toggleWatchlist}
            onPlayLicensed={(m) => setStreamingMovie(m)}
          />
        )}

        {/* ROW 1: Netflix Top 10 Today in India (Signature Big Numbers) */}
        <Top10Row
          movies={movies}
          onSelectMovie={setSelectedMovie}
          onPlayLicensed={(m) => setStreamingMovie(m)}
        />

        {/* ROW 2: AI Curated For Current Profile */}
        <NetflixRow
          title={`Top Picks for ${currentProfile?.name || 'You'}`}
          badge="AI Recommendation"
          movies={aiRecs.length > 0 ? aiRecs : movies.slice(1, 6)}
          onSelectMovie={setSelectedMovie}
          watchlist={watchlist}
          onToggleWatchlist={toggleWatchlist}
          onPlayLicensed={(m) => setStreamingMovie(m)}
        />

        {/* ROW 3: STREAMVERSE Originals & Licensed Cinema (Built-in Player) */}
        {licensedMovies.length > 0 && (
          <NetflixRow
            title="STREAMVERSE Originals & Indie Cinema"
            badge="Built-in Streaming"
            movies={licensedMovies}
            onSelectMovie={setSelectedMovie}
            watchlist={watchlist}
            onToggleWatchlist={toggleWatchlist}
            onPlayLicensed={(m) => setStreamingMovie(m)}
          />
        )}

        {/* ROW 4: Blockbuster Tamil Cinema */}
        <NetflixRow
          title="Trending Tamil Cinema"
          movies={tamilMovies}
          onSelectMovie={setSelectedMovie}
          watchlist={watchlist}
          onToggleWatchlist={toggleWatchlist}
          onPlayLicensed={(m) => setStreamingMovie(m)}
        />

        {/* ROW 5: Trending on Netflix */}
        {netflixMovies.length > 0 && (
          <NetflixRow
            title="Popular on Netflix"
            badge="Netflix India"
            movies={netflixMovies}
            onSelectMovie={setSelectedMovie}
            watchlist={watchlist}
            onToggleWatchlist={toggleWatchlist}
            onPlayLicensed={(m) => setStreamingMovie(m)}
          />
        )}

        {/* ROW 6: Popular on JioHotstar & Disney */}
        {hotstarMovies.length > 0 && (
          <NetflixRow
            title="Hotstar Exclusives"
            badge="JioHotstar"
            movies={hotstarMovies}
            onSelectMovie={setSelectedMovie}
            watchlist={watchlist}
            onToggleWatchlist={toggleWatchlist}
            onPlayLicensed={(m) => setStreamingMovie(m)}
          />
        )}

        {/* ROW 7: Prime Video Hits */}
        {primeMovies.length > 0 && (
          <NetflixRow
            title="Included with Amazon Prime"
            badge="Prime Video"
            movies={primeMovies}
            onSelectMovie={setSelectedMovie}
            watchlist={watchlist}
            onToggleWatchlist={toggleWatchlist}
            onPlayLicensed={(m) => setStreamingMovie(m)}
          />
        )}

        {/* ROW 8: My List */}
        <div id="my-list-section">
          <NetflixRow
            title="My List"
            movies={myWatchlistMovies}
            onSelectMovie={setSelectedMovie}
            watchlist={watchlist}
            onToggleWatchlist={toggleWatchlist}
            onPlayLicensed={(m) => setStreamingMovie(m)}
          />
        </div>
      </main>

      {/* Netflix Footer */}
      <footer className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-12 py-12 text-xs text-gray-500 space-y-4">
        <div className="flex items-center gap-2 text-gray-400 font-bold">
          <span>STREAMVERSE — Unified OTT Platform & Proprietary Streaming Service</span>
        </div>
        <p className="leading-relaxed">
          Aggregates legal metadata for Netflix, Amazon Prime Video, JioHotstar, Sony LIV, and ZEE5 via TMDB Watch Providers (India Region). Direct streams rendered with licensed distribution authorization.
        </p>
        <div className="pt-2 text-gray-600">
          © 2026 STREAMVERSE Inc. Netflix UI/UX Architecture Model.
        </div>
      </footer>

      {/* MODALS */}
      {/* 1. Full Netflix-grade Video Player Overlay */}
      <NetflixPlayer
        movie={streamingMovie}
        onClose={() => setStreamingMovie(null)}
      />

      {/* 2. Movie Details & OTT Availability Modal */}
      <MovieDetailsModal
        movie={selectedMovie}
        onClose={() => setSelectedMovie(null)}
        isWatchlisted={selectedMovie ? watchlist.includes(selectedMovie.id) : false}
        onToggleWatchlist={toggleWatchlist}
        onSelectMovie={(m) => setSelectedMovie(m)}
        onPlayLicensed={(m) => setStreamingMovie(m)}
      />

      {/* 3. Official HD Trailer Modal */}
      <TrailerModal
        movie={trailerMovie}
        onClose={() => setTrailerMovie(null)}
      />

      {/* 4. Universal Multi-OTT Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectMovie={(m) => setSelectedMovie(m)}
      />

      {/* 5. Creator Studio / Add Content Modal */}
      <ContentStudioModal
        isOpen={isStudioOpen}
        onClose={() => setIsStudioOpen(false)}
        onAddMovie={handleAddMovie}
      />
    </div>
  );
}
