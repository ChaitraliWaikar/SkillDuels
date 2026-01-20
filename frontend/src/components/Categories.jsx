// src/components/Categories.jsx - FIXED with 10s timeout
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, query, where, limit } from "firebase/firestore";
import { db } from "../../../backend/firebase/config";
import { useAuth } from "../../../backend/context/AuthContext";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import "../styles/categories.css";
import { mockApi } from "../../../backend/services/mockApi";

const Categories = () => {
  const navigate = useNavigate();
  const { currentUser, userData } = useAuth();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchingOpponent, setSearchingOpponent] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTimer, setSearchTimer] = useState(0);

  useEffect(() => {
    fetchCategories();
  }, []);

  // Timer for matchmaking (10 seconds)
  useEffect(() => {
    let interval;
    if (searchingOpponent && searchTimer < 10) {
      interval = setInterval(() => {
        setSearchTimer((prev) => prev + 1);
      }, 1000);
    } else if (searchTimer >= 10) {
      // After 10 seconds, suggest solo mode
      handleMatchmakingTimeout();
    }

    return () => clearInterval(interval);
  }, [searchingOpponent, searchTimer]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await mockApi.getCategories();

      const categoriesWithIcons = data.map((cat) => ({
        ...cat,
        icon: cat.icon || "📚",
      }));

      setCategories(categoriesWithIcons);
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  const findRandomOpponent = async () => {
    try {
      const usersRef = collection(db, "users");
      const q = query(
        usersRef,
        where("uid", "!=", currentUser?.uid || "none"),
        limit(10),
      );

      const snapshot = await getDocs(q);
      const users = [];
      snapshot.forEach((doc) => users.push(doc.data()));

      if (users.length > 0) {
        const randomIndex = Math.floor(Math.random() * users.length);
        const opponent = users[randomIndex];

        return {
          userId: opponent.uid,
          username: opponent.username,
          level: opponent.level,
          xp: opponent.xp,
          profilePicture: opponent.profilePicture,
        };
      }

      return null; // No real opponents found
    } catch (error) {
      console.error("Error finding opponent:", error);
      return null;
    }
  };

  const handleMatchmakingTimeout = () => {
    setSearchingOpponent(false);
    setSearchTimer(0);

    // Show dialog suggesting solo mode
    if (
      window.confirm(
        "No opponents found. Would you like to play solo mode instead?",
      )
    ) {
      navigate("/solo-quiz");
    } else {
      setSelectedCategory(null);
    }
  };

  const handleChooseCategory = async (category) => {
    setSelectedCategory(category);
    setSearchingOpponent(true);
    setSearchTimer(0);

    try {
      // Try to find a real opponent
      const opponent = await findRandomOpponent();

      if (opponent) {
        // Real opponent found!
        setSearchingOpponent(false);

        const currentUserData = {
          userId: currentUser?.uid,
          username: userData?.username || currentUser?.displayName || "You",
          level: userData?.level || 1,
          xp: userData?.xp || 0,
          profilePicture: userData?.profilePicture || null,
        };

        navigate("/start-battle", {
          state: {
            category: category.name,
            categoryId: category.id,
            battleId: "battle_" + Date.now(),
            currentUser: currentUserData,
            opponent: opponent,
            isSolo: false,
          },
        });
      } else {
        // No opponent found, timer will continue and suggest solo after 10s
        console.log("No opponent found, waiting for timeout...");
      }
    } catch (error) {
      console.error("Matchmaking error:", error);
      setSearchingOpponent(false);

      if (
        window.confirm(
          "Error finding opponents. Would you like to play solo instead?",
        )
      ) {
        navigate("/solo-quiz");
      }
    }
  };

  const handleCancelSearch = () => {
    setSearchingOpponent(false);
    setSelectedCategory(null);
    setSearchTimer(0);
  };

  if (loading) {
    return (
      <div className="app-container">
        <Navbar />
        <div className="content-wrapper">
          <Sidebar />
          <main className="categories-main">
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading categories...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-container">
        <Navbar />
        <div className="content-wrapper">
          <Sidebar />
          <main className="categories-main">
            <div className="error-container">
              <h2>{error}</h2>
              <button onClick={fetchCategories} className="btn-choose">
                Try Again
              </button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // Searching for opponent overlay
  if (searchingOpponent) {
    return (
      <div className="app-container">
        <Navbar />
        <div className="content-wrapper">
          <Sidebar />
          <main className="categories-main">
            <div className="matchmaking-overlay">
              <div className="matchmaking-content">
                <div className="loading-spinner"></div>
                <h2>Finding an opponent...</h2>
                <p>{selectedCategory?.name}</p>
                <p className="timer-text">Time elapsed: {searchTimer}s / 10s</p>
                <p className="hint-text">
                  {searchTimer < 5
                    ? "Searching for players..."
                    : "Still searching..."}
                </p>
                <button onClick={handleCancelSearch} className="btn-cancel">
                  Cancel
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <Navbar />
      <div className="content-wrapper">
        <Sidebar />
        <main className="categories-main">
          <h1 className="categories-title">CHOOSE YOUR BATTLE CATEGORY</h1>
          <p className="categories-subtitle">
            Select a category and we'll find you an opponent!
          </p>

          <div className="categories-grid">
            {categories.map((category) => (
              <div key={category.id} className="category-card">
                <div className="category-icon">{category.icon}</div>
                <h3 className="category-name">{category.name}</h3>
                <button
                  className="btn-choose"
                  onClick={() => handleChooseCategory(category)}
                >
                  START BATTLE
                </button>
              </div>
            ))}
          </div>

          <div className="solo-cta">
            <p>Want to practice alone?</p>
            <button onClick={() => navigate("/solo-quiz")} className="btn-solo">
              Play Solo Mode
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Categories;
