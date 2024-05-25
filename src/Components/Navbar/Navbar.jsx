import React, { useState } from "react";
import "./Navbar.css";
import menu from "../../assets/menu.png";
import logo from "../../assets/logo.png";
import search from "../../assets/search.png";
import save from "../../assets/save.png";
import notification from "../../assets/notification.png";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

const Navbar = ({ setSidebar, user }) => {
  const [searchQuery, setSearchQuery] = useSearchParams();
  const navigate = useNavigate();
  const [text, setText] = useState();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text) return;
    setSearchQuery(() => {
      searchQuery.set("search-query", text);

      return searchQuery;
    });
    navigate(`/results?${searchQuery}`, {
      replace: true,
    });
  };

  const goToPlaylist = () => {
    navigate("/playlist");
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
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <button type="submit">
              <img src={search} alt="" />
            </button>
          </div>
        </form>
      </div>
      <div className="navbar navright">
        <img className="save-btn" onClick={goToPlaylist} src={save} alt="" />
        <img src={notification} alt="" />
        <img className="user-icon" src={user.photoURL} alt="" />
      </div>
    </nav>
  );
};

export default Navbar;
