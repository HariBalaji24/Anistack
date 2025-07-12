import React, { useEffect, useState, useRef } from "react";
import axios from "../../services/axios";
import "./Navbar.css";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [genredata, setGenreData] = useState([]);
  const [showGenres, setShowGenres] = useState(false);
  const [showPopular, setShowPopular] = useState(false);
  const [showTypes, setShowTypes] = useState(false);
  const [searchbar, setSearchbar] = useState(false);
  const [name, setName] = useState([]);
  const [clicked, setClicked] = useState(false);

  const userRef = useRef(null); // For dropdown and image reference

  useEffect(() => {
    async function fetchGenres() {
      try {
        const response = await axios.get("genres/anime?swf");
        const sorted = response.data.data.sort((a, b) =>
          a.name.localeCompare(b.name)
        );
        setGenreData(sorted);
      } catch (error) {
        console.error("Error fetching genre data:", error);
      }
    }
    fetchGenres();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("auth-token");
    if (!token) return;

    async function fetchName() {
      try {
        const response = await axios.get("http://localhost:3000/user/getname", {
          headers: {
            authorization: token,
          },
        });
        setName(response.data.name);
      } catch (error) {
        console.error("Error fetching name:", error);
      }
    }

    fetchName();
  }, []);

  // Close dropdown when clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userRef.current && !userRef.current.contains(event.target)) {
        setClicked(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const columns = 5;
  const genreChunks = [];
  for (
    let i = 0;
    i < genredata.length;
    i += Math.ceil(genredata.length / columns)
  ) {
    genreChunks.push(
      genredata.slice(i, i + Math.ceil(genredata.length / columns))
    );
  }

  const handlelogout=()=>{
    localStorage.removeItem("auth-token")
    window.location.reload()
  }

  return (
    <div className="navs" onClick={() => setSearchbar(false)}>
      <div className="navbar">
        <div className="navbar-container">
          <Link to="/">
            <div className="navbar-right">
              <img
                className="navbar-image"
                src="https://img.freepik.com/free-vector/colorful-letter-gradient-logo-design_474888-2309.jpg?semt=ais_hybrid&w=740"
                alt="logo"
              />
              <h1 className="navbar-title">Anistack</h1>
            </div>
          </Link>

          <div className="navbar-middle">
            <ul className="navbar-middle-ul">
              <li
                className="navbar-genres"
                onMouseEnter={() => setShowGenres(true)}
                onMouseLeave={() => setShowGenres(false)}
              >
                Genres
                {showGenres && (
                  <div className="genre-dropdown">
                    {genreChunks.map((chunk, i) => (
                      <div key={i} className="genre-column">
                        {chunk.map((genre) => (
                          <Link
                            key={genre.mal_id}
                            to={`/genre/${genre.mal_id}`}
                            className="genre-link"
                          >
                            {genre.name}
                          </Link>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </li>

              <li
                onMouseEnter={() => setShowPopular(true)}
                onMouseLeave={() => setShowPopular(false)}
                className="navbar-popular"
              >
                Popular
                {showPopular && (
                  <div className="popular-dropdown">
                    <ul className="popular-dropdown-elements">
                      <Link to="/popular/anime">
                        <p className="popular-link">Anime</p>
                      </Link>
                      <Link to="/popular/manga">
                        <p className="popular-link">Manga</p>
                      </Link>
                    </ul>
                  </div>
                )}
              </li>

              <Link to="/upcoming">
                <li className="navbar-upcoming">Upcoming</li>
              </Link>
              <Link to="/ongoing">
                <li className="navbar-ongoing">Ongoing</li>
              </Link>

              <li
                className="navbar-types"
                onMouseEnter={() => setShowTypes(true)}
                onMouseLeave={() => setShowTypes(false)}
              >
                Types
                {showTypes && (
                  <div className="navbar-types-container">
                    <div className="navbar-types-conrtainer1">
                      {["tv", "manga", "movie", "ona", "ova", "special", "music"].map((type) => (
                        <Link key={type} to={`/type/${type}`}>
                          <div className="navbar-types-container-elements">
                            {type.toUpperCase()}
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </li>
            </ul>
          </div>

          <div className="navbar-end">
            {localStorage.getItem("auth-token") ? (
              <div ref={userRef} className="navbar-user-wrapper">
                <div
                  className="navbar-user"
                  onClick={() => setClicked((prev) => !prev)}
                >
                  <div className="navbar-user-signin">{name}</div>
                  <img
                    src="https://static.wikia.nocookie.net/1e39c2a9-f2b3-4673-927f-9ed5d5c3f188/scale-to-width/755"
                    className="navbar-user-image"
                    alt="user"
                  />
                </div>
                {clicked && (
                  <div className="useroptions">
                    <div className="useroptions-list">
                      <Link to="/user-details"><div className="user-profile">Profile</div></Link>
                      <div className="user-edit">Edit details</div>
                      <div onClick={handlelogout} className="user-logout">Log out</div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="navbar-user">
                <Link to="/signin">
                  <div className="navbar-user-signin">Sign in</div>
                </Link>
                <Link to="/signin">
                  <img
                    src="https://www.shutterstock.com/image-vector/default-avatar-profile-icon-transparent-600nw-2534623311.jpg"
                    className="navbar-user-image"
                    alt="guest"
                  />
                </Link>
              </div>
            )}
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
