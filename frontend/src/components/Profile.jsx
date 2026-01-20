// src/components/Profile.jsx - FIXED
import React, { useState, useEffect } from "react";
import { useAuth } from "../../../backend/context/AuthContext";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import "../styles/profile.css";

const Profile = () => {
  const { currentUser, userData, updateUserProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    profilePicture: null,
  });

  const fileInputRef = React.useRef(null);

  // Load user data when component mounts or userData changes
  useEffect(() => {
    if (userData) {
      setFormData({
        name: userData.name || userData.username || "",
        username: userData.username || "",
        email: userData.email || currentUser?.email || "",
        profilePicture: userData.profilePicture || null,
      });
    }
  }, [userData, currentUser]);

  const handleSave = async () => {
    setError("");
    setSuccess("");

    // Validation
    if (!formData.name.trim()) {
      setError("Name cannot be empty");
      return;
    }

    if (!formData.username.trim()) {
      setError("Username cannot be empty");
      return;
    }

    if (formData.username.length < 3) {
      setError("Username must be at least 3 characters");
      return;
    }

    try {
      setLoading(true);

      // Prepare updates (only include changed fields)
      const updates = {};
      if (formData.name !== userData.name) updates.name = formData.name.trim();
      if (formData.username !== userData.username)
        updates.username = formData.username.trim();
      if (formData.profilePicture !== userData.profilePicture)
        updates.profilePicture = formData.profilePicture;

      if (Object.keys(updates).length > 0) {
        await updateUserProfile(currentUser.uid, updates);
        setSuccess("Profile updated successfully!");
        setIsEditing(false);

        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setIsEditing(false);
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      setError("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("File size should be less than 5MB");
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file");
      return;
    }

    // Convert to base64
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData({ ...formData, profilePicture: reader.result });
      setError("");
    };
    reader.onerror = () => {
      setError("Failed to read image file");
    };
    reader.readAsDataURL(file);
  };

  const handleAvatarClick = () => {
    if (isEditing) {
      fileInputRef.current?.click();
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setError("");
    setSuccess("");
    // Reset form data to original userData
    if (userData) {
      setFormData({
        name: userData.name || userData.username || "",
        username: userData.username || "",
        email: userData.email || currentUser?.email || "",
        profilePicture: userData.profilePicture || null,
      });
    }
  };

  if (!userData) {
    return (
      <>
        <Navbar />
        <div className="home-wrapper">
          <Sidebar />
          <div className="profile-container">
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "50vh",
                color: "#fff",
              }}
            >
              <div className="loading-spinner"></div>
              <p style={{ marginTop: "1rem" }}>Loading profile...</p>
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
        <div className="profile-container">
          <h1 className="page-title">My Profile</h1>

          {error && (
            <div
              className="profile-error"
              style={{
                background: "rgba(239, 68, 68, 0.1)",
                border: "1px solid #ef4444",
                color: "#ef4444",
                padding: "0.75rem 1rem",
                borderRadius: "8px",
                marginBottom: "1rem",
              }}
            >
              {error}
            </div>
          )}

          {success && (
            <div
              className="profile-success"
              style={{
                background: "rgba(34, 197, 94, 0.1)",
                border: "1px solid #22c55e",
                color: "#22c55e",
                padding: "0.75rem 1rem",
                borderRadius: "8px",
                marginBottom: "1rem",
              }}
            >
              {success}
            </div>
          )}

          {/* Profile Card */}
          <div className="profile-card">
            <div className="profile-avatar-section">
              <div
                className="profile-avatar"
                onClick={handleAvatarClick}
                style={{ cursor: isEditing ? "pointer" : "default" }}
              >
                {formData.profilePicture ? (
                  <img src={formData.profilePicture} alt="Profile" />
                ) : (
                  <div className="avatar-placeholder">
                    {(formData.name || formData.username || "U")
                      .charAt(0)
                      .toUpperCase()}
                  </div>
                )}
                {isEditing && (
                  <div
                    className="avatar-overlay"
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: "rgba(0,0,0,0.5)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "50%",
                      fontSize: "2rem",
                    }}
                  >
                    📷
                  </div>
                )}
              </div>

              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                accept="image/*"
                onChange={handleImageUpload}
              />
            </div>

            <h2 className="profile-name">
              {formData.name || formData.username}
            </h2>
            <p className="profile-username">@{formData.username}</p>
            <p className="profile-rank">
              {userData.rank || "Bronze I"} • Level {userData.level || 1}
            </p>

            {!isEditing ? (
              <>
                <div className="profile-info">
                  <div className="info-row">
                    <strong>Email</strong>
                    <span>{formData.email}</span>
                  </div>
                </div>

                <button className="btn-edit" onClick={() => setIsEditing(true)}>
                  ✏️ Edit Profile
                </button>
              </>
            ) : (
              <>
                <div className="profile-edit-form">
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Name"
                    disabled={loading}
                  />
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value })
                    }
                    placeholder="Username"
                    disabled={loading}
                  />
                  <input
                    type="email"
                    value={formData.email}
                    placeholder="Email (cannot be changed)"
                    disabled
                  />
                </div>

                <div className="profile-actions">
                  <button
                    className="btn-save"
                    onClick={handleSave}
                    disabled={loading}
                  >
                    {loading ? "Saving..." : "💾 Save"}
                  </button>
                  <button
                    className="btn-cancel"
                    onClick={handleCancel}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Stats Cards */}
          <div className="stats-cards">
            <div className="stat-card-profile">
              <div className="stat-icon">⚡</div>
              <div className="stat-value">
                {(userData.xp || 0).toLocaleString()}
              </div>
              <div className="stat-label">Total XP</div>
            </div>

            <div className="stat-card-profile">
              <div className="stat-icon">🏆</div>
              <div className="stat-value">{userData.badges || 0}</div>
              <div className="stat-label">Badges Earned</div>
            </div>
          </div>

          {/* Battle Statistics */}
          <div className="battle-stats">
            <h3>Battle Statistics</h3>
            <div className="stats-grid-profile">
              <div className="stat-item">
                <div className="stat-number win">{userData.wins || 0}</div>
                <div className="stat-text">Wins</div>
              </div>
              <div className="stat-item">
                <div className="stat-number loss">{userData.losses || 0}</div>
                <div className="stat-text">Losses</div>
              </div>
              <div className="stat-item">
                <div className="stat-number total">
                  {userData.totalBattles || 0}
                </div>
                <div className="stat-text">Total Battles</div>
              </div>
              <div className="stat-item">
                <div className="stat-number winrate">
                  {userData.winRate || 0}%
                </div>
                <div className="stat-text">Win Rate</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
