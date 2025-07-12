import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import axios from "../../services/axios";
import "../Popularanime/Popular.css";
import { Link } from "react-router-dom";
const Types = () => {
  const { type } = useParams();
  const [animeData, setAnimeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const isManga = location.pathname.includes("manga");
  useEffect(() => {
    async function apicall() {
      try {
        if (type === "manga") {
          setLoading(true);
          const response = await axios.get(
            `/manga?order_by=popularity&limit=24&page=${page}`
          );

          setAnimeData(response.data.data);
          setTotalPages(response.data.pagination.last_visible_page);
          setLoading(false);
        } else {
          setLoading(true);
          const response = await axios.get(
            `/anime?type=${type}&limit=24&page=${page}`
          );
          setAnimeData(response.data.data);
          setTotalPages(response.data.pagination.last_visible_page);
          setLoading(false);
        }
      } catch (err) {
        setError("Failed to fetch data");
        setLoading(false);
      }
    }

    apicall();
  }, [type, page]);

  if (loading) return <p>Loading...</p>;
  if (error) return <h2>{error}</h2>;

  return (
    <div className="popular-card">
      <div className="popular-card-container">
        {animeData.map((anime) => (
          <Link
            to={`${
              isManga || anime.type === "Manhwa"
                ? "/manga"
                : "/anime"
            }/${anime.mal_id}`}
          >
            <div key={anime.mal_id} className="popular-card-elements">
              <div className="popular-card-card1">
                <span className="popular-card-type">{anime.type}</span>
                <img
                  className="popular-card-image"
                  src={anime.images.jpg.large_image_url}
                  alt={anime.title}
                />
                <h3 className="popular-card-title">
                  {anime.title_english || anime.title}
                </h3>

                <div className="popular-card-card2">
                  <h3 className="popular-card-status">
                    Status: {anime.status || "Unknown"}
                  </h3>
                  {isManga  ? <h3 className="popular-card-episodes">
                      Chapters : {anime.chapters}
                    </h3> : (
                    <h3 className="popular-card-episodes">
                      Episodes : {anime.episodes}
                    </h3>
                  )}
                  <h3 className="popular-card-score">
                    Score : {anime.score != null ? anime.score : "Not Rated"}
                  </h3>
                  <h3 className="popular-card-genres">
                    Genres :{" "}
                    {anime.genres?.length > 0
                      ? anime.genres.map((g) => g.name).join(", ")
                      : "N/A"}
                  </h3>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="popular-card-palignation">
        <button
          disabled={page === 1}
          className="popular-card-previous"
          onClick={() => setPage(page - 1)}
        >
          Previous
        </button>
        {[...Array(10)].map((_, i) => {
          const pageNum = Math.max(1, page - 3) + i;
          if (pageNum <= totalPages) {
            return (
              <button
                key={pageNum}
                className={`popular-card-pagebtn ${
                  page === pageNum ? "active" : ""
                }`}
                onClick={() => setPage(pageNum)}
              >
                {pageNum}
              </button>
            );
          }
          return null;
        })}
        <button
          disabled={page === totalPages}
          className="popular-card-next"
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Types;
