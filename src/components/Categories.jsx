/* eslint-disable react-hooks/immutability */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import '../styles/categories.css';
import { mockApi } from '../services/mockApi';

const Categories = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categories, setCategories] = useState([]);

  // Fetch categories dynamically from backend (updated by admin)
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await mockApi.getCategories();
      // Add icons if missing (mockApi might not return icons for new categories)
      const categoriesWithIcons = data.map(cat => ({
        ...cat,
        icon: cat.icon || '📚' // Default icon
      }));
      setCategories(categoriesWithIcons);
    } catch (error) {
      console.error('Error fetching categories:', error);
      alert('Failed to load categories');
    }
  };

  // Handle category selection and matchmaking
  const handleChooseCategory = async (category) => {
    setSelectedCategory(category.id);
    setLoading(true);

    try {
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
              userId: 'u1', // Matches mockApi seed user
              username: 'DemoUser',
              level: 5,
              xp: 1200,
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