import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import '../styles/adminpanel.css';

const AdminPanel = () => {
  const navigate = useNavigate();

  const adminOptions = [
    { id: 1, title: 'Add Question', route: '/admin/add-question' },
    { id: 2, title: 'Manage Questions', route: '/admin/manage-questions' },
    { id: 3, title: 'Add Category', route: '/admin/add-category' },
    { id: 4, title: 'Manage Categories', route: '/admin/manage-categories' }
  ];

  return (
    <div className="app-container">
      <Navbar />
      <div className="content-wrapper">
        <Sidebar />
        <main className="admin-main">
          <div className="admin-grid">
            {adminOptions.map((option) => (
              <div key={option.id} className="admin-card">
                <h3>{option.title}</h3>
                <button 
                  className="btn-admin-choose"
                  onClick={() => navigate(option.route)}
                >
                  CHOOSE
                </button>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminPanel;








