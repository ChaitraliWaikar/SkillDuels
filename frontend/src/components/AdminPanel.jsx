// src/components/AdminPanel.jsx - Enhanced with Stats
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../backend/context/AuthContext";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import "../styles/adminpanel.css";
import { mockApi } from "../../../backend/services/mockApi";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../backend/firebase/config";

const AdminPanel = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalQuestions: 0,
    totalCategories: 0,
    totalBattles: 0,
    loading: true,
  });

  useEffect(() => {
    fetchAdminStats();
  }, []);

  const fetchAdminStats = async () => {
    try {
      // Fetch from Firebase
      const usersSnapshot = await getDocs(collection(db, "users"));
      const totalUsers = usersSnapshot.size;

      // Fetch from mockApi (localStorage)
      const categories = await mockApi.getCategories();
      const questions = await mockApi.getQuestions();

      setStats({
        totalUsers,
        totalQuestions: questions.length,
        totalCategories: categories.length,
        totalBattles: 0, // Will be implemented later
        loading: false,
      });

      console.log("📊 Admin stats loaded:", {
        totalUsers,
        totalQuestions: questions.length,
        totalCategories: categories.length,
      });
    } catch (error) {
      console.error("Error fetching admin stats:", error);
      setStats((prev) => ({ ...prev, loading: false }));
    }
  };

  const adminOptions = [
    {
      id: 1,
      title: "Add Question",
      route: "/admin/add-question",
      icon: "➕",
      description: "Create new quiz questions",
    },
    {
      id: 2,
      title: "Manage Questions",
      route: "/admin/manage-questions",
      icon: "📝",
      description: "Edit or delete questions",
    },
    {
      id: 3,
      title: "Add Category",
      route: "/admin/add-category",
      icon: "🏷️",
      description: "Create new categories",
    },
    {
      id: 4,
      title: "Manage Categories",
      route: "/admin/manage-categories",
      icon: "📂",
      description: "Edit or delete categories",
    },
  ];

  if (!isAdmin) {
    return (
      <div className="app-container">
        <Navbar />
        <div className="content-wrapper">
          <Sidebar />
          <main className="admin-main">
            <div className="error-container">
              <h2>Access Denied</h2>
              <p>You need admin privileges to access this page.</p>
              <button
                onClick={() => navigate("/")}
                className="btn-admin-choose"
              >
                Go Home
              </button>
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
        <main className="admin-main">
          <h1 style={{ color: "#fff", marginBottom: "2rem", fontSize: "2rem" }}>
            🛡️ Admin Dashboard
          </h1>

          {/* Stats Overview */}
          {stats.loading ? (
            <div style={{ color: "#fff", marginBottom: "2rem" }}>
              Loading stats...
            </div>
          ) : (
            <div className="stats-grid" style={{ marginBottom: "3rem" }}>
              <div
                className="stat-card"
                style={{
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                }}
              >
                <p className="stat-label">Total Users</p>
                <p className="stat-value">{stats.totalUsers}</p>
              </div>
              <div
                className="stat-card"
                style={{
                  background:
                    "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                }}
              >
                <p className="stat-label">Total Questions</p>
                <p className="stat-value">{stats.totalQuestions}</p>
              </div>
              <div
                className="stat-card"
                style={{
                  background:
                    "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
                }}
              >
                <p className="stat-label">Total Categories</p>
                <p className="stat-value">{stats.totalCategories}</p>
              </div>
              <div
                className="stat-card"
                style={{
                  background:
                    "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
                }}
              >
                <p className="stat-label">Total Battles</p>
                <p className="stat-value">{stats.totalBattles}</p>
              </div>
            </div>
          )}

          {/* Admin Actions */}
          <div className="admin-grid">
            {adminOptions.map((option) => (
              <div key={option.id} className="admin-card">
                <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>
                  {option.icon}
                </div>
                <h3>{option.title}</h3>
                <p
                  style={{
                    color: "#9ca3af",
                    fontSize: "0.875rem",
                    marginBottom: "1rem",
                  }}
                >
                  {option.description}
                </p>
                <button
                  className="btn-admin-choose"
                  onClick={() => navigate(option.route)}
                >
                  OPEN
                </button>
              </div>
            ))}
          </div>

          {/* Debug Section */}
          <div
            style={{
              marginTop: "3rem",
              padding: "1.5rem",
              background: "rgba(0,0,0,0.3)",
              borderRadius: "12px",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <h3 style={{ color: "#fff", marginBottom: "1rem" }}>
              🔧 Debug Tools
            </h3>
            <button
              onClick={() => mockApi.debugStorage()}
              className="btn-admin-choose"
              style={{ marginRight: "1rem" }}
            >
              Check Storage
            </button>
            <button onClick={fetchAdminStats} className="btn-admin-choose">
              Refresh Stats
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminPanel;
