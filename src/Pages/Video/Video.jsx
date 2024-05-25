import React from "react";
import "./Video.css";
import PlayVideo from "../../Components/PlayVideo/PlayVideo";
import Recommended from "../../Components/Recommended/Recommended";
import { useParams } from "react-router-dom";

const Video = ({user}) => {
  const { videoId, categoryId } = useParams();

  return (
    <div className="play-container">
      <PlayVideo videoId={videoId} user={user} />
      <Recommended categoryId={categoryId} />
    </div>
  );
};

export default Video;
