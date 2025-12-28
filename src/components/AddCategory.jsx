
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import '../styles/adminpanel.css';
import { mockApi } from '../services/mockApi';

const AddCategory = () => {
  const navigate = useNavigate();
  const [categoryName, setCategoryName] = useState('');

  const handleAddCategory = async () => {
    if (!categoryName.trim()) {
      alert('Please enter category name');
      return;
    }

    try {
      await mockApi.addCategory(categoryName);
      alert('Category added successfully!');
      navigate('/admin/manage-categories');
    } catch (error) {
      console.error("Error adding category:", error);
      alert('Failed to add category');
    }
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