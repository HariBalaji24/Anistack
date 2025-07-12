import React, { useEffect, useState } from 'react';
import axios from '../../services/axios';
import "./Popular.css";
import { Link } from 'react-router-dom';

const Popular = () => {
  const [animeData, setAnimeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  useEffect(() => {
    async function apicall(retry=0) {
      try {
        setLoading(true);
        const response = await axios.get(`/top/anime?filter=favorite&limit=24&page=${page}`);
        setAnimeData(response.data.data);
        setTotalPages(response.data.pagination.last_visible_page);
        setLoading(false);
      } catch (error) {
        if (error.response?.status === 429 && retry < 1) {
          setTimeout(() => apicall(retry + 1), 1000);
        } else {
          console.error("Failed to fetch anime data", error);
        }
      }
    }

    apicall();
  }, [page]);

  if (loading) return null;
  if (error) return <h2>{error}</h2>;

  return (
    <div>
      <div className='popular-card'>
       
        <div className='popular-card-container'>
          {animeData.map((anime) => (
            <Link to={`/anime/${anime.mal_id}`} >
              <div key={anime.mal_id} className='popular-card-elements'>
                <div className='popular-card-card1'>
                  <span className='popular-card-type'>{anime.type}</span>
                  <img className='popular-card-image' src={anime.images.jpg.large_image_url} alt={anime.title} />
                  <h3 className='popular-card-title'>{anime.title_english || anime.title}</h3>

                  <div className="popular-card-card2">
                    <h3 className='popular-card-status'>Status: {anime.status || "Unknown"}</h3>
                    <h3 className='popular-card-episodes'>Episodes : {anime.episodes ?? "Unknown"}</h3>
                    <h3 className='popular-card-score'>Score : {anime.score != null ? (anime.score/2).toFixed(1) : "Not Rated"}</h3>
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
          <button disabled={page === 1} className='popular-card-previous' onClick={() => setPage(page - 1)}>Previous</button>
          {[...Array(10)].map((_, i) => {
            const pageNum = Math.max(1, page - 3) + i;
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
          <button disabled={page === totalPages} className='popular-card-next' onClick={() => setPage(page + 1)}>Next</button>
        </div>
      </div>
    </div>
  );
};

export default Popular;