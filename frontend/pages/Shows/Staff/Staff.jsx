import React, { useEffect, useState } from 'react'
import { useParams } from "react-router-dom";
import axios from "../../../services/axios";
import "./Staff.css"

const Staff = () => {
  const { id } = useParams();
  const [staffs, setstaffs] = useState([]);

  useEffect(() => {
    async function fetchstaffs() {
      try {
        const res = await axios.get(`/anime/${id}/staff`);
        setstaffs(res.data.data);
      } catch (err) {
        console.error("Error fetching staffs:", err);
      }
    }

    fetchstaffs();
  }, [id]);
  return (
    <div className='staffs-container'>
  {staffs.map((anime) => (
    <div key={anime.person.mal_id} className='staff-card'>
      <img
        src={anime.person.images.jpg.image_url}
        className='staff-image'
        alt={anime.person.name}
      />
      <div className='staff-name'>{anime.person.name}</div>
      <div className='staff-positions'>{anime.positions.join(', ')}</div>
    </div>
  ))}
</div>

  )
}

export default Staff