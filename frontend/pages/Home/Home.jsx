import React, { useState, useEffect, useCallback } from "react";
import "./Home.css";
import axios from "../../services/axios";
import { Link } from "react-router-dom";
import debounce from "lodash.debounce";
const Home = () => {
  const [animeData, setAnimeData] = useState([]);
  const [page, setPage] = useState(1);
  const [condition, setCondition] = useState("all");
  const [searchresults, setsearchresults] = useState(null);
  const [result, setresult] = useState("Show Results");

  const loadResults = useCallback(
    debounce(async (word) => {
      if (word.trim() === "") {
        setsearchresults(null);
      } else {
        try {
          const response = await axios.get(
            `anime?q=${word}&order_by=popularity&limit=5` ||
              `manga?q=${word}&order_by=popularity&limit=5`
          );

          if (response.data.data.length === 0) {
            setresult("No results found");
            setsearchresults([]);
          } else {
            setsearchresults(response.data.data);
            setresult("Show results");
          }
        } catch (err) {
          return null;
        }
      }
    }, 200),
    []
  );

  // Search input change handler
  const showResults = (word) => {
    loadResults(word);
  };
  // Fetch anime based on condition and page
  useEffect(() => {
    setsearchresults(null); // Reset search when page or condition changes
    async function fetchAnime(retry = 0) {
      try {
        let response;
        if (condition === "all") {
          response = await axios.get(
            `anime?status=complete&start_date=2024-01-01&sort=asc&limit=21&page=${page}`
          );
        } else if (condition === "trending") {
          response = await axios.get(
            `top/anime?filter=airing&sfw=true&limit=21&page=${page}`
          );
        } else if (condition === "random") {
          response = await axios.get(
            `anime?genres_exclude=12&sfw=true&page=${Math.floor(
              Math.random() * 100
            )}&limit=21`
          );
        }
        setAnimeData(response.data.data);
      } catch (error) {
        if (error.response?.status === 429 && retry < 3) {
          setTimeout(() => fetchAnime(retry + 1), 1000);
        } else {
          console.error("Failed to fetch anime data", error);
        }
      }
    }

    fetchAnime();
  }, [page, condition]);

  return (
    <div className="home-container">
      {/* Top Banner & Search */}
      <div className="home-container1">
        <img
          className="home-image"
          src="https://s4.anilist.co/file/anilistcdn/media/anime/banner/178788-uYQZgw1v7xyN.jpg"
          alt="Banner"
        />
        <div className="search-wrapper">
          <div className="search-warpper-1">
            <input
              className="home-search-bar"
              type="text"
              placeholder="Search anime"
              onChange={(e) => showResults(e.target.value)}
            />
            <img
              src="https://pixsector.com/cache/e7836840/av6584c34aabb39f00a10.png"
              alt="Search icon"
              className="home-search-icon"
            />
          </div>
        </div>
      </div>
      <div className="search-elements">
        {searchresults !== null &&
          searchresults.map((anime, index) => {
            return (
              <Link to={`/anime/${anime.mal_id}`} key={anime.mal_id}>
                <div
                  className={`search-card ${
                    index % 2 === 0 ? "search-even-index" : "search-odd-index"
                  }`}
                >
                  <img
                    src={anime.images.jpg.large_image_url}
                    alt=""
                    className="search-image"
                  />
                  <div className="search-details">
                    <h2 className="search-name">
                      {anime.title_english || anime.title}
                    </h2>
                    <h2 className="search-name">
                      Genres : {anime.genres.map((g) => g.name).join(", ")}
                    </h2>
                    <h2 className="search-name">Type : {anime.type}</h2>
                    <h2 className="search-name">
                      Score : {(anime.score / 2).toFixed(1)}
                    </h2>
                  </div>
                </div>
              </Link>
            );
          })}
      </div>
      <div className="home-container2">
        <div className="container21">
          <div className="home-navbarcontainer">
            <div onClick={() => setCondition("all")} className="home-elements">
              All
            </div>
            <div
              onClick={() => setCondition("trending")}
              className="home-elements"
            >
              Trending
            </div>
            <div
              onClick={() => setCondition("random")}
              className="home-elements"
            >
              Random
            </div>
          </div>

          <div className="container22">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="home-button-previous"
            >
              {"<"}
            </button>
            <button
              onClick={() => setPage(page + 1)}
              className="home-button-next"
            >
              {">"}
            </button>
          </div>
        </div>
        <div className="home-card-elements">
          {animeData.map((anime) => (
            <Link to={`/anime/${anime.mal_id}`} key={anime.mal_id}>
              <div className="home-card-card1">
                <span className="home-card-type">{anime.type}</span>
                <img
                  className="home-card-image"
                  src={anime.images.jpg.image_url}
                  alt={anime.title}
                />
                <h3 className="home-card-title">
                  {anime.title_english || anime.title}
                </h3>
                <div className="home-card-card2">
                  <h3 className="home-card-status">
                    Status : {anime.status || "Unknown"}
                  </h3>
                  <h3 className="home-card-episodes">
                    Episodes : {anime.episodes ?? "Unknown"}
                  </h3>
                  <h3 className="home-card-score">
                    Score :{" "}
                    {anime.score != null
                      ? (anime.score / 2).toFixed(1)
                      : "Not Rated"}
                  </h3>
                  <h3 className="home-card-genres">
                    Genres :{" "}
                    {anime.genres?.length > 0
                      ? anime.genres.map((g) => g.name).join(", ")
                      : "N/A"}
                  </h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
