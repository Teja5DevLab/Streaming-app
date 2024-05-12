import React from "react";
import "./Sidebar.css";
import home from "../../assets/home.png";
import tom from "../../assets/tom.png";
import megan from "../../assets/megan.png";
import entertainment from "../../assets/entertainment.png";
import game_icon from "../../assets/game_icon.png";
import music from "../../assets/music.png";
import blogs from "../../assets/blogs.png";
import cameron from "../../assets/cameron.png";
import simon from "../../assets/simon.png";
import jack from "../../assets/jack.png";
import news from "../../assets/news.png";
import tech from "../../assets/tech.png";
import sports from "../../assets/sports.png";
import automobile_icon from "../../assets/automobiles.png";

const Sidebar = ({ sidebar, category, setCategory }) => {
  return (
    <div className={`sidebar ${sidebar ? "" : "small-sidebar"}`}>
      <div className="shortcut-links">
        <div
          className={`side_links ${category === 0 ? "active" : ""}`}
          onClick={() => setCategory(0)}
        >
          <img src={home} alt="1." />
          <p>Home</p>
        </div>
        <div
          className={`side_links ${category === 20 ? "active" : ""}`}
          onClick={() => setCategory(20)}
        >
          <img src={game_icon} alt="2." />
          <p>Gaming</p>
        </div>
        <div
          className={`side_links ${category === 2 ? "active" : ""}`}
          onClick={() => setCategory(2)}
        >
          <img src={automobile_icon} alt="3." />
          <p>AutoMobiles</p>
        </div>
        <div
          className={`side_links ${category === 17 ? "active" : ""}`}
          onClick={() => setCategory(17)}
        >
          <img src={sports} alt="4." />
          <p>Sports</p>
        </div>
        <div
          className={`side_links ${category === 24 ? "active" : ""}`}
          onClick={() => setCategory(24)}
        >
          <img src={entertainment} alt="5." />
          <p>Entertainment</p>
        </div>
        <div
          className={`side_links ${category === 28 ? "active" : ""}`}
          onClick={() => setCategory(28)}
        >
          <img src={tech} alt="6." />
          <p>Technology</p>
        </div>
        <div
          className={`side_links ${category === 10 ? "active" : ""}`}
          onClick={() => setCategory(10)}
        >
          <img src={music} alt="7." />
          <p>Music</p>
        </div>
        <div
          className={`side_links ${category === 22 ? "active" : ""}`}
          onClick={() => setCategory(22)}
        >
          <img src={blogs} alt="8." />
          <p>Blogs</p>
        </div>
        <div
          className={`side_links ${category === 25 ? "active" : ""}`}
          onClick={() => setCategory(25)}
        >
          <img src={news} alt="9." />
          <p>News</p>
        </div>
        <hr />
      </div>
      <div className="subscribed">
        <h3>Subscriptions</h3>
        <div className="side_links">
          <img src={jack} alt="" />
          <p>PewDiePie</p>
        </div>
        <div className="side_links">
          <img src={tom} alt="" />
          <p>Justine Bieber</p>
        </div>
        <div className="side_links">
          <img src={megan} alt="" />
          <p>5-Minute Crafts</p>
        </div>
        <div className="side_links">
          <img src={cameron} alt="" />
          <p>Nas Daily</p>
        </div>
        <div className="side_links">
          <img src={simon} alt="" />
          <p>Mr Beast</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
