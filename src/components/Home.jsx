/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import "../styles/home.css";   
const Home = () => {
  const [userData, setUserData] = useState({
    username: "username",
    xp: 2850,
    badge: "Silver II",
    streak: 7,
  });

  return (
    <div className="app-container">
      <Navbar />
      <div className="content-wrapper">
        <Sidebar />

        <main className="main-content">
          <h1 className="welcome-title">
            Welcome back,{" "}
            <span className="username-highlight">{userData.username}</span>
          </h1>

          {/* Stats Grid - Now Responsive */}
          <div className="stats-grid">
            <div className="stat-card">
              <h3>XP earned</h3>
              <p className="stat-xp">{userData.xp.toLocaleString()}</p>
            </div>

            <div className="stat-card">
              <h3>Highest Badge</h3>
              <p className="stat-level">{userData.badge}</p>
            </div>

            
          </div>

          {/* Battle Section */}
          <div className="battle-section">
            <h2>SkillDuels — Battle. Learn. Win.</h2>
            <p>Compete in real-time quizzes.</p>
            <p>Earn XP, climb ranks, and challenge your friends.</p>

            <button className="btn-start-quiz">Start Quiz Battle NOW!</button>

            <div className="how-it-works">
              <h3>How It Works :</h3>
              <div className="steps">
                <div className="step" data-step="1">
                  <h4>Choose a Category</h4>
                  <p>(Aptitude, Logic, GK, Coding, etc.)</p>
                </div>
                <div className="step" data-step="2">
                  <h4>Battle a Real Opponent</h4>
                  <p>(Real-time quiz duel with timer & live score.)</p>
                </div>
                <div className="step" data-step="3">
                  <h4>Earn XP & Rank Up</h4>
                  <p>(Unlock badges, climb leaderboard.)</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Home;