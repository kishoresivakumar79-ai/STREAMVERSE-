import httpx
from typing import List, Dict, Any, Optional
from app.config import settings
from app.schemas.schemas import MovieBase, MovieDetail, WatchProvider

# Curated High-Fidelity Catalog (Every Movie with its authentic official poster & Indian OTT mappings)
MOCK_MOVIES: List[Dict[str, Any]] = [
    {
        "id": 1072790,
        "title": "Leo",
        "original_title": "Leo - Bloody Sweet",
        "overview": "Parthiban is a mild-mannered cafe owner in Kashmir, who fends off a gang of murderous thugs and gains attention from a drug cartel claiming he was once their dangerous enforcer, Leo Das.",
        "poster_path": "https://image.tmdb.org/t/p/w500/b14qqgzYrr4zX7zN2J1G2Q2Qp6i.jpg",
        "backdrop_path": "https://image.tmdb.org/t/p/original/t5zCBSB5xMDKcDqe91qahCOUYVV.jpg",
        "release_date": "2023-10-19",
        "release_year": 2023,
        "original_language": "ta",
        "genres": ["Action", "Crime", "Thriller"],
        "vote_average": 7.3,
        "vote_count": 480,
        "popularity": 92.5,
        "runtime_minutes": 164,
        "director": "Lokesh Kanagaraj",
        "cast": ["Thalapathy Vijay", "Sanjay Dutt", "Arjun Sarja", "Trisha Krishnan"],
        "trailer_url": "https://www.youtube.com/watch?v=Po3jStA673E",
        "is_licensed_stream": False,
        "providers": [
            {
                "provider_id": 8,
                "provider_name": "Netflix",
                "logo_path": "https://assets.nflxext.com/ffe/siteui/common/icons/monogram_n.svg",
                "watch_url": "https://www.netflix.com/title/81639323",
                "type": "flatrate",
                "quality": "4K Dolby Vision"
            }
        ]
    },
    {
        "id": 872954,
        "title": "Vikram",
        "original_title": "Vikram",
        "overview": "A special investigator discovers a case of serial killings is not what it seems to be, leading him to an undercover black-ops commander and a shadowy drug syndicate.",
        "poster_path": "https://image.tmdb.org/t/p/w500/t0b13hB36W943Q55xQ8oI3x0w5j.jpg",
        "backdrop_path": "https://image.tmdb.org/t/p/original/70Xqamtn1gQe7eSviXJ03uEec9J.jpg",
        "release_date": "2022-06-03",
        "release_year": 2022,
        "original_language": "ta",
        "genres": ["Action", "Thriller", "Crime"],
        "vote_average": 8.1,
        "vote_count": 620,
        "popularity": 88.0,
        "runtime_minutes": 175,
        "director": "Lokesh Kanagaraj",
        "cast": ["Kamal Haasan", "Vijay Sethupathi", "Fahadh Faasil", "Suriya"],
        "trailer_url": "https://www.youtube.com/watch?v=OKBMCL-frPU",
        "is_licensed_stream": False,
        "providers": [
            {
                "provider_id": 122,
                "provider_name": "JioHotstar",
                "logo_path": "https://img10.hotstar.com/image/upload/f_auto,q_90,w_384/v1656431456/web-images/logo-d-plus.svg",
                "watch_url": "https://www.hotstar.com/in/movies/vikram/1260105315",
                "type": "flatrate",
                "quality": "4K UHD"
            },
            {
                "provider_id": 5,
                "provider_name": "ZEE5",
                "logo_path": "https://www.zee5.com/images/ZEE5_logo.svg",
                "watch_url": "https://www.zee5.com/movies/details/vikram/0-0-1z5170366",
                "type": "flatrate",
                "quality": "1080p HD"
            }
        ]
    },
    {
        "id": 940551,
        "title": "Jailer",
        "original_title": "Jailer",
        "overview": "Muthuvel Pandian, a retired strict jailer, goes on a merciless manhunt to track down the syndicate responsible for his police officer son's disappearance.",
        "poster_path": "https://image.tmdb.org/t/p/w500/pTmMxAHqX4vsIDE6HPPxOR0Q6TN.jpg",
        "backdrop_path": "https://image.tmdb.org/t/p/original/e2duwRzB3tY8F4z94b2E3Kq6y1P.jpg",
        "release_date": "2023-08-10",
        "release_year": 2023,
        "original_language": "ta",
        "genres": ["Action", "Comedy", "Crime"],
        "vote_average": 7.2,
        "vote_count": 390,
        "popularity": 85.2,
        "runtime_minutes": 168,
        "director": "Nelson Dilipkumar",
        "cast": ["Rajinikanth", "Vinayakan", "Ramya Krishnan", "Mohanlal", "Shiva Rajkumar"],
        "trailer_url": "https://www.youtube.com/watch?v=xenOE1Tma0A",
        "is_licensed_stream": False,
        "providers": [
            {
                "provider_id": 9,
                "provider_name": "Amazon Prime Video",
                "logo_path": "https://m.media-amazon.com/images/G/01/digital/video/web/logo-min-remake.png",
                "watch_url": "https://www.primevideo.com/detail/Jailer/0SZW5F2G3W5F7D3T4M6B9K",
                "type": "flatrate",
                "quality": "4K UHD"
            }
        ]
    },
    {
        "id": 1118224,
        "title": "Maharaja",
        "original_title": "Maharaja",
        "overview": "A quiet barber files an unusual police complaint demanding the retrieval of his missing dustbin 'Lakshmi', disguising a much deeper, chilling vendetta against ruthless criminals.",
        "poster_path": "https://image.tmdb.org/t/p/w500/s0m4TM1XRAftQStgKpw024RvkJo.jpg",
        "backdrop_path": "https://image.tmdb.org/t/p/original/ot1UteJ1TL3xWuhkLRNzBULw4KJ.jpg",
        "release_date": "2024-06-14",
        "release_year": 2024,
        "original_language": "ta",
        "genres": ["Action", "Thriller", "Drama"],
        "vote_average": 8.4,
        "vote_count": 510,
        "popularity": 95.8,
        "runtime_minutes": 141,
        "director": "Nithilan Saminathan",
        "cast": ["Vijay Sethupathi", "Anurag Kashyap", "Mamta Mohandas", "Natty Subramaniam"],
        "trailer_url": "https://www.youtube.com/watch?v=1F3X04J54vU",
        "is_licensed_stream": False,
        "providers": [
            {
                "provider_id": 8,
                "provider_name": "Netflix",
                "logo_path": "https://assets.nflxext.com/ffe/siteui/common/icons/monogram_n.svg",
                "watch_url": "https://www.netflix.com/title/81775743",
                "type": "flatrate",
                "quality": "4K UHD"
            }
        ]
    },
    {
        "id": 660046,
        "title": "Ponniyin Selvan: Part I",
        "original_title": "Ponniyin Selvan: I",
        "overview": "Vandiyathevan sets out to cross the Chola land to deliver a secret message from Crown Prince Aditha Karikalan, unraveling political conspiracy, love, and treason.",
        "poster_path": "https://image.tmdb.org/t/p/w500/nrVpYaBw0kqm2ySiwbxo33LnRkr.jpg",
        "backdrop_path": "https://image.tmdb.org/t/p/original/t5zCBSB5xMDKcDqe91qahCOUYVV.jpg",
        "release_date": "2022-09-30",
        "release_year": 2022,
        "original_language": "ta",
        "genres": ["Action", "Adventure", "Drama"],
        "vote_average": 7.7,
        "vote_count": 310,
        "popularity": 79.0,
        "runtime_minutes": 167,
        "director": "Mani Ratnam",
        "cast": ["Vikram", "Aishwarya Rai Bachchan", "Jayam Ravi", "Karthi", "Trisha"],
        "trailer_url": "https://www.youtube.com/watch?v=D4qAQYlgZVM",
        "is_licensed_stream": False,
        "providers": [
            {
                "provider_id": 9,
                "provider_name": "Amazon Prime Video",
                "logo_path": "https://m.media-amazon.com/images/G/01/digital/video/web/logo-min-remake.png",
                "watch_url": "https://www.primevideo.com/detail/Ponniyin-Selvan-Part-1/0G128H7654321",
                "type": "flatrate",
                "quality": "4K UHD"
            }
        ]
    },
    {
        "id": 585244,
        "title": "Master",
        "original_title": "Master",
        "overview": "An alcoholic professor is sent to a juvenile school, where he clashes with a ruthless gangster who uses the children as pawns for his criminal empire.",
        "poster_path": "https://image.tmdb.org/t/p/w500/wit1VRI9sAbCstuwm3KPgxfYYqo.jpg",
        "backdrop_path": "https://image.tmdb.org/t/p/original/70Xqamtn1gQe7eSviXJ03uEec9J.jpg",
        "release_date": "2021-01-13",
        "release_year": 2021,
        "original_language": "ta",
        "genres": ["Action", "Crime", "Thriller"],
        "vote_average": 7.4,
        "vote_count": 290,
        "popularity": 86.4,
        "runtime_minutes": 179,
        "director": "Lokesh Kanagaraj",
        "cast": ["Thalapathy Vijay", "Vijay Sethupathi", "Malavika Mohanan", "Arjun Das"],
        "trailer_url": "https://www.youtube.com/watch?v=1_iU7rJiZ_g",
        "is_licensed_stream": False,
        "providers": [
            {
                "provider_id": 9,
                "provider_name": "Amazon Prime Video",
                "logo_path": "https://m.media-amazon.com/images/G/01/digital/video/web/logo-min-remake.png",
                "watch_url": "https://www.primevideo.com/detail/Master/0SZW5F2G3",
                "type": "flatrate",
                "quality": "4K UHD"
            }
        ]
    },
    {
        "id": 634492,
        "title": "Kaithi",
        "original_title": "Kaithi",
        "overview": "Dilli, an ex-convict, endeavors to meet his daughter for the first time after leaving prison. However, his attempts are interrupted by a drug raid led by inspector Bejoy.",
        "poster_path": "https://image.tmdb.org/t/p/w500/g4oKq6v1wAkwX9y9lUa25V66yA0.jpg",
        "backdrop_path": "https://image.tmdb.org/t/p/original/e2duwRzB3tY8F4z94b2E3Kq6y1P.jpg",
        "release_date": "2019-10-25",
        "release_year": 2019,
        "original_language": "ta",
        "genres": ["Action", "Thriller", "Crime"],
        "vote_average": 8.0,
        "vote_count": 310,
        "popularity": 84.0,
        "runtime_minutes": 145,
        "director": "Lokesh Kanagaraj",
        "cast": ["Karthi", "Narain", "Arjun Das", "George Maryan"],
        "trailer_url": "https://www.youtube.com/watch?v=g79Awe0F8hg",
        "is_licensed_stream": False,
        "providers": [
            {
                "provider_id": 122,
                "provider_name": "JioHotstar",
                "logo_path": "https://img10.hotstar.com/image/upload/f_auto,q_90,w_384/v1656431456/web-images/logo-d-plus.svg",
                "watch_url": "https://www.hotstar.com/in/movies/kaithi/1260014022",
                "type": "flatrate",
                "quality": "1080p HD"
            },
            {
                "provider_id": 4,
                "provider_name": "Sony LIV",
                "logo_path": "https://www.sonyliv.com/assets/liv-logo.png",
                "watch_url": "https://www.sonyliv.com",
                "type": "flatrate",
                "quality": "HD"
            }
        ]
    },
    {
        "id": 872585,
        "title": "Oppenheimer",
        "original_title": "Oppenheimer",
        "overview": "The story of J. Robert Oppenheimer's role in the development of the atomic bomb during World War II and the subsequent political fallout.",
        "poster_path": "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
        "backdrop_path": "https://image.tmdb.org/t/p/original/fm6K9vYqq0nG9SOo9psh697w09.jpg",
        "release_date": "2023-07-21",
        "release_year": 2023,
        "original_language": "en",
        "genres": ["Drama", "History"],
        "vote_average": 8.1,
        "vote_count": 13400,
        "popularity": 99.4,
        "runtime_minutes": 180,
        "director": "Christopher Nolan",
        "cast": ["Cillian Murphy", "Emily Blunt", "Matt Damon", "Robert Downey Jr."],
        "trailer_url": "https://www.youtube.com/watch?v=uYPbbksJxIg",
        "is_licensed_stream": False,
        "providers": [
            {
                "provider_id": 122,
                "provider_name": "JioHotstar",
                "logo_path": "https://img10.hotstar.com/image/upload/f_auto,q_90,w_384/v1656431456/web-images/logo-d-plus.svg",
                "watch_url": "https://www.hotstar.com/in/movies/oppenheimer/1260172355",
                "type": "flatrate",
                "quality": "4K Dolby Atmos"
            },
            {
                "provider_id": 9,
                "provider_name": "Amazon Prime Video",
                "logo_path": "https://m.media-amazon.com/images/G/01/digital/video/web/logo-min-remake.png",
                "watch_url": "https://www.primevideo.com/detail/Oppenheimer/0TZ9Q5W03",
                "type": "rent",
                "quality": "4K UHD"
            }
        ]
    },
    {
        "id": 157336,
        "title": "Interstellar",
        "original_title": "Interstellar",
        "overview": "The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel and conquer the vast distances involved in an interstellar voyage.",
        "poster_path": "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
        "backdrop_path": "https://image.tmdb.org/t/p/original/xJHokMbljvjADYdit5fK5VQsXEG.jpg",
        "release_date": "2014-11-05",
        "release_year": 2014,
        "original_language": "en",
        "genres": ["Adventure", "Drama", "Sci-Fi"],
        "vote_average": 8.4,
        "vote_count": 35200,
        "popularity": 94.1,
        "runtime_minutes": 169,
        "director": "Christopher Nolan",
        "cast": ["Matthew McConaughey", "Anne Hathaway", "Jessica Chastain", "Michael Caine"],
        "trailer_url": "https://www.youtube.com/watch?v=zSWdZVtXT7E",
        "is_licensed_stream": False,
        "providers": [
            {
                "provider_id": 9,
                "provider_name": "Amazon Prime Video",
                "logo_path": "https://m.media-amazon.com/images/G/01/digital/video/web/logo-min-remake.png",
                "watch_url": "https://www.primevideo.com/detail/Interstellar/0I905YF9",
                "type": "flatrate",
                "quality": "4K UHD"
            },
            {
                "provider_id": 122,
                "provider_name": "JioHotstar",
                "logo_path": "https://img10.hotstar.com/image/upload/f_auto,q_90,w_384/v1656431456/web-images/logo-d-plus.svg",
                "watch_url": "https://www.hotstar.com/in/movies/interstellar/1260013540",
                "type": "flatrate",
                "quality": "1080p HD"
            }
        ]
    },
    {
        "id": 1163258,
        "title": "12th Fail",
        "original_title": "12th Fail",
        "overview": "Based on the true story of Manoj Kumar Sharma, who overcomes extreme poverty to crack the IPS exam, proving honesty and perseverance conquer all odds.",
        "poster_path": "https://image.tmdb.org/t/p/w500/eebUPRI4Z5e1Z7Hev4JZAwMIFkX.jpg",
        "backdrop_path": "https://image.tmdb.org/t/p/original/v5e4T1Q7u3p9a7K6a8m2.jpg",
        "release_date": "2023-10-27",
        "release_year": 2023,
        "original_language": "hi",
        "genres": ["Drama", "Biography"],
        "vote_average": 8.5,
        "vote_count": 780,
        "popularity": 87.5,
        "runtime_minutes": 147,
        "director": "Vidhu Vinod Chopra",
        "cast": ["Vikrant Massey", "Medha Shankr", "Anant Joshi", "Anshumaan Pushkar"],
        "trailer_url": "https://www.youtube.com/watch?v=we33P9b4zH8",
        "is_licensed_stream": False,
        "providers": [
            {
                "provider_id": 122,
                "provider_name": "JioHotstar",
                "logo_path": "https://img10.hotstar.com/image/upload/f_auto,q_90,w_384/v1656431456/web-images/logo-d-plus.svg",
                "watch_url": "https://www.hotstar.com/in/movies/12th-fail/1260163351",
                "type": "flatrate",
                "quality": "4K UHD"
            }
        ]
    },
    {
        "id": 781732,
        "title": "Animal",
        "original_title": "Animal",
        "overview": "A son undergoes a remarkable transformation as the bond with his father begins to fracture, leading him down a dangerous path of unchecked vengeance.",
        "poster_path": "https://image.tmdb.org/t/p/w500/lprsAHkwMxk2iC6VZxNmV0H7g1t.jpg",
        "backdrop_path": "https://image.tmdb.org/t/p/original/3m4G9X0F4v93vE6K9G1v2W8K0L.jpg",
        "release_date": "2023-12-01",
        "release_year": 2023,
        "original_language": "hi",
        "genres": ["Action", "Crime", "Drama"],
        "vote_average": 7.0,
        "vote_count": 410,
        "popularity": 93.2,
        "runtime_minutes": 201,
        "director": "Sandeep Reddy Vanga",
        "cast": ["Ranbir Kapoor", "Anil Kapoor", "Bobby Deol", "Rashmika Mandanna"],
        "trailer_url": "https://www.youtube.com/watch?v=YD7b4gUatR4",
        "is_licensed_stream": False,
        "providers": [
            {
                "provider_id": 8,
                "provider_name": "Netflix",
                "logo_path": "https://assets.nflxext.com/ffe/siteui/common/icons/monogram_n.svg",
                "watch_url": "https://www.netflix.com/title/81436990",
                "type": "flatrate",
                "quality": "4K UHD"
            }
        ]
    },
    {
        "id": 999001,
        "title": "The Last Horizon (STREAMVERSE Original)",
        "original_title": "The Last Horizon - Indie Sci-Fi Short",
        "overview": "A solo astronaut on a deep-space satellite station detects an unearthly musical broadcast emanating from the edge of the Kuiper belt. Our exclusive licensed indie sci-fi premiere.",
        "poster_path": "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&q=80",
        "backdrop_path": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1600&q=80",
        "release_date": "2025-01-15",
        "release_year": 2025,
        "original_language": "en",
        "genres": ["Sci-Fi", "Drama", "Mystery"],
        "vote_average": 8.8,
        "vote_count": 140,
        "popularity": 91.0,
        "runtime_minutes": 24,
        "director": "K. R. Vasanth",
        "cast": ["Elena Ross", "Arun Kumar"],
        "trailer_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        "is_licensed_stream": True,
        "stream_url": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        "providers": [
            {
                "provider_id": 999,
                "provider_name": "STREAMVERSE Own Streaming",
                "logo_path": "/favicon.ico",
                "watch_url": "internal://stream/999001",
                "type": "free",
                "quality": "4K HDR"
            }
        ]
    }
]

