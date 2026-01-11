/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import '../styles/categories.css';
import { mockApi } from '../services/mockApi';

const SoloQuiz = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await mockApi.getCategories();

        // Apply the same icon fallback as in battle mode
        const categoriesWithIcons = data.map(cat => ({
          ...cat,
          icon: cat.icon || '📚'  // Consistent default icon
        }));

        setCategories(categoriesWithIcons);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Failed to load categories. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleChooseCategory = (category) => {
    const soloUser = {
      userId: 'solo_' + Date.now(),
      username: 'You',
      level: 15,
      xp: 1250,
      profilePicture: null
    };

    navigate('/start-battle', {
      state: {
        category: category.name,
        categoryId: category.id,
        battleId: 'solo_' + Date.now(),
        currentUser: soloUser,
        opponent: null,
        isSolo: true
      }
    });
  };

  if (loading) {
    return (
      <div className="app-container">
        <Navbar />
        <div className="content-wrapper">
          <Sidebar />
          <main className="categories-main">
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading categories...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-container">
        <Navbar />
        <div className="content-wrapper">
          <Sidebar />
          <main className="categories-main">
            <div className="error-container">
              <h2>{error}</h2>
              <button 
                className="btn-choose" 
                onClick={() => window.location.reload()}
              >
                Try Again
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

        <main className="categories-main">
          <h1 className="categories-title">SOLO PRACTICE</h1>
          <p className="solo-subtitle" style={{textAlign:'center'}}>
            Practice alone, improve your skills, and prepare for battles!
          </p>

          <div className="categories-grid" style={{alignContent:'center'}}>
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