import React, { useEffect, useState } from "react";
import { Link, Outlet, useParams, useLocation } from "react-router-dom";
import axios from "../../../services/axios";
import "./Shows.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Shows = () => {
  const { id } = useParams();
  const location = useLocation();
  const isManga = location.pathname.includes("manga");
  const [dur, setdur] = useState(0);
  const [data, setData] = useState(null);
  const [episodedata, setEpisodedata] = useState([]);
  const [stats, setStats] = useState(null);
  const [animeoption, setAnimeoption] = useState();
  const [mangaoption, setMangaoption] = useState();
  const [clicked, setclicked] = useState(false);
  const [watched, setwatched] = useState(0);
  const [watchlist, setwatchlist] = useState([]);
  const [read, setread] = useState(0);
  const [readlist, setreadlist] = useState([]);
  const token = localStorage.getItem("auth-token");

  const colorepisode = (id) => {
    if (clicked && !watchlist.includes(id)) {
      const newList = [...watchlist, id];
      setwatchlist(newList);
      setwatched(newList.length);
      if (id > 0) {
        setAnimeoption("Watching");
      }
      animechange(Date.now(), animeoption, newList);
    }
  };

  const colorchapter = (id) => {
    if (!token) {
      toast.error("Log in first to add this to your list");
    }
    if (clicked) {
      const newList = [...readlist, id];
      setreadlist(newList);
      setread(newList.length);

      if (id > 0) {
        setMangaoption("Reading");
      }

      if (newList.length === data.chapters) {
        setAnimeoption("Reading");
      }

      mangachange(Date.now(), mangaoption, newList);
    }
  };

  const animeaddtolist = async (updated) => {
    const episodes = episodedata.length;
    const details = {
      id: data.mal_id,
      image:
        data.images?.jpg?.large_image_url ||
        data.images?.webp?.large_image_url ||
        "",
      name: data.title_english || data.title,
      duration: dur === 0 ? 23 : dur,
      totalEpisodes: episodes,
      status: animeoption || "Want to Watch",
      createdAt: new Date().toISOString(),
      updatedAt: updated,
    };

    try {
      const response = await axios.post(
        "https://anistack-1.onrender.com/user/animepost",
        details,
        {
          headers: { authorization: token },
        }
      );
    } catch (error) {
      console.error("Error ", error);
    }
  };

  const mangaaddtolist = async (updated) => {
    const details = {
      id: data.mal_id,
      image:
        data.images?.jpg?.large_image_url ||
        data.images?.webp?.large_image_url ||
        "",
      name: data.title_english || data.title,
      totalChapters: data.chapters,
      chaptersRead: read,
      status: mangaoption || "Want to Read",
      createdAt: new Date().toISOString(),
      updatedAt: updated,
    };
    try {
      const response = await axios.post(
        "https://anistack-1.onrender.com/user/mangapost",
        details,
        {
          headers: { authorization: token },
        }
      );
    } catch (error) {
      console.error("Error ", error);
    }
  };
  const animechange = async (updatedat, newStatus, episodeList = watchlist) => {
    try {
      const details = {
        id: data.mal_id,
        status: newStatus,
        episodeswatched: episodeList.length,
        updatedAt: new Date(updatedat).toISOString(),
        numberofepisodeswatched: episodeList,
      };
      await axios.patch("https://anistack-1.onrender.com/user/animechanges", details, {
        headers: { authorization: token },
      });
    } catch (error) {
      console.error("Anime update failed", error);
    }
  };

  const mangachange = async (updatedat, newStatus, chapterList = readlist) => {
    try {
      const details = {
        id: data.mal_id,
        status: newStatus,
        chaptersRead: chapterList.length,
        updatedAt: new Date(updatedat).toISOString(),
        numberofchaptersread: chapterList,
      };
      await axios.patch("https://anistack-1.onrender.com/user/mangachanges", details, {
        headers: { authorization: token },
      });
    } catch (error) {
      console.error("Anime update failed", error);
    }
  };
  // For manga
  useEffect(() => {
    if (!isManga || !data || !token) return;

    const getmangadetails = async () => {
      try {
        const response = await axios.get(
          `https://anistack-1.onrender.com/user/getmangadetails?id=${id}`,
          {
            headers: { authorization: token },
          }
        );

        const { status, numberofchaptersread } = response.data.details;
        setclicked(true);
        setMangaoption(status);
        setreadlist(numberofchaptersread || []); // ✅ Always use fallback
        setread((numberofchaptersread || []).length); // ✅ Avoid undefined.length
      } catch (error) {
        console.error(
          "Get manga details error:",
          error.response?.data || error.message
        );
      }
    };

    getmangadetails();
  }, [data, id, token, isManga]);

  useEffect(() => {
    if (isManga || !data || !token) return;

    const getanimedetails = async () => {
      try {
        const response = await axios.get(
          `https://anistack-1.onrender.com/user/getanimedetails?id=${id}`,
          { headers: { authorization: token } }
        );

        const { status, numberofepisodeswatched } = response.data.details;
        setclicked(true);
        setAnimeoption(status);
        setwatchlist(numberofepisodeswatched);
      } catch (error) {
        if (
          error.response?.status === 404 &&
          error.response?.data?.message === "anime not found in user list"
        ) {
          // 👇 Don’t treat this as error, just set state to "not in list"
          setclicked(false);
          setAnimeoption(null);
          setwatchlist([]);
        } else {
          console.error(
            "Unexpected error:",
            error.response?.data || error.message
          );
        }
      }
    };

    getanimedetails();
  }, [data, id, token, isManga]);

  const changehandler1 = async (event) => {
    setAnimeoption(event);
    animechange(Date.now(), event);
  };

  const changehandler2 = async (event) => {
    setMangaoption(event);
    mangachange(Date.now(), event);
  };

  useEffect(() => {
    async function fetchData(retry = 0) {
      try {
        const response = await axios.get(
          `${isManga ? "/manga" : "/anime"}/${id}`
        );
        if (!isManga && response.data.data.type !== "Movie") {
          const durationStr = response.data.data.duration;
          let strnum = 24; // fallback default

          if (durationStr?.includes("min per ep")) {
            strnum = Number(durationStr.split(" min per ep")[0]);
          } else if (durationStr?.includes("min")) {
            strnum = Number(durationStr.split(" min")[0]);
          }

          setdur(Number.isNaN(strnum) ? 24 : strnum); // default fallback
        }

        if (response.data.data.type === "Movie") {
          let strnum1 = response.data.data.duration.split(" hr")[0];
          let strnum2 = response.data.data.duration
            ?.split(" hr ")[1]
            ?.split(" min")[0];
          let num1 = Number(strnum1) * 60;
          let num2 = Number(strnum2);
          setdur(num1 + num2);
        }
        setData(response.data.data);
      } catch (error) {
        if (error.response?.status === 429 && retry < 3) {
          setTimeout(() => fetchData(retry + 1), 1000);
        } else {
          console.error("Failed to fetch anime data", error);
        }
      }
    }
    fetchData();
  }, [id, isManga]);

  useEffect(() => {
    if (isManga) return;
    async function fetchEpisodes(retry = 0) {
      let page = 1;
      let episodes = [];
      let hasNextPage = true;

      while (hasNextPage) {
        try {
          const response = await axios.get(
            `/anime/${id}/episodes?page=${page}`
          );
          if (!response) {
            setEpisodedata(null);
          }
          episodes = [...episodes, ...response.data.data];
          hasNextPage = response.data.pagination.has_next_page;
          page++;
        } catch (error) {
          if (error.response?.status === 429 && retry < 3) {
            setTimeout(() => fetchEpisodes(retry + 1), 1000);
          } else {
            console.error("Failed to fetch anime data", error);
          }
        }
      }

      episodes.sort((a, b) => a.mal_id - b.mal_id);
      setEpisodedata(episodes);
    }

    fetchEpisodes();
  }, [id, isManga]);

  useEffect(() => {
    async function fetchStats(retry = 0) {
      try {
        const response = await axios.get(
          `/${isManga ? "manga" : "anime"}/${id}/statistics`
        );

        setStats(response.data.data);
      } catch (error) {
        if (
          (error.response?.status === 429 ||
            error.message?.includes("Cannot read properties of null")) &&
          retry < 3
        ) {
          setTimeout(() => fetchStats(retry + 1), 1000);
        } else {
          console.error("Failed to fetch anime data", error);
        }
      }
    }
    fetchStats();
  }, [id, isManga]);

  if (!data) return <div>Loading...</div>;

  return (
    <div className="show-container">
      {/* <ToastContainer position="top-right" autoClose={3000} /> */}
      <div className="shows-container1">
        <img
          className="shows-image"
          src={data.images.jpg.large_image_url}
          alt={data.title}
        />
        <div className="shows-container2">
          <h1 className="shows-title">{data.title_english || data.title}</h1>
          {data.type && <p className="shows-season">Type : {data.type}</p>}
          {data.season && data.year && (
            <p className="shows-season">
              {data.season} , {data.year}
            </p>
          )}
          {!isManga ? (
            <p className="shows-episodes">
              Episodes :{" "}
              {data.episodes !== null ? data.episodes : episodedata.length}
            </p>
          ) : (
            <div className="shows-chapvol">
              <p className="shows-episodes">
                {" "}
                Chapters : {data.chapters || "N/A"}
              </p>
              <p className="shows-episodes">
                {" "}
                Volumes : {data.volumes || "N/A"}
              </p>
            </div>
          )}
          {!isManga && (
            <p className="shows-episodes">Rating : {data.rating || "N/A"}</p>
          )}

          <p className="shows-status">Status : {data.status || "N/A"}</p>
          {!isManga && (
            <p className="shows-episodes">
              Duration : {data.duration || "N/A"}
            </p>
          )}
          <p className="shows-score">
            Score : {(data.score / 2).toFixed(2) || "N/A"} / 5
          </p>

          {/* Genres */}
          <div className="shows-genres-container">
            <p className="shows-genres">Genres :</p>
            <ul className="shows-ul">
              {data.genres.map((g) => (
                <Link key={g.mal_id} to={`/genre/${g.mal_id}`}>
                  <li className="shows-indi-genres">{g.name}</li>
                </Link>
              ))}
            </ul>
          </div>

          {/* Studios or Authors */}
          {!isManga && (
            <div className="shows-genres-container">
              <p className="shows-genres">Studios :</p>
              <ul className="shows-ul">
                {data.studios.map((s) => (
                  <Link key={s.mal_id} to={`/genre/${s.mal_id}`}>
                    <li className="shows-indi-genres">{s.name}</li>
                  </Link>
                ))}
              </ul>
            </div>
          )}

          <div className="shows-genres-container">
            {isManga ? (
              <p className="shows-genres">Authors :</p>
            ) : (
              <p className="shows-genres">Producers:</p>
            )}
            <ul className="shows-ul-genres">
              {isManga
                ? data.authors?.length > 0 &&
                  data.authors.map((p) => (
                    <Link key={p.mal_id} to={`/genre/${p.mal_id}`}>
                      <li className="shows-indi-genres">{p.name}</li>
                    </Link>
                  ))
                : data.producers?.length > 0 &&
                  data.producers.map((p) => (
                    <Link key={p.mal_id} to={`/genre/${p.mal_id}`}>
                      <li className="shows-indi-genres">{p.name}</li>
                    </Link>
                  ))}
            </ul>
          </div>

          <div className="shows-status">
            {clicked && localStorage.getItem("auth-token") ? (
              isManga ? (
                <select
                  value={mangaoption}
                  onChange={(e) => changehandler2(e.target.value)}
                  id="anime-select"
                >
                  <option value="Want to read">Want to read</option>
                  <option value="Reading">Reading</option>
                  <option value="Completed">Completed</option>
                  <option value="Dropped">Dropped</option>
                  <option value="Onhold">On hold</option>
                </select>
              ) : (
                <select
                  value={animeoption}
                  onChange={(e) => changehandler1(e.target.value)}
                  id="anime-select"
                >
                  <option value="Want to watch">Want to watch</option>
                  <option value="Watching">Watching</option>
                  <option value="Completed">Completed</option>
                  <option value="Dropped">Dropped</option>
                  <option value="Onhold">On hold</option>
                </select>
              )
            ) : (
              <button
                onClick={async () => {
                  if (!token) {
                    toast.error("Please log in to add this to your list");
                    return;
                  }
                  setclicked(true);
                  if (isManga) {
                    toast.success("Manga has been added")
                    await mangaaddtolist(Date.now());
                  } else {
                    toast.success("Anime has been added")
                    await animeaddtolist(Date.now());
                  }
                }}
                className="add-to-list"
              >
                ADD TO LIST +
              </button>
            )}
          </div>

          <p className="shows-synopsis">
            {data.synopsis &&
              data.synopsis.split("[Written by MAL Rewrite]")[0]}
          </p>
        </div>
      </div>

      <div className="shows-container4">
        <div className="scores-and-stats">
          {/* Score Bar */}
          {stats && stats.scores && (
            <div className="shows-score-bars">
              <h2 className="scores-title">Scores</h2>
              {stats.scores.slice(5, 10).map((anime, index) => (
                <div key={index} className="score-bar-row">
                  <span className="score-label">Score {anime.score - 5}</span>
                  <div className="score-bar-container">
                    <div
                      className="score-bar-fill"
                      style={{ width: `${anime.percentage + 1}%` }}
                    ></div>
                  </div>
                  <span className="score-percent">{anime.percentage + 1}%</span>
                </div>
              ))}
            </div>
          )}

          {/* Stats on the Right */}
        </div>
        <div className="shows-review">
          <h2 className="scores-title">Statistics</h2>

          <div className="shows-details">
            {!isManga && data.type === "TV" && (
              <h2 className="shows-stat-item">
                Running time : {Math.floor((dur * episodedata.length) / 60)}h{" "}
                {(dur * episodedata.length) % 60} mins approx
              </h2>
            )}
            <h3 className="shows-stat-item">
              {isManga ? "Reading" : "Watching"} :{" "}
              {stats?.[isManga ? "reading" : "watching"] ?? "N/A"}
            </h3>
            <h3 className="shows-stat-item">Completed : {stats?.completed}</h3>
            <h3 className="shows-stat-item">On Hold : {stats?.on_hold}</h3>
            <h3 className="shows-stat-item">Dropped : {stats?.dropped}</h3>
            {!isManga ? (
              <h3 className="shows-stat-item">
                Want to Watch : {stats?.plan_to_watch}
              </h3>
            ) : (
              <h3 className="shows-stat-item">
                Want to Read : {stats?.plan_to_read}
              </h3>
            )}
          </div>
        </div>
      </div>

      {!isManga && data.status !== "Not yet aired" && episodedata !== null ? (
        <div className="shows-container3">
          <h2 className="show-container3-episodes">Available Episodes</h2>
          <div className="shows-episodes-list">
            {data.type == "Movie" ? (
              <span
                onClick={() => {
                  if (!token) {
                    toast.error("Please log in to add this to your list")
                    return;
                  }
                  else{
                    toast.success("Anime successfully added to your list")
                  }
                  colorepisode(1);
                }}
                key={1}
                className={`shows-episodes-number ${
                  watchlist?.includes(1) &&
                  clicked !== false &&
                  "shows-episodes-number-color"
                }`}
              >
                1
              </span>
            ) : (
              episodedata.map((epi) => (
                <span
                  onClick={() => {
                      if (!token) {
                        toast.error("Please log in to add this to your list");
                        return;
                      } else {
                        toast.success("Anime has been updated to your list");
                      }
                    
                    colorepisode(epi.mal_id);
                  }}
                  key={epi.mal_id}
                  className={`shows-episodes-number ${
                    watchlist?.includes(epi.mal_id) &&
                    clicked !== false &&
                    "shows-episodes-number-color"
                  }`}
                >
                  {epi.mal_id}
                </span>
              ))
            )}
          </div>
        </div>
      ) : (
        isManga &&
        data.chapters !== null && (
          <div className="shows-container3">
            <h2 className="show-container3-episodes">Chapters</h2>
            <div className="shows-episodes-list">
              {Array.from({ length: data.chapters }).map((_, index) => (
                <span
                  onClick={() => {
                    if (!token) {
                      toast.error("Please log in to add this to your list");
                      return;
                    } else {
                      toast.success("Chapter has been updated to your list");
                    }
                    colorchapter(index + 1);
                  }}
                  key={index + 1}
                  className={`shows-episodes-number ${
                    readlist?.includes(index + 1) &&
                    clicked !== false &&
                    "shows-episodes-number-color"
                  }`}
                >
                  {index + 1}
                </span>
              ))}
            </div>
          </div>
        )
      )}

      <Outlet />
    </div>
  );
};

export default Shows;
