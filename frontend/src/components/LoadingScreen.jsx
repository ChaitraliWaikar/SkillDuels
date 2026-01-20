// src/components/LoadingScreen.jsx
import React from 'react';
import '../styles/loading.css';

const LoadingScreen = () => {
  return (
    <div className="loading-screen">
      <div className="loading-content">
        <div className="loading-spinner-large"></div>
        <h2>SkillDuels</h2>
        <p>Loading...</p>
      </div>
    </div>
  );
};

export default LoadingScreen;