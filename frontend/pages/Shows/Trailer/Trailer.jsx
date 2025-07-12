import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../../../services/axios';
import './Trailer.css';

const Trailer = () => {
  const { id } = useParams();
  const [trailerUrl, setTrailerUrl] = useState('');

  useEffect(() => {
    async function fetchTrailer() {
      try {
        const res = await axios.get(`/anime/${id}`);
        const embedUrl = res.data.data.trailer.embed_url;
        if (embedUrl) {
          setTrailerUrl(embedUrl);
        }
      } catch (err) {
        console.error("Error fetching trailer:", err);
      }
    }

    fetchTrailer();
  }, [id]);

  return (
    <div className="trailer-container">
     
      {trailerUrl ? (
        <div className="video-wrapper">
          <iframe
            className="trailer-iframe"
            src={trailerUrl}
            title="Anime Trailer"
            allowFullScreen
          />
        </div>
      ) : (
        <p className='no-trailer'>Trailer not available.</p>
      )}
    </div>
  );
};

export default Trailer;
