import numpy as np
import pandas as pd
from typing import List, Dict, Any, Optional
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from app.services.tmdb_service import MOCK_MOVIES

class AIRecommendationEngine:
    def __init__(self):
        self.movies_df = None
        self.tfidf_matrix = None
        self.vectorizer = TfidfVectorizer(stop_words='english', max_features=5000)
        self._build_model()

    def _build_model(self):
        """Preprocesses movie metadata and builds the TF-IDF feature space."""
        df = pd.DataFrame(MOCK_MOVIES)
        
        # Create a rich metadata 'soup' combining title, genres, cast, director, overview, and language
        def create_soup(row):
            genres_str = " ".join(row.get("genres", [])) * 2 # Weight genres twice
            cast_str = " ".join(row.get("cast", []))
            director = row.get("director", "")
            overview = row.get("overview", "")
            lang = row.get("original_language", "")
            return f"{row['title']} {genres_str} {cast_str} {director} {lang} {overview}"

        df["soup"] = df.apply(create_soup, axis=1)
        self.movies_df = df
        self.tfidf_matrix = self.vectorizer.fit_transform(df["soup"])

    def get_content_based_recommendations(self, movie_id: int, top_n: int = 5) -> List[Dict[str, Any]]:
        """
        Finds movies most similar to the given movie_id using Cosine Similarity over TF-IDF vectors.
        """
        if self.movies_df is None or movie_id not in self.movies_df["id"].values:
            return MOCK_MOVIES[:top_n]

        idx = self.movies_df.index[self.movies_df["id"] == movie_id][0]
        
        # Compute cosine similarity between target movie vector and all movie vectors
        sim_scores = cosine_similarity(self.tfidf_matrix[idx], self.tfidf_matrix).flatten()
        
        # Sort descending, excluding the movie itself
        ranked_indices = sim_scores.argsort()[::-1]
        ranked_indices = [i for i in ranked_indices if i != idx][:top_n]
        
        recommendations = []
        for i in ranked_indices:
            movie_dict = self.movies_df.iloc[i].to_dict()
            movie_dict["similarity_score"] = round(float(sim_scores[i]), 3)
            movie_dict["recommendation_reason"] = f"Similar genre & cast synergy ({int(sim_scores[i]*100)}% match)"
            recommendations.append(movie_dict)
            
        return recommendations

    def get_personalized_recommendations(
        self,
        preferred_languages: List[str] = ["ta", "en"],
        preferred_genres: List[str] = ["Action", "Thriller"],
        top_n: int = 6
    ) -> List[Dict[str, Any]]:
        """
        Hybrid Taste Recommendation:
        Scores movies according to user's selected languages, genres, and overall popularity/rating.
        """
        scored_movies = []
        for _, movie in self.movies_df.iterrows():
            score = 0.0
            
            # Language match (+35 points)
            if movie["original_language"] in preferred_languages:
                score += 35.0
                
            # Genre match (+25 points per matching genre)
            matching_genres = set(movie["genres"]).intersection(set(preferred_genres))
            score += len(matching_genres) * 25.0
            
            # Rating boost (+1 to 10 points)
            score += float(movie.get("vote_average", 7.0))
            
            movie_dict = movie.to_dict()
            movie_dict["ai_match_percentage"] = min(int(score), 99)
            movie_dict["recommendation_reason"] = f"Matches your affinity for {', '.join(matching_genres) if matching_genres else 'trending cinema'}"
            scored_movies.append((score, movie_dict))

        # Sort by total calculated score
        scored_movies.sort(key=lambda x: x[0], reverse=True)
        return [m[1] for m in scored_movies[:top_n]]

    def get_mood_recommendations(self, mood: str, top_n: int = 5) -> List[Dict[str, Any]]:
        """
        AI Mood Engine: Translates emotional mood / vibe into latent semantic vector space.
        """
        mood_mapping = {
            "high-octane": "adrenaline action gang chase revenge guns fight explosion",
            "mind-bending": "mystery thriller plot twist psychological investigation suspense dark puzzle",
            "inspirational": "biography true story perseverance struggle honest motivation triumph study",
            "sci-fi": "space astronaut interstellar cosmos wormhole satellite alien universe technology",
            "tamil-mass": "tamil superstar heroism action whistle dialogue mass blockbuster"
        }

        query_text = mood_mapping.get(mood.lower(), mood)
        query_vec = self.vectorizer.transform([query_text])

        # Compute cosine similarity between mood vector and movies
        sim_scores = cosine_similarity(query_vec, self.tfidf_matrix).flatten()
        ranked_indices = sim_scores.argsort()[::-1][:top_n]

        results = []
        for i in ranked_indices:
            m = self.movies_df.iloc[i].to_dict()
            m["mood_score"] = int(sim_scores[i] * 100)
            m["recommendation_reason"] = f"Curated for '{mood.replace('-', ' ').title()}' mood"
            results.append(m)
        return results

ai_engine = AIRecommendationEngine()

