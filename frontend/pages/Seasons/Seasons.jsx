import React, { useEffect, useState } from 'react';
import { Link, Outlet, useLocation, useParams } from 'react-router-dom';
import axios from '../../services/axios';
import './Seasons.css';
import "../Popularanime/Popular.css";

const extractBaseTitle = (title) => {
  if (!title) return "";

  let base = title.split(":")[0];

  const suffixes = ["season", "part", "arc", "final", "the movie", "manga"];
  for (let suffix of suffixes) {
    const regex = new RegExp(`\\b${suffix}\\b.*`, "i");
    base = base.replace(regex, "").trim();
  }

  const words = base.trim().split(/\s+/);
  return words.slice(0, 3).join(" ");
};

const Seasons = () => {
  const location = useLocation();
  const isManga = location.pathname.includes("/manga/");
  console.log(isManga)
  const { id } = useParams();
  const [relatedWorks, setRelatedWorks] = useState([]);
  const [animeTitle, setAnimeTitle] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    async function fetchFranchise() {
      try {
        const animeRes = await axios.get(`${isManga ? "/manga" : "/anime"}/${id}`);
        const anime = animeRes.data.data;
        setAnimeTitle(anime.title);

        const titleVariants = [anime.title, anime.title_english, anime.title_japanese]
          .filter(Boolean)
          .map(extractBaseTitle);

        const searchTerm = titleVariants[0];

        const [animeSearch, mangaSearch] = await Promise.all([
          axios.get(`/anime?q=${encodeURIComponent(searchTerm)}&limit=24`),
          axios.get(`/manga?q=${encodeURIComponent(searchTerm)}&limit=24`)
        ]);

        const combined = [...animeSearch.data.data, ...mangaSearch.data.data];

        const matches = combined.filter(entry => {
          const fullTitle = `${entry.title} ${entry.title_english ?? ""} ${entry.title_japanese ?? ""}`.toLowerCase();
          return titleVariants.some(variant => fullTitle.includes(variant.toLowerCase()));
        });

        const uniqueWorks = Array.from(new Map(matches.map(item => [item.mal_id, item])).values());
        setRelatedWorks(uniqueWorks);
        setTotalPages(Math.ceil(uniqueWorks.length / 24));
      } catch (err) {
        console.log("Error fetching franchise:", err);
      }
    }

    fetchFranchise();
  }, [id]);

  const paginatedWorks = relatedWorks.slice((page - 1) * 24, page * 24);

  return (
    <div>
      <div className='popular-card'>
        <div className='popular-card-container'>
          {paginatedWorks.map((item) => (
            <Link to={`${item.type==="Manga" ? "/manga" : "/anime"}/${item.mal_id}`} key={item.mal_id}>
              <div className='popular-card-elements'>
                <div className='popular-card-card1'>
                  <span className='popular-card-type'>{item.type}</span>
                  <img className='popular-card-image' src={item.images.jpg.large_image_url} alt={item.title} />
                  <h3 className='popular-card-title'>{item.title_english || item.title}</h3>
                  <div className="popular-card-card2">
                    <h3 className='popular-card-status'>Status: {item.status || "Unknown"}</h3>
                    <h3 className='popular-card-episodes'>
                      {item.type === "Manga" ? "Chapters" : "Episodes"}: {item.episodes ?? item.chapters ?? "Unknown"}
                    </h3>
                    <h3 className='popular-card-score'>Score: {item.score != null ? (item.score/2).toFixed(1) : "Not Rated"}</h3>
                    <h3 className='popular-card-genres'>
                      Genres: {item.genres?.length > 0 ? item.genres.map(g => g.name).join(", ") : "N/A"}
                    </h3>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className='popular-card-palignation'>
          <button disabled={page === 1} className='popular-card-previous' onClick={() => setPage(page - 1)}>Previous</button>
          {[...Array(Math.min(totalPages, 7))].map((_, i) => {
            const pageNum = Math.max(1, page - 3) + i;
            if (pageNum <= totalPages) {
              return (
                <button
                  key={pageNum}
                  className={`popular-card-pagebtn ${page === pageNum ? 'active' : ''}`}
                  onClick={() => setPage(pageNum)}
                >
                  {pageNum}
                </button>
              );
            }
            return null;
          })}
          <button disabled={page === totalPages} className='popular-card-next' onClick={() => setPage(page + 1)}>Next</button>
        </div>
      </div>
      <Outlet />
    </div>
  );
};

export default Seasons;
