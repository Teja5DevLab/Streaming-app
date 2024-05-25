import React, { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import "./App.css";
import Navbar from "./Components/Navbar/Navbar";
import Home from "./Pages/Home/Home";
import loader from "./assets/loading.gif";
import Video from "./Pages/Video/Video";
import SearchResults from "./Pages/SearchResults/SearchResults";
import Login from "./Pages/Login/Login";
import ProtectedRoute from "./Components/ProtectedRoute";
import Playlist from "./Pages/PlayList/PlayList";

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebar, setSidebar] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser({
          uid: user.uid,
          displayName: user.displayName,
          photoURL: user.photoURL,
        });
      } else {
        setUser(null);
        navigate("/login");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  if (loading) {
    return (
      <div className="load-wrap">
        <img src={loader} alt="" />
      </div>
    );
  }

  return (
    <div>
      {user && <Navbar setSidebar={setSidebar} user={user} />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path=""
          element={
            <ProtectedRoute user={user}>
              <Home sidebar={sidebar} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/video/:categoryId/:videoId"
          element={
            <ProtectedRoute user={user}>
              <Video user={user} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/results"
          element={
            <ProtectedRoute user={user}>
              <SearchResults sidebar={sidebar} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/playlist"
          element={
            <ProtectedRoute user={user}>
              <Playlist sidebar={sidebar} />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
};

export default App;
