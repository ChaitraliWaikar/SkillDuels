// App.jsx - FIXED
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "../../backend/context/AuthContext";
import LoadingScreen from "./components/LoadingScreen";
import Home from "./components/Home";
import Profile from "./components/Profile";
import Categories from "./components/Categories";
import StartBattle from "./components/StartBattle";
import AdminPanel from "./components/AdminPanel";
import AddQuestion from "./components/AddQuestion";
import ManageQuestions from "./components/ManageQuestions";
import AddCategory from "./components/AddCategory";
import ManageCategories from "./components/ManageCategories";
import EditQuestion from "./components/EditQuestion";
import Quiz from "./components/Quiz";
import BattleResults from "./components/BattleResults";
import SoloQuiz from "./components/SoloQuiz";
import Leaderboard from "./components/Leaderboard";
import Achievements from "./components/Achievements";
import Friends from "./components/Friends";
import Login from "./components/Login";
import Signup from "./components/SignUp";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();
  
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// Admin Route Component
const AdminRoute = ({ children }) => {
  const { currentUser, isAdmin } = useAuth();
  
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

// Public Route (redirect to home if already logged in)
const PublicRoute = ({ children }) => {
  const { currentUser } = useAuth();
  return !currentUser ? children : <Navigate to="/" replace />;
};

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
      
      {/* Home - Accessible to all */}
      <Route path="/" element={<Home />} />
      
      {/* Leaderboard - Public */}
      <Route path="/leaderboard" element={<Leaderboard />} />
      
      {/* Protected Routes */}
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/category" element={<ProtectedRoute><Categories /></ProtectedRoute>} />
      <Route path="/start-battle" element={<ProtectedRoute><StartBattle /></ProtectedRoute>} />
      <Route path="/quiz" element={<ProtectedRoute><Quiz /></ProtectedRoute>} />
      <Route path="/battle-results" element={<ProtectedRoute><BattleResults /></ProtectedRoute>} />
      <Route path="/solo-quiz" element={<ProtectedRoute><SoloQuiz /></ProtectedRoute>} />
      <Route path="/achievements" element={<ProtectedRoute><Achievements /></ProtectedRoute>} />
      <Route path="/friends" element={<ProtectedRoute><Friends /></ProtectedRoute>} />
      
      {/* Admin Routes */}
      <Route path="/admin" element={<AdminRoute><AdminPanel /></AdminRoute>} />
      <Route path="/admin/add-question" element={<AdminRoute><AddQuestion /></AdminRoute>} />
      <Route path="/admin/manage-questions" element={<AdminRoute><ManageQuestions /></AdminRoute>} />
      <Route path="/admin/add-category" element={<AdminRoute><AddCategory /></AdminRoute>} />
      <Route path="/admin/manage-categories" element={<AdminRoute><ManageCategories /></AdminRoute>} />
      <Route path="/admin/edit-question/:id" element={<AdminRoute><EditQuestion /></AdminRoute>} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;