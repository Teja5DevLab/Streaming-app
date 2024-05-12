import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import moment from "moment";
import { API_KEY } from "../../data";

const SearchResults = ({ sidebar }) => {
  const { query } = useParams();
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        const response = await axios.get(
          `https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=25&q=${query}&key=${API_KEY}`
        );
        setSearchResults(response.data.items);
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    };

    fetchSearchResults();
  }, [query]);

  console.log(searchResults);

  return searchResults ? (
    <div className="search-results">
      {searchResults.map((result, index) => (
        <Link
          key={index}
          to={`/video/13/${result.id.videoId}`}
          className="search-item"
        >
          <img
            src={result.snippet.thumbnails.medium.url}
            alt={result.snippet.title}
          />
          <div className="search-item-details">
            <h2>{result.snippet.title}</h2>
            <p>{result.snippet.channelTitle}</p>
            <p> {moment(result.snippet.publishedAt).fromNow()}</p>
          </div>
        </Link>
      ))}
    </div>
  ) : (
    <div>Loading...</div>
  );
};

export default SearchResults;
