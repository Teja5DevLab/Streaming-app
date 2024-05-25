import React, { useRef, useState, useEffect } from "react";
import "./SearchResults.css";
import axios from "axios";
import { Link, useSearchParams } from "react-router-dom";
import moment from "moment";
import { API_KEY } from "../../data";
import loader from "../../assets/loading.gif";
import Sidebar from "../../Components/Sidebar/Sidebar";
import { ProgressBar } from "../../Components/ProgressBar/ProgressBar";

const SearchResults = ({ sidebar }) => {
  const [searchParams] = useSearchParams();
  const [category, setCategory] = useState(0);
  const [searchResults, setSearchResults] = useState([]);
  const observer = useRef();
  const lastCommentRef = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const [pageToken, setPageToken] = useState("");

  const query = searchParams.get("search-query") || "";

  useEffect(() => {
    const fetchSearchData = async () => {
      setIsLoading(true);
      const searchVideoList_url = `https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=12&q=${query}&type=video&key=${API_KEY}`;
      try {
        const response = await axios.get(searchVideoList_url);
        if (response.data.items.length > 0) {
          const { items, nextPageToken } = response.data;
          setPageToken(nextPageToken);
          setSearchResults(items);
          setIsLoading(false);
        } else {
          console.warn("No Feeds found");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(true);
      }
    };

    fetchSearchData();
  }, [query]);

  const loadMoreSearchResults = async () => {
    setIsLoading(true);
    const recommendedDetailsUrl = `https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=12&q=${query}&type=video&key=${API_KEY}&pageToken=${pageToken}`;

    try {
      const response = await axios.get(recommendedDetailsUrl);
      if (response.data.items.length > 0) {
        const { items, nextPageToken } = response.data;
        setPageToken(nextPageToken);
        setSearchResults((prevSearchResults) => [
          ...prevSearchResults,
          ...items,
        ]);
        setIsLoading(false);
      } else {
        console.warn("No SearchResult found ");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setIsLoading(true);
    }
  };

  useEffect(() => {
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !isLoading) {
        loadMoreSearchResults();
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

  return searchResults ? (
    <>
      <ProgressBar isLoading={isLoading} />
      <Sidebar
        sidebar={sidebar}
        category={category}
        setCategory={setCategory}
      />
      <div className={`container ${sidebar ? "" : "large-container"}`}>
        <div className="search-results">
          {searchResults.map((result, index) => (
            <Link
              key={index}
              to={`/video/13/${result.id.videoId}`}
              className="search-item"
            >
              <div>
                <img
                  src={result.snippet.thumbnails.medium.url}
                  alt={result.snippet.title}
                />
              </div>
              <div className="search-item-details">
                <h3>{result.snippet.title}</h3>
                <p>{moment(result.snippet.publishedAt).fromNow()}</p>
                <p>{result.snippet.channelTitle}</p>
                <h5>{result.snippet.description}</h5>
              </div>
            </Link>
          ))}
        </div>
        <div ref={lastCommentRef}>
          <img className="loader" src={loader} alt="" />
        </div>
      </div>
    </>
  ) : (
    <div></div>
  );
};

export default SearchResults;
