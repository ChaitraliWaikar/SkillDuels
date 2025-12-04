/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import io from 'socket.io-client';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import '../styles/startbattle.css';

const StartBattle = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [timer, setTimer] = useState(5);
  const [battleStarted, setBattleStarted] = useState(false);
  const [socket, setSocket] = useState(null);
  const [questions, setQuestions] = useState([]);

  // Get data from navigation state
  const { 
    category, 
    categoryId, 
    battleId, 
    opponent, 
    currentUser,
    isSolo = false  // ADD THIS LINE
  } = location.state || {};

  // Initialize Socket.IO connection
  useEffect(() => {
    // const newSocket = io('http://localhost:5000', {
    //   auth: { token: localStorage.getItem('authToken') }
    // });
    // setSocket(newSocket);

    // Join battle room
    // if (battleId) {
    //   newSocket.emit('joinBattle', { battleId });
    // }

    // Listen for opponent quit
    // newSocket.on('opponentQuit', () => {
    //   alert('Opponent has quit the battle');
    //   navigate('/categories');
    // });

    // return () => newSocket.close();
  }, [battleId]);

  // Fetch questions for the selected category
  useEffect(() => {
    if (categoryId) {
      fetchQuestions();
    }
  }, [categoryId]);

  const fetchQuestions = async () => {
    try {
      // Fetch questions from backend based on category
      // const response = await fetch(`/api/questions/category/${categoryId}`);
      // const data = await response.json();
      // setQuestions(data.questions);

      // Mock questions based on category (matches ManageQuestions data)
      const allQuestions = [
        // Aptitude Questions
        { id: 1, question: 'What is 15% of 200?', options: ['20', '25', '30', '35'], correctAnswer: 2, categoryId: 1 },
        { id: 2, question: 'If a train travels 60 km in 45 minutes, what is its speed in km/h?', options: ['60', '70', '80', '90'], correctAnswer: 2, categoryId: 1 },
        { id: 3, question: 'A number increased by 20% becomes 60. What is the number?', options: ['40', '45', '50', '55'], correctAnswer: 2, categoryId: 1 },
        { id: 4, question: 'The ratio of 5:8 is equal to?', options: ['15:24', '10:13', '20:32', '25:30'], correctAnswer: 0, categoryId: 1 },
        { id: 5, question: 'What is the average of 10, 20, 30, 40, 50?', options: ['25', '30', '35', '40'], correctAnswer: 1, categoryId: 1 },

        // Logical Reasoning Questions
        { id: 6, question: 'If all cats are animals and some animals are dogs, then?', options: ['All cats are dogs', 'Some cats are dogs', 'No conclusion', 'All dogs are cats'], correctAnswer: 2, categoryId: 2 },
        { id: 7, question: 'What comes next: 2, 6, 12, 20, 30, ?', options: ['38', '40', '42', '44'], correctAnswer: 2, categoryId: 2 },
        { id: 8, question: 'If CODE is written as DPEF, how is MIND written?', options: ['NKOE', 'NJOE', 'NJND', 'NKND'], correctAnswer: 1, categoryId: 2 },
        { id: 9, question: 'A is taller than B. C is shorter than B. Who is the shortest?', options: ['A', 'B', 'C', 'Cannot determine'], correctAnswer: 2, categoryId: 2 },
        { id: 10, question: 'Complete the series: AB, CD, EF, ?', options: ['GH', 'HI', 'IJ', 'FG'], correctAnswer: 0, categoryId: 2 },

        // General Knowledge Questions
        { id: 11, question: 'What is the capital of France?', options: ['London', 'Berlin', 'Paris', 'Madrid'], correctAnswer: 2, categoryId: 3 },
        { id: 12, question: 'Who wrote "Romeo and Juliet"?', options: ['Charles Dickens', 'William Shakespeare', 'Jane Austen', 'Mark Twain'], correctAnswer: 1, categoryId: 3 },
        { id: 13, question: 'Which planet is known as the Red Planet?', options: ['Venus', 'Mars', 'Jupiter', 'Saturn'], correctAnswer: 1, categoryId: 3 },
        { id: 14, question: 'In which year did World War II end?', options: ['1943', '1944', '1945', '1946'], correctAnswer: 2, categoryId: 3 },
        { id: 15, question: 'What is the largest ocean on Earth?', options: ['Atlantic', 'Indian', 'Arctic', 'Pacific'], correctAnswer: 3, categoryId: 3 },

        // Verbal Questions
        { id: 16, question: 'Synonym of "Happy":', options: ['Sad', 'Joyful', 'Angry', 'Tired'], correctAnswer: 1, categoryId: 4 },
        { id: 17, question: 'Antonym of "Brave":', options: ['Coward', 'Strong', 'Bold', 'Fearless'], correctAnswer: 0, categoryId: 4 },
        { id: 18, question: 'Fill in the blank: She is good ___ mathematics.', options: ['in', 'at', 'on', 'with'], correctAnswer: 1, categoryId: 4 },
        { id: 19, question: 'Choose the correctly spelled word:', options: ['Occassion', 'Occasion', 'Ocasion', 'Occation'], correctAnswer: 1, categoryId: 4 },
        { id: 20, question: 'Complete the idiom: "A piece of ___"', options: ['bread', 'cake', 'stone', 'wood'], correctAnswer: 1, categoryId: 4 }
      ];

      // Filter questions by categoryId
      const categoryQuestions = allQuestions.filter(q => q.categoryId === categoryId);
      setQuestions(categoryQuestions);
      console.log(`Loaded ${categoryQuestions.length} questions for category ${categoryId}`);
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

    // Emit battle started event via Socket.IO
    // socket?.emit('battleStarted', { battleId });

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
          isSolo  // ADD THIS LINE
        }
      });
    }, 1000);
  };

  const handleQuit = () => {
    // Notify backend and opponent via Socket.IO
    // socket?.emit('quitBattle', { battleId, userId: currentUser?.userId });

    // Backend: Update battle status
    // fetch('/api/battle/quit', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ battleId, userId: currentUser?.userId })
    // });

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