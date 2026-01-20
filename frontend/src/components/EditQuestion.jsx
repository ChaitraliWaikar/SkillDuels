// src/components/EditQuestion.jsx - FIXED with real API
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import "../styles/adminpanel.css";
import { mockApi } from "../../../backend/services/mockApi";

const EditQuestion = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadQuestionData();
  }, [id]);

  const loadQuestionData = async () => {
    try {
      setLoading(true);

      // Fetch categories and question data
      const [cats, question] = await Promise.all([
        mockApi.getCategories(),
        mockApi.getQuestionById(id),
      ]);

      setCategories(cats);

      if (question) {
        setSelectedCategory(question.categoryId.toString());
        setQuestionText(question.question);
        setOptions(question.options);
        setCorrectAnswer(question.correctAnswer.toString());
      } else {
        alert("Question not found");
        navigate("/admin/manage-questions");
      }
    } catch (error) {
      console.error("Error loading question:", error);
      alert("Failed to load question");
      navigate("/admin/manage-questions");
    } finally {
      setLoading(false);
    }
  };

  const addOption = () => {
    if (options.length < 6) {
      setOptions([...options, ""]);
    }
  };

  const removeOption = (index) => {
    if (options.length > 2) {
      const newOptions = options.filter((_, i) => i !== index);
      setOptions(newOptions);

      // Adjust correct answer if needed
      if (parseInt(correctAnswer) === index) {
        setCorrectAnswer("");
      } else if (parseInt(correctAnswer) > index) {
        setCorrectAnswer((parseInt(correctAnswer) - 1).toString());
      }
    }
  };

  const updateOption = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleUpdateQuestion = async () => {
    // Validation
    if (!selectedCategory) {
      alert("Please select a category");
      return;
    }
    if (!questionText.trim()) {
      alert("Please enter question text");
      return;
    }
    const filledOptions = options.filter((opt) => opt.trim());
    if (filledOptions.length < 2) {
      alert("Please provide at least 2 options");
      return;
    }
    if (!correctAnswer) {
      alert("Please select correct answer");
      return;
    }

    const questionData = {
      categoryId: selectedCategory,
      question: questionText,
      options: filledOptions,
      correctAnswer: parseInt(correctAnswer),
    };

    try {
      await mockApi.updateQuestion(id, questionData);
      alert("Question updated successfully!");
      navigate("/admin/manage-questions");
    } catch (error) {
      console.error("Error updating question:", error);
      alert("Failed to update question");
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
              <p>Loading question...</p>
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
          <h1 className="admin-title">Edit Question</h1>
          <div className="admin-form-container">
            <div className="form-group">
              <label
                style={{
                  color: "#fff",
                  marginBottom: "0.5rem",
                  display: "block",
                }}
              >
                Category
              </label>
              <select
                className="admin-select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.icon} {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label
                style={{
                  color: "#fff",
                  marginBottom: "0.5rem",
                  display: "block",
                }}
              >
                Question Text
              </label>
              <input
                type="text"
                className="admin-input-large"
                placeholder="Enter question text"
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
              />
            </div>

            <label
              style={{
                color: "#fff",
                marginBottom: "0.5rem",
                display: "block",
                marginTop: "1rem",
              }}
            >
              Options
            </label>
            {options.map((option, index) => (
              <div key={index} className="option-group">
                <input
                  type="text"
                  className="admin-input"
                  placeholder={`Option ${String.fromCharCode(65 + index)}`}
                  value={option}
                  onChange={(e) => updateOption(index, e.target.value)}
                />
                {options.length > 2 && (
                  <button
                    className="btn-remove"
                    onClick={() => removeOption(index)}
                    title="Remove option"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}

            {options.length < 6 && (
              <button className="btn-add-option" onClick={addOption}>
                Add Option +
              </button>
            )}

            <div className="form-group" style={{ marginTop: "1rem" }}>
              <label
                style={{
                  color: "#fff",
                  marginBottom: "0.5rem",
                  display: "block",
                }}
              >
                Correct Answer
              </label>
              <select
                className="admin-select"
                value={correctAnswer}
                onChange={(e) => setCorrectAnswer(e.target.value)}
              >
                <option value="">Select Correct Answer</option>
                {options.map(
                  (opt, index) =>
                    opt.trim() && (
                      <option key={index} value={index}>
                        {String.fromCharCode(65 + index)}. {opt}
                      </option>
                    ),
                )}
              </select>
            </div>

            <div style={{ display: "flex", gap: "1rem", marginTop: "2rem" }}>
              <button
                className="btn-save-question"
                onClick={handleUpdateQuestion}
              >
                Update Question
              </button>
              <button
                className="btn-cancel"
                onClick={() => navigate("/admin/manage-questions")}
                style={{
                  padding: "0.75rem 1.5rem",
                  background: "#6b7280",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default EditQuestion;
