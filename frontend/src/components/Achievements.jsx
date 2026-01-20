// src/components/Achievements.jsx - FIXED
import React, { useState, useEffect } from "react";
import { useAuth } from "../../../backend/context/AuthContext";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import "../styles/achievements.css";

const Achievements = () => {
  const { userData } = useAuth();
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userData) {
      generateBadges();
      setLoading(false);
    }
  }, [userData]);

  const generateBadges = () => {
    if (!userData) return;

    // Define all possible badges
    const allBadges = [
      {
        id: "bronze_i",
        name: "Bronze I",
        description: "Score 40-59% in a battle",
        icon: "🥉",
        requirement: "Score 40% or higher",
        threshold: 0,
      },
      {
        id: "bronze_ii",
        name: "Bronze II",
        description: "Score 40-59% in 5 battles",
        icon: "🥉",
        requirement: "Win 5 battles",
        threshold: 5,
      },
      {
        id: "bronze_iii",
        name: "Bronze III",
        description: "Reach Bronze III rank",
        icon: "🥉",
        requirement: "Earn 500 XP",
        threshold: 500,
      },
      {
        id: "silver_i",
        name: "Silver I",
        description: "Score 60-79% in a battle",
        icon: "🥈",
        requirement: "Earn 1000 XP",
        threshold: 1000,
      },
      {
        id: "silver_ii",
        name: "Silver II",
        description: "Score 80-99% in a battle",
        icon: "🥈",
        requirement: "Earn 1500 XP",
        threshold: 1500,
      },
      {
        id: "silver_iii",
        name: "Silver III",
        description: "Reach Silver III rank",
        icon: "🥈",
        requirement: "Earn 2000 XP",
        threshold: 2000,
      },
      {
        id: "gold_i",
        name: "Gold I",
        description: "Reach Gold I rank",
        icon: "🥇",
        requirement: "Earn 3000 XP",
        threshold: 3000,
      },
      {
        id: "gold_ii",
        name: "Gold II",
        description: "Reach Gold II rank",
        icon: "🥇",
        requirement: "Earn 4000 XP",
        threshold: 4000,
      },
      {
        id: "gold_iii",
        name: "Gold III",
        description: "Get a perfect score (100%)",
        icon: "🥇",
        requirement: "Earn 5000 XP",
        threshold: 5000,
      },
      {
        id: "first_win",
        name: "First Victory",
        description: "Win your first battle",
        icon: "🎯",
        requirement: "Win 1 battle",
        threshold: 1,
      },
      {
        id: "streak_5",
        name: "Hot Streak",
        description: "Win 5 battles in a row",
        icon: "🔥",
        requirement: "Win streak of 5",
        threshold: 5,
      },
      {
        id: "veteran",
        name: "Veteran",
        description: "Play 50 battles",
        icon: "⚔️",
        requirement: "Play 50 battles",
        threshold: 50,
      },
    ];

    // Determine which badges are unlocked based on user stats
    const userBadges = allBadges.map((badge) => {
      let unlocked = false;
      let unlockedDate = null;

      // Safely get user stats with defaults
      const userXP = userData.xp || 0;
      const userWins = userData.wins || 0;
      const userStreak = userData.streak || 0;
      const userTotalBattles = userData.totalBattles || 0;

      // Check unlock conditions
      if (
        badge.id.includes("bronze") ||
        badge.id.includes("silver") ||
        badge.id.includes("gold")
      ) {
        unlocked = userXP >= badge.threshold;
      } else if (badge.id === "first_win") {
        unlocked = userWins >= 1;
      } else if (badge.id === "streak_5") {
        unlocked = userStreak >= 5;
      } else if (badge.id === "veteran") {
        unlocked = userTotalBattles >= 50;
      }

      // If unlocked and in user's achievements array
      if (unlocked && userData.achievements?.includes(badge.id)) {
        unlockedDate = userData.createdAt;
      }

      return {
        ...badge,
        unlocked,
        unlockedDate,
      };
    });

    setBadges(userBadges);
  };

  if (loading || !userData) {
    return (
      <div className="app-container">
        <Navbar />
        <div className="content-wrapper">
          <Sidebar />
          <main className="achievements-main">
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading achievements...</p>
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
        <main className="achievements-main">
          <h1 className="achievements-title">Achievements / Badges</h1>

          <div className="achievements-header">
            <div className="stat-box">
              <p className="stat-label">Total XP</p>
              <p className="stat-value">
                {(userData.xp || 0).toLocaleString()}
              </p>
            </div>
            <div className="stat-box">
              <p className="stat-label">Best Rank</p>
              <p className="stat-value">{userData.badge || "Bronze I"}</p>
            </div>
            <div className="stat-box">
              <p className="stat-label">Badges Earned</p>
              <p className="stat-value">
                {badges.filter((b) => b.unlocked).length}/{badges.length}
              </p>
            </div>
          </div>

          <div className="badges-grid">
            {badges.map((badge) => (
              <div
                key={badge.id}
                className={`badge-card ${badge.unlocked ? "unlocked" : "locked"}`}
              >
                <div className="badge-icon-container">
                  <div className="badge-icon">
                    {badge.unlocked ? badge.icon : "🔒"}
                  </div>
                </div>

                <div className="badge-info">
                  <h3 className="badge-name">{badge.name}</h3>
                  <p className="badge-description">{badge.description}</p>

                  {badge.unlocked ? (
                    <p className="badge-date">✅ Unlocked</p>
                  ) : (
                    <p className="badge-requirement">
                      <span className="lock-icon">🔒</span> {badge.requirement}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Achievements;
