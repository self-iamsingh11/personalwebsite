"""
Movie Recommendation Engine - FastAPI Backend
Production-grade recommendation system with multiple algorithms
"""

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict
import random
from datetime import datetime
from enum import Enum

# ============== FastAPI App Setup ==============

app = FastAPI(
    title="Movie Recommendation Engine API",
    version="1.0.0",
    description="Production-grade movie recommendation system with multiple algorithms"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============== Data Models ==============

class Genre(str, Enum):
    ACTION = "Action"
    COMEDY = "Comedy"
    DRAMA = "Drama"
    THRILLER = "Thriller"
    ROMANCE = "Romance"
    SCIFI = "Sci-Fi"
    HORROR = "Horror"
    ADVENTURE = "Adventure"
    ANIMATION = "Animation"
    DOCUMENTARY = "Documentary"

class Mood(str, Enum):
    HAPPY = "happy"
    CHILL = "chill"
    ADVENTUROUS = "adventurous"
    ROMANTIC = "romantic"
    THRILLING = "thrilling"

class Movie(BaseModel):
    id: int
    title: str
    year: int
    genres: List[str]
    rating: float
    poster_url: str
    description: str
    director: str
    cast: List[str]
    runtime: int  # minutes
    popularity: float  # 0-100
    release_date: str

class MovieRecommendation(BaseModel):
    movie: Movie
    score: float
    explanation: str
    algorithm: str
    diversity_tag: str  # "similar", "diverse", "trending", "new"

class FeedbackRequest(BaseModel):
    user_id: int
    movie_id: int
    feedback_type: str  # "like", "dislike", "watch", "skip"
    rating: Optional[float] = None
    watch_time: Optional[int] = None

class UserProfile(BaseModel):
    user_id: int
    preferred_genres: List[str]
    watch_history: List[int]
    ratings: Dict[int, float]

# ============== Sample Movie Database ==============

MOVIES_DB: List[Movie] = [
    # Action Movies
    Movie(id=1, title="The Dark Knight", year=2008, genres=["Action", "Drama", "Thriller"],
          rating=9.0, poster_url="https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
          description="When the menace known as The Joker wreaks havoc on Gotham, Batman must face one of the greatest tests.",
          director="Christopher Nolan", cast=["Christian Bale", "Heath Ledger", "Aaron Eckhart"],
          runtime=152, popularity=95.0, release_date="2008-07-18"),
    
    Movie(id=2, title="Inception", year=2010, genres=["Action", "Sci-Fi", "Thriller"],
          rating=8.8, poster_url="https://image.tmdb.org/t/p/w500/edv5CZvWj09upOsy2Y6IwDhK8bt.jpg",
          description="A thief who steals corporate secrets through dream-sharing technology is given a task to plant an idea.",
          director="Christopher Nolan", cast=["Leonardo DiCaprio", "Joseph Gordon-Levitt", "Ellen Page"],
          runtime=148, popularity=92.0, release_date="2010-07-16"),
    
    Movie(id=3, title="Mad Max: Fury Road", year=2015, genres=["Action", "Adventure", "Sci-Fi"],
          rating=8.1, poster_url="https://image.tmdb.org/t/p/w500/8tZYtuWezp8JbcsvHYO0O46tFbo.jpg",
          description="In a post-apocalyptic wasteland, Max allies with Furiosa to flee a cult leader pursuing them.",
          director="George Miller", cast=["Tom Hardy", "Charlize Theron", "Nicholas Hoult"],
          runtime=120, popularity=88.0, release_date="2015-05-15"),
    
    Movie(id=4, title="John Wick", year=2014, genres=["Action", "Thriller"],
          rating=7.4, poster_url="https://image.tmdb.org/t/p/w500/fZPSd91yGE9fCcCe6OoQr6E3Bev.jpg",
          description="An ex-hitman comes out of retirement to track down the gangsters who killed his dog.",
          director="Chad Stahelski", cast=["Keanu Reeves", "Michael Nyqvist", "Alfie Allen"],
          runtime=101, popularity=85.0, release_date="2014-10-24"),
    
    # Sci-Fi Movies
    Movie(id=5, title="Interstellar", year=2014, genres=["Sci-Fi", "Drama", "Adventure"],
          rating=8.6, poster_url="https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
          description="A team of explorers travel through a wormhole in search of a new home for humanity.",
          director="Christopher Nolan", cast=["Matthew McConaughey", "Anne Hathaway", "Jessica Chastain"],
          runtime=169, popularity=91.0, release_date="2014-11-07"),
    
    Movie(id=6, title="Blade Runner 2049", year=2017, genres=["Sci-Fi", "Drama", "Thriller"],
          rating=8.0, poster_url="https://image.tmdb.org/t/p/w500/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg",
          description="Young Blade Runner K's discovery of a long-buried secret leads him to track down former Rick Deckard.",
          director="Denis Villeneuve", cast=["Ryan Gosling", "Harrison Ford", "Ana de Armas"],
          runtime=164, popularity=82.0, release_date="2017-10-06"),
    
    Movie(id=7, title="The Matrix", year=1999, genres=["Sci-Fi", "Action"],
          rating=8.7, poster_url="https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
          description="A hacker discovers reality is a simulation created by machines to control humanity.",
          director="Lana Wachowski", cast=["Keanu Reeves", "Laurence Fishburne", "Carrie-Anne Moss"],
          runtime=136, popularity=94.0, release_date="1999-03-31"),
    
    Movie(id=8, title="Arrival", year=2016, genres=["Sci-Fi", "Drama"],
          rating=7.9, poster_url="https://image.tmdb.org/t/p/w500/x2FJsf1ElAgr63Y3PNPtJrcmpoe.jpg",
          description="A linguist works to decipher the language of aliens who have arrived on Earth.",
          director="Denis Villeneuve", cast=["Amy Adams", "Jeremy Renner", "Forest Whitaker"],
          runtime=116, popularity=78.0, release_date="2016-11-11"),
    
    # Comedy Movies
    Movie(id=9, title="The Grand Budapest Hotel", year=2014, genres=["Comedy", "Drama", "Adventure"],
          rating=8.1, poster_url="https://image.tmdb.org/t/p/w500/eWdyYQreja6JGCzqHWXpWHDrrPo.jpg",
          description="A concierge and lobby boy become entangled in theft and murder at a famous hotel.",
          director="Wes Anderson", cast=["Ralph Fiennes", "Tony Revolori", "Saoirse Ronan"],
          runtime=99, popularity=80.0, release_date="2014-03-28"),
    
    Movie(id=10, title="Superbad", year=2007, genres=["Comedy"],
          rating=7.6, poster_url="https://image.tmdb.org/t/p/w500/ek8e8txUyUwd2BNqj6lFEerJfbq.jpg",
          description="Two co-dependent high school seniors try to get alcohol for a party before graduation.",
          director="Greg Mottola", cast=["Jonah Hill", "Michael Cera", "Christopher Mintz-Plasse"],
          runtime=113, popularity=75.0, release_date="2007-08-17"),
    
    Movie(id=11, title="The Hangover", year=2009, genres=["Comedy"],
          rating=7.7, poster_url="https://image.tmdb.org/t/p/w500/uluhlXubGu1VxU63X9VHCLWDAYP.jpg",
          description="Three friends wake up after a bachelor party with no memory and must find the missing groom.",
          director="Todd Phillips", cast=["Bradley Cooper", "Ed Helms", "Zach Galifianakis"],
          runtime=100, popularity=86.0, release_date="2009-06-05"),
    
    # Romance Movies
    Movie(id=12, title="La La Land", year=2016, genres=["Romance", "Drama", "Comedy"],
          rating=8.0, poster_url="https://image.tmdb.org/t/p/w500/uDO8zWDhfWbFzNqOc3I4JbcXYy3.jpg",
          description="Jazz pianist and aspiring actress fall in love while pursuing their dreams in Los Angeles.",
          director="Damien Chazelle", cast=["Ryan Gosling", "Emma Stone", "John Legend"],
          runtime=128, popularity=89.0, release_date="2016-12-09"),
    
    Movie(id=13, title="The Notebook", year=2004, genres=["Romance", "Drama"],
          rating=7.8, poster_url="https://image.tmdb.org/t/p/w500/rNzQyW4f8B8cQeg7Dgj3n6eT5k9.jpg",
          description="A poor young man falls in love with a rich young woman, but her family disapproves.",
          director="Nick Cassavetes", cast=["Ryan Gosling", "Rachel McAdams", "James Garner"],
          runtime=123, popularity=82.0, release_date="2004-06-25"),
    
    Movie(id=14, title="Before Sunrise", year=1995, genres=["Romance", "Drama"],
          rating=8.1, poster_url="https://image.tmdb.org/t/p/w500/4wvzFYvn7yjsAsWukk2DOXN4M6I.jpg",
          description="A young man and woman meet on a train and spend one romantic night in Vienna.",
          director="Richard Linklater", cast=["Ethan Hawke", "Julie Delpy"],
          runtime=101, popularity=76.0, release_date="1995-01-27"),
    
    # Thriller Movies
    Movie(id=15, title="Gone Girl", year=2014, genres=["Thriller", "Drama"],
          rating=8.1, poster_url="https://image.tmdb.org/t/p/w500/lv5xShBIDPe7m4ufdTLhAXJCmSh.jpg",
          description="A man becomes the prime suspect when his wife goes missing on their anniversary.",
          director="David Fincher", cast=["Ben Affleck", "Rosamund Pike", "Neil Patrick Harris"],
          runtime=149, popularity=84.0, release_date="2014-10-03"),
    
    Movie(id=16, title="Se7en", year=1995, genres=["Thriller", "Drama"],
          rating=8.6, poster_url="https://image.tmdb.org/t/p/w500/6yoghtyTpznpBik8EngEmJskVUO.jpg",
          description="Two detectives hunt a serial killer who uses the seven deadly sins as motifs.",
          director="David Fincher", cast=["Brad Pitt", "Morgan Freeman", "Kevin Spacey"],
          runtime=127, popularity=90.0, release_date="1995-09-22"),
    
    Movie(id=17, title="Shutter Island", year=2010, genres=["Thriller", "Drama"],
          rating=8.2, poster_url="https://image.tmdb.org/t/p/w500/kve20tXwUZpu4GUX8l6X7Z4jmL6.jpg",
          description="A U.S. Marshal investigates a patient's disappearance from a hospital for the criminally insane.",
          director="Martin Scorsese", cast=["Leonardo DiCaprio", "Mark Ruffalo", "Ben Kingsley"],
          runtime=138, popularity=87.0, release_date="2010-02-19"),
    
    # Horror Movies
    Movie(id=18, title="Get Out", year=2017, genres=["Horror", "Thriller"],
          rating=7.7, poster_url="https://image.tmdb.org/t/p/w500/tFXcEccSQMf3zy7uCiqVuKrRaKH.jpg",
          description="A young Black man visits his white girlfriend's family estate with terrifying consequences.",
          director="Jordan Peele", cast=["Daniel Kaluuya", "Allison Williams", "Bradley Whitford"],
          runtime=104, popularity=83.0, release_date="2017-02-24"),
    
    Movie(id=19, title="The Conjuring", year=2013, genres=["Horror", "Thriller"],
          rating=7.5, poster_url="https://image.tmdb.org/t/p/w500/wVYREutTvI2tmxr6ujrHT704wGF.jpg",
          description="Paranormal investigators help a family terrorized by a dark presence in their farmhouse.",
          director="James Wan", cast=["Vera Farmiga", "Patrick Wilson", "Lili Taylor"],
          runtime=112, popularity=79.0, release_date="2013-07-19"),
    
    Movie(id=20, title="Hereditary", year=2018, genres=["Horror", "Drama"],
          rating=7.3, poster_url="https://image.tmdb.org/t/p/w500/p9fmuz2Oj3EdFOzUmOQa4mWKQIy.jpg",
          description="A family is haunted by mysterious occurrences after the death of their grandmother.",
          director="Ari Aster", cast=["Toni Collette", "Milly Shapiro", "Gabriel Byrne"],
          runtime=127, popularity=77.0, release_date="2018-06-08"),
    
    # Drama Movies
    Movie(id=21, title="The Shawshank Redemption", year=1994, genres=["Drama"],
          rating=9.3, poster_url="https://image.tmdb.org/t/p/w500/q6y0Go1tsSsxKoNIAWFb86G51bT.jpg",
          description="Two imprisoned men bond over a number of years, finding solace and eventual redemption.",
          director="Frank Darabont", cast=["Tim Robbins", "Morgan Freeman", "Bob Gunton"],
          runtime=142, popularity=97.0, release_date="1994-09-23"),
    
    Movie(id=22, title="Parasite", year=2019, genres=["Drama", "Thriller", "Comedy"],
          rating=8.5, poster_url="https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",
          description="A poor family schemes to infiltrate a wealthy household with devastating consequences.",
          director="Bong Joon-ho", cast=["Song Kang-ho", "Lee Sun-kyun", "Cho Yeo-jeong"],
          runtime=132, popularity=93.0, release_date="2019-05-30"),
    
    Movie(id=23, title="Whiplash", year=2014, genres=["Drama"],
          rating=8.5, poster_url="https://image.tmdb.org/t/p/w500/oPxnRhyAIcWHC1yDJAKjJXcLzPA.jpg",
          description="A drummer enrolls at a music conservatory and is pushed to his limits by an instructor.",
          director="Damien Chazelle", cast=["Miles Teller", "J.K. Simmons", "Melissa Benoist"],
          runtime=106, popularity=86.0, release_date="2014-10-10"),
    
    Movie(id=24, title="Fight Club", year=1999, genres=["Drama", "Thriller"],
          rating=8.8, poster_url="https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
          description="An insomniac office worker and a soap salesman form an underground fight club.",
          director="David Fincher", cast=["Brad Pitt", "Edward Norton", "Helena Bonham Carter"],
          runtime=139, popularity=92.0, release_date="1999-10-15"),
    
    # Animation Movies
    Movie(id=25, title="Spider-Man: Into the Spider-Verse", year=2018, genres=["Animation", "Action", "Adventure"],
          rating=8.4, poster_url="https://image.tmdb.org/t/p/w500/iiZZdoQBEYBv6id8su7ImL0oCbD.jpg",
          description="Teen Miles Morales becomes Spider-Man and must team up with others across dimensions.",
          director="Bob Persichetti", cast=["Shameik Moore", "Jake Johnson", "Hailee Steinfeld"],
          runtime=117, popularity=91.0, release_date="2018-12-14"),
    
    Movie(id=26, title="Spirited Away", year=2001, genres=["Animation", "Adventure", "Drama"],
          rating=8.6, poster_url="https://image.tmdb.org/t/p/w500/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg",
          description="A young girl enters a world of spirits and must save her parents from a witch.",
          director="Hayao Miyazaki", cast=["Rumi Hiiragi", "Miyu Irino", "Mari Natsuki"],
          runtime=125, popularity=88.0, release_date="2001-07-20"),
    
    Movie(id=27, title="WALL-E", year=2008, genres=["Animation", "Adventure", "Sci-Fi"],
          rating=8.4, poster_url="https://image.tmdb.org/t/p/w500/hbhFnRzzg6ZDmm5YKGtCPHa3Pow.jpg",
          description="A robot cleaning Earth falls in love and follows his beloved across the galaxy.",
          director="Andrew Stanton", cast=["Ben Burtt", "Elissa Knight", "Jeff Garlin"],
          runtime=98, popularity=85.0, release_date="2008-06-27"),
    
    # Adventure Movies
    Movie(id=28, title="The Lord of the Rings: The Fellowship of the Ring", year=2001, 
          genres=["Adventure", "Drama", "Action"],
          rating=8.8, poster_url="https://image.tmdb.org/t/p/w500/6oom5QYQ2yQTMJIbnvbkBL9cHo6.jpg",
          description="A hobbit inherits a powerful ring and must destroy it to save Middle-earth.",
          director="Peter Jackson", cast=["Elijah Wood", "Ian McKellen", "Viggo Mortensen"],
          runtime=178, popularity=95.0, release_date="2001-12-19"),
    
    Movie(id=29, title="Indiana Jones and the Raiders of the Lost Ark", year=1981, 
          genres=["Adventure", "Action"],
          rating=8.4, poster_url="https://image.tmdb.org/t/p/w500/ceG9VzoRAVGwivFU403Wc3AHRys.jpg",
          description="Archaeologist Indiana Jones races to find the Ark of the Covenant before the Nazis.",
          director="Steven Spielberg", cast=["Harrison Ford", "Karen Allen", "Paul Freeman"],
          runtime=115, popularity=89.0, release_date="1981-06-12"),
    
    Movie(id=30, title="Jurassic Park", year=1993, genres=["Adventure", "Sci-Fi", "Thriller"],
          rating=8.1, poster_url="https://image.tmdb.org/t/p/w500/oU7Oq2kFAAlGqbU4VoAE36g4hoI.jpg",
          description="A theme park with cloned dinosaurs goes horribly wrong during a preview tour.",
          director="Steven Spielberg", cast=["Sam Neill", "Laura Dern", "Jeff Goldblum"],
          runtime=127, popularity=93.0, release_date="1993-06-11"),
    
    # More recent movies for "trending"
    Movie(id=31, title="Dune", year=2021, genres=["Sci-Fi", "Adventure", "Drama"],
          rating=8.0, poster_url="https://image.tmdb.org/t/p/w500/d5NXSklXo0qyIYkgV94XAgMIckC.jpg",
          description="Paul Atreides must travel to the most dangerous planet to ensure his family's future.",
          director="Denis Villeneuve", cast=["Timothée Chalamet", "Rebecca Ferguson", "Zendaya"],
          runtime=155, popularity=94.0, release_date="2021-10-22"),
    
    Movie(id=32, title="Everything Everywhere All at Once", year=2022, genres=["Action", "Comedy", "Sci-Fi"],
          rating=8.1, poster_url="https://image.tmdb.org/t/p/w500/w3LxiVYdWWRvJVjXhP7yoZxJw0T.jpg",
          description="A middle-aged Chinese immigrant must connect with parallel universe versions of herself.",
          director="Daniel Kwan", cast=["Michelle Yeoh", "Stephanie Hsu", "Ke Huy Quan"],
          runtime=139, popularity=96.0, release_date="2022-03-25"),
    
    Movie(id=33, title="Top Gun: Maverick", year=2022, genres=["Action", "Drama"],
          rating=8.3, poster_url="https://image.tmdb.org/t/p/w500/62HCnUTziyWcpDaBO2i1DX17ljH.jpg",
          description="Maverick trains a new generation of pilots for a dangerous mission.",
          director="Joseph Kosinski", cast=["Tom Cruise", "Miles Teller", "Jennifer Connelly"],
          runtime=130, popularity=95.0, release_date="2022-05-27"),
    
    Movie(id=34, title="The Batman", year=2022, genres=["Action", "Drama", "Thriller"],
          rating=7.8, poster_url="https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg",
          description="Batman ventures into Gotham's underworld when a sadistic killer leaves cryptic clues.",
          director="Matt Reeves", cast=["Robert Pattinson", "Zoë Kravitz", "Paul Dano"],
          runtime=176, popularity=92.0, release_date="2022-03-04"),
    
    Movie(id=35, title="Oppenheimer", year=2023, genres=["Drama", "Thriller"],
          rating=8.5, poster_url="https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
          description="The story of J. Robert Oppenheimer and the development of the atomic bomb.",
          director="Christopher Nolan", cast=["Cillian Murphy", "Emily Blunt", "Matt Damon"],
          runtime=180, popularity=98.0, release_date="2023-07-21"),
    
    Movie(id=36, title="Barbie", year=2023, genres=["Comedy", "Adventure"],
          rating=7.0, poster_url="https://image.tmdb.org/t/p/w500/iuFNMS8U5cb6xfzi51Dbkovj7vM.jpg",
          description="Barbie and Ken leave Barbie Land and discover the real world.",
          director="Greta Gerwig", cast=["Margot Robbie", "Ryan Gosling", "America Ferrera"],
          runtime=114, popularity=97.0, release_date="2023-07-21"),
]

# ============== User Profiles (Simulated) ==============

USER_PROFILES: Dict[int, UserProfile] = {
    1: UserProfile(user_id=1, preferred_genres=["Action", "Sci-Fi", "Thriller"],
                   watch_history=[1, 2, 5, 7], ratings={1: 9.0, 2: 8.5, 5: 9.0, 7: 8.0}),
    2: UserProfile(user_id=2, preferred_genres=["Romance", "Comedy", "Drama"],
                   watch_history=[12, 13, 9, 22], ratings={12: 9.0, 13: 8.0, 9: 8.5, 22: 9.0}),
    3: UserProfile(user_id=3, preferred_genres=["Horror", "Thriller"],
                   watch_history=[18, 19, 15, 16], ratings={18: 8.0, 19: 7.5, 15: 8.5, 16: 9.0}),
    4: UserProfile(user_id=4, preferred_genres=["Animation", "Adventure"],
                   watch_history=[25, 26, 27, 28], ratings={25: 9.0, 26: 9.5, 27: 8.5, 28: 9.0}),
}

# Mood to genre mapping
MOOD_GENRE_MAP = {
    "happy": ["Comedy", "Animation", "Adventure"],
    "chill": ["Drama", "Romance", "Documentary"],
    "adventurous": ["Action", "Adventure", "Sci-Fi"],
    "romantic": ["Romance", "Drama", "Comedy"],
    "thrilling": ["Thriller", "Horror", "Action"],
}

# ============== Recommendation Algorithms ==============

class RecommendationEngine:
    """Multi-algorithm recommendation engine with ensemble ranking"""
    
    @staticmethod
    def content_based_filter(
        user_genres: List[str], 
        exclude_ids: List[int] = None,
        limit: int = 20
    ) -> List[tuple]:
        """
        Content-Based Filtering: Recommend movies based on genre preferences
        """
        exclude_ids = exclude_ids or []
        scored_movies = []
        
        for movie in MOVIES_DB:
            if movie.id in exclude_ids:
                continue
            
            # Calculate genre overlap score
            genre_overlap = len(set(movie.genres) & set(user_genres))
            genre_score = genre_overlap / max(len(user_genres), 1)
            
            # Weight by movie rating
            quality_score = movie.rating / 10.0
            
            # Combined score
            final_score = (genre_score * 0.6) + (quality_score * 0.4)
            scored_movies.append((movie, final_score, "content_based"))
        
        # Sort by score
        scored_movies.sort(key=lambda x: x[1], reverse=True)
        return scored_movies[:limit]
    
    @staticmethod
    def collaborative_filter(
        user_id: int,
        exclude_ids: List[int] = None,
        limit: int = 20
    ) -> List[tuple]:
        """
        Collaborative Filtering: Recommend based on similar users' preferences
        """
        exclude_ids = exclude_ids or []
        user_profile = USER_PROFILES.get(user_id)
        
        if not user_profile:
            # Cold start: return popular movies
            return RecommendationEngine.popularity_based(exclude_ids, limit)
        
        # Find similar users (users with overlapping watch history)
        similar_user_movies = []
        for other_id, other_profile in USER_PROFILES.items():
            if other_id == user_id:
                continue
            
            overlap = set(user_profile.watch_history) & set(other_profile.watch_history)
            if len(overlap) >= 1:
                # Get movies this similar user liked that current user hasn't seen
                for movie_id in other_profile.watch_history:
                    if movie_id not in user_profile.watch_history and movie_id not in exclude_ids:
                        rating = other_profile.ratings.get(movie_id, 7.5)
                        if rating >= 7.5:
                            similar_user_movies.append((movie_id, rating))
        
        # Get movie objects and score
        scored_movies = []
        seen_ids = set()
        for movie_id, sim_rating in similar_user_movies:
            if movie_id in seen_ids:
                continue
            seen_ids.add(movie_id)
            
            movie = next((m for m in MOVIES_DB if m.id == movie_id), None)
            if movie:
                score = (sim_rating / 10.0) * 0.7 + (movie.rating / 10.0) * 0.3
                scored_movies.append((movie, score, "collaborative"))
        
        if len(scored_movies) < limit:
            # Supplement with content-based
            user_genres = user_profile.preferred_genres
            supplement = RecommendationEngine.content_based_filter(
                user_genres, 
                exclude_ids + list(seen_ids),
                limit - len(scored_movies)
            )
            scored_movies.extend(supplement)
        
        scored_movies.sort(key=lambda x: x[1], reverse=True)
        return scored_movies[:limit]
    
    @staticmethod
    def popularity_based(
        exclude_ids: List[int] = None,
        limit: int = 20
    ) -> List[tuple]:
        """
        Popularity-Based: Recommend trending/popular movies
        """
        exclude_ids = exclude_ids or []
        
        # Sort by popularity and recency
        popular_movies = []
        for movie in MOVIES_DB:
            if movie.id in exclude_ids:
                continue
            
            # Boost recent movies
            recency_boost = 1.0 if movie.year >= 2022 else (0.9 if movie.year >= 2020 else 0.8)
            score = (movie.popularity / 100.0) * recency_boost
            popular_movies.append((movie, score, "popularity"))
        
        popular_movies.sort(key=lambda x: x[1], reverse=True)
        return popular_movies[:limit]
    
    @staticmethod
    def mood_based_filter(
        mood: str,
        exclude_ids: List[int] = None,
        limit: int = 20
    ) -> List[tuple]:
        """
        Mood-Based Filtering: Recommend based on user's current mood
        """
        preferred_genres = MOOD_GENRE_MAP.get(mood, ["Drama", "Comedy"])
        return RecommendationEngine.content_based_filter(preferred_genres, exclude_ids, limit)
    
    @staticmethod
    def generate_explanation(movie: Movie, algorithm: str, user_profile: UserProfile = None) -> str:
        """Generate human-readable explanation for recommendation"""
        
        if algorithm == "collaborative":
            return "Users with similar taste enjoyed this"
        
        elif algorithm == "content_based":
            if user_profile:
                matching_genres = set(movie.genres) & set(user_profile.preferred_genres)
                if matching_genres:
                    return f"Because you like {', '.join(matching_genres)}"
            return f"Matches your taste in {movie.genres[0]}"
        
        elif algorithm == "popularity":
            if movie.year >= 2023:
                return "Trending now"
            elif movie.popularity >= 90:
                return "Top rated by viewers"
            return "Popular choice"
        
        elif algorithm == "mood":
            return "Perfect for your mood"
        
        return "Recommended for you"
    
    @staticmethod
    def get_diversity_tag(movie: Movie, algorithm: str) -> str:
        """Assign diversity tag to recommendation"""
        if movie.year >= 2023:
            return "new"
        elif algorithm == "popularity":
            return "trending"
        elif movie.popularity >= 85:
            return "similar"
        return "diverse"
    
    @staticmethod
    def ensemble_recommend(
        user_id: int = None,
        mood: str = None,
        genres: List[str] = None,
        exclude_ids: List[int] = None,
        limit: int = 20
    ) -> List[MovieRecommendation]:
        """
        Ensemble Ranking: Combine multiple algorithms with weighted scoring
        """
        exclude_ids = exclude_ids or []
        user_profile = USER_PROFILES.get(user_id) if user_id else None
        
        # Get candidates from all algorithms
        candidates = []
        
        # 1. Collaborative filtering (if user exists)
        if user_profile:
            cf_results = RecommendationEngine.collaborative_filter(user_id, exclude_ids, 15)
            for movie, score, algo in cf_results:
                candidates.append((movie, score * 1.2, algo))  # Boost CF results
        
        # 2. Content-based (using mood or explicit genres)
        if mood:
            mood_results = RecommendationEngine.mood_based_filter(mood, exclude_ids, 15)
            for movie, score, _ in mood_results:
                candidates.append((movie, score * 1.1, "mood"))
        elif genres:
            cb_results = RecommendationEngine.content_based_filter(genres, exclude_ids, 15)
            candidates.extend(cb_results)
        elif user_profile:
            cb_results = RecommendationEngine.content_based_filter(
                user_profile.preferred_genres, exclude_ids, 15
            )
            candidates.extend(cb_results)
        
        # 3. Popularity (always include some)
        pop_results = RecommendationEngine.popularity_based(exclude_ids, 10)
        for movie, score, algo in pop_results:
            candidates.append((movie, score * 0.9, algo))
        
        # Deduplicate and aggregate scores
        movie_scores: Dict[int, tuple] = {}
        for movie, score, algo in candidates:
            if movie.id in movie_scores:
                existing_score = movie_scores[movie.id][1]
                movie_scores[movie.id] = (movie, max(existing_score, score), algo)
            else:
                movie_scores[movie.id] = (movie, score, algo)
        
        # Sort by score and create recommendations
        sorted_movies = sorted(movie_scores.values(), key=lambda x: x[1], reverse=True)
        
        recommendations = []
        for movie, score, algorithm in sorted_movies[:limit]:
            rec = MovieRecommendation(
                movie=movie,
                score=min(score, 1.0),
                explanation=RecommendationEngine.generate_explanation(movie, algorithm, user_profile),
                algorithm=algorithm,
                diversity_tag=RecommendationEngine.get_diversity_tag(movie, algorithm)
            )
            recommendations.append(rec)
        
        # Inject diversity if too homogeneous
        if len(recommendations) >= 5:
            seen_genres = set()
            for rec in recommendations[:5]:
                seen_genres.update(rec.movie.genres)
            
            # If top 5 are too similar, swap in a diverse pick
            if len(seen_genres) <= 3:
                for rec in recommendations[5:]:
                    new_genres = set(rec.movie.genres) - seen_genres
                    if new_genres:
                        # Move this diverse movie up
                        recommendations.remove(rec)
                        recommendations.insert(4, rec)
                        break
        
        return recommendations

# ============== API Endpoints ==============

@app.get("/")
async def root():
    """API root endpoint"""
    return {
        "name": "Movie Recommendation Engine API",
        "version": "1.0.0",
        "endpoints": ["/movies", "/recommendations", "/search", "/trending", "/feedback"]
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

@app.get("/movies", response_model=List[Movie])
async def get_movies(
    genre: Optional[str] = Query(None, description="Filter by genre"),
    year_min: Optional[int] = Query(None, description="Minimum release year"),
    year_max: Optional[int] = Query(None, description="Maximum release year"),
    rating_min: Optional[float] = Query(None, description="Minimum rating"),
    limit: int = Query(50, ge=1, le=100, description="Number of results"),
    offset: int = Query(0, ge=0, description="Offset for pagination")
):
    """Get all movies with optional filters"""
    filtered = MOVIES_DB
    
    if genre:
        filtered = [m for m in filtered if genre in m.genres]
    if year_min:
        filtered = [m for m in filtered if m.year >= year_min]
    if year_max:
        filtered = [m for m in filtered if m.year <= year_max]
    if rating_min:
        filtered = [m for m in filtered if m.rating >= rating_min]
    
    return filtered[offset:offset + limit]

@app.get("/movies/{movie_id}", response_model=Movie)
async def get_movie(movie_id: int):
    """Get a specific movie by ID"""
    movie = next((m for m in MOVIES_DB if m.id == movie_id), None)
    if not movie:
        raise HTTPException(status_code=404, detail="Movie not found")
    return movie

@app.get("/recommendations", response_model=List[MovieRecommendation])
async def get_recommendations(
    user_id: Optional[int] = Query(None, description="User ID for personalization"),
    mood: Optional[str] = Query(None, description="User mood (happy, chill, adventurous, romantic, thrilling)"),
    genres: Optional[str] = Query(None, description="Comma-separated genre preferences"),
    limit: int = Query(20, ge=1, le=50, description="Number of recommendations")
):
    """Get personalized movie recommendations"""
    genre_list = genres.split(",") if genres else None
    
    recommendations = RecommendationEngine.ensemble_recommend(
        user_id=user_id,
        mood=mood,
        genres=genre_list,
        limit=limit
    )
    
    return recommendations

@app.get("/search", response_model=List[Movie])
async def search_movies(
    query: str = Query(..., min_length=1, description="Search query"),
    limit: int = Query(20, ge=1, le=50, description="Number of results")
):
    """Search movies by title, description, cast, or director"""
    query_lower = query.lower()
    results = []
    
    for movie in MOVIES_DB:
        # Search in title, description, director, and cast
        if (query_lower in movie.title.lower() or
            query_lower in movie.description.lower() or
            query_lower in movie.director.lower() or
            any(query_lower in actor.lower() for actor in movie.cast)):
            results.append(movie)
    
    # Sort by relevance (title matches first, then by rating)
    results.sort(key=lambda m: (
        query_lower in m.title.lower(),
        m.rating
    ), reverse=True)
    
    return results[:limit]

@app.get("/trending", response_model=List[MovieRecommendation])
async def get_trending(
    limit: int = Query(10, ge=1, le=20, description="Number of trending movies")
):
    """Get currently trending movies"""
    trending = RecommendationEngine.popularity_based(limit=limit)
    
    recommendations = []
    for movie, score, algo in trending:
        rec = MovieRecommendation(
            movie=movie,
            score=score,
            explanation="Trending now" if movie.year >= 2022 else "All-time favorite",
            algorithm="popularity",
            diversity_tag="trending" if movie.year >= 2022 else "similar"
        )
        recommendations.append(rec)
    
    return recommendations

@app.get("/genres", response_model=List[str])
async def get_genres():
    """Get all available genres"""
    all_genres = set()
    for movie in MOVIES_DB:
        all_genres.update(movie.genres)
    return sorted(list(all_genres))

@app.post("/feedback")
async def submit_feedback(feedback: FeedbackRequest):
    """Submit user feedback for a movie"""
    # In production, this would update the user profile and trigger model retraining
    
    user_profile = USER_PROFILES.get(feedback.user_id)
    if not user_profile:
        # Create new user profile
        USER_PROFILES[feedback.user_id] = UserProfile(
            user_id=feedback.user_id,
            preferred_genres=[],
            watch_history=[],
            ratings={}
        )
        user_profile = USER_PROFILES[feedback.user_id]
    
    if feedback.feedback_type == "watch":
        if feedback.movie_id not in user_profile.watch_history:
            user_profile.watch_history.append(feedback.movie_id)
        
        # Update genre preferences based on watched movie
        movie = next((m for m in MOVIES_DB if m.id == feedback.movie_id), None)
        if movie:
            for genre in movie.genres:
                if genre not in user_profile.preferred_genres:
                    user_profile.preferred_genres.append(genre)
    
    if feedback.rating:
        user_profile.ratings[feedback.movie_id] = feedback.rating
    
    return {"status": "success", "message": "Feedback recorded"}

@app.get("/user/{user_id}/profile", response_model=UserProfile)
async def get_user_profile(user_id: int):
    """Get user profile"""
    profile = USER_PROFILES.get(user_id)
    if not profile:
        raise HTTPException(status_code=404, detail="User not found")
    return profile

# ============== Run Server ==============

if __name__ == "__main__":
    import uvicorn
    print("Starting Movie Recommendation Engine API...")
    print("Model: Ensemble (Collaborative + Content-Based + Popularity)")
    print("Movies in database:", len(MOVIES_DB))
    uvicorn.run(app, host="0.0.0.0", port=8001)
