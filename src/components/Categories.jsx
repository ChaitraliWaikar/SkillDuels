/* eslint-disable react-hooks/exhaustive-deps */
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

  // Fetch categories only once on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await mockApi.getCategories();

        // Add default icon only if missing (consistent with SoloQuiz)
        const withIcons = data.map(cat => ({
          ...cat,
          icon: cat.icon || '📚'
        }));

        setCategories(withIcons);
      } catch (error) {
        console.error('Error fetching categories:', error);
        alert('Failed to load categories');
      }
    };

    fetchCategories();
  }, []); // ← empty dependency array = run once on mount

  // Handle category selection and matchmaking
  const handleChooseCategory = async (category) => {
    setSelectedCategory(category.id);
    setLoading(true);

    try {
      // Simulate matchmaking (2 seconds delay)
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
              userId: 'u1', // Must match seed user in mockApi
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

          {categories.length === 0 ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading categories...</p>
            </div>
          ) : (
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
          )}

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