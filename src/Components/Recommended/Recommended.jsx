import React, { useRef, useState, useEffect } from "react";
import "./Recommended.css";
import axios from "axios";
import { API_KEY } from "../../data";
import { value_converter } from "../../data";
import moment from "moment";
import loader from "../../assets/loading.gif";
import { Link } from "react-router-dom";

const Recommended = ({ categoryId }) => {
  const observer = useRef();
  const lastCommentRef = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const [pageToken, setPageToken] = useState("");
  const [recommendedData, setRecommendedData] = useState([]);
  const [error, setError] = useState(null);

  const fetchRecommendedData = async () => {
    setIsLoading(true);
    const recommendedDetailsUrl = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&maxResults=15&regionCode=US&videoCategoryId=${categoryId}&type=video&key=${API_KEY}`;
    try {
      const response = await axios.get(recommendedDetailsUrl);
      if (response.data.items.length > 0) {
        const { items, nextPageToken } = response.data;
        setPageToken(nextPageToken);
        setRecommendedData(items);
        setIsLoading(false);
      } else {
        console.warn("No Feeds found");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Something went wrong");
      setIsLoading(true);
    }
  };

  const loadMoreRecommendations = async () => {
    setIsLoading(true);
    const recommendedDetailsUrl = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&maxResults=15&regionCode=US&videoCategoryId=${categoryId}&type=video&key=${API_KEY}&pageToken=${pageToken}`;
    try {
      const response = await axios.get(recommendedDetailsUrl);
      if (response.data.items.length > 0) {
        const { items, nextPageToken } = response.data;
        setPageToken(nextPageToken);
        setRecommendedData((prevRecommendation) => [
          ...prevRecommendation,
          ...items,
        ]);
        setIsLoading(false);
      } else {
        console.warn("No Recommendations found ");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setIsLoading(true);
    }
  };

  useEffect(() => {
    fetchRecommendedData();
    // eslint-disable-next-line
  }, [categoryId]);

  useEffect(() => {
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !isLoading) {
        loadMoreRecommendations();
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

  const shortenTitle = (title, maxLength) => {
    if (title.length > maxLength) {
      return title.substring(0, maxLength) + "...";
    }
    return title;
  };

  return (
    <>
      {error && (
        <div className={`error-message ${error ? "show" : ""}`}>{error}</div>
      )}
      {recommendedData ? (
        <div className="recommended">
          <h3>{error ? "" : "Related Videos"}</h3>
          {recommendedData.map((item, index) => {
            return (
              <Link
                to={`/video/${item.snippet.categoryId}/${item.id}`}
                key={index}
                className="side-video"
              >
                <img src={item.snippet.thumbnails.medium.url} alt="" />
                <div className="side-vid-info">
                  <h4>{shortenTitle(item.snippet.title, 70)}</h4>
                  <p>{item.snippet.channelTitle}</p>
                  <p>
                    {value_converter(item.statistics.viewCount)} views &bull;{" "}
                    {moment(item.snippet.publishedAt).fromNow()}
                  </p>
                </div>
              </Link>
            );
          })}
          <div ref={lastCommentRef}>
            {error ? "" : <img className="loader" src={loader} alt="" />}
          </div>
        </div>
      ) : (
        <div></div>
      )}
    </>
  );
};

export default Recommended;
