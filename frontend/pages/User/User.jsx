import axios from "../../services/axios";
import React, { useEffect, useState } from "react";
import "./User.css";
import { Link } from "react-router-dom";

const User = () => {
  const [animedetails, setanimedetails] = useState([]);
  const [mangadetails, setmangadetails] = useState([]);

  const token = localStorage.getItem("auth-token");

  useEffect(() => {
    async function fetchdetails() {
      try {
        const response = await axios.get(
          "http://localhost:3000/user/user-details",
          {
            headers: { authorization: token },
          }
        );
        const { animedetails, mangadetails } = response.data;
        setanimedetails(animedetails || []);
        setmangadetails(mangadetails || []);
      } catch (error) {
        console.log(error);
      }
    }

    fetchdetails();
  }, []);

  const formatTime = (minutes) => {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hrs}hr ${mins}min`;
  };

  return (
    <div className="user-container">
      <div className="user-section">
        <h2 className="user-title">Anime List</h2>
        {animedetails.length === 0 ? (
          <p className="user-empty">No anime added yet.</p>
        ) : (
          <ul className="user-list">
            {animedetails.map((anime, index) => {
              const watchedTime = anime.episodesWatched * anime.duration;
              const totalTime = anime.totalEpisodes * anime.duration;
              const remainingTime = Math.max(totalTime - watchedTime, 0);
              const progress =
                anime.totalEpisodes > 0
                  ? (anime.episodesWatched / anime.totalEpisodes) * 100
                  : 0;

              return (
                <Link to={`/anime/${anime.id}`}><li key={index} className="user-card">
                  <img src={anime.image} alt="" className="user-image" />
                  <h3 className="user-card-title">{anime.name}</h3>
                  <p className="user-status">Status : {anime.status}</p>
                  <p className="user-episodes">Episodes : {anime.totalEpisodes}</p>
                  <p className="user-episodes">Episodes watched : {anime.episodesWatched}</p>
                  <p className="user-duration">Duration : {anime.duration} min</p>
                  <p className="user-watched">
                    Time Watched : {formatTime(watchedTime)}
                  </p>
                  <p className="user-remaining">
                    Time Remaining : {formatTime(remainingTime)}
                  </p>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    ></div>
                  </div>
                </li></Link>
                 
              );
            })}
          </ul>
        )}
      </div>

      <div className="user-section">
        <h2 className="user-title">Manga List</h2>
        {mangadetails.length === 0 ? (
          <p className="user-empty">No manga added yet.</p>
        ) : (
          <ul className="user-list">
            {mangadetails.map((manga, index) => (
             <Link to={`/manga/${manga.id}`} > <li key={index} className="user-card">
                  <img src={manga.image} alt="" className="user-image" />
                <h3 className="user-card-title">{manga.name}</h3>
                <p className="user-status">Status: {manga.status}</p>
                <p className="user-chapters">
                  Chapters Read: {manga.chaptersRead}
                </p>
                
                {manga.totalChapters!==null && 
                <div><p className="user-total-chapters">
                  Total Chapters: {manga.totalChapters}
                </p>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${
                        manga.totalChapters > 0
                          ? (manga.chaptersRead / manga.totalChapters) * 100
                          : 0
                      }%`,
                    }}
                  ></div>
                </div></div>
                
                }
              </li></Link>
            ))}
            
          </ul>
        )}
      </div>
    </div>
  );
};

export default User;
