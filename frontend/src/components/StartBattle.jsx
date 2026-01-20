// src/components/StartBattle.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../backend/context/AuthContext";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import "../styles/startbattle.css";
import { mockApi } from "../../../backend/services/mockApi";

const StartBattle = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userData } = useAuth();

  const [timer, setTimer] = useState(5);
  const [battleStarted, setBattleStarted] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [error, setError] = useState(null);

  // Get data from navigation state
  const {
    category,
    categoryId,
    battleId,
    opponent,
    currentUser,
    isSolo = false,
  } = location.state || {};

  // Fetch questions for the selected category
  useEffect(() => {
    if (!categoryId) {
      setError("No category selected");
      setLoadingQuestions(false);
      return;
    }

    const fetchQuestions = async () => {
      try {
        setLoadingQuestions(true);
        setError(null);

        // FIX: Use getQuestions instead of getCategories!
        const data = await mockApi.getQuestions(categoryId);

        if (data.length === 0) {
          throw new Error(
            `No questions available for category: ${category || categoryId}`,
          );
        }

        setQuestions(data);
        console.log(
          `Loaded ${data.length} questions for category ${categoryId}`,
        );
      } catch (err) {
        console.error("Error fetching questions:", err);
        setError(err.message || "Failed to load questions for this category");
      } finally {
        setLoadingQuestions(false);
      }
    };

    fetchQuestions();
  }, [categoryId, category]);

  // Countdown timer → auto start when reaches 0
  useEffect(() => {
    if (timer > 0 && !battleStarted && !loadingQuestions && !error) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else if (timer === 0 && !battleStarted && !loadingQuestions && !error) {
      handleStartBattle();
    }
  }, [timer, battleStarted, loadingQuestions, error]);

  const handleStartBattle = () => {
    setBattleStarted(true);

    // Navigate to quiz with all necessary data
    setTimeout(() => {
      navigate("/quiz", {
        state: {
          questions,
          categoryId,
          category,
          battleId,
          opponent,
          currentUser,
          isSolo,
        },
      });
    }, 800);
  };

  const handleQuit = () => {
    if (window.confirm("Are you sure you want to quit?")) {
      navigate(isSolo ? "/solo-quiz" : "/category");
    }
  };

  // Loading / Error states
  if (loadingQuestions) {
    return (
      <div className="app-container">
        <Navbar />
        <div className="content-wrapper">
          <Sidebar />
          <main className="battle-main">
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading questions...</p>
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
          <main className="battle-main">
            <div className="error-container">
              <h2>Oops!</h2>
              <p>{error}</p>
              <p style={{ color: "#6b7280", margin: "1rem 0" }}>
                This category might not have any questions yet.
              </p>
              <button className="btn-quit" onClick={handleQuit}>
                Go Back
              </button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // Use real user data from Firebase
  const displayUser = {
    userId: currentUser?.userId,
    username: userData?.username || currentUser?.username || "You",
    level: userData?.level || currentUser?.level || 1,
    xp: userData?.xp || currentUser?.xp || 0,
    profilePicture:
      userData?.profilePicture || currentUser?.profilePicture || null,
  };

  return (
    <div className="app-container">
      <Navbar />
      <div className="content-wrapper">
        <Sidebar />
        <main className="battle-main">
          <div className="timer-section">
            <span className="timer-label">Starting in</span>
            <span className="timer-value">00:0{timer}</span>
          </div>

          <h2 className="category-title">{category || "Selected Category"}</h2>
          <p className="battle-type">
            {isSolo ? "Solo Practice Mode" : "Live 1v1 Battle"}
          </p>

          <div className="players-container">
            {/* Current User */}
            <div className="player-card">
              <div className="player-avatar">
                {displayUser.profilePicture ? (
                  <img src={displayUser.profilePicture} alt="You" />
                ) : (
                  <div className="avatar-placeholder">
                    {displayUser.username?.charAt(0)?.toUpperCase() || "Y"}
                  </div>
                )}
              </div>
              <h3 className="player-username">{displayUser.username}</h3>
              <p className="player-stats">
                Level {displayUser.level} • {displayUser.xp} XP
              </p>
            </div>

            {/* VS - only in battle mode */}
            {!isSolo && <div className="vs-divider">VS</div>}

            {/* Opponent - only in battle mode */}
            {!isSolo && (
              <div className="player-card">
                <div className="player-avatar">
                  {opponent?.profilePicture ? (
                    <img src={opponent.profilePicture} alt="Opponent" />
                  ) : (
                    <div className="avatar-placeholder">
                      {opponent?.username?.charAt(0)?.toUpperCase() || "O"}
                    </div>
                  )}
                </div>
                <h3 className="player-username">
                  {opponent?.username || "Opponent"}
                </h3>
                <p className="player-stats">
                  Level {opponent?.level || "?"} • {opponent?.xp || 0} XP
                </p>
              </div>
            )}
          </div>

          <div className="battle-actions">
            {!battleStarted && timer > 0 && (
              <button className="btn-quit" onClick={handleQuit}>
                Quit
              </button>
            )}

            {battleStarted && (
              <div className="battle-started-msg">
                <h2>Battle Started!</h2>
                <p>Preparing questions...</p>
                <div className="loading-spinner-small"></div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default StartBattle;
