import React from "react";
import "./Sidebar.css";
import home from "../../assets/home.png";
import megan from "../../assets/megan.png";
import entertainment from "../../assets/entertainment.png";
import game_icon from "../../assets/game_icon.png";
import music from "../../assets/music.png";
import blogs from "../../assets/blogs.png";
import news from "../../assets/news.png";
import save from "../../assets/save.png";
import ben from "../../assets/ben.jpg";
import dot from "../../assets/dot.png";
import youn from "../../assets/youn.jpg";
import ufc from "../../assets/ufc.jpg";
import shroud from "../../assets/shroud.jpg";
import nileblue from "../../assets/nileblue.jpg";
import nilered from "../../assets/nilered.jpg";
import tech from "../../assets/tech.png";
import arrow from "../../assets/right-arrow.png";
import sports from "../../assets/sports.png";
import automobile_icon from "../../assets/automobiles.png";
import { logOut } from "../../firebase";
import logout from "../../assets/exit.png";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ sidebar, category, setCategory }) => {
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await logOut();
    } catch (error) {
      console.error("Error logging out", error);
    }
  };

  const goToPlaylist = () => {
    navigate("/playlist");
  };

  const currentYear = new Date().getFullYear();

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
      <div className="you-wrap">
        <h3>
          You <img src={arrow} alt="" />
        </h3>
        {sidebar ? (
          <button id="logout" onClick={handleLogout}>
            <img src={logout} alt="Logout" />
            Logout
          </button>
        ) : (
          <img
            id="logout-image"
            onClick={handleLogout}
            src={logout}
            alt="Logout"
          />
        )}
        {sidebar ? (
          <button id="logout" className="play" onClick={goToPlaylist}>
            <img src={save} alt="Playlist" />
            Playlist
          </button>
        ) : (
          <img
            id="logout-image"
            onClick={goToPlaylist}
            src={save}
            alt="Playlist"
          />
        )}
      </div>
      <hr id="line1" />
      <div className="subscribed">
        <h3>Subscriptions</h3>
        <div className="side_links">
          <img src={ben} alt="" />
          <p>
            Ben <img src={dot} alt="" />
          </p>
        </div>
        <div className="side_links">
          <img src={ufc} alt="" />
          <p>
            UFC <img src={dot} alt="" />
          </p>
        </div>
        <div className="side_links">
          <img src={youn} alt="" />
          <p>
            Dr. Youn <img src={dot} alt="" />
          </p>
        </div>
        <div className="side_links">
          <img src={shroud} alt="" />
          <p>
            Shroud <img src={dot} alt="" />
          </p>
        </div>
        <div className="side_links">
          <img src={nileblue} alt="" />
          <p>
            NileBlue <img src={dot} alt="" />
          </p>
        </div>
        <div className="side_links">
          <img src={nilered} alt="" />
          <p>
            NileRed <img src={dot} alt="" />
          </p>
        </div>
        <div className="side_links">
          <img src={megan} alt="" />
          <p>
            Craft <img src={dot} alt="" />
          </p>
        </div>
        <div className="side_links">
          <img id="arrow" src={arrow} alt="" />
          <p>Show More</p>
        </div>
      </div>
      <hr id="line1" />
      <div className="side_footer_wrap">
        <div className="side_footer">
          <p>About</p>
          <p>Press</p>
          <p>Copyright</p>
          <p>Contact us</p>
          <p>Creator</p>
          <p>Advertise</p>
          <p>Developer</p>
        </div>
        <div className="side_footer">
          <p>Terms</p>
          <p>Privacy</p>
          <p>Policy & Safety</p>
          <p>How YouTube works</p>
          <p>Test new features</p>
        </div>
        <p id="copyright">&copy; {currentYear} Tejas Agrawal</p>
      </div>
    </div>
  );
};

export default Sidebar;
