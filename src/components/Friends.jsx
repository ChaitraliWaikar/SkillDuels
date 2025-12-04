/* eslint-disable no-unused-vars */
// ==========================================
// Friends.jsx - Updated with Badge System
// ==========================================
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import '../styles/friends.css';

const Friends = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('friends-list');
  const [socket, setSocket] = useState(null);
  const currentUserId = 'user123';// From auth

  // Friends List State
  const [friends, setFriends] = useState([]);
  const [onlineStatus, setOnlineStatus] = useState({});

  // Pending Requests State
  const [pendingRequests, setPendingRequests] = useState([]);

  // Add Friend State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // Initialize Socket.IO
  useEffect(() => {
    // const newSocket = io('http://localhost:5000', {
    //   auth: { token: localStorage.getItem('authToken') }
    // });
    // setSocket(newSocket);

    // // Join user's room for receiving friend requests
    // newSocket.emit('userOnline', { userId: currentUserId });

    // // Listen for friend status updates
    // newSocket.on('friendStatusUpdate', (data) => {
    //   setOnlineStatus(prev => ({
    //     ...prev,
    //     [data.userId]: data.status
    //   }));
    // });

    // // Listen for new friend requests
    // newSocket.on('friendRequestReceived', (request) => {
    //   setPendingRequests(prev => [request, ...prev]);
    // });

    // // Listen for battle invitations
    // newSocket.on('battleInviteReceived', (invite) => {
    //   if (window.confirm(`${invite.fromUsername} challenged you to a battle in ${invite.category}!`)) {
    //     acceptBattleInvite(invite);
    //   }
    // });

    // return () => newSocket.close();

    fetchFriends();
    fetchPendingRequests();
  }, []);

  // Fetch friends list
  const fetchFriends = async () => {
    try {
      // MongoDB query with badge information:
      // db.friendships.aggregate([
      //   {
      //     $match: {
      //       $or: [{ userId1: currentUserId }, { userId2: currentUserId }],
      //       status: 'accepted'
      //     }
      //   },
      //   {
      //     $lookup: {
      //       from: 'users',
      //       let: { friendId: { $cond: [{ $eq: ['$userId1', currentUserId] }, '$userId2', '$userId1'] } },
      //       pipeline: [
      //         { $match: { $expr: { $eq: ['$_id', '$$friendId'] } } },
      //         { $project: { username: 1, bestBadge: 1, totalXP: 1, profilePicture: 1 } }
      //       ],
      //       as: 'friendData'
      //     }
      //   }
      // ])
      
      // const response = await fetch('/api/friends/list', {
      //   headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
      // });
      // const data = await response.json();
      // setFriends(data.friends);

      // Mock data with badges
      const mockFriends = [
        {
          _id: 'friend1',
          userId: 'user1',
          username: 'ProGamer123',
          totalXP: 5420,
          bestBadge: 'Gold III',
          profilePicture: null,
          status: 'online'
        },
        {
          _id: 'friend2',
          userId: 'user2',
          username: 'QuizMaster',
          totalXP: 4850,
          bestBadge: 'Silver II',
          profilePicture: null,
          status: 'offline'
        },
        {
          _id: 'friend3',
          userId: 'user3',
          username: 'Brainiac',
          totalXP: 4320,
          bestBadge: 'Silver II',
          profilePicture: null,
          status: 'online'
        },
        {
          _id: 'friend4',
          userId: 'user4',
          username: 'SmartKid',
          totalXP: 2100,
          bestBadge: 'Bronze II',
          profilePicture: null,
          status: 'offline'
        }
      ];

      setFriends(mockFriends);

      // Set initial online status
      const statusMap = {};
      mockFriends.forEach(friend => {
        statusMap[friend.userId] = friend.status;
      });
      setOnlineStatus(statusMap);
    } catch (error) {
      console.error('Error fetching friends:', error);
    }
  };

  // Fetch pending requests
  const fetchPendingRequests = async () => {
    try {
      // MongoDB query with badge info:
      // db.friendRequests.aggregate([
      //   { $match: { toUserId: currentUserId, status: 'pending' } },
      //   {
      //     $lookup: {
      //       from: 'users',
      //       localField: 'fromUserId',
      //       foreignField: '_id',
      //       as: 'fromUser'
      //     }
      //   },
      //   { $unwind: '$fromUser' },
      //   {
      //     $project: {
      //       fromUserId: 1,
      //       username: '$fromUser.username',
      //       bestBadge: '$fromUser.bestBadge',
      //       totalXP: '$fromUser.xp',
      //       profilePicture: '$fromUser.profilePicture',
      //       sentAt: 1
      //     }
      //   }
      // ])
      
      // const response = await fetch('/api/friends/pending-requests', {
      //   headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
      // });
      // const data = await response.json();
      // setPendingRequests(data.requests);

      // Mock data
      const mockRequests = [
        {
          _id: 'req1',
          fromUserId: 'user5',
          username: 'NewPlayer',
          totalXP: 1200,
          bestBadge: 'Bronze I',
          profilePicture: null,
          sentAt: new Date()
        },
        {
          _id: 'req2',
          fromUserId: 'user6',
          username: 'ChallengerX',
          totalXP: 2890,
          bestBadge: 'Silver I',
          profilePicture: null,
          sentAt: new Date()
        }
      ];

      setPendingRequests(mockRequests);
    } catch (error) {
      console.error('Error fetching pending requests:', error);
    }
  };

  // Search users
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      // MongoDB query with badge:
      // db.users.find({
      //   $or: [
      //     { username: { $regex: searchQuery, $options: 'i' } },
      //     { email: searchQuery }
      //   ],
      //   _id: { $ne: currentUserId }
      // })
      // .select('username bestBadge xp profilePicture')
      // .limit(10)
      
      // const response = await fetch(`/api/friends/search?q=${searchQuery}`, {
      //   headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
      // });
      // const data = await response.json();
      // setSearchResults(data.users);

      // Mock data
      const mockResults = [
        {
          _id: 'user7',
          username: 'TestUser123',
          totalXP: 2300,
          bestBadge: 'Silver I',
          profilePicture: null,
          friendStatus: 'none' // 'none', 'pending', 'friends'
        }
      ];

      setSearchResults(mockResults);
    } catch (error) {
      console.error('Error searching users:', error);
    } finally {
      setLoading(false);
    }
  };

  // Send friend request
  const sendFriendRequest = async (userId) => {
    try {
      // MongoDB: Insert into friendRequests collection
      // const response = await fetch('/api/friends/send-request', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      //   },
      //   body: JSON.stringify({ toUserId: userId })
      // });

      // // Socket.IO: Notify the recipient
      // socket?.emit('sendFriendRequest', {
      //   fromUserId: currentUserId,
      //   toUserId: userId
      // });

      alert('Friend request sent!');
      setSearchResults(searchResults.map(user => 
        user._id === userId ? { ...user, friendStatus: 'pending' } : user
      ));
    } catch (error) {
      console.error('Error sending friend request:', error);
    }
  };

  // Accept friend request
  const acceptFriendRequest = async (requestId, fromUserId) => {
    try {
      // MongoDB: Update friendRequests status and create friendship
      // const response = await fetch('/api/friends/accept-request', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      //   },
      //   body: JSON.stringify({ requestId })
      // });

      // // Socket.IO: Notify sender
      // socket?.emit('friendRequestAccepted', {
      //   toUserId: fromUserId,
      //   fromUserId: currentUserId
      // });

      setPendingRequests(pendingRequests.filter(req => req._id !== requestId));
      fetchFriends(); // Refresh friends list
      alert('Friend request accepted!');
    } catch (error) {
      console.error('Error accepting friend request:', error);
    }
  };

  // Reject friend request
  const rejectFriendRequest = async (requestId) => {
    try {
      // MongoDB: Delete or update friendRequests status
      // await fetch(`/api/friends/reject-request/${requestId}`, {
      //   method: 'DELETE',
      //   headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
      // });

      setPendingRequests(pendingRequests.filter(req => req._id !== requestId));
      alert('Friend request rejected');
    } catch (error) {
      console.error('Error rejecting friend request:', error);
    }
  };

  // Send battle challenge
  const challengeFriend = (friend) => {
    // Socket.IO: Send battle invitation
    // socket?.emit('sendBattleInvite', {
    //   fromUserId: currentUserId,
    //   toUserId: friend.userId,
    //   fromUsername: 'YourUsername'
    // });

    alert(`Battle challenge sent to ${friend.username}!`);
  };

  // Accept battle invite
  const acceptBattleInvite = (invite) => {
    // Navigate to category selection or directly to start battle
    navigate('/categories', {
      state: {
        battleInvite: true,
        opponentId: invite.fromUserId,
        opponentUsername: invite.fromUsername
      }
    });
  };

  // Remove friend
  const removeFriend = async (friendId) => {
    if (!window.confirm('Are you sure you want to remove this friend?')) return;

    try {
      // MongoDB: Delete friendship document
      // await fetch(`/api/friends/remove/${friendId}`, {
      //   method: 'DELETE',
      //   headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
      // });

      setFriends(friends.filter(f => f._id !== friendId));
      alert('Friend removed');
    } catch (error) {
      console.error('Error removing friend:', error);
    }
  };

  // Helper function to get badge icon and class
  const getBadgeInfo = (badge) => {
    const badgeMap = {
      'Gold III': { icon: '🥇', class: 'gold' },
      'Silver II': { icon: '🥈', class: 'silver' },
      'Silver I': { icon: '🥈', class: 'silver' },
      'Bronze II': { icon: '🥉', class: 'bronze' },
      'Bronze I': { icon: '🥉', class: 'bronze' }
    };
    return badgeMap[badge] || { icon: '🏅', class: 'bronze' };
  };

  // Sort friends: online first
  const sortedFriends = [...friends].sort((a, b) => {
    const aOnline = onlineStatus[a.userId] === 'online';
    const bOnline = onlineStatus[b.userId] === 'online';
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
              className={`tab-button ${activeTab === 'add-friend' ? 'active' : ''}`}
              onClick={() => setActiveTab('add-friend')}
            >
              Add Friend
            </button>
            <button
              className={`tab-button ${activeTab === 'pending' ? 'active' : ''}`}
              onClick={() => setActiveTab('pending')}
            >
              Pending Requests
              {pendingRequests.length > 0 && (
                <span className="badge">{pendingRequests.length}</span>
              )}
            </button>
            <button
              className={`tab-button ${activeTab === 'friends-list' ? 'active' : ''}`}
              onClick={() => setActiveTab('friends-list')}
            >
              Friends List
            </button>
          </div>

          {/* Add Friend Tab */}
          {activeTab === 'add-friend' && (
            <div className="tab-content">
              <h2 className="tab-title">Add Friend</h2>
              <div className="search-container">
                <input
                  type="text"
                  className="search-input"
                  placeholder="🔍 Enter username or email"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
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
                            {user.profilePicture ? (
                              <img src={user.profilePicture} alt={user.username} />
                            ) : (
                              <div className="avatar-placeholder-small">
                                {user.username.charAt(0).toUpperCase()}
                              </div>
                            )}
                          </div>
                          <div className="user-details-small">
                            <h3>{user.username}</h3>
                            <p>
                              <span className={`badge-display ${badgeInfo.class}`}>
                                {badgeInfo.icon} {user.bestBadge}
                              </span>
                              <span>• {user.totalXP.toLocaleString()} XP</span>
                            </p>
                          </div>
                        </div>
                        {user.friendStatus === 'none' && (
                          <button
                            className="btn-add"
                            onClick={() => sendFriendRequest(user._id)}
                          >
                            Add
                          </button>
                        )}
                        {user.friendStatus === 'pending' && (
                          <span className="status-pending">Pending</span>
                        )}
                        {user.friendStatus === 'friends' && (
                          <span className="status-friends">Friends</span>
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
          {activeTab === 'pending' && (
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
                            {request.profilePicture ? (
                              <img src={request.profilePicture} alt={request.username} />
                            ) : (
                              <div className="avatar-placeholder-small">
                                {request.username.charAt(0).toUpperCase()}
                              </div>
                            )}
                          </div>
                          <div className="user-details-small">
                            <h3>{request.username}</h3>
                            <p>
                              <span className={`badge-display ${badgeInfo.class}`}>
                                {badgeInfo.icon} {request.bestBadge}
                              </span>
                              <span>• {request.totalXP.toLocaleString()} XP</span>
                            </p>
                          </div>
                        </div>
                        <div className="request-actions">
                          <button
                            className="btn-accept"
                            onClick={() => acceptFriendRequest(request._id, request.fromUserId)}
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
          {activeTab === 'friends-list' && (
            <div className="tab-content">
              <h2 className="tab-title">Friends List</h2>
              {sortedFriends.length > 0 ? (
                <div className="friends-list">
                  {sortedFriends.map((friend) => {
                    const isOnline = onlineStatus[friend.userId] === 'online';
                    const badgeInfo = getBadgeInfo(friend.bestBadge);
                    return (
                      <div key={friend._id} className="friend-card">
                        <div className="user-info">
                          <div className="user-avatar-small">
                            {friend.profilePicture ? (
                              <img src={friend.profilePicture} alt={friend.username} />
                            ) : (
                              <div className="avatar-placeholder-small">
                                {friend.username.charAt(0).toUpperCase()}
                              </div>
                            )}
                            <div className={`status-indicator ${isOnline ? 'online' : 'offline'}`} />
                          </div>
                          <div className="user-details-small">
                            <h3>{friend.username}</h3>
                            <p>
                              <span className={`badge-display ${badgeInfo.class}`}>
                                {badgeInfo.icon} {friend.bestBadge}
                              </span>
                              <span>• {friend.totalXP.toLocaleString()} XP</span>
                            </p>
                            <span className={`status-text ${isOnline ? 'online' : 'offline'}`}>
                              {isOnline ? 'Online' : 'Offline'}
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
                <p className="no-data">No friends yet. Add some friends to get started!</p>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Friends;