class TMDBService:
    def __init__(self):
        self.api_key = settings.TMDB_API_KEY
        self.base_url = settings.TMDB_BASE_URL
        self._client = None

    @property
    def client(self) -> httpx.AsyncClient:
        if self._client is None or self._client.is_closed:
            self._client = httpx.AsyncClient(timeout=10.0)
        return self._client

    async def get_trending(self, time_window: str = "week") -> List[Dict[str, Any]]:
        if not self.api_key:
            return MOCK_MOVIES

        try:
            url = f"{self.base_url}/trending/movie/{time_window}?api_key={self.api_key}"
            res = await self.client.get(url)
            if res.status_code == 200:
                data = res.json()
                results = []
                for item in data.get("results", []):
                    results.append(self._format_tmdb_movie(item))
                return results or MOCK_MOVIES
        except Exception:
            pass
        return MOCK_MOVIES

    async def search_movies(self, query: str, page: int = 1) -> List[Dict[str, Any]]:
        if not self.api_key:
            query_lower = query.lower()
            return [m for m in MOCK_MOVIES if query_lower in m["title"].lower() or query_lower in m["overview"].lower()]

        try:
            url = f"{self.base_url}/search/movie?api_key={self.api_key}&query={query}&page={page}"
            res = await self.client.get(url)
            if res.status_code == 200:
                data = res.json()
                return [self._format_tmdb_movie(item) for item in data.get("results", [])]
        except Exception:
            pass
        return [m for m in MOCK_MOVIES if query.lower() in m["title"].lower()]

    async def get_movie_details(self, tmdb_id: int) -> Optional[Dict[str, Any]]:
        for m in MOCK_MOVIES:
            if m["id"] == tmdb_id:
                return m

        if not self.api_key:
            return None

        try:
            url = f"{self.base_url}/movie/{tmdb_id}?api_key={self.api_key}&append_to_response=credits,videos,watch/providers"
            res = await self.client.get(url)
            if res.status_code == 200:
                data = res.json()
                formatted = self._format_tmdb_movie(data)
                watch_data = data.get("watch/providers", {}).get("results", {}).get("IN", {})
                providers = []
                if "flatrate" in watch_data:
                    for p in watch_data["flatrate"]:
                        providers.append(WatchProvider(
                            provider_id=p["provider_id"],
                            provider_name=p["provider_name"],
                            logo_path=f"https://image.tmdb.org/t/p/w92{p['logo_path']}",
                            watch_url=watch_data.get("link"),
                            type="flatrate"
                        ).model_dump())
                formatted["providers"] = providers
                return formatted
        except Exception:
            pass
        return None

    def _format_tmdb_movie(self, item: Dict[str, Any]) -> Dict[str, Any]:
        poster = f"https://image.tmdb.org/t/p/w500{item.get('poster_path')}" if item.get('poster_path') else None
        backdrop = f"https://image.tmdb.org/t/p/original{item.get('backdrop_path')}" if item.get('backdrop_path') else None
        year = int(item.get("release_date", "0000").split("-")[0]) if item.get("release_date") else None
        
        return {
            "id": item.get("id"),
            "title": item.get("title") or item.get("name"),
            "original_title": item.get("original_title"),
            "overview": item.get("overview", ""),
            "poster_path": poster,
            "backdrop_path": backdrop,
            "release_date": item.get("release_date"),
            "release_year": year,
            "original_language": item.get("original_language", "en"),
            "genres": [g.get("name") if isinstance(g, dict) else str(g) for g in item.get("genres", [])],
            "vote_average": round(float(item.get("vote_average", 0.0)), 1),
            "vote_count": item.get("vote_count", 0),
            "popularity": float(item.get("popularity", 0.0)),
            "is_licensed_stream": False,
            "providers": []
        }

tmdb_service = TMDBService()
