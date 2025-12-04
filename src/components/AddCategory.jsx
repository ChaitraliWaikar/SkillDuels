
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import '../styles/adminpanel.css';

const AddCategory = () => {
  const navigate = useNavigate();
  const [categoryName, setCategoryName] = useState('');

  const handleAddCategory = () => {
    if (!categoryName.trim()) {
      alert('Please enter category name');
      return;
    }

    // Backend API call
    // fetch('/api/admin/categories', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ name: categoryName })
    // })
    // .then(res => res.json())
    // .then(data => {
    //   alert('Category added successfully!');
    //   navigate('/admin/manage-categories');
    // });

    console.log('Adding category:', categoryName);
    alert('Category added successfully!');
    navigate('/admin/manage-categories');
  };

  return (
    <div className="app-container">
      <Navbar />
      <div className="content-wrapper">
        <Sidebar />
        <main className="admin-main">
          <div className="admin-form-container-center">
            <input
              type="text"
              className="admin-input-large"
              placeholder="Category Name"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
            />
            <button className="btn-save-question" onClick={handleAddCategory}>
              Add Category
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AddCategory;