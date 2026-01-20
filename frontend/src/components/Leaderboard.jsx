// src/components/Leaderboard.jsx - FIXED
import React, { useState, useEffect } from "react";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "../../../backend/firebase/config";
import { useAuth } from "../../../backend/context/AuthContext";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import "../styles/leaderboard.css";

const Leaderboard = () => {
  const { currentUser } = useAuth();
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      setError(null);

      // Query Firestore with timeout
      const usersRef = collection(db, "users");
      const q = query(usersRef, orderBy("xp", "desc"), limit(100));

      // Add timeout to prevent infinite loading
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Request timeout")), 10000),
      );

      const queryPromise = getDocs(q);

      const querySnapshot = await Promise.race([queryPromise, timeoutPromise]);

      const users = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        users.push({
          id: doc.id,
          uid: data.uid || doc.id,
          username: data.username || "Unknown User",
          xp: data.xp || 0,
          wins: data.wins || 0,
          losses: data.losses || 0,
          badge: data.badge || "Bronze I",
          profilePicture: data.profilePicture || null,
        });
      });

      // Add rank to each user
      const usersWithRank = users.map((user, index) => ({
        ...user,
        rank: index + 1,
      }));

      setLeaderboardData(usersWithRank);
    } catch (err) {
      console.error("Error fetching leaderboard:", err);
      setError("Failed to load leaderboard. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const getRankClass = (rank) => {
    if (rank === 1) return "rank-gold";
    if (rank === 2) return "rank-silver";
    if (rank === 3) return "rank-bronze";
    return "rank-normal";
  };

  const getRankIcon = (rank) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return rank;
  };

  const getBadgeIcon = (badge) => {
    if (!badge) return "🏅";
    if (badge.includes("Gold")) return "🥇";
    if (badge.includes("Silver")) return "🥈";
    if (badge.includes("Bronze")) return "🥉";
    return "🏅";
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="home-wrapper">
          {currentUser && <Sidebar />}
          <div className="leaderboard-container">
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "50vh",
                color: "#fff",
              }}
            >
              <div className="loading-spinner"></div>
              <p className="loading-text" style={{ marginTop: "1rem" }}>
                Loading leaderboard...
              </p>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="home-wrapper">
          {currentUser && <Sidebar />}
          <div className="leaderboard-container">
            <div
              style={{
                textAlign: "center",
                padding: "2rem",
                color: "#fff",
              }}
            >
              <p
                className="error-text"
                style={{
                  color: "#ef4444",
                  marginBottom: "1rem",
                  fontSize: "1.1rem",
                }}
              >
                {error}
              </p>
              <button
                onClick={fetchLeaderboard}
                className="retry-button"
                style={{
                  padding: "0.75rem 1.5rem",
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "1rem",
                  fontWeight: "600",
                }}
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (leaderboardData.length === 0) {
    return (
      <>
        <Navbar />
        <div className="home-wrapper">
          {currentUser && <Sidebar />}
          <div className="leaderboard-container">
            <h1 className="leaderboard-title">LEADERBOARD</h1>
            <div
              style={{
                textAlign: "center",
                padding: "2rem",
                color: "#9ca3af",
              }}
            >
              <p>No players yet. Be the first to play!</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="home-wrapper">
        {currentUser && <Sidebar />}
        <div className="leaderboard-container">
          <h1 className="leaderboard-title">LEADERBOARD</h1>

          <div className="leaderboard-list">
            {leaderboardData.map((user) => (
              <div
                key={user.id}
                className={`leaderboard-item ${getRankClass(user.rank)} ${
                  currentUser?.uid === user.uid ? "current-user" : ""
                }`}
              >
                <div className="rank-badge">{getRankIcon(user.rank)}</div>

                <div className="user-avatar">
                  {user.profilePicture ? (
                    <img src={user.profilePicture} alt={user.username} />
                  ) : (
                    <div className="avatar-placeholder">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                <div className="user-info">
                  <div className="user-name">{user.username}</div>
                  <div className="user-stats">
                    {user.wins}W / {user.losses}L • {getBadgeIcon(user.badge)}{" "}
                    {user.badge}
                  </div>
                </div>

                <div className="user-xp">
                  XP <strong>{user.xp.toLocaleString()}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Leaderboard;
