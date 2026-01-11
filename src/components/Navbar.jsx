// components/Navbar.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, User, Home, Swords, Gamepad2, Users, Trophy, Medal, Shield } from "lucide-react";
import "../styles/navbar.css";

// Simulating logged-in user (replace with real auth later)
const useAuth = () => {
  const currentUser = {
    id: 1,
    username: "admin123",
    role: "admin", // Change to "user" for normal users
  };
  return currentUser;
};

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const user = useAuth();
  const isAdmin = user.role === "admin";

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

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

  return (
    <nav className="navbar">
      {/* Logo - Left */}
      <Link to="/" className="logo">
        <h1>SkillDuels</h1>
      </Link>

      {/* Desktop: Only Profile Icon (at the end/right) */}
      <div className="desktop-nav">
        <Link to="/profile" className="profile-icon-link">
          <div className="profile-icon">
            <User size={26} strokeWidth={2.5} />
          </div>
        </Link>
      </div>

      {/* Mobile Hamburger (only on mobile) */}
      <button
        className="hamburger"
        onClick={toggleMenu}
        aria-label="Toggle menu"
      >
        {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* Mobile Sidebar Menu */}
      <div className={`mobile-menu ${isMenuOpen ? "open" : ""}`}>
        <div className="mobile-menu-header">
          <h2>Menu</h2>
          <button onClick={toggleMenu} aria-label="Close menu">
            <X size={28} />
          </button>
        </div>

        <div className="mobile-nav-links">
          {/* Profile first */}
          <Link to="/profile" onClick={toggleMenu} className="mobile-profile">
            <User size={26} /> Profile
          </Link>

          {/* All other navigation items */}
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={toggleMenu}
              className="mobile-nav-item"
            >
              <item.icon size={26} />
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;