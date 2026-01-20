// src/components/Friends.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../backend/context/AuthContext";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import "../styles/friends.css";

const Friends = () => {
  const navigate = useNavigate();
  const { currentUser, userData } = useAuth();
  const [activeTab, setActiveTab] = useState("friends-list");

  // Friends List State (Mock for now - will be implemented with backend)
  const [friends, setFriends] = useState([]);
  const [onlineStatus, setOnlineStatus] = useState({});

  // Pending Requests State
  const [pendingRequests, setPendingRequests] = useState([]);

  // Add Friend State
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Mock friends data
    const mockFriends = [
      {
        _id: "friend1",
        userId: "user1",
        username: "ProGamer123",
        totalXP: 5420,
        bestBadge: "Gold III",
        profilePicture: null,
        status: "online",
      },
      {
        _id: "friend2",
        userId: "user2",
        username: "QuizMaster",
        totalXP: 4850,
        bestBadge: "Silver II",
        profilePicture: null,
        status: "offline",
      },
    ];

    setFriends(mockFriends);

    const statusMap = {};
    mockFriends.forEach((friend) => {
      statusMap[friend.userId] = friend.status;
    });
    setOnlineStatus(statusMap);
  }, []);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setLoading(true);

    // Mock search results
    setTimeout(() => {
      const mockResults = [
        {
          _id: "user7",
          username: searchQuery,
          totalXP: 2300,
          bestBadge: "Silver I",
          profilePicture: null,
          friendStatus: "none",
        },
      ];
      setSearchResults(mockResults);
      setLoading(false);
    }, 500);
  };

  const sendFriendRequest = (userId) => {
    alert("Friend request sent! (Feature coming soon)");
    setSearchResults(
      searchResults.map((user) =>
        user._id === userId ? { ...user, friendStatus: "pending" } : user,
      ),
    );
  };

  const acceptFriendRequest = (requestId) => {
    alert("Friend request accepted! (Feature coming soon)");
    setPendingRequests(pendingRequests.filter((req) => req._id !== requestId));
  };

  const rejectFriendRequest = (requestId) => {
    alert("Friend request rejected");
    setPendingRequests(pendingRequests.filter((req) => req._id !== requestId));
  };

  const challengeFriend = (friend) => {
    alert(`Battle challenge to ${friend.username}! (Feature coming soon)`);
  };

  const removeFriend = (friendId) => {
    if (!window.confirm("Are you sure you want to remove this friend?")) return;
    setFriends(friends.filter((f) => f._id !== friendId));
    alert("Friend removed");
  };

  const getBadgeInfo = (badge) => {
    const badgeMap = {
      "Gold III": { icon: "🥇", class: "gold" },
      "Gold II": { icon: "🥇", class: "gold" },
      "Gold I": { icon: "🥇", class: "gold" },
      "Silver III": { icon: "🥈", class: "silver" },
      "Silver II": { icon: "🥈", class: "silver" },
      "Silver I": { icon: "🥈", class: "silver" },
      "Bronze III": { icon: "🥉", class: "bronze" },
      "Bronze II": { icon: "🥉", class: "bronze" },
      "Bronze I": { icon: "🥉", class: "bronze" },
    };
    return badgeMap[badge] || { icon: "🏅", class: "bronze" };
  };

  const sortedFriends = [...friends].sort((a, b) => {
    const aOnline = onlineStatus[a.userId] === "online";
    const bOnline = onlineStatus[b.userId] === "online";
    if (aOnline && !bOnline) return -1;
    if (!aOnline && bOnline) return 1;
    return 0;
  });

  return (
    <div className="app-container">
      <Navbar />
      <div className="content-wrapper">
        <Sidebar />
        <main className="friends-main">
          {/* Tab Navigation */}
          <div className="friends-tabs">
            <button
              className={`tab-button ${activeTab === "add-friend" ? "active" : ""}`}
              onClick={() => setActiveTab("add-friend")}
            >
              Add Friend
            </button>
            <button
              className={`tab-button ${activeTab === "pending" ? "active" : ""}`}
              onClick={() => setActiveTab("pending")}
            >
              Pending Requests
              {pendingRequests.length > 0 && (
                <span className="badge">{pendingRequests.length}</span>
              )}
            </button>
            <button
              className={`tab-button ${activeTab === "friends-list" ? "active" : ""}`}
              onClick={() => setActiveTab("friends-list")}
            >
              Friends List
            </button>
          </div>

          {/* Add Friend Tab */}
          {activeTab === "add-friend" && (
            <div className="tab-content">
              <h2 className="tab-title">Add Friend</h2>
              <div className="search-container">
                <input
                  type="text"
                  className="search-input"
                  placeholder="🔍 Enter username or email"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                />
                <button className="search-button" onClick={handleSearch}>
                  Search
                </button>
              </div>

              <div className="search-results">
                {loading ? (
                  <p className="loading-text">Searching...</p>
                ) : searchResults.length > 0 ? (
                  searchResults.map((user) => {
                    const badgeInfo = getBadgeInfo(user.bestBadge);
                    return (
                      <div key={user._id} className="user-card">
                        <div className="user-info">
                          <div className="user-avatar-small">
                            <div className="avatar-placeholder-small">
                              {user.username.charAt(0).toUpperCase()}
                            </div>
                          </div>
                          <div className="user-details-small">
                            <h3>{user.username}</h3>
                            <p>
                              <span
                                className={`badge-display ${badgeInfo.class}`}
                              >
                                {badgeInfo.icon} {user.bestBadge}
                              </span>
                              <span> • {user.totalXP.toLocaleString()} XP</span>
                            </p>
                          </div>
                        </div>
                        {user.friendStatus === "none" && (
                          <button
                            className="btn-add"
                            onClick={() => sendFriendRequest(user._id)}
                          >
                            Add
                          </button>
                        )}
                        {user.friendStatus === "pending" && (
                          <span className="status-pending">Pending</span>
                        )}
                      </div>
                    );
                  })
                ) : searchQuery ? (
                  <p className="no-results">No users found</p>
                ) : null}
              </div>
            </div>
          )}

          {/* Pending Requests Tab */}
          {activeTab === "pending" && (
            <div className="tab-content">
              <h2 className="tab-title">Pending Requests</h2>
              {pendingRequests.length > 0 ? (
                <div className="requests-list">
                  {pendingRequests.map((request) => {
                    const badgeInfo = getBadgeInfo(request.bestBadge);
                    return (
                      <div key={request._id} className="request-card">
                        <div className="user-info">
                          <div className="user-avatar-small">
                            <div className="avatar-placeholder-small">
                              {request.username.charAt(0).toUpperCase()}
                            </div>
                          </div>
                          <div className="user-details-small">
                            <h3>{request.username}</h3>
                            <p>
                              <span
                                className={`badge-display ${badgeInfo.class}`}
                              >
                                {badgeInfo.icon} {request.bestBadge}
                              </span>
                              <span>
                                {" "}
                                • {request.totalXP.toLocaleString()} XP
                              </span>
                            </p>
                          </div>
                        </div>
                        <div className="request-actions">
                          <button
                            className="btn-accept"
                            onClick={() => acceptFriendRequest(request._id)}
                          >
                            Accept
                          </button>
                          <button
                            className="btn-reject"
                            onClick={() => rejectFriendRequest(request._id)}
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="no-data">No pending requests</p>
              )}
            </div>
          )}

          {/* Friends List Tab */}
          {activeTab === "friends-list" && (
            <div className="tab-content">
              <h2 className="tab-title">Friends List</h2>
              {sortedFriends.length > 0 ? (
                <div className="friends-list">
                  {sortedFriends.map((friend) => {
                    const isOnline = onlineStatus[friend.userId] === "online";
                    const badgeInfo = getBadgeInfo(friend.bestBadge);
                    return (
                      <div key={friend._id} className="friend-card">
                        <div className="user-info">
                          <div className="user-avatar-small">
                            <div className="avatar-placeholder-small">
                              {friend.username.charAt(0).toUpperCase()}
                            </div>
                            <div
                              className={`status-indicator ${isOnline ? "online" : "offline"}`}
                            />
                          </div>
                          <div className="user-details-small">
                            <h3>{friend.username}</h3>
                            <p>
                              <span
                                className={`badge-display ${badgeInfo.class}`}
                              >
                                {badgeInfo.icon} {friend.bestBadge}
                              </span>
                              <span>
                                {" "}
                                • {friend.totalXP.toLocaleString()} XP
                              </span>
                            </p>
                            <span
                              className={`status-text ${isOnline ? "online" : "offline"}`}
                            >
                              {isOnline ? "Online" : "Offline"}
                            </span>
                          </div>
                        </div>
                        <div className="friend-actions">
                          {isOnline && (
                            <button
                              className="btn-challenge"
                              onClick={() => challengeFriend(friend)}
                            >
                              Challenge
                            </button>
                          )}
                          <button
                            className="btn-remove"
                            onClick={() => removeFriend(friend._id)}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="no-data">
                  No friends yet. Add some friends to get started!
                  <br />
                  <small>
                    (Friend system coming soon with real-time features)
                  </small>
                </p>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Friends;
