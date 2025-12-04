/* eslint-disable react-hooks/immutability */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import '../styles/leaderboard.css';

const Leaderboard = () => {
  const navigate = useNavigate();
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState('user123'); // Get from auth

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      // Backend API call to fetch leaderboard
      // MongoDB Aggregation Pipeline:
      // db.users.aggregate([
      //   {
      //     $lookup: {
      //       from: "battles",
      //       localField: "_id",
      //       foreignField: "userId",
      //       as: "userBattles"
      //     }
      //   },
      //   {
      //     $addFields: {
      //       bestBadge: {
      //         $max: "$badges.rank" // Get highest badge rank
      //       },
      //       totalBattles: { $size: "$userBattles" },
      //       wins: {
      //         $size: {
      //           $filter: {
      //             input: "$userBattles",
      //             cond: { $eq: ["$$this.winner", "$_id"] }
      //           }
      //         }
      //       }
      //     }
      //   },
      //   { $sort: { xp: -1 } },
      //   { $limit: 100 }
      // ])
      
      // const response = await fetch('/api/leaderboard');
      // const data = await response.json();
      // setLeaderboardData(data.users);

      // Mock data for demonstration
      const mockData = [
        {
          _id: 'user1',
          username: 'ProGamer123',
          xp: 5420,
          level: 54,
          wins: 120,
          totalBattles: 150,
          profilePicture: null,
          rank: 1,
          bestBadge: 'Gold III' // Highest badge unlocked
        },
        {
          _id: 'user2',
          username: 'QuizMaster',
          xp: 4850,
          level: 48,
          wins: 98,
          totalBattles: 130,
          profilePicture: null,
          rank: 2,
          bestBadge: 'Gold III'
        },
        {
          _id: 'user3',
          username: 'Brainiac',
          xp: 4320,
          level: 43,
          wins: 87,
          totalBattles: 115,
          profilePicture: null,
          rank: 3,
          bestBadge: 'Silver II'
        },
        {
          _id: 'user123',
          username: 'YourUsername',
          xp: 3890,
          level: 38,
          wins: 75,
          totalBattles: 105,
          profilePicture: null,
          rank: 4,
          bestBadge: 'Silver II'
        },
        {
          _id: 'user5',
          username: 'SmartPlayer',
          xp: 3540,
          level: 35,
          wins: 68,
          totalBattles: 95,
          profilePicture: null,
          rank: 5,
          bestBadge: 'Silver I'
        },
        {
          _id: 'user6',
          username: 'Challenger99',
          xp: 3120,
          level: 31,
          wins: 55,
          totalBattles: 85,
          profilePicture: null,
          rank: 6,
          bestBadge: 'Bronze II'
        },
        {
          _id: 'user7',
          username: 'BattleKing',
          xp: 2890,
          level: 28,
          wins: 48,
          totalBattles: 78,
          profilePicture: null,
          rank: 7,
          bestBadge: 'Bronze I'
        }
      ];
      
      setLeaderboardData(mockData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      setLoading(false);
    }
  };

  const getRankClass = (rank) => {
    if (rank === 1) return 'rank-gold';
    if (rank === 2) return 'rank-silver';
    if (rank === 3) return 'rank-bronze';
    return 'rank-normal';
  };

  const getRankIcon = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return rank;
  };

  const getBadgeIcon = (badge) => {
    switch(badge) {
      case 'Gold III': return '🥇';
      case 'Silver II': return '🥈';
      case 'Silver I': return '🥈';
      case 'Bronze II': return '🥉';
      case 'Bronze I': return '🥉';
      default: return '🏅';
    }
  };

  const getBadgeColor = (badge) => {
    switch(badge) {
      case 'Gold III': return '#ffd700';
      case 'Silver II': return '#c0c0c0';
      case 'Silver I': return '#d4d4d4';
      case 'Bronze II': return '#cd7f32';
      case 'Bronze I': return '#e8a87c';
      default: return '#6b7280';
    }
  };

  if (loading) {
    return (
      <div className="app-container">
        <Navbar />
        <div className="content-wrapper">
          <Sidebar />
          <main className="leaderboard-main">
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading leaderboard...</p>
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
        <main className="leaderboard-main">
          <h1 className="leaderboard-title">LEADERBOARD</h1>
          
          <div className="leaderboard-container">
            {leaderboardData.map((user) => (
              <div 
                key={user._id} 
                className={`leaderboard-item ${user._id === currentUserId ? 'current-user' : ''}`}
              >
                <div className="rank-section">
                  <div className={`rank-badge ${getRankClass(user.rank)}`}>
                    {getRankIcon(user.rank)}
                  </div>
                </div>

                <div className="user-info-section">
                  <div className="user-avatar">
                    {user.profilePicture ? (
                      <img src={user.profilePicture} alt={user.username} />
                    ) : (
                      <div className="avatar-placeholder-small">
                        {user.username.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  
                  <div className="user-details">
                    <h3 className="username">{user.username}</h3>
                    <p className="user-stats">
                      {user.wins}W / {user.totalBattles - user.wins}L • 
                      <span 
                        className="badge-indicator" 
                        style={{ color: getBadgeColor(user.bestBadge) }}
                      >
                        {' '}{getBadgeIcon(user.bestBadge)} {user.bestBadge}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="xp-section">
                  <div className="xp-badge">
                    <span className="xp-label">XP</span>
                    <span className="xp-value">{user.xp}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Leaderboard;

/* 
BACKEND IMPLEMENTATION NOTES:

1. MongoDB Schema for User:
{
  _id: ObjectId,
  username: String,
  email: String,
  xp: Number,
  level: Number,
  wins: Number,
  totalBattles: Number,
  profilePicture: String,
  badges: [{
    name: String, // 'Gold III', 'Silver II', etc.
    unlockedAt: Date,
    rank: Number // 5 for Gold III, 4 for Silver II, etc.
  }],
  bestBadge: String // Cached for performance
}

2. Badge Ranking System:
const BADGE_RANKS = {
  'Gold III': 5,
  'Silver II': 4,
  'Silver I': 3,
  'Bronze II': 2,
  'Bronze I': 1
};

3. Calculate Badge from Score:
function calculateBadge(score, totalQuestions) {
  const percentage = (score / totalQuestions) * 100;
  if (percentage === 100) return { name: 'Gold III', rank: 5 };
  if (percentage >= 80) return { name: 'Silver II', rank: 4 };
  if (percentage >= 60) return { name: 'Silver I', rank: 3 };
  if (percentage >= 40) return { name: 'Bronze II', rank: 2 };
  return { name: 'Bronze I', rank: 1 };
}

4. Update User Badge after Battle:
async function updateUserBadge(userId, score, totalQuestions) {
  const newBadge = calculateBadge(score, totalQuestions);
  
  // Add badge to user's badges array
  await User.updateOne(
    { _id: userId },
    { 
      $addToSet: { 
        badges: {
          name: newBadge.name,
          unlockedAt: new Date(),
          rank: newBadge.rank
        }
      }
    }
  );
  
  // Update bestBadge if this is higher
  const user = await User.findById(userId);
  const currentBestRank = BADGE_RANKS[user.bestBadge] || 0;
  
  if (newBadge.rank > currentBestRank) {
    await User.updateOne(
      { _id: userId },
      { $set: { bestBadge: newBadge.name } }
    );
  }
  
  return newBadge;
}

5. Leaderboard API Endpoint:
router.get('/api/leaderboard', async (req, res) => {
  try {
    const users = await User.find()
      .select('username xp wins totalBattles profilePicture bestBadge')
      .sort({ xp: -1 })
      .limit(100);
    
    // Add rank to each user
    const usersWithRank = users.map((user, index) => ({
      ...user.toObject(),
      rank: index + 1
    }));
    
    res.json({ users: usersWithRank });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

6. Socket.IO Real-time Updates:
// When a battle ends, emit leaderboard update
io.on('battleCompleted', async (data) => {
  const { userId, score, totalQuestions } = data;
  
  // Update user badge
  const badge = await updateUserBadge(userId, score, totalQuestions);
  
  // Emit to all clients
  io.emit('leaderboardUpdate', {
    userId,
    badge: badge.name
  });
});
*/