import React from "react";
import "./Notfound.css";

const Notfound = () => {
  return (
    <div className="notfound-container">
      <div className="notfound-content">
        <h1>404</h1>
        <h2>Oops! Page Not Found</h2>
        <p>The page you are looking for doesn’t exist or has been moved.</p>
        <a href="/" className="home-btn">Go Back Home</a>
      </div>
    </div>
  );
};

export default Notfound;
