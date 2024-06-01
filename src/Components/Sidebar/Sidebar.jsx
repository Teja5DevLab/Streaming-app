import React from "react";
import { logOut } from "../../firebase";
import logout from "../../assets/exit.png";
import { useNavigate } from "react-router-dom";
import "./Sidebar.css";
import megan from "../../assets/megan.png";
import save from "../../assets/save.png";
import ben from "../../assets/ben.jpg";
import dot from "../../assets/dot.png";
import youn from "../../assets/youn.jpg";
import ufc from "../../assets/ufc.jpg";
import shroud from "../../assets/shroud.jpg";
import nileblue from "../../assets/nileblue.jpg";
import nilered from "../../assets/nilered.jpg";
import arrow from "../../assets/right-arrow.png";
import { GrTechnology, GrBlog } from "react-icons/gr";
import { FiHome } from "react-icons/fi";
import { SlTrophy } from "react-icons/sl";
import { SiRimacautomobili } from "react-icons/si";
import { LuMusic4, LuNewspaper } from "react-icons/lu";
import { PiGameController, PiTelevision } from "react-icons/pi";

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
          <FiHome className="icons" />
          <p>Home</p>
        </div>
        <div
          className={`side_links ${category === 20 ? "active" : ""}`}
          onClick={() => setCategory(20)}
        >
          <PiGameController className="icons" />
          <p>Gaming</p>
        </div>
        <div
          className={`side_links ${category === 2 ? "active" : ""}`}
          onClick={() => setCategory(2)}
        >
          <SiRimacautomobili className="icons" />
          <p>AutoMobiles</p>
        </div>
        <div
          className={`side_links ${category === 17 ? "active" : ""}`}
          onClick={() => setCategory(17)}
        >
          <SlTrophy className="icons" />
          <p>Sports</p>
        </div>
        <div
          className={`side_links ${category === 24 ? "active" : ""}`}
          onClick={() => setCategory(24)}
        >
          <PiTelevision className="icons" />
          <p>Entertainment</p>
        </div>
        <div
          className={`side_links ${category === 28 ? "active" : ""}`}
          onClick={() => setCategory(28)}
        >
          <GrTechnology className="icons" />
          <p>Technology</p>
        </div>
        <div
          className={`side_links ${category === 10 ? "active" : ""}`}
          onClick={() => setCategory(10)}
        >
          <LuMusic4 className="icons" />
          <p>Music</p>
        </div>
        <div
          className={`side_links ${category === 22 ? "active" : ""}`}
          onClick={() => setCategory(22)}
        >
          <GrBlog className="icons" />
          <p>Blogs</p>
        </div>
        <div
          className={`side_links ${category === 25 ? "active" : ""}`}
          onClick={() => setCategory(25)}
        >
          <LuNewspaper className="icons" />
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
      <hr id="line2" />
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
