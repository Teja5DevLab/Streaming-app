import React from "react";
import axios from "axios";
import { useRef, useState, useEffect } from "react";
import moment from "moment";
import "./Feeds.css";
import { Link } from "react-router-dom";
import loader from "../../assets/loading.gif";
import { API_KEY, value_converter } from "../../data";

const Feeds = ({ category }) => {
  const [isLoading, setIsLoading] = useState(false);
  const observer = useRef();
  const lastCommentRef = useRef();
  const [data, setData] = useState([]);
  const [pageToken, setPageToken] = useState("");

  useEffect(() => {
    const fetchFeedsData = async () => {
      setIsLoading(true);
      const videoList_url = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&maxResults=25&regionCode=US&videoCategoryId=${category}&type=video&key=${API_KEY}`;
      try {
        const response = await axios.get(videoList_url);
        if (response.data.items.length > 0) {
          const { items, nextPageToken } = response.data;
          setPageToken(nextPageToken);
          setData(items);
          setIsLoading(false);
        } else {
          console.warn("No Feeds found");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(true);
      }
    };

    fetchFeedsData();
  }, [category]);

  const loadMoreFeeds = async () => {
    setIsLoading(true);
    const videoList_url = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&maxResults=25&regionCode=US&videoCategoryId=${category}&type=video&key=${API_KEY}&pageToken=${pageToken}`;
    try {
      const response = await axios.get(videoList_url);
      if (response.data.items.length > 0) {
        const { items, nextPageToken } = response.data;
        setPageToken(nextPageToken);
        setData((prevFeeds) => [...prevFeeds, ...items]);
        setIsLoading(false);
      } else {
        console.warn("No Feeds found ");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setIsLoading(true);
    }
  };
  useEffect(() => {
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !isLoading) {
        loadMoreFeeds();
      }
    });

    if (lastCommentRef.current) {
      observer.current.observe(lastCommentRef.current);
    }

    return () => {
      if (lastCommentRef.current) {
        // eslint-disable-next-line
        observer.current.unobserve(lastCommentRef.current);
      }
    };
    // eslint-disable-next-line
  }, [isLoading]);

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
      <div ref={lastCommentRef}>
        <img className="loader" src={loader} alt="" />
      </div>
    </div>
  ) : (
    <div>Loading...</div>
  );
};

export default Feeds;
