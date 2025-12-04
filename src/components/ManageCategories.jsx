/* eslint-disable react-hooks/set-state-in-effect */

import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import '../styles/adminpanel.css';

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');

  useEffect(() => {
    // fetch('/api/admin/categories')
    //   .then(res => res.json())
    //   .then(data => setCategories(data.categories));

    // Mock data
    setCategories([
      { id: 1, name: 'Aptitude' },
      { id: 2, name: 'Logical Reasoning' },
      { id: 3, name: 'General Knowledge' },
      { id: 4, name: 'Verbal' }
    ]);
  }, []);

  const handleEdit = (category) => {
    setEditingId(category.id);
    setEditValue(category.name);
  };

  const handleSave = (id) => {
    if (!editValue.trim()) {
      alert('Category name cannot be empty');
      return;
    }

    // fetch(`/api/admin/categories/${id}`, {
    //   method: 'PUT',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ name: editValue })
    // })
    // .then(() => {
    //   setCategories(categories.map(cat => 
    //     cat.id === id ? { ...cat, name: editValue } : cat
    //   ));
    //   setEditingId(null);
    // });

    setCategories(categories.map(cat => 
      cat.id === id ? { ...cat, name: editValue } : cat
    ));
    setEditingId(null);
    alert('Category updated successfully!');
  };

  const handleDelete = (id) => {
    if (window.confirm('Deleting this category will affect all questions under it. Continue?')) {
      // fetch(`/api/admin/categories/${id}`, { method: 'DELETE' })
      //   .then(() => {
      //     setCategories(categories.filter(cat => cat.id !== id));
      //   });

      setCategories(categories.filter(cat => cat.id !== id));
      alert('Category deleted successfully!');
    }
  };

  return (
    <div className="app-container">
      <Navbar />
      <div className="content-wrapper">
        <Sidebar />
        <main className="admin-main">
          <div className="manage-categories-container">
            <h1 className="admin-title">Manage Categories</h1>
            <div className="categories-list">
              {categories.map((cat) => (
                <div key={cat.id} className="category-item">
                  {editingId === cat.id ? (
                    <input
                      type="text"
                      className="category-edit-input"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSave(cat.id)}
                    />
                  ) : (
                    <span className="category-name-text">{cat.name}</span>
                  )}
                  <div className="category-actions">
                    {editingId === cat.id ? (
                      <button 
                        className="btn-icon"
                        onClick={() => handleSave(cat.id)}
                      >
                        ✓
                      </button>
                    ) : (
                      <button 
                        className="btn-icon"
                        onClick={() => handleEdit(cat)}
                      >
                        ✏️
                      </button>
                    )}
                    <button 
                      className="btn-icon"
                      onClick={() => handleDelete(cat.id)}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ManageCategories;