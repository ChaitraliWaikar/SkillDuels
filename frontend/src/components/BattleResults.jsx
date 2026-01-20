// src/components/BattleResults.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../backend/context/AuthContext";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import "../styles/battleresults.css";

const BattleResults = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userData } = useAuth();
  const [showCelebration, setShowCelebration] = useState(false);

  const {
    currentUser,
    opponent,
    category,
    userScore,
    opponentScore,
    totalQuestions,
    userAnswers = [],
    xpEarned = 0,
    isSolo = false,
    isWin = false,
    isDraw = false,
  } = location.state || {};

  // Determine winner
  const isUserWinner = isWin;
  const winner = isSolo
    ? currentUser
    : isDraw
      ? null
      : isUserWinner
        ? currentUser
        : opponent;

  // Calculate badge based on score
  const calculateBadge = (score, total) => {
    const percentage = (score / total) * 100;
    if (percentage === 100) return "Gold III";
    if (percentage >= 80) return "Silver II";
    if (percentage >= 60) return "Silver I";
    if (percentage >= 40) return "Bronze II";
    return "Bronze I";
  };

  const badge = calculateBadge(userScore, totalQuestions);
  const finalXP = xpEarned;

  useEffect(() => {
    if (isUserWinner && !isSolo) {
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 4000);
    }
  }, [isUserWinner, isSolo]);

  const handlePlayAgain = () => {
    if (isSolo) {
      navigate("/solo-quiz");
    } else {
      navigate("/category");
    }
  };

  const handleViewAnswers = () => {
    navigate("/review-answers", {
      state: {
        userAnswers,
        category,
        userScore,
        totalQuestions,
      },
    });
  };

  const handleGoToDashboard = () => {
    navigate("/");
  };

  if (!currentUser || (!opponent && !isSolo)) {
    return (
      <div className="app-container">
        <Navbar />
        <div className="content-wrapper">
          <Sidebar />
          <main className="results-main">
            <div className="error-container">
              <h2>No battle results found</h2>
              <button className="btn-back" onClick={() => navigate("/")}>
                Go Home
              </button>
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

        <main className="results-main">
          {/* Celebration Animation */}
          {showCelebration && (
            <div className="celebration-overlay">
              <div className="celebration-content">
                <div className="celebration-icon">🎉</div>
                <h2 className="celebration-text">Congratulations!</h2>
              </div>
            </div>
          )}

          <div className="results-container">
            <h1 className="results-title">
              {isSolo
                ? "Practice Complete!"
                : isDraw
                  ? "It's a Draw!"
                  : isUserWinner
                    ? "You Win!"
                    : "You Lost"}
            </h1>

            {/* Winner Profile - Only show if not solo */}
            {winner && !isSolo && (
              <div className="winner-section">
                <h2 className="winner-label">Winner</h2>
                <div className="winner-profile">
                  {winner.profilePicture ? (
                    <img
                      src={winner.profilePicture}
                      alt="Winner"
                      className="winner-avatar"
                    />
                  ) : (
                    <div className="winner-avatar-placeholder">
                      {winner.username?.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <h3 className="winner-username">{winner.username}</h3>
              </div>
            )}

            {/* Solo mode - Show user profile */}
            {isSolo && (
              <div className="winner-section">
                <div className="winner-profile">
                  {userData?.profilePicture ? (
                    <img
                      src={userData.profilePicture}
                      alt="Profile"
                      className="winner-avatar"
                      style={{ border: "5px solid #10b981" }}
                    />
                  ) : (
                    <div
                      className="winner-avatar-placeholder"
                      style={{ border: "5px solid #10b981" }}
                    >
                      {userData?.username?.charAt(0).toUpperCase() || "U"}
                    </div>
                  )}
                </div>
                <h3 className="winner-username">
                  {userData?.username || "You"}
                </h3>
              </div>
            )}

            {/* Draw Message */}
            {isDraw && (
              <div className="draw-section">
                <div className="draw-avatars">
                  <div className="draw-player">
                    {userData?.profilePicture ? (
                      <img
                        src={userData.profilePicture}
                        alt="You"
                        className="draw-avatar"
                      />
                    ) : (
                      <div className="draw-avatar-placeholder">
                        {userData?.username?.charAt(0).toUpperCase() || "Y"}
                      </div>
                    )}
                    <p>{userData?.username || "You"}</p>
                  </div>
                  <div className="draw-vs">VS</div>
                  <div className="draw-player">
                    {opponent?.profilePicture ? (
                      <img
                        src={opponent.profilePicture}
                        alt="Opponent"
                        className="draw-avatar"
                      />
                    ) : (
                      <div className="draw-avatar-placeholder">
                        {opponent?.username?.charAt(0).toUpperCase() || "O"}
                      </div>
                    )}
                    <p>{opponent?.username || "Opponent"}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Scores */}
            <div className="scores-display">
              <h2 className="score-title">
                Final Score: {userScore}/{totalQuestions}
              </h2>
            </div>

            {/* Stats */}
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-icon">⭐</div>
                <div className="stat-content">
                  <p className="stat-label">XP Earned</p>
                  <p className="stat-value">{finalXP}</p>
                </div>
              </div>

              <div className="stat-item">
                <div className="stat-icon">🏆</div>
                <div className="stat-content">
                  <p className="stat-label">Badge Unlocked</p>
                  <p className="stat-value">{badge}</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="action-buttons">
              <button className="btn-play-again" onClick={handlePlayAgain}>
                Play Again
              </button>
              <button className="btn-view-answers" onClick={handleViewAnswers}>
                View Answers
              </button>
              <button className="btn-dashboard" onClick={handleGoToDashboard}>
                Go to Dashboard
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default BattleResults;
