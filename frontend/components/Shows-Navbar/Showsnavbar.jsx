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
          <Link to={""} ><div >Overview</div></Link>
          <Link to={`seasons`} ><div >Relations</div></Link>
          <Link to={"characters"}><div >Characters</div></Link>
          {  !isManga && (<Link to={"staffs" }><div >Staffs</div></Link>) }
          <Link to={"images"} ><div >Images</div></Link>
          <Link to={"recommendations"} ><div>Recommendations</div></Link>
          {!isManga && (<Link to={"trailers"} ><div>Trailers</div></Link>)}
          
        </div>
        </div>
       
        
  
  
  
      <Outlet/>
      </div>
    );
  };
  
  

export default Showsnavbar