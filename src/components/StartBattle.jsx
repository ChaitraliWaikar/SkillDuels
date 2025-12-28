/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import '../styles/startbattle.css';
import { mockApi } from '../services/mockApi';

const StartBattle = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [timer, setTimer] = useState(5);
  const [battleStarted, setBattleStarted] = useState(false);
  const [questions, setQuestions] = useState([]);

  // Get data from navigation state
  const {
    category,
    categoryId,
    battleId,
    opponent,
    currentUser,
    isSolo = false
  } = location.state || {};

  // Fetch questions for the selected category
  useEffect(() => {
    if (categoryId) {
      fetchQuestions();
    }
  }, [categoryId]);

  const fetchQuestions = async () => {
    try {
      const data = await mockApi.getQuestions(categoryId);
      setQuestions(data);
      console.log(`Loaded ${data.length} questions for category ${categoryId}`);
    } catch (error) {
      console.error('Error fetching questions:', error);
      alert('Failed to load questions');
    }
  };

  // Countdown timer
  useEffect(() => {
    if (timer > 0 && !battleStarted) {
      const interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else if (timer === 0 && !battleStarted) {
      handleStartBattle();
    }
  }, [timer, battleStarted]);

  const handleStartBattle = () => {
    setBattleStarted(true);

    // Navigate to quiz page with questions
    setTimeout(() => {
      navigate('/quiz', {
        state: {
          questions,
          categoryId,
          category,
          battleId,
          opponent,
          currentUser,
          isSolo
        }
      });
    }, 1000);
  };

  const handleQuit = () => {
    alert('You have quit the battle');
    navigate('/categories');
  };

  return (
    <div className="app-container">
      <Navbar />
      <div className="content-wrapper">
        <Sidebar />
        <main className="battle-main">
          <div className="timer-section">
            <span className="timer-label">Timer :</span>
            <span className="timer-value">00:0{timer}</span>
          </div>

          <h2 className="category-title">{category || 'Category Name'}</h2>
          <p className="battle-type">{isSolo ? 'Solo Practice' : 'Live Battle'}</p>

          <div className="players-container">
            {/* Current User */}
            <div className="player-card">
              <div className="player-avatar">
                {currentUser?.profilePicture ? (
                  <img src={currentUser.profilePicture} alt="Profile" />
                ) : (
                  <div className="avatar-placeholder">
                    {currentUser?.username?.charAt(0).toUpperCase() || 'P'}
                  </div>
                )}
              </div>
              <h3 className="player-username">{currentUser?.username || 'You'}</h3>
              <p className="player-stats">
                Level {currentUser?.level || 0} • {currentUser?.xp || 0} XP
              </p>
            </div>

            {/* VS Text - Only show if not solo */}
            {!isSolo && <div className="vs-divider">VS</div>}

            {/* Opponent - Only show if not solo */}
            {!isSolo && (
              <div className="player-card">
                <div className="player-avatar">
                  {opponent?.profilePicture ? (
                    <img src={opponent.profilePicture} alt="Profile" />
                  ) : (
                    <div className="avatar-placeholder">
                      {opponent?.username?.charAt(0).toUpperCase() || 'O'}
                    </div>
                  )}
                </div>
                <h3 className="player-username">{opponent?.username || 'Opponent'}</h3>
                <p className="player-stats">
                  Level {opponent?.level || 0} • {opponent?.xp || 0} XP
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
                <p>Loading questions...</p>
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