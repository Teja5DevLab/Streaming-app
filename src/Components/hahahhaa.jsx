import React, { useEffect, useState } from "react";
import "./PlayVideo.css";
import like from "../../assets/like.png";
import profile from "../../assets/jack.png";
import dislike from "../../assets/dislike.png";
import share from "../../assets/share.png";
import bell from "../../assets/bell.png";
import download from "../../assets/download.png";
import { API_KEY, value_converter } from "../../data";
import axios from "axios";
import moment from "moment";
import { useParams } from "react-router-dom";

const PlayVideo = () => {
  const { videoId } = useParams();
  const [subscribed, setSubscribed] = useState(false);
  const [commentData, setCommentData] = useState([]);
  const [apiData, setApiData] = useState(null);
  const [showFullComments, setShowFullComments] = useState({});
  const [channelData, setChannelData] = useState(null);
  const [showFullDescription, setShowFullDescription] = useState(null);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    const fetchVideoData = async () => {
      const videoDetailsUrl = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=${videoId}&key=${API_KEY}`;

      try {
        const response = await axios.get(videoDetailsUrl);
        setApiData(response.data.items);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchVideoData();
  }, [videoId]);

  useEffect(() => {
    if (!apiData?.length) return;
    const fetchChannelData = async () => {
      const channelDetailsUrl = `https://youtube.googleapis.com/youtube/v3/channels?part=snippet%2CcontentDetails%2Cstatistics&id=${apiData[0].snippet.channelId}&key=${API_KEY}`;

      try {
        const response = await axios.get(channelDetailsUrl);
        setChannelData(response.data.items[0]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchChannelData();
  }, [apiData]);

  useEffect(() => {
    const fetchCommentData = async () => {
      const commentDetailsUrl = `https://youtube.googleapis.com/youtube/v3/commentThreads?part=snippet%2Creplies&maxResults=12&videoId=${videoId}&key=${API_KEY}`;

      try {
        const response = await axios.get(commentDetailsUrl);
        if (response.data.items.length > 0) {
          setCommentData(response.data.items);
        } else {
          console.warn("No comments found for video with ID:", videoId);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchCommentData();
  }, [videoId]);

  const getDescription = () => {
    if (!apiData) return "Description Here...";
    const description = apiData[0].snippet.description;
    if (description.length > 200 && !showFullDescription) {
      return `${description.slice(0, 255)} ...more`;
    }
    return description;
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
            authorDisplayName: "Tejas Agrawal",
            authorProfileImageUrl: profile,
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

  return (
    <>
      <div className="play-video">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
          title="T"
          frameBorder="0"
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
              <p>{apiData ? apiData[0].snippet.channelTitle : "Name..."}</p>
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
            <button>
              <img src={share} alt="" /> Share
            </button>
            <button>
              <img src={download} alt="" /> Download
            </button>
          </div>
        </div>
        <div className="video-desc">
          <div className="information">
            <h5 onClick={handleToggleDescription}>
              {apiData
                ? value_converter(apiData[0].statistics.viewCount)
                : "1B"}{" "}
              &bull;{" "}
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
            Comments
          </h4>
          <form className="comment-form" onSubmit={handleSubmitComment}>
            <div className="add-comment">
              <img src={profile} alt="" />
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
      </div>
    </>
  );
};

export default PlayVideo;
