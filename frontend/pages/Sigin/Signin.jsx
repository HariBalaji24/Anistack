import React, { useState } from "react";
import "./Signin.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Signin = () => {
  const [mode, setMode] = useState("Sign In");
  const [user, setUser] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUser((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async () => {
    const url = `http://localhost:3000/user/${mode === "Sign In" ? "signin" : "login"}`;
    const payload = {
      email: user.email,
      password: user.password,
      ...(mode === "Sign In" && { name: user.name }),
    };

    try {
      const response = await axios.post(url, payload, {
        headers: { "Content-Type": "application/json" },
      });

      const data = response.data;

      if (data.success && data.token) {

        localStorage.setItem("auth-token", data.token);
        navigate("/");
        window.location.reload()
      } else {
        alert("Login/Register failed");
      }
    } catch (error) {
      alert(error.response?.data?.message);
    }
  };

  const toggleMode = () => {
    setMode(mode === "Sign In" ? "Log In" : "Sign In");
    setUser({ name: "", email: "", password: "" });
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h3 className="title">{mode}</h3>
        <div className="form">
          {mode === "Sign In" && (
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                name="name"
                type="text"
                placeholder="Enter your name"
                value={user.name}
                onChange={handleChange}
              />
            </div>
          )}
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              name="email"
              type="email"
              placeholder="Enter your email"
              value={user.email}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              name="password"
              type="password"
              placeholder="Enter your password"
              value={user.password}
              onChange={handleChange}
            />
          </div>
          <button className="submit-button" onClick={handleSubmit}>
            {mode}
          </button>
          <div className="toggle-section">
            <span>
              {mode === "Sign In"
                ? "Already have an account ?"
                : "Don't have an account ?"}
            </span>
            <span onClick={toggleMode} className="toggle-link">
              {mode === "Sign In" ? " Log In" : " Sign In"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signin;
