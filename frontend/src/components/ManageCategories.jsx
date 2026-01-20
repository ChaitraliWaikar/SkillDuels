// src/components/ManageCategories.jsx - FIXED with real API
import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import "../styles/adminpanel.css";
import { mockApi } from "../../../backend/services/mockApi";

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await mockApi.getCategories();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      alert("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (category) => {
    setEditingId(category.id);
    setEditValue(category.name);
  };

  const handleSave = async (id) => {
    if (!editValue.trim()) {
      alert("Category name cannot be empty");
      return;
    }

    try {
      const category = categories.find((c) => c.id === id);
      await mockApi.updateCategory(id, editValue, category.icon);

      setCategories(
        categories.map((cat) =>
          cat.id === id ? { ...cat, name: editValue } : cat,
        ),
      );
      setEditingId(null);
      alert("Category updated successfully!");
    } catch (error) {
      console.error("Error updating category:", error);
      alert("Failed to update category");
    }
  };

  const handleDelete = async (id) => {
    const category = categories.find((c) => c.id === id);
    const confirmMsg = `Deleting "${category.name}" will also delete all its questions. Continue?`;

    if (window.confirm(confirmMsg)) {
      try {
        await mockApi.deleteCategory(id);
        setCategories(categories.filter((cat) => cat.id !== id));
        alert("Category and all its questions deleted successfully!");
      } catch (error) {
        console.error("Error deleting category:", error);
        alert("Failed to delete category");
      }
    }
  };

  if (loading) {
    return (
      <div className="app-container">
        <Navbar />
        <div className="content-wrapper">
          <Sidebar />
          <main className="admin-main">
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading categories...</p>
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
        <main className="admin-main">
          <div className="manage-categories-container">
            <h1 className="admin-title">Manage Categories</h1>

            {categories.length === 0 ? (
              <div
                style={{ color: "#fff", textAlign: "center", padding: "2rem" }}
              >
                <p>No categories found.</p>
                <button
                  onClick={() => (window.location.href = "/admin/add-category")}
                  className="btn-admin-choose"
                  style={{ marginTop: "1rem" }}
                >
                  Add First Category
                </button>
              </div>
            ) : (
              <div className="categories-list">
                {categories.map((cat) => (
                  <div key={cat.id} className="category-item">
                    <span
                      className="category-icon"
                      style={{ fontSize: "2rem", marginRight: "1rem" }}
                    >
                      {cat.icon}
                    </span>
                    {editingId === cat.id ? (
                      <input
                        type="text"
                        className="category-edit-input"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onKeyPress={(e) =>
                          e.key === "Enter" && handleSave(cat.id)
                        }
                        autoFocus
                      />
                    ) : (
                      <span className="category-name-text">{cat.name}</span>
                    )}
                    <div className="category-actions">
                      {editingId === cat.id ? (
                        <>
                          <button
                            className="btn-icon"
                            onClick={() => handleSave(cat.id)}
                            title="Save"
                          >
                            ✔
                          </button>
                          <button
                            className="btn-icon"
                            onClick={() => setEditingId(null)}
                            title="Cancel"
                          >
                            ✖
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            className="btn-icon"
                            onClick={() => handleEdit(cat)}
                            title="Edit"
                          >
                            ✏️
                          </button>
                          <button
                            className="btn-icon"
                            onClick={() => handleDelete(cat.id)}
                            title="Delete"
                          >
                            🗑️
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ManageCategories;
