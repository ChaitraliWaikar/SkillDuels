// components/Sidebar.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/sidebar.css";
import { 
  User, Swords, Gamepad2, Users, Trophy, Medal, 
  Home, Shield, Settings 
} from "lucide-react";

// Simulating logged-in user (replace with real auth later)
const useAuth = () => {
  // Replace this with your real auth logic (e.g. from context, Redux, etc.)
  const currentUser = {
    id: 1,
    username: "admin123",
    role: "admin"  // ← "admin" or "user"
    // role: "user" → for normal users
  };
  return currentUser;
};

const Sidebar = () => {
  const location = useLocation();
  const user = useAuth();

  const isActive = (path) => location.pathname === path;
  const isAdmin = user.role === "admin";

  return (
    <aside className="sidebar">
      <div className="sidebar-section">
        {/* PROFILE */}
        <Link to="/profile" className="sidebar-link">
          <button className={`sidebar-btn ${isActive("/profile") ? "active" : ""}`}>
            <User size={25} className="icon" />
            <span>Profile</span>
          </button>
        </Link>

        {/* HOME */}
        <Link to="/" className="sidebar-link">
          <button className={`sidebar-btn ${isActive("/") ? "active" : ""}`}>
            <Home size={25} className="icon" />
            <span>Home</span>
          </button>
        </Link>

        {/* START BATTLE */}
        <Link to="/category" className="sidebar-link">
          <button className={`sidebar-btn ${isActive("/category") ? "active" : ""}`}>
            <Swords size={25} className="icon" />
            <span>Start Battle</span>
          </button>
        </Link>

        {/* PLAY SOLO */}
        <Link to="/solo-quiz" className="sidebar-link">
          <button className={`sidebar-btn ${isActive("/solo") ? "active" : ""}`}>
            <Gamepad2 size={25} className="icon" />
            <span>Play Solo</span>
          </button>
        </Link>

        {/* FRIENDS */}
        <Link to="/friends" className="sidebar-link">
          <button className={`sidebar-btn ${isActive("/friends") ? "active" : ""}`}>
            <Users size={25} className="icon" />
            <span>Friends</span>
          </button>
        </Link>

        {/* LEADERBOARD */}
        <Link to="/leaderboard" className="sidebar-link">
          <button className={`sidebar-btn ${isActive("/leaderboard") ? "active" : ""}`}>
            <Trophy size={25} className="icon" />
            <span>Leaderboard</span>
          </button>
        </Link>

        {/* ACHIEVEMENTS */}
        <Link to="/achievements" className="sidebar-link">
          <button className={`sidebar-btn ${isActive("/achievements") ? "active" : ""}`}>
            <Medal size={25} className="icon" />
            <span>Achievements</span>
          </button>
        </Link>

        {/* ADMIN PANEL — ONLY FOR ADMINS */}
        {isAdmin && (
          <Link to="/admin" className="sidebar-link">
            <button className={`sidebar-btn admin-btn ${isActive("/admin") ? "active" : ""}`}>
              <Shield size={25} className="icon" />
              <span>Admin Panel</span>
            </button>
          </Link>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;