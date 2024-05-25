import React, { useState, useEffect } from "react";
import "./PlayList.css";
import { Link } from "react-router-dom";
import moment from "moment";
import { value_converter } from "../../data";
import Sidebar from "../../Components/Sidebar/Sidebar";
import cross from "../../assets/cross.png";
import { db, auth } from "../../firebase";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";

const Playlist = ({ sidebar }) => {
  const [playlist, setPlaylist] = useState([]);
  const [category, setCategory] = useState(0);

  useEffect(() => {
    const fetchPlaylist = async () => {
      if (auth.currentUser) {
        const userId = auth.currentUser.uid;
        const userDocRef = doc(db, "users", userId);
        const playlistCollectionRef = collection(userDocRef, "playlist");
        const querySnapshot = await getDocs(playlistCollectionRef);
        const playlistData = querySnapshot.docs.map((doc) => doc.data());
        setPlaylist(playlistData);
      }
    };

    fetchPlaylist();
  }, []);

  const removeFromPlaylist = async (videoId) => {
    if (auth.currentUser) {
      const userId = auth.currentUser.uid;
      const userDocRef = doc(db, "users", userId);
      const videoDocRef = doc(collection(userDocRef, "playlist"), videoId);

      const updatedPlaylist = playlist.filter(
        (video) => video.videoId !== videoId
      );
      setPlaylist(updatedPlaylist);
      localStorage.setItem("playlist", JSON.stringify(updatedPlaylist));
      await deleteDoc(videoDocRef);
    }
  };

  return (
    <>
      <Sidebar
        sidebar={sidebar}
        category={category}
        setCategory={setCategory}
      />
      <div className={`container ${sidebar ? "" : "large-container"}`}>
        <h1 id="large-playlist">Playlist</h1>
        <div
          className={playlist.length <= 3 ? "playlist-flex" : "playlist-grid"}
        >
          {playlist.length > 0 ? (
            playlist.map((video, index) => (
              <div key={index} className="card-container">
                <Link
                  to={`/video/${video.categoryId}/${video.videoId}`}
                  className="playlist-card"
                >
                  <img src={video.thumbnail} alt={video.title} />
                  <div className="video-details">
                    <h2>{video.title}</h2>
                    <h3>{video.channelTitle}</h3>
                    <p>
                      {value_converter(video.viewCount)} views &bull;{" "}
                      {moment(video.publishedAt).fromNow()}
                    </p>
                  </div>
                </Link>
                <button
                  className="remove-button"
                  onClick={() => removeFromPlaylist(video.videoId)}
                >
                  <img src={cross} alt="" />
                </button>
              </div>
            ))
          ) : (
            <p id="empty-playlist">Add videos</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Playlist;
