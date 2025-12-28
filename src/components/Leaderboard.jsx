/* eslint-disable react-hooks/immutability */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import '../styles/leaderboard.css';
import { mockApi } from '../services/mockApi';

const Leaderboard = () => {
  const navigate = useNavigate();
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState('u1'); // Matches seed data

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const users = await mockApi.getLeaderboard();

      // Add rank to each user
      const usersWithRank = users.map((user, index) => ({
        ...user,
        _id: user.id, // Map id to _id for compatibility
        rank: index + 1,
        wins: user.wins || 0,
        totalBattles: user.totalBattles || 0,
        bestBadge: user.bestBadge || 'Bronze I'
      }));

      setLeaderboardData(usersWithRank);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      setLoading(false);
    }
  };

  const getRankClass = (rank) => {
    if (rank === 1) return 'rank-gold';
    if (rank === 2) return 'rank-silver';
    if (rank === 3) return 'rank-bronze';
    return 'rank-normal';
  };

  const getRankIcon = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return rank;
  };

  const getBadgeIcon = (badge) => {
    switch (badge) {
      case 'Gold III': return '🥇';
      case 'Silver II': return '🥈';
      case 'Silver I': return '🥈';
      case 'Bronze II': return '🥉';
      case 'Bronze I': return '🥉';
      default: return '🏅';
    }
  };

  const getBadgeColor = (badge) => {
    switch (badge) {
      case 'Gold III': return '#ffd700';
      case 'Silver II': return '#c0c0c0';
      case 'Silver I': return '#d4d4d4';
      case 'Bronze II': return '#cd7f32';
      case 'Bronze I': return '#e8a87c';
      default: return '#6b7280';
    }
  };

  if (loading) {
    return (
      <div className="app-container">
        <Navbar />
        <div className="content-wrapper">
          <Sidebar />
          <main className="leaderboard-main">
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading leaderboard...</p>
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
        <main className="leaderboard-main">
          <h1 className="leaderboard-title">LEADERBOARD</h1>

          <div className="leaderboard-container">
            {leaderboardData.map((user) => (
              <div
                key={user._id}
                className={`leaderboard-item ${user._id === currentUserId ? 'current-user' : ''}`}
              >
                <div className="rank-section">
                  <div className={`rank-badge ${getRankClass(user.rank)}`}>
                    {getRankIcon(user.rank)}
                  </div>
                </div>

                <div className="user-info-section">
                  <div className="user-avatar">
                    {user.profilePicture ? (
                      <img src={user.profilePicture} alt={user.username} />
                    ) : (
                      <div className="avatar-placeholder-small">
                        {user.username.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>

                  <div className="user-details">
                    <h3 className="username">{user.username}</h3>
                    <p className="user-stats">
                      {user.wins}W / {user.totalBattles - user.wins}L •
                      <span
                        className="badge-indicator"
                        style={{ color: getBadgeColor(user.bestBadge) }}
                      >
                        {' '}{getBadgeIcon(user.bestBadge)} {user.bestBadge}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="xp-section">
                  <div className="xp-badge">
                    <span className="xp-label">XP</span>
                    <span className="xp-value">{user.xp}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Leaderboard;