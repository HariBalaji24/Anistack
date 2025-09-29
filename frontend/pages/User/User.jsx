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
          "https://anistack-1.onrender.com/user/user-details",
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
  }, [token]);

  const formatTime = (minutes) => {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hrs}hr ${mins}min`;
  };
console.log(animedetails)
  return (
    <div className="user-container">
      {/* ================== ANIME SECTION ================== */}
      <div className="user-section">
        <h2 className="user-title">Anime List</h2>
        {animedetails.length === 0 ? (
          <p className="user-empty">No anime added yet</p>
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
                <li key={index} className="user-card">
                  <Link to={`/anime/${anime.id}`}>
                    <img
                      src={anime.image}
                      alt={anime.name}
                      className="user-image"
                    />
                    <h3 className="user-card-title">{anime.name}</h3>
                    <p className="user-status">Status: {anime.status}</p>
                    {
                      anime.totalEpisodes!==0 && <p className="user-episodes">
                      Episodes: {anime.totalEpisodes}
                    </p> 
                    }
                    
                    <p className="user-episodes">
                      Episodes watched: {anime.episodesWatched || 0}
                    </p>
                    <p className="user-duration">
                      Duration: {anime.duration} min
                    </p>

                    <p className="user-watched">
                      Time Watched:{" "}
                      {watchedTime > 0
                        ? formatTime(watchedTime)
                        : "0hr 0min"}
                    </p>

                    <p className="user-remaining">
                      Time Remaining:{" "}
                      {
                        isNaN(remainingTime) ? formatTime(totalTime) : formatTime(remainingTime)
                      }
                    </p>

                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{ width: `${Math.min(progress, 100) || 0}%` }}
                      ></div>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* ================== MANGA SECTION ================== */}
      <div className="user-section">
        <h2 className="user-title">Manga List</h2>
        {mangadetails.length === 0 ? (
          <p className="user-empty">No manga added yet</p>
        ) : (
          <ul className="user-list">
            {mangadetails.map((manga, index) => (
              <li key={index} className="user-card">
                <Link to={`/manga/${manga.id}`}>
                  <img
                    src={manga.image}
                    alt={manga.name}
                    className="user-image"
                  />
                  <h3 className="user-card-title">{manga.name}</h3>
                  <p className="user-status">Status: {manga.status}</p>
                  <p className="user-chapters">
                    Chapters Read: {manga.chaptersRead || 0}
                  </p>

                  {manga.totalChapters !== null && (
                    <div>
                      <p className="user-total-chapters">
                        Total Chapters: {manga.totalChapters}
                      </p>
                      <div className="progress-bar">
                        <div
                          className="progress-fill"
                          style={{
                            width: `${
                              
                                 (manga.chaptersRead / manga.totalChapters) *
                                  100
                                || 0
                            }%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default User;
