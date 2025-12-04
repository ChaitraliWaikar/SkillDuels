/* eslint-disable no-unused-vars */
// components/Navbar.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/navbar.css";
import { User } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      {/* Logo */}
      <Link to="/" className="logo">
        <h1>SkillDuels</h1>
      </Link>

      {/* Desktop Navigation */}
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/achievements">Achievements</Link>
        <Link to="/category">Battles</Link>
        <Link to="/leaderboard">Leaderboard</Link>

        {/* Profile Icon — NOW FULLY CLICKABLE */}
        <Link to="/profile" className="profile-icon-link">
          <div className="profile-icon">
            <User size={22} strokeWidth={2.5} />
          </div>
        </Link>
      </div>

      {/* Mobile Profile Icon — ALSO CLICKABLE */}
      <Link to="/profile" className="mobile-only">
        <div className="profile-icon">
          <User size={22} strokeWidth={2.5} />
        </div>
      </Link>
    </nav>
  );
};

export default Navbar;