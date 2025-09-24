import React, { useEffect, useState } from 'react';
import { Link, Outlet, useLocation, useParams } from 'react-router-dom';
import axios from '../../services/axios';
import "./Showsnavbar.css"

const Showsnavbar = () => {
    const { id} = useParams();
    const location = useLocation()
    const isManga = location.pathname.includes("/manga")

   
    
    
  
  
    return (
      <div className='shows-container'>
        <div className="shows-navbar-container1"> 
          <div className="shows-navbar">
          <Link to={""} ><div className='individual'>Overview</div></Link>
          <Link to={`seasons`} className='individual' ><div >Relations</div></Link>
          <Link to={"characters"}><div className='individual' >Characters</div></Link>
          {  !isManga && (<Link to={"staffs" }><div className='individual' >Staffs</div></Link>) }
          <Link to={"images"} ><div className='individual' >Images</div></Link>
          <Link to={"recommendations"} ><div className='individual'>Recommendations</div></Link>
          {!isManga && (<Link to={"trailers"}  className='individual'><div>Trailers</div></Link>)}
          
        </div>
        </div>
       
        
  
  
  
      <Outlet/>
      </div>
    );
  };
  
  

export default Showsnavbar