/* eslint-disable react-hooks/set-state-in-effect */

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import "../styles/adminpanel.css";
import { mockApi } from "../../../backend/services/mockApi";

const ManageQuestions = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");

  // Fetch questions and categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cats, qs] = await Promise.all([
          mockApi.getCategories(),
          mockApi.getCategories(),
        ]);

        setCategories(cats);

        // Map categoryId to category name for display
        const mappedQuestions = qs.map((q) => {
          const cat = cats.find((c) => c.id == q.categoryId);
          return {
            ...q,
            category: cat ? cat.name : "Unknown",
            createdAt: q.createdAt || new Date().toISOString(),
          };
        });

        setQuestions(mappedQuestions);
        setFilteredQuestions(mappedQuestions);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = [...questions];

    if (searchTerm) {
      filtered = filtered.filter((q) =>
        q.question.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    if (filterCategory) {
      filtered = filtered.filter((q) => q.category === filterCategory);
    }

    if (sortOrder === "asc") {
      filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else {
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    setFilteredQuestions(filtered);
  }, [searchTerm, filterCategory, sortOrder, questions]);

  const handleEdit = (questionId) => {
    navigate(`/admin/edit-question/${questionId}`);
  };

  const handleDelete = async (questionId) => {
    if (window.confirm("Are you sure you want to delete this question?")) {
      try {
        await mockApi.deleteQuestion(questionId);
        setQuestions(questions.filter((q) => q.id !== questionId));
        alert("Question deleted successfully!");
      } catch (error) {
        console.error("Error deleting question:", error);
        alert("Failed to delete question");
      }
    }
  };

  return (
    <div className="app-container">
      <Navbar />
      <div className="content-wrapper">
        <Sidebar />
        <main className="admin-main">
          <h1 className="admin-title">Manage Questions</h1>

          <div className="filters-section">
            <input
              type="text"
              className="search-input"
              placeholder="🔍 Search questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <select
              className="filter-select"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>

            <select
              className="filter-select"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="desc">Newest First</option>
              <option value="asc">Oldest First</option>
            </select>
          </div>

          <div className="questions-table">
            <table>
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Question</th>
                  <th>Edit</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                {filteredQuestions.map((q) => (
                  <tr key={q.id}>
                    <td>{q.category}</td>
                    <td>{q.question}</td>
                    <td>
                      <button
                        className="btn-icon"
                        onClick={() => handleEdit(q.id)}
                      >
                        ✏️
                      </button>
                    </td>
                    <td>
                      <button
                        className="btn-icon"
                        onClick={() => handleDelete(q.id)}
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ManageQuestions;
