import React, { useState, useEffect } from "react";
import "./Recommended.css";
import axios from "axios";
import { API_KEY } from "../../data";
import { value_converter } from "../../data";
import moment from "moment";
import { Link } from "react-router-dom";

const Recommended = ({ categoryId }) => {
  const [recommendedData, setRecommendedData] = useState([]);

  useEffect(() => {
    const fetchRecommendedData = async () => {
      const recommendedDetailsUrl = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&maxResults=21&regionCode=US&videoCategoryId=${categoryId}&key=${API_KEY}`;

      try {
        const response = await axios.get(recommendedDetailsUrl);
        if (response.data.items.length > 0) {
          setRecommendedData(response.data.items);
        } else {
          console.warn("No comments found for video with ID:", categoryId);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchRecommendedData();
  }, [categoryId]);

  const shortenTitle = (title, maxLength) => {
    if (title.length > maxLength) {
      return title.substring(0, maxLength) + "...";
    }
    return title;
  };

  return recommendedData ? (
    <div className="recommended">
      {recommendedData.map((item, index) => {
        return (
          <Link to={`/video/${item.snippet.categoryId}/${item.id}`} key={index} className="side-video">
            <img src={item.snippet.thumbnails.medium.url} alt="" />
            <div className="side-vid-info">
              <h4>{shortenTitle(item.snippet.title, 70)}</h4>
              <p>{item.snippet.channelTitle}</p>
              <p>{value_converter(item.statistics.viewCount)} views &bull; {moment(item.snippet.publishedAt).fromNow()}</p>
            </div>
          </Link>
        );
      })}
    </div>
  ) : (
    <div>Loading...</div>
  );
};

export default Recommended;
