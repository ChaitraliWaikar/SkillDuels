// Profile.jsx
import React, { useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import '../styles/profile.css';

const Profile = () => {
  // Backend integration: Update these values from API
  const [userData, setUserData] = useState({
    name: 'Your Name',
    username: 'username',
    email: 'user@example.com',
    xp: 1250,
    rank: 'Silver',
    level: 15,
    wins: 32,
    losses: 18,
    totalBattles: 50,
    badges: 8,
    winRate: 64,
    profilePicture: null // URL or base64 string
  });

  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = React.useRef(null);

  // Example: Fetch user data from backend
  // useEffect(() => {
  //   fetch('/api/user/profile')
  //     .then(res => res.json())
  //     .then(data => setUserData(data));
  // }, []);

  const handleSave = () => {
    setIsEditing(false);
    console.log('Save profile data:', userData);
    // API call to update profile
    // fetch('/api/user/profile', {
    //   method: 'PUT',
    //   body: JSON.stringify(userData)
    // });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size should be less than 5MB');
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file');
        return;
      }

      // Convert to base64 for preview and storage
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setUserData({...userData, profilePicture: base64String});
        
        // Upload to backend
        // Option 1: Send base64 string
        // fetch('/api/user/profile-picture', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ image: base64String })
        // });
        
        // Option 2: Send as FormData (recommended for larger files)
        // const formData = new FormData();
        // formData.append('profilePicture', file);
        // fetch('/api/user/profile-picture', {
        //   method: 'POST',
        //   body: formData
        // })
        // .then(res => res.json())
        // .then(data => {
        //   setUserData({...userData, profilePicture: data.imageUrl});
        // });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="app-container">
      <Navbar />
      
      <div className="content-wrapper">
        <Sidebar />
        
        <main className="profile-main">
          <h1 className="page-title">My Profile</h1>

          <div className="profile-grid">
            {/* Profile Card */}
            <div className="profile-card">
              <div className="profile-avatar">
                {userData.profilePicture ? (
                  <img 
                    src={userData.profilePicture} 
                    alt="Profile" 
                    className="avatar-image"
                  />
                ) : (
                  <div className="avatar-circle">
                    {userData.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  style={{ display: 'none' }}
                />
                <button className="edit-avatar" onClick={handleAvatarClick}>
                  📷
                </button>
              </div>
              
              <h2 className="profile-name">{userData.name}</h2>
              <p className="profile-username">@{userData.username}</p>
              
              <div className="profile-badges">
                <span className="badge badge-rank">{userData.rank}</span>
                <span className="badge badge-level">Level {userData.level}</span>
              </div>

              {!isEditing ? (
                <>
                  <div className="profile-detail">
                    <span className="detail-label">Email</span>
                    <span className="detail-value">{userData.email}</span>
                  </div>
                  <button className="btn-edit" onClick={() => setIsEditing(true)}>
                    ✏️ Edit Profile
                  </button>
                </>
              ) : (
                <>
                  <div className="edit-form">
                    <input 
                      type="text" 
                      value={userData.name}
                      onChange={(e) => setUserData({...userData, name: e.target.value})}
                      placeholder="Name"
                    />
                    <input 
                      type="text" 
                      value={userData.username}
                      onChange={(e) => setUserData({...userData, username: e.target.value})}
                      placeholder="Username"
                    />
                    <input 
                      type="email" 
                      value={userData.email}
                      onChange={(e) => setUserData({...userData, email: e.target.value})}
                      placeholder="Email"
                    />
                  </div>
                  <div className="edit-actions">
                    <button className="btn-save" onClick={handleSave}>
                      💾 Save
                    </button>
                    <button className="btn-cancel" onClick={() => setIsEditing(false)}>
                      Cancel
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Stats Cards */}
            <div className="stats-container">
              <div className="stat-card-large">
                <div className="stat-card-sub">
                <div className="stat-icon">⚡</div>
                <div>
                  <h3>{userData.xp.toLocaleString()}</h3>
                  <p>Total XP</p>
                </div>
              </div>

              <div className="stat-card-sub">
                <div className="stat-icon">🏆</div>
                <div>
                  <h3>{userData.badges}</h3>
                  <p>Badges Earned</p>
                </div>
                </div>
              </div>
              

              <div className="battle-stats">
                <h3 className="section-title">Battle Statistics</h3>
                
                <div className="stat-row">
                  <div className="stat-item">
                    <div className="stat-number win">{userData.wins}</div>
                    <div className="stat-label">Wins</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-number loss">{userData.losses}</div>
                    <div className="stat-label">Losses</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-number total">{userData.totalBattles}</div>
                    <div className="stat-label">Total Battles</div>
                  </div>
                </div>

                
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Profile;