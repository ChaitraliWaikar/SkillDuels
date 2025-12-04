/* eslint-disable react-hooks/purity */
/* eslint-disable react-hooks/immutability */
 

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import '../styles/categories.css';

const SoloQuiz = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);

  // Fetch categories dynamically from backend
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

  const handleChooseCategory = (category) => {
    // Create solo user data
    const soloUser = {
      userId: 'solo_' + Date.now(),
      username: 'You',
      level: 15,
      xp: 1250,
      profilePicture: null
    };

    // Navigate directly to start battle with isSolo flag
    navigate('/start-battle', {
      state: {
        category: category.name,
        categoryId: category.id,
        battleId: 'solo_' + Date.now(),
        currentUser: soloUser,
        opponent: null, // No opponent in solo mode
        isSolo: true // Flag to indicate solo mode
      }
    });
  };

  return (
    <div className="app-container">
      <Navbar />

      <div className="content-wrapper">
        <Sidebar />

        <main className="categories-main">
          <h1 className="categories-title">SOLO PRACTICE - CHOOSE CATEGORY</h1>
          <p style={{ textAlign: 'center', color: '#6b7280', marginBottom: '2rem' }}>
            Practice alone and improve your skills!
          </p>

          <div className="categories-grid">
            {categories.map((category) => (
              <div key={category.id} className="category-card">
                <div className="category-icon">{category.icon}</div>
                <h3 className="category-name">{category.name}</h3>
                <button
                  className="btn-choose"
                  onClick={() => handleChooseCategory(category)}
                >
                  START PRACTICE
                </button>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default SoloQuiz;