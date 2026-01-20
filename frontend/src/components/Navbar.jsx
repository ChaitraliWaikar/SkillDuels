// components/Navbar.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  User,
  Home,
  Swords,
  Gamepad2,
  Users,
  Trophy,
  Medal,
  Shield,
  LogOut,
} from "lucide-react";
import { useAuth } from "../../../backend/context/AuthContext";
import "../styles/navbar.css";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { currentUser, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
      setIsMenuOpen(false);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const navItems = [
    { name: "Home", path: "/", icon: Home },
    { name: "Start Battle", path: "/category", icon: Swords },
    { name: "Play Solo", path: "/solo-quiz", icon: Gamepad2 },
    { name: "Friends", path: "/friends", icon: Users },
    { name: "Leaderboard", path: "/leaderboard", icon: Trophy },
    { name: "Achievements", path: "/achievements", icon: Medal },
  ];

  if (isAdmin) {
    navItems.push({ name: "Admin Panel", path: "/admin", icon: Shield });
  }

  // Not logged in - show minimal navbar
  if (!currentUser) {
    return (
      <nav className="navbar">
        <div className="navbar-container">
          <Link to="/" className="logo">
            <span className="logo-text">SkillDuels</span>
          </Link>

          <div className="navbar-right">
            <Link to="/leaderboard" className="nav-link">
              <Trophy size={20} />
            </Link>
            <Link to="/login" className="nav-link profile-link">
              <User size={24} />
            </Link>
          </div>
        </div>
      </nav>
    );
  }

  // Logged in - show full navbar
  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo - Left */}
        <Link to="/" className="logo">
          <span className="logo-text">SkillDuels</span>
        </Link>

        {/* Desktop: Only Profile Icon (at the end/right) */}
        <div className="navbar-right desktop-only">
          <Link to="/profile" className="nav-link profile-link">
            <User size={24} />
          </Link>
        </div>

        {/* Mobile Hamburger (only on mobile) */}
        <button className="menu-toggle mobile-only" onClick={toggleMenu}>
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Mobile Sidebar Menu */}
        <div className={`mobile-menu ${isMenuOpen ? "open" : ""}`}>
          <div className="mobile-menu-header">
            <span>Menu</span>
          </div>

          {/* Profile first */}
          <Link to="/profile" className="mobile-menu-item" onClick={toggleMenu}>
            <User size={20} />
            <span>Profile</span>
          </Link>

          {/* All other navigation items */}
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className="mobile-menu-item"
              onClick={toggleMenu}
            >
              <item.icon size={20} />
              <span>{item.name}</span>
            </Link>
          ))}

          {/* Logout */}
          <button
            className="mobile-menu-item logout-btn"
            onClick={handleLogout}
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
