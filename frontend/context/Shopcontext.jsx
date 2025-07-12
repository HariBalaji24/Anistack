import React, { createContext, useState } from "react";

export const Shopcontext = createContext(null);

const Shopcontextprovider = (props) => {
  const [animeClicks, setAnimeClicks] = useState({});
  const [mangaClicks, setMangaClicks] = useState({});

  function addanime(clicked) {
    if (localStorage.getItem("auth-token")) {
      fetch("http://localhost:3000/addanime", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": `${localStorage.getItem("auth-token")}`,
        },
        body: JSON.stringify({ clicked }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          setAnimeClicks((prev) => ({
            ...prev,
            [clicked]: (prev[clicked] || 0) + 1,
          }));
        })
        .catch((err) => console.error("Error adding to anime:", err));
    }
  }

  function addmanga(clicked) {
    if (localStorage.getItem("auth-token")) {
      fetch("http://localhost:3000/addmanga", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": `${localStorage.getItem("auth-token")}`,
        },
        body: JSON.stringify({ clicked }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          setMangaClicks((prev) => ({
            ...prev,
            [clicked]: (prev[clicked] || 0) + 1,
          }));
        })
        .catch((err) => console.error("Error adding to manga:", err));
    }
  }

  const contextvalue = {
    addanime,
    addmanga,
    animeClicks,
    mangaClicks,
  };

  return (
    <Shopcontext.Provider value={contextvalue}>
      {props.children}
    </Shopcontext.Provider>
  );
};

export default Shopcontextprovider;
