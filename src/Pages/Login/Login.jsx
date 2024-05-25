import React from "react";
import "./Login.css";
import logo from "../../assets/logo.png";
import { signInWithGoogle } from "../../firebase";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await signInWithGoogle();
      navigate("/");
    } catch (error) {
      console.error("Error logging in with Google", error);
    }
  };

  return (
    <div className="full-body">
      <div className="login-container">
        <div className="login-box">
          <img src={logo} alt="Logo" className="logo" />
          <h2>Stream Your Favorites</h2>
          <p>Join us today and dive into endless entertainment</p>
          <button onClick={handleLogin} className="google-button">
            Sign up with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
