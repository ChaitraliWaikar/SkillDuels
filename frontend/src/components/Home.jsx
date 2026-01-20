// src/components/Home.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../backend/context/AuthContext";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import "../styles/home.css";

const Home = () => {
  const { currentUser, userData } = useAuth();
  const navigate = useNavigate();

  const handleStartBattle = () => {
    if (currentUser) {
      navigate("/category");
    } else {
      navigate("/login");
    }
  };

  // Logged out view
  if (!currentUser) {
    return (
      <>
        <Navbar />
        <div className="home-container logged-out">
          <div className="hero-section">
            <div className="hero-content">
              <h1 className="hero-title">SkillDuels</h1>
              <p className="hero-subtitle">Battle. Learn. Win.</p>
              <p className="hero-description">
                Compete in real-time quizzes, earn XP, climb ranks, and
                challenge your friends.
              </p>

              <div className="hero-buttons">
                <button
                  onClick={() => navigate("/login")}
                  className="cta-button primary"
                >
                  Log In
                </button>
                <button
                  onClick={() => navigate("/signup")}
                  className="cta-button secondary"
                >
                  Sign Up
                </button>
              </div>
            </div>

            <div className="how-it-works">
              <h2>How It Works</h2>
              <div className="steps">
                <div className="step">
                  <div className="step-number">1</div>
                  <h3>Choose a Category</h3>
                  <p>Aptitude, Logic, GK, Coding, etc.</p>
                </div>
                <div className="step">
                  <div className="step-number">2</div>
                  <h3>Battle a Real Opponent</h3>
                  <p>Real-time quiz duel with timer & live score</p>
                </div>
                <div className="step">
                  <div className="step-number">3</div>
                  <h3>Earn XP & Rank Up</h3>
                  <p>Unlock badges, climb leaderboard</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Loading state
  if (!userData) {
    return (
      <>
        <Navbar />
        <div className="home-wrapper">
          <Sidebar />
          <div className="home-container">
            <p>Loading...</p>
          </div>
        </div>
      </>
    );
  }

  // Logged in view
  return (
    <>
      <Navbar />
      <div className="home-wrapper">
        <Sidebar />
        <div className="home-container">
          <div className="welcome-section">
            <div className="welcome-text">
              <p className="greeting">
                Welcome back,{" "}
                <span className="username">{userData.username}</span>
              </p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="stats-grid">
            <div className="stat-card">
              <p className="stat-label">XP earned</p>
              <p className="stat-value">{userData.xp.toLocaleString()}</p>
            </div>
            <div className="stat-card">
              <p className="stat-label">Current Rank</p>
              <p className="stat-value">{userData.rank}</p>
            </div>
            <div className="stat-card">
              <p className="stat-label">Win Streak</p>
              <p className="stat-value">{userData.streak}</p>
            </div>
            <div className="stat-card">
              <p className="stat-label">Level</p>
              <p className="stat-value">{userData.level}</p>
            </div>
          </div>

          {/* Battle Section */}
          <div className="battle-section">
            <h2 className="battle-title">SkillDuels — Battle. Learn. Win.</h2>
            <p className="battle-description">
              Compete in real-time quizzes.
              <br />
              Earn XP, climb ranks, and challenge your friends.
            </p>
            <button onClick={handleStartBattle} className="cta-button">
              Start Quiz Battle NOW!
            </button>

            <div className="how-it-works">
              <h3>How It Works:</h3>
              <div className="steps">
                <div className="step">
                  <h4>Choose a Category</h4>
                  <p>(Aptitude, Logic, GK, Coding, etc.)</p>
                </div>
                <div className="step">
                  <h4>Battle a Real Opponent</h4>
                  <p>(Real-time quiz duel with timer & live score.)</p>
                </div>
                <div className="step">
                  <h4>Earn XP & Rank Up</h4>
                  <p>(Unlock badges, climb leaderboard.)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
