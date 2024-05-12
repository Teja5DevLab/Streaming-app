import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import moment from "moment";
import "./Feeds.css";
import { Link } from "react-router-dom";
import { API_KEY, value_converter } from "../../data";

const Feeds = ({ category }) => {
  const [data, setData] = useState([]);
  const fetchData = () => {
    const videoList_url = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&maxResults=50&regionCode=US&videoCategoryId=${category}&key=${API_KEY}`;
    axios
      .get(videoList_url)
      .then((response) => setData(response.data.items))
      .catch((error) => console.error("Error fetching data:", error));
  };
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [category]);

  return data ? (
    <div className="feed">
      {data.map((item, index) => {
        return (
          <Link
            key={index}
            to={`video/${item.snippet.categoryId}/${item.id}`}
            className="card"
          >
            <img src={item.snippet.thumbnails.medium.url} alt="" />
            <h2>{item.snippet.title}</h2>
            <h3>{item.snippet.channelTitle}</h3>
            <p>
              {value_converter(item.statistics.viewCount)} &bull;{" "}
              {moment(item.snippet.publishedAt).fromNow()}
            </p>
          </Link>
        );
      })}
    </div>
  ) : (
    <div>loading...</div>
  );
};

export default Feeds;
