// App.jsx
import React from "react";
import Navbar from "./Components/Navbar/Navbar";
import { Route, Routes, useNavigate } from "react-router-dom";
import Home from "./Pages/Home/Home";
import Video from "./Pages/Video/Video";
import SearchResults from "./Pages/SearchResults/SearchResults";

const App = () => {
  const [sidebar, setSidebar] = React.useState(true);
  const navigate = useNavigate();

  const handleSearch = (query) => {
    navigate(`/search/${query}`);
  };

  return (
    <div>
      <Navbar setSidebar={setSidebar} handleSearch={handleSearch} />
      <Routes>
        <Route path="/" element={<Home sidebar={sidebar} />} />
        <Route path="/video/:categoryId/:videoId" element={<Video />} />
        <Route path="/search/:query" element={<SearchResults />} />
      </Routes>
    </div>
  );
};

export default App;
