import React, { useEffect, useState, useRef } from "react";
import axios from "../../services/axios";
import "./Navbar.css";
import { Link } from "react-router-dom";
import noprofile from "../../Assets/noprofile.jpg"
import logo from "../../Assets/logo.jpeg"

const Navbar = () => {
  const [genredata, setGenreData] = useState([]);
  const [showGenres, setShowGenres] = useState(false);
  const [showPopular, setShowPopular] = useState(false);
  const [showTypes, setShowTypes] = useState(false);
  const [searchbar, setSearchbar] = useState(false);
  const [name, setName] = useState([]);
  const [clicked, setClicked] = useState(false);
  const [userimage,setuserimage] = useState("https://photosraja.com/wp-content/uploads/2024/09/no-dp_40.webp")
  const userRef = useRef(null); 

  useEffect(() => {
    async function fetchGenres() {
      try {
        const response = await axios.get("genres/anime?swf=true");
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
        const response = await axios.get("https://anistack-1.onrender.com/user/getname", {
          headers: {
            authorization: token,
          },
        });
        setName(response.data.name);
        setuserimage(response.data.image)
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
  console.log(userimage)
  return (
    <div className="navs" onClick={() => setSearchbar(false)}>
     
      <div className="navbar"> 
        <div className="navbar-container">
          <Link to="/">
            <div className="navbar-left">
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
                    src={userimage}
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
                    src={userimage}
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
