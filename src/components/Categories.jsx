/* eslint-disable react-hooks/immutability */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import '../styles/categories.css';

const Categories = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [socket, setSocket] = useState(null);

  // Fetch categories dynamically from backend (updated by admin)
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      // Backend API call to get all active categories
      // const response = await fetch('/api/categories');
      // const data = await response.json();
      // setCategories(data.categories);

      // Mock data - Replace with actual API call
      const mockCategories = [
        { id: 1, name: 'Aptitude', icon: '🧮' },
        { id: 2, name: 'Logical Reasoning', icon: '🧠' },
        { id: 3, name: 'General Knowledge', icon: '📚' },
        { id: 4, name: 'Verbal', icon: '📝' }
      ];
      setCategories(mockCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
      alert('Failed to load categories');
    }
  };

  // Initialize Socket.IO connection
  useEffect(() => {
    // const newSocket = io('http://localhost:5000', {
    //   auth: { token: localStorage.getItem('authToken') }
    // });
    // setSocket(newSocket);

    // return () => newSocket.close();
  }, []);

  // Handle category selection and matchmaking
  const handleChooseCategory = async (category) => {
    setSelectedCategory(category.id);
    setLoading(true);

    try {
      // Socket.IO matchmaking
      // socket.emit('findMatch', {
      //   userId: currentUser.id,
      //   categoryId: category.id,
      //   username: currentUser.username,
      //   level: currentUser.level,
      //   xp: currentUser.xp,
      //   profilePicture: currentUser.profilePicture
      // });

      // socket.on('matchFound', (battleData) => {
      //   setLoading(false);
      //   navigate('/start-battle', { 
      //     state: { 
      //       category: category.name,
      //       categoryId: category.id,
      //       battleId: battleData.battleId,
      //       opponent: battleData.opponent,
      //       currentUser: battleData.currentUser
      //     } 
      //   });
      // });

      // socket.on('matchTimeout', () => {
      //   setLoading(false);
      //   alert('No opponent found. Please try again!');
      // });

      // socket.on('matchError', (error) => {
      //   setLoading(false);
      //   alert('Error finding match: ' + error.message);
      // });

      // Simulate matchmaking for demo
      setTimeout(() => {
        const mockOpponent = {
          userId: 'opp123',
          username: 'Opponent123',
          level: 14,
          xp: 1180,
          profilePicture: null
        };

        navigate('/start-battle', { 
          state: { 
            category: category.name,
            categoryId: category.id,
            battleId: 'battle_' + Date.now(),
            opponent: mockOpponent,
            currentUser: {
              userId: 'user123',
              username: 'YourUsername',
              level: 15,
              xp: 1250,
              profilePicture: null
            }
          } 
        });
      }, 2000);

    } catch (error) {
      console.error('Error during matchmaking:', error);
      setLoading(false);
      alert('Failed to find match. Please try again.');
    }
  };

  // Cancel matchmaking
  const handleCancelSearch = () => {
    // socket?.emit('cancelMatchmaking');
    setLoading(false);
    setSelectedCategory(null);
  };

  return (
    <div className="app-container">
      <Navbar />
      
      <div className="content-wrapper">
        <Sidebar />
        
        <main className="categories-main">
          <h1 className="categories-title">CHOOSE YOUR CATEGORY</h1>
          
          <div className="categories-grid">
            {categories.map((category) => (
              <div key={category.id} className="category-card">
                <div className="category-icon">{category.icon}</div>
                <h3 className="category-name">{category.name}</h3>
                <button 
                  className="btn-choose"
                  onClick={() => handleChooseCategory(category)}
                  disabled={loading}
                >
                  {loading && selectedCategory === category.id ? 'Finding...' : 'CHOOSE'}
                </button>
              </div>
            ))}
          </div>

          {loading && (
            <div className="loading-overlay">
              <div className="loading-spinner"></div>
              <p>Finding an opponent...</p>
              <button className="btn-cancel-search" onClick={handleCancelSearch}>
                Cancel
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Categories;