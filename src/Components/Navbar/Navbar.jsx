// Navbar.jsx
import React, { useState } from "react";
import "./Navbar.css";
import menu from "../../assets/menu.png";
import logo from "../../assets/logo.png";
import search from "../../assets/search.png";
import upload from "../../assets/upload.png";
import more from "../../assets/more.png";
import notification from "../../assets/notification.png";
import profile from "../../assets/jack.png";
import { Link } from "react-router-dom";

const Navbar = ({ setSidebar, handleSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSearch(searchQuery);
    setSearchQuery("");
  };

  return (
    <nav className="navbar">
      <div className="navbar navleft">
        <img
          className="menu-icon"
          onClick={() => setSidebar((prev) => !prev)}
          src={menu}
          alt=""
        />
        <Link to="/">
          <img className="logo" src={logo} alt="" />
        </Link>
      </div>
      <div className="navbar navmiddle">
        <form onSubmit={handleSubmit}>
          <div className="search-box">
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit">
              <img src={search} alt="" />
            </button>
          </div>
        </form>
      </div>
      <div className="navbar navright">
        <img src={upload} alt="" />
        <img src={more} alt="" />
        <img src={notification} alt="" />
        <img className="user-icon" src={profile} alt="" />
      </div>
    </nav>
  );
};

export default Navbar;
