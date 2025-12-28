/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import '../styles/quiz.css';
import { mockApi } from '../services/mockApi';

const Quiz = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get data from StartBattle
  const {
    questions = [],
    categoryId,
    category,
    battleId,
    opponent,
    currentUser,
    isSolo = false
  } = location.state || {};

  // Quiz state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15); // 15 seconds per question
  const [isAnswered, setIsAnswered] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [userAnswers, setUserAnswers] = useState([]);

  const currentQuestion = questions[currentQuestionIndex];

  // Timer countdown
  useEffect(() => {
    if (quizCompleted) return;

    if (timeLeft > 0 && !isAnswered) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !isAnswered) {
      handleTimeUp();
    }
  }, [timeLeft, isAnswered, quizCompleted]);

  const handleTimeUp = () => {
    setIsAnswered(true);

    // Record wrong answer
    const answerData = {
      questionId: currentQuestion.id,
      selectedAnswer: null,
      correct: false,
      timeSpent: 15
    };
    setUserAnswers([...userAnswers, answerData]);

    setTimeout(() => moveToNextQuestion(), 2000);
  };

  const handleAnswerSelect = (answerIndex) => {
    if (isAnswered) return;

    setSelectedAnswer(answerIndex);
    setIsAnswered(true);

    const isCorrect = answerIndex === currentQuestion.correctAnswer;
    const timeSpent = 15 - timeLeft;
    const newScore = isCorrect ? score + 1 : score;

    setScore(newScore);

    // Record answer
    const answerData = {
      questionId: currentQuestion.id,
      selectedAnswer: answerIndex,
      correct: isCorrect,
      timeSpent
    };
    setUserAnswers([...userAnswers, answerData]);

    setTimeout(() => moveToNextQuestion(), 2000);
  };

  const moveToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
      setTimeLeft(15);
    } else {
      handleQuizComplete();
    }
  };

  const handleQuizComplete = async (opponentDisconnected = false) => {
    setQuizCompleted(true);

    const totalQuestions = questions.length;
    const correctAnswers = score;
    const percentage = ((correctAnswers / totalQuestions) * 100).toFixed(1);

    const baseXP = correctAnswers * 10;
    const xpEarned = baseXP;

    const calculateBadge = (score, total) => {
      const percentage = (score / total) * 100;
      if (percentage === 100) return 'Gold III';
      if (percentage >= 80) return 'Silver II';
      if (percentage >= 60) return 'Silver I';
      if (percentage >= 40) return 'Bronze II';
      return 'Bronze I';
    };

    const badge = calculateBadge(correctAnswers, totalQuestions);

    // Update User Stats in Mock Backend
    if (currentUser && currentUser.userId) {
      await mockApi.updateUserStats(currentUser.userId, {
        xpEarned,
        isWin: true, // Simplified: assume win if completed for now, or compare with opponent
        badge
      });
    }

    setTimeout(() => {
      // For solo mode, no opponent score
      const opponentScoreDemo = isSolo ? null :
        (opponentDisconnected ? 0 : Math.floor(Math.random() * (totalQuestions + 1)));

      navigate('/');
    }, 2000);
  };

  const getAnswerClass = (index) => {
    if (!isAnswered) return 'quiz-option';

    if (index === currentQuestion.correctAnswer) {
      return 'quiz-option correct';
    }

    if (index === selectedAnswer && index !== currentQuestion.correctAnswer) {
      return 'quiz-option wrong';
    }

    return 'quiz-option';
  };

  const getProgressPercentage = () => {
    return ((currentQuestionIndex + 1) / questions.length) * 100;
  };

  if (!questions || questions.length === 0) {
    return (
      <div className="app-container">
        <Navbar />
        <div className="content-wrapper">
          <Sidebar />
          <main className="quiz-main">
            <div className="error-message">
              <h2>No questions available for this category</h2>
              <button className="btn-back" onClick={() => navigate('/categories')}>
                Back to Categories
              </button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (quizCompleted) {
    return (
      <div className="app-container">
        <Navbar />
        <div className="content-wrapper">
          <Sidebar />
          <main className="quiz-main">
            <div className="quiz-completed">
              <h2>Quiz Completed!</h2>
              <p>Your Score: {score}/{questions.length}</p>
              <p>Redirecting to home...</p>
              <div className="loading-spinner-small"></div>
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
        <main className="quiz-main">
          <div className="quiz-container">
            <button className="btn-quit" onClick={() => navigate('/')}>
              Quit Quiz
            </button>
            {/* Header */}
            <div className="quiz-header">
              <div className="quiz-info">
                <h2 className="category-tag">{category}</h2>
                <div className="question-counter">
                  Question {currentQuestionIndex + 1}/{questions.length}
                </div>
              </div>
              <div className="timer-display">
                <div className="timer-circle">
                  <span className={timeLeft <= 5 ? 'time-warning' : ''}>{timeLeft}s</span>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${getProgressPercentage()}%` }}
              ></div>
            </div>

            {/* Scores */}
            <div className="scores-container">
              <div className="player-score">
                <span className="score-label">You</span>
                <span className="score-value">{score}</span>
              </div>

              {!isSolo && (
                <>
                  <div className="vs-separator">VS</div>
                  <div className="player-score">
                    <span className="score-label">{opponent?.username}</span>
                    <span className="score-value">{opponentScore}</span>
                  </div>
                </>
              )}
            </div>

            {/* Question */}
            <div className="question-card">
              <h3 className="question-text">{currentQuestion.question}</h3>
            </div>

            {/* Options */}
            <div className="options-container">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  className={getAnswerClass(index)}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={isAnswered}
                >
                  <span className="option-label">
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="option-text">{option}</span>
                  {isAnswered && index === currentQuestion.correctAnswer && (
                    <span className="correct-icon">✅</span>
                  )}
                  {isAnswered && index === selectedAnswer && index !== currentQuestion.correctAnswer && (
                    <span className="wrong-icon">❌</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Quiz;