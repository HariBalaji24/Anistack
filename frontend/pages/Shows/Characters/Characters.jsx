import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import axios from "../../../services/axios";
import "./Characters.css"

const Characters = () => {
  const { id } = useParams();
  const [characters, setCharacters] = useState([]);
  const location = useLocation();
  const isManga = location.pathname.includes("/manga/");
  useEffect(() => {
    async function fetchCharacters() {
      try {
        const res = await axios.get(`${isManga ? "/manga" : "/anime"}/${id}/characters`);
        setCharacters(res.data.data);
      } catch (err) {
        console.error("Error fetching characters:", err);
      }
    }

    fetchCharacters();
  }, [id]);

  return (
    <div className="character-container">
      <div className="character-grid">
        {characters.map((char) => {
          const japaneseVA = char.voice_actors?.find(va => va.language === "Japanese");

          return (
            <div key={char.character.mal_id} className="character-rectangle">
            <div className="character-left">
              {
                char.character.images.jpg.image_url===null ?<img src="https://cdn.myanimelist.net/images/questionmark_23.gif?s=f7dcbc4a4603d18356d3dfef8abd655c" alt={char.character.name} className="character-img" /> :<img src={char.character.images.jpg.image_url} alt={char.character.name} className="character-img" />
              }
              
              <div className="character-namebox">
                <div className="character-name">{char.character.name}</div>
              <div className="character-role">Role : {char.role}</div>
              {
                !isManga && (<div className="character-fav">Favourites : {char.favorites}</div>)
              }
              
              </div>
              
            </div>
          
            {japaneseVA && (
              <div className="va-right">
                <div className="voice-namebox">
                  <div className="va-name">{japaneseVA.person.name}</div>
                  <div className="va-language">Japanese</div>
                </div>
                <img src={japaneseVA.person.images.jpg.image_url} alt={japaneseVA.name} className="va-img" />
                
                
              </div>
            )}
          </div>
          
          );
        })}
      </div>
    </div>
  );
};

export default Characters;
