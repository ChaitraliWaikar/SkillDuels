// components/Sidebar.jsx
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  User,
  Swords,
  Gamepad2,
  Users,
  Trophy,
  Medal,
  Home,
  Shield,
  LogOut,
} from "lucide-react";
import { useAuth } from "../../../backend/context/AuthContext";
import "../styles/sidebar.css";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, isAdmin, logout } = useAuth();

  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  

  // Don't render sidebar if user is not logged in
  if (!currentUser) {
    return null;
  }

  return (
    <aside className="sidebar">
      <nav>
        {/* PROFILE */}
        <Link
          to="/profile"
          className={`sidebar-item ${isActive("/profile") ? "active" : ""}`}
        >
          <User size={20} />
          <span>Profile</span>
        </Link>

        {/* HOME */}
        <Link
          to="/"
          className={`sidebar-item ${isActive("/") ? "active" : ""}`}
        >
          <Home size={20} />
          <span>Home</span>
        </Link>

        {/* START BATTLE */}
        <Link
          to="/category"
          className={`sidebar-item ${isActive("/category") ? "active" : ""}`}
        >
          <Swords size={20} />
          <span>Start Battle</span>
        </Link>

        {/* PLAY SOLO */}
        <Link
          to="/solo-quiz"
          className={`sidebar-item ${isActive("/solo-quiz") ? "active" : ""}`}
        >
          <Gamepad2 size={20} />
          <span>Play Solo</span>
        </Link>

        {/* FRIENDS */}
        <Link
          to="/friends"
          className={`sidebar-item ${isActive("/friends") ? "active" : ""}`}
        >
          <Users size={20} />
          <span>Friends</span>
        </Link>

        {/* LEADERBOARD */}
        <Link
          to="/leaderboard"
          className={`sidebar-item ${isActive("/leaderboard") ? "active" : ""}`}
        >
          <Trophy size={20} />
          <span>Leaderboard</span>
        </Link>

        {/* ACHIEVEMENTS */}
        <Link
          to="/achievements"
          className={`sidebar-item ${isActive("/achievements") ? "active" : ""}`}
        >
          <Medal size={20} />
          <span>Achievements</span>
        </Link>

        {/* ADMIN PANEL — ONLY FOR ADMINS */}
     {isAdmin && (
      <Link to="/admin" className={`sidebar-item ${isActive("/admin") ? "active" : ""}`}>
        <Shield size={20} />
        <span>Admin Panel</span>
      </Link>
    )}

        {/* LOGOUT */}
        <button onClick={handleLogout} className="sidebar-item logout-btn">
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar;
