/* eslint-disable react-hooks/immutability */
import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

import '../styles/achievements.css';

const Achievements = () => {
  const [userData, setUserData] = useState(null);
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserAchievements();
  }, []);

  const fetchUserAchievements = async () => {
    try {
      // Backend API call to fetch user achievements
      // MongoDB query: db.users.findOne({ _id: currentUserId })
      // const response = await fetch('/api/user/achievements');
      // const data = await response.json();
      // setUserData(data.user);
      // setBadges(data.badges);

      // Mock data for demonstration
      const mockUserData = {
        totalXP: 3890,
        level: 38,
        bestRank: 'Gold',
        badges: [
          'bronze_i', 'bronze_ii', 'silver_i', 'silver_ii', 'gold_iii'
        ]
      };

      const allBadges = [
        {
          id: 'bronze_i',
          name: 'Bronze I',
          description: 'Score 40-59% in a battle',
          icon: '🥉',
          unlocked: true,
          unlockedDate: '2024-01-10'
        },
        {
          id: 'bronze_ii',
          name: 'Bronze II',
          description: 'Score 40-59% in 5 battles',
          icon: '🥉',
          unlocked: true,
          unlockedDate: '2024-01-12'
        },
        {
          id: 'silver_i',
          name: 'Silver I',
          description: 'Score 60-79% in a battle',
          icon: '🥈',
          unlocked: true,
          unlockedDate: '2024-01-15'
        },
        {
          id: 'silver_ii',
          name: 'Silver II',
          description: 'Score 80-99% in a battle',
          icon: '🥈',
          unlocked: true,
          unlockedDate: '2024-01-18'
        },
        {
          id: 'gold_iii',
          name: 'Gold III',
          description: 'Get a perfect score (100%)',
          icon: '🥇',
          unlocked: true,
          unlockedDate: '2024-01-20'
        }
      ];

      setUserData(mockUserData);
      setBadges(allBadges);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching achievements:', error);
      setLoading(false);
    }
  };

  if (loading) {
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
              <p className="stat-value">{userData.totalXP}</p>
            </div>
            <div className="stat-box">
              <p className="stat-label">Best Rank</p>
              <p className="stat-value">{userData.bestRank}</p>
            </div>
          </div>

          <div className="badges-grid">
            {badges.map((badge) => (
              <div 
                key={badge.id} 
                className={`badge-card ${badge.unlocked ? 'unlocked' : 'locked'}`}
              >
                <div className="badge-icon-container">
                  <div className="badge-icon">
                    {badge.unlocked ? badge.icon : '🔒'}
                  </div>
                </div>
                
                <div className="badge-info">
                  <h3 className="badge-name">{badge.name}</h3>
                  <p className="badge-description">{badge.description}</p>
                  
                  {badge.unlocked ? (
                    <p className="badge-date">
                      Unlocked: {new Date(badge.unlockedDate).toLocaleDateString()}
                    </p>
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