import React, { useRef, useEffect, useState } from "react";
import "./PlayVideo.css";
import like from "../../assets/like.png";
import profile from "../../assets/user_profile.jpg";
import dislike from "../../assets/dislike.png";
import check from "../../assets/check.png";
import bell from "../../assets/bell.png";
import save from "../../assets/save.png";
import { API_KEY, value_converter } from "../../data";
import loader from "../../assets/loading.gif";
import axios from "axios";
import moment from "moment";
import { useParams } from "react-router-dom";
import { db, auth } from "../../firebase";
import { doc, setDoc, deleteDoc, collection } from "firebase/firestore";

const PlayVideo = ({ user }) => {
  const [isInPlaylist, setIsInPlaylist] = useState(false);
  const observer = useRef();
  const lastCommentRef = useRef();
  const { videoId } = useParams();
  const [subscribed, setSubscribed] = useState(false);
  const [commentData, setCommentData] = useState([]);
  const [apiData, setApiData] = useState(null);
  const [showFullComments, setShowFullComments] = useState({});
  const [channelData, setChannelData] = useState(null);
  const [showFullDescription, setShowFullDescription] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [pageToken, setPageToken] = useState("");

  const fetchData = async (url, setter) => {
    try {
      const response = await axios.get(url);
      setter(response.data.items);
    } catch (error) {
      console.error("Something went wrong", error);
    }
  };

  useEffect(() => {
    fetchData(
      `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=${videoId}&key=${API_KEY}`,
      setApiData
    );
  }, [videoId]);

  useEffect(() => {
    if (apiData?.length) {
      fetchData(
        `https://youtube.googleapis.com/youtube/v3/channels?part=snippet%2CcontentDetails%2Cstatistics&id=${apiData[0].snippet.channelId}&key=${API_KEY}`,
        (data) => setChannelData(data[0])
      );
    }
  }, [apiData]);

  useEffect(() => {
    const fetchCommentData = async () => {
      setIsLoading(true);
      const commentDetailsUrl = `https://youtube.googleapis.com/youtube/v3/commentThreads?part=snippet%2Creplies&maxResults=10&videoId=${videoId}&key=${API_KEY}`;

      try {
        const response = await axios.get(commentDetailsUrl);
        if (response.data.items.length > 0) {
          const { items, nextPageToken } = response.data;
          setPageToken(nextPageToken);
          setCommentData(items);
          setIsLoading(false);
        } else {
          console.warn("No comments found");
        }
      } catch (error) {
        console.error("Something went wrong", error);
        setIsLoading(true);
      }
    };

    fetchCommentData();
  }, [videoId]);

  const loadMoreComments = async () => {
    setIsLoading(true);
    const commentDetailsUrl = `https://youtube.googleapis.com/youtube/v3/commentThreads?part=snippet%2Creplies&maxResults=10&videoId=${videoId}&key=${API_KEY}&pageToken=${pageToken}`;

    try {
      const response = await axios.get(commentDetailsUrl);
      if (response.data.items.length > 0) {
        const { items, nextPageToken } = response.data;
        setPageToken(nextPageToken);
        setCommentData((prevComments) => [...prevComments, ...items]);
        setIsLoading(false);
      } else {
        console.warn("No comments found");
      }
    } catch (error) {
      console.error("Something went wrong", error);
      setIsLoading(true);
    }
  };

  useEffect(() => {
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && window.innerWidth >= 900 && !isLoading) {
        loadMoreComments();
      }
    });

    if (lastCommentRef.current && window.innerWidth >= 900) {
      observer.current.observe(lastCommentRef.current);
    }

    return () => {
      if (lastCommentRef.current && window.innerWidth >= 900) {
        // eslint-disable-next-line
        observer.current.unobserve(lastCommentRef.current);
      }
    };
    // eslint-disable-next-line
  }, [isLoading]);

  const getDescription = () => {
    if (!apiData) return "Description Here...";
    const description = apiData[0].snippet.description;
    const isSmallScreen = window.innerWidth <= 450;
    const sliceLength = isSmallScreen ? 90 : 260;

    if (description.length === 0) return "No Description";
    return description.length > 200 && !showFullDescription
      ? `${description.slice(0, sliceLength)} ...more`
      : description;
  };

  const handleToggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  const handleClick = () => {
    setSubscribed((prevSubscribed) => !prevSubscribed);
  };

  const toggleComment = (commentId) => {
    setShowFullComments((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  const handleSubmitComment = (event) => {
    event.preventDefault();
    if (!newComment.trim()) return;
    const newCommentData = {
      snippet: {
        topLevelComment: {
          snippet: {
            textOriginal: newComment,
            authorDisplayName: "@" + user.displayName,
            authorProfileImageUrl: user.photoURL,
            publishedAt: new Date().toISOString(),
            likeCount: 0,
          },
        },
      },
      id: commentData.length + 1,
    };
    setCommentData([newCommentData, ...commentData]);
    setNewComment("");
  };

  useEffect(() => {
    const existingPlaylist = JSON.parse(localStorage.getItem("playlist")) || [];
    const index = existingPlaylist.findIndex(
      (video) => video.videoId === videoId
    );
    setIsInPlaylist(index !== -1);
  }, [videoId]);

  const addToPlaylist = async () => {
    if (apiData && apiData.length > 0 && auth.currentUser) {
      const userId = auth.currentUser.uid;
      const videoData = {
        videoId,
        title: apiData[0].snippet.title,
        channelTitle: apiData[0].snippet.channelTitle,
        viewCount: apiData[0].statistics.viewCount,
        publishedAt: apiData[0].snippet.publishedAt,
        thumbnail: apiData[0].snippet.thumbnails.medium.url,
        categoryId: apiData[0].snippet.categoryId,
      };

      const userDocRef = doc(db, "users", userId);
      const videoDocRef = doc(collection(userDocRef, "playlist"), videoId);
      const existingPlaylist =
        JSON.parse(localStorage.getItem("playlist")) || [];
      const index = existingPlaylist.findIndex(
        (video) => video.videoId === videoId
      );

      if (index !== -1) {
        existingPlaylist.splice(index, 1);
        setIsInPlaylist(false);
        await deleteDoc(videoDocRef);
      } else {
        existingPlaylist.push(videoData);
        setIsInPlaylist(true);
        await setDoc(videoDocRef, videoData);
      }

      localStorage.setItem("playlist", JSON.stringify(existingPlaylist));
      console.log(existingPlaylist);
    } else {
      console.error("API data is not available or user is not authenticated");
    }
  };

  return (
    <>
      <div className="play-video">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
          title="T"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        ></iframe>
        <h3>{apiData ? apiData[0].snippet.title : "Title Here..."}</h3>
        <div className="video-info">
          <div className="publisher">
            <img
              src={
                channelData ? channelData.snippet.thumbnails.default.url : ""
              }
              alt=""
            />
            <div>
              <p>
                {apiData ? apiData[0].snippet.channelTitle : "Channel Name"}
              </p>
              <span>
                {channelData
                  ? value_converter(channelData.statistics.subscriberCount)
                  : "1B"}{" "}
                Subscribers
              </span>
            </div>
            {subscribed ? (
              <button className="subscribed-button" onClick={handleClick}>
                <img src={bell} alt="" /> Subscribed
              </button>
            ) : (
              <button className="subscribe-button" onClick={handleClick}>
                Subscribe
              </button>
            )}
          </div>
          <div>
            <button>
              <img src={like} alt="" />{" "}
              {apiData
                ? value_converter(apiData[0].statistics.likeCount)
                : "1B"}
            </button>
            <button>
              <img src={dislike} alt="" />
            </button>
            <button className="save-btn" onClick={addToPlaylist}>
              {!isInPlaylist ? (
                <img src={save} alt="" />
              ) : (
                <img src={check} alt="" />
              )}
              Save
            </button>
          </div>
        </div>
        <div className="video-desc">
          <div className="information">
            <h5 onClick={handleToggleDescription}>
              {apiData
                ? value_converter(apiData[0].statistics.viewCount)
                : "1B"}{" "}
              views &bull;{" "}
              {apiData
                ? moment(apiData[0].snippet.publishedAt).fromNow()
                : "20 years ago"}
            </h5>
            <p onClick={handleToggleDescription}>{getDescription()}</p>
          </div>
          <h4>
            {apiData
              ? value_converter(apiData[0].statistics.commentCount)
              : "1B"}{" "}
            views Comments
          </h4>
          <form className="comment-form" onSubmit={handleSubmitComment}>
            <div className="add-comment">
              <img src={user.photoURL} alt="" />
              <input
                type="text"
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
            </div>
            <button type="submit">Comment</button>
          </form>
          {commentData.map((item, index) => {
            const snippet = item.snippet.topLevelComment.snippet;
            const commentId = item.id;
            const commentText = snippet.textOriginal;
            const isCommentFull = showFullComments[commentId];

            return (
              <div key={index} className="comments">
                <img src={snippet.authorProfileImageUrl || profile} alt="" />
                <div>
                  <h3>
                    {snippet.authorDisplayName}{" "}
                    <span>{moment(snippet.publishedAt).fromNow()}</span>
                  </h3>
                  <p>
                    {isCommentFull || commentText.length <= 250
                      ? commentText
                      : commentText.slice(0, 250) + "..."}
                    {commentText.length > 250 && (
                      <>
                        {!isCommentFull && (
                          <button
                            className="toggle"
                            onClick={() => toggleComment(commentId)}
                          >
                            Read More
                          </button>
                        )}
                        {isCommentFull && (
                          <button
                            className="toggle"
                            onClick={() => toggleComment(commentId)}
                          >
                            Show Less
                          </button>
                        )}
                      </>
                    )}
                  </p>
                  <div className="comment-action">
                    <img src={like} alt="" />
                    <span>{value_converter(snippet.likeCount)}</span>
                    <img src={dislike} alt="" />
                    <p>reply</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <hr id="line" />
        <div ref={lastCommentRef}>
          <img id="loader" src={loader} alt="" />
        </div>
      </div>
    </>
  );
};

export default PlayVideo;
