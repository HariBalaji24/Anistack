import React, { useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import axios from "../../../services/axios"
import "./Images.css"

const Images = () => {
  const [images, setImages] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const { id } = useParams();
  const isManga = useLocation().pathname.includes("/manga")
  useEffect(() => {
    async function fetchImages() {
      try {
        const res = await axios.get(`${isManga ? "manga" : "anime"}/${id}/pictures`);
        setImages(res.data.data);
      } catch (err) {
        setImages(null)
        console.error("Error fetching images:", err);
      }
    }

    fetchImages();
  }, [id]);

  const handleImageClick = (index) => {
    setSelectedIndex(index);
  };

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains('fullscreen-overlay')) {
      setSelectedIndex(null);
    }
  };

  const goToNext = () => {
    setSelectedIndex((prev) => (prev + 1) % images.length);
  };

  const goToPrev = () => {
    setSelectedIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <>
      <div className="images-container">
        {images.map((anime, index) => (
          <img
            key={index}
            src={anime.jpg.large_image_url}
            alt=""
            onClick={() => handleImageClick(index)}
          />
        ))}
      </div>

      {selectedIndex !== null && (
        <div className="fullscreen-overlay" onClick={handleOverlayClick}>
          <button className="carousel-btn left" onClick={goToPrev}>‹</button>
          <img
            className="fullscreen-img"
            src={images[selectedIndex].jpg.large_image_url}
            alt=""
          />
          <button className="carousel-btn right" onClick={goToNext}>›</button>
        </div>
      )}
      {
        setImages===null && <div className="no-image">No Images Found</div>
      }
    </>
  );
};

export default Images;
