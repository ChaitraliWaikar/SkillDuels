// src/components/Quiz.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../backend/context/AuthContext";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import "../styles/quiz.css";

const Quiz = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, updateUserStats } = useAuth();

  // Get data from StartBattle
  const {
    questions = [],
    categoryId,
    category,
    battleId,
    opponent,
    isSolo = false,
  } = location.state || {};

  // Quiz state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
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

  // Simulate opponent progress
  useEffect(() => {
    if (!isSolo && !quizCompleted) {
      const interval = setInterval(() => {
        // Randomly increase opponent score
        if (Math.random() > 0.7) {
          setOpponentScore((prev) => Math.min(prev + 1, questions.length));
        }
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [isSolo, quizCompleted, questions.length]);

  const handleTimeUp = () => {
    setIsAnswered(true);

    const answerData = {
      questionId: currentQuestion.id,
      selectedAnswer: null,
      correct: false,
      timeSpent: 15,
    };

    setUserAnswers([...userAnswers, answerData]);
    setTimeout(() => moveToNextQuestion(), 3000);
  };

  const handleAnswerSelect = (answerIndex) => {
    if (isAnswered) return;

    setSelectedAnswer(answerIndex);
    setIsAnswered(true);

    const isCorrect = answerIndex === currentQuestion.correctAnswer;
    const timeSpent = 15 - timeLeft;

    if (isCorrect) {
      setScore(score + 1);
    }

    const answerData = {
      questionId: currentQuestion.id,
      selectedAnswer: answerIndex,
      correct: isCorrect,
      timeSpent,
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

  const handleQuizComplete = async () => {
    setQuizCompleted(true);

    const totalQuestions = questions.length;
    const correctAnswers = score;

    // Calculate final opponent score for battle mode
    const finalOpponentScore = isSolo
      ? 0
      : Math.min(opponentScore + Math.floor(Math.random() * 2), totalQuestions);

    const isWin = isSolo ? true : correctAnswers > finalOpponentScore;
    const isDraw = isSolo ? false : correctAnswers === finalOpponentScore;

    // Calculate XP earned
    const baseXP = correctAnswers * 10; // 10 XP per correct answer
    const bonusXP = isWin ? 50 : 0; // 50 bonus XP for winning
    const xpEarned = baseXP + bonusXP;

    try {
      // Update user stats in Firestore
      if (currentUser) {
        await updateUserStats(currentUser.uid, {
          xpEarned: xpEarned,
          isWin: isWin,
        });
      }
    } catch (error) {
      console.error("Error updating stats:", error);
    }

    // Redirect to results after 2 seconds
    setTimeout(() => {
      navigate("/battle-results", {
        state: {
          currentUser: {
            userId: currentUser?.uid,
            username: currentUser?.displayName,
            profilePicture: null,
          },
          opponent: opponent,
          category: category,
          userScore: correctAnswers,
          opponentScore: finalOpponentScore,
          totalQuestions: totalQuestions,
          userAnswers: userAnswers,
          xpEarned: xpEarned,
          isSolo: isSolo,
          isWin: isWin,
          isDraw: isDraw,
        },
      });
    }, 2000);
  };

  const getAnswerClass = (index) => {
    if (!isAnswered) return "quiz-option";

    if (index === currentQuestion.correctAnswer) {
      return "quiz-option correct";
    }

    if (index === selectedAnswer && index !== currentQuestion.correctAnswer) {
      return "quiz-option wrong";
    }

    return "quiz-option";
  };

  const getProgressPercentage = () => {
    return ((currentQuestionIndex + 1) / questions.length) * 100;
  };

  if (!questions || questions.length === 0) {
    return (
      <>
        <Navbar />
        <div className="home-wrapper">
          <Sidebar />
          <div className="quiz-container">
            <h2>No questions available for this category</h2>
            <button onClick={() => navigate("/category")} className="btn-back">
              Back to Categories
            </button>
          </div>
        </div>
      </>
    );
  }

  if (quizCompleted) {
    return (
      <>
        <Navbar />
        <div className="home-wrapper">
          <Sidebar />
          <div className="quiz-container">
            <div className="quiz-complete">
              <h2>Quiz Completed!</h2>
              <p className="score-display">
                Your Score: {score}/{questions.length}
              </p>
              <p>Redirecting to results...</p>
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
        <Sidebar />
        <div className="quiz-container">
          <button className="quit-button" onClick={() => navigate("/")}>
            Quit Quiz
          </button>

          {/* Header */}
          <div className="quiz-header">
            <h2 className="category-name">{category}</h2>
            <div className="quiz-info">
              <span className="question-counter">
                Question {currentQuestionIndex + 1}/{questions.length}
              </span>
              <span className="timer">{timeLeft}s</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${getProgressPercentage()}%` }}
            />
          </div>

          {/* Scores */}
          <div className="scores-section">
            <div className="score-item user-score">
              <span>You</span>
              <strong>{score}</strong>
            </div>

            {!isSolo && (
              <>
                <div className="vs-divider">VS</div>
                <div className="score-item opponent-score">
                  <span>{opponent?.username || "Opponent"}</span>
                  <strong>{opponentScore}</strong>
                </div>
              </>
            )}
          </div>

          {/* Question */}
          <div className="question-card">
            <h3 className="question-text">{currentQuestion.question}</h3>
          </div>

          {/* Options */}
          <div className="options-grid">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                className={getAnswerClass(index)}
                onClick={() => handleAnswerSelect(index)}
                disabled={isAnswered}
              >
                <span className="option-letter">
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="option-text">{option}</span>
                {isAnswered && index === currentQuestion.correctAnswer && (
                  <span className="option-icon">✅</span>
                )}
                {isAnswered &&
                  index === selectedAnswer &&
                  index !== currentQuestion.correctAnswer && (
                    <span className="option-icon">❌</span>
                  )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Quiz;
