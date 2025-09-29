import React, { useState } from "react";
import "./Signin.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import googleimage from "../../Assets/google-image.png";
import {useGoogleLogin} from "@react-oauth/google"

const Signin = () => {
  const [mode, setMode] = useState("Sign In");
  const [user, setUser] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

 const responsegoogle = async (authResult) => {
  try {
    if (authResult.code) {
      const response = await axios.get(
        `https://anistack-1.onrender.com/user/google?code=${authResult.code}`
      );
      console.log(response.data.token);
      localStorage.setItem("auth-token", response.data.token);
      toast.success("Google login successful!");
      navigate("/");
    }
  } catch (error) {
    console.error(error);
    toast.error("Google login failed");
  }
};

const googlelogin = useGoogleLogin({
  onSuccess: responsegoogle,
  onError: responsegoogle,
  flow: "auth-code",
});

  const handleChange = (e) => {
    setUser((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async () => {
    const url = `https://anistack-1.onrender.com/user/${
      mode === "Sign In" ? "signin" : "login"
    }`;
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
        toast.success(`${mode} successful`, {
          position: "top-center", 
          duration: 3000,        
          style: { fontSize: "16px" },
          icon: "✅",
        });
        setTimeout(() =>{ navigate("/"); window.location.reload()}, 2000);
      } else {
        toast.error(`${mode} failed. Try again`, {
          position: "top-center",
          duration: 3000,
          style: { fontSize: "16px" },
          icon: "❌",
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong", {
        position: "top-center",
        duration: 3000,
        style: { fontSize: "16px" },
        icon: "❌",
      });
    }
  };

  const toggleMode = () => {
    setMode(mode === "Sign In" ? "Log In" : "Sign In");
    setUser({ name: "", email: "", password: "" });
  };

  return (
    <div className="login-container">
      {/* Toast container */}
      <Toaster 
        position="top-right" 
        reverseOrder={false} 
        toastOptions={{
          duration: 3000,
          style: { fontSize: "16px" },
        }}
      />

      <div className="login-box">
        <h3 className="title">{mode}</h3>
        <div className="form">
          {mode === "Sign In" && (
            <div className="form-group">
              <input
                name="name"
                type="text"
                placeholder="Username"
                value={user.name}
                onChange={handleChange}
              />
            </div>
          )}
          <div className="form-group">
            <input
              name="email"
              type="email"
              placeholder="Email address"
              value={user.email}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <input
              name="password"
              type="password"
              placeholder="Password"
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
            <div>
              <div className="with-google" onClick={googlelogin} >
                <img className="google-image" src={googleimage} alt="" />
                <p>Continue with Google</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signin;
