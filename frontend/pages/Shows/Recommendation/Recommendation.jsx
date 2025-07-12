import React, { useEffect, useState } from 'react';
import axios from '../../../services/axios';
import "./Recommendation.css";
import { Link, useLocation, useParams } from 'react-router-dom';

const Recommendation = () => {
  const [animeData, setAnimeData] = useState([]);
  const { id } = useParams();
  const location = useLocation();
  const isManga = location.pathname.includes("/manga/");
  
  useEffect(() => {
    async function apicall() {
      try {
        const response = await axios.get(`${isManga ? "/manga" : "/anime"}/${id}/recommendations?limit=24`);
        setAnimeData(response.data.data);
      } catch (err) {
        console.error("Error fetching recommendations:", err);
      }
    }

    apicall();
  }, [id, isManga]);

  return (
    <div className='popular-card'>
      <div className='popular-card-container'>
        {animeData.map((anime) => (
  <Link to={`/${isManga ? "manga" : "anime"}/${anime.entry.mal_id}`} key={anime.entry.mal_id}>
    <div className='popular-card-elements'>
      <div className='popular-card-card1'>
        <img
          className='popular-card-image'
          src={anime.entry.images.jpg.large_image_url}
          alt={anime.entry.title}
        />
        <h3 className='popular-card-title'>{anime.entry.title}</h3>
      </div>
    </div>
  </Link>
))}

      </div>
    </div>
  );
};

export default Recommendation;
