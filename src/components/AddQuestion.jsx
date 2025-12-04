/* eslint-disable react-hooks/set-state-in-effect */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import '../styles/adminpanel.css';

const AddQuestion = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [questionText, setQuestionText] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [correctAnswer, setCorrectAnswer] = useState('');

  // Fetch categories from backend
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

  const addOption = () => {
    if (options.length < 6) {
      setOptions([...options, '']);
    }
  };

  const removeOption = (index) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const updateOption = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSaveQuestion = () => {
    // Validation
    if (!selectedCategory) {
      alert('Please select a category');
      return;
    }
    if (!questionText.trim()) {
      alert('Please enter question text');
      return;
    }
    if (options.some(opt => !opt.trim())) {
      alert('Please fill all options');
      return;
    }
    if (!correctAnswer) {
      alert('Please select correct answer');
      return;
    }

    const questionData = {
      categoryId: selectedCategory,
      question: questionText,
      options: options.filter(opt => opt.trim()),
      correctAnswer: correctAnswer
    };

    // Backend API call
    // fetch('/api/admin/questions', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(questionData)
    // })
    // .then(res => res.json())
    // .then(data => {
    //   alert('Question added successfully!');
    //   navigate('/admin/manage-questions');
    // })
    // .catch(err => alert('Failed to add question'));

    console.log('Saving question:', questionData);
    alert('Question added successfully!');
    navigate('/admin/manage-questions');
  };

  return (
    <div className="app-container">
      <Navbar />
      <div className="content-wrapper">
        <Sidebar />
        <main className="admin-main">
          <div className="admin-form-container">
            <div className="form-group">
              <select 
                className="admin-select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <input
                type="text"
                className="admin-input-large"
                placeholder="Question Text"
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
              />
            </div>

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

            <div className="form-group">
              <select
                className="admin-select"
                value={correctAnswer}
                onChange={(e) => setCorrectAnswer(e.target.value)}
              >
                <option value="">Correct Answer</option>
                {options.map((opt, index) => (
                  opt.trim() && (
                    <option key={index} value={index}>
                      {opt}
                    </option>
                  )
                ))}
              </select>
            </div>

            <button className="btn-save-question" onClick={handleSaveQuestion}>
              Save Question
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AddQuestion;
