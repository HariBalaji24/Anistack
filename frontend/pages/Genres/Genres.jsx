import React, { useEffect, useState } from 'react';
import axios from '../../services/axios';
import "../Popularanime/Popular.css";
import { Link, useParams } from 'react-router-dom';

const Genres = () => {
  const [animeData, setAnimeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { genre } = useParams();

  useEffect(() => {
    async function apicall(retryCount = 0) {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(`anime?genres=${genre}&limit=24&page=${page}&order_by=popularity`);
        setAnimeData(response.data.data);
        setTotalPages(response.data.pagination.last_visible_page);
        setLoading(false);
      } catch (err) {
        if (err.response?.status === 429 && retryCount < 3) {
          // Retry after 1 second
          setTimeout(() => apicall(retryCount + 1), 1000);
        } else {
          setError("Failed to fetch data. Please try again later.");
          setLoading(false);
        }
      }
    }

    apicall();
  }, [genre, page]);

  if (loading) return <h2>Loading...</h2>;
  if (error) return <h2>{error}</h2>;

  return (
    <div>
      <div className='popular-card'>
        <div className='popular-card-container'>
          {animeData.map((anime) => (
            <Link key={anime.mal_id} to={`/anime/${anime.mal_id}`}>
              <div className='popular-card-elements'>
                <div className='popular-card-card1'>
                  <span className='popular-card-type'>{anime.type}</span>
                  <img
                    className='popular-card-image'
                    src={anime.images.jpg.large_image_url}
                    alt={anime.title}
                  />
                  <h3 className='popular-card-title'>{anime.title_english || anime.title}</h3>

                  <div className="popular-card-card2">
                    <h3 className='popular-card-status'>Status: {anime.status || "Unknown"}</h3>
                    <h3 className='popular-card-episodes'>Episodes : {anime.episodes ?? "Unknown"}</h3>
                    <h3 className='popular-card-score'>
                      Score : {anime.score != null ? (anime.score / 2).toFixed(1) : "Not Rated"}
                    </h3>
                    <h3 className='popular-card-genres'>
                      Genres : {anime.genres?.length > 0 ? anime.genres.map(g => g.name).join(", ") : "N/A"}
                    </h3>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className='popular-card-palignation'>
          <button
            disabled={page === 1}
            className='popular-card-previous'
            onClick={() => setPage(page - 1)}
          >
            Previous
          </button>

          {[...Array(10)].map((_, i) => {
            const pageNum = Math.max(1, page - 5) + i;
            if (pageNum <= totalPages) {
              return (
                <button
                  key={pageNum}
                  className={`popular-card-pagebtn ${page === pageNum ? 'active' : ''}`}
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
            className='popular-card-next'
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Genres;
