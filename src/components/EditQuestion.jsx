/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import '../styles/adminpanel.css';

const EditQuestion = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [questionText, setQuestionText] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [correctAnswer, setCorrectAnswer] = useState('');

  useEffect(() => {
    // Fetch existing question data
    // fetch(`/api/admin/questions/${id}`)
    //   .then(res => res.json())
    //   .then(data => {
    //     setSelectedCategory(data.categoryId);
    //     setQuestionText(data.question);
    //     setOptions(data.options);
    //     setCorrectAnswer(data.correctAnswer);
    //   });

    // Mock data
    setSelectedCategory('1');
    setQuestionText('What is 2+2?');
    setOptions(['2', '3', '4', '5']);
    setCorrectAnswer('2');

    // Fetch categories
    setCategories([
      { id: 1, name: 'Aptitude' },
      { id: 2, name: 'Logical Reasoning' },
      { id: 3, name: 'General Knowledge' },
      { id: 4, name: 'Verbal' }
    ]);
  }, [id]);

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

  const handleUpdateQuestion = () => {
    if (!selectedCategory || !questionText.trim() || options.some(opt => !opt.trim()) || !correctAnswer) {
      alert('Please fill all fields');
      return;
    }

    const questionData = {
      categoryId: selectedCategory,
      question: questionText,
      options: options.filter(opt => opt.trim()),
      correctAnswer: correctAnswer
    };

    // fetch(`/api/admin/questions/${id}`, {
    //   method: 'PUT',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(questionData)
    // })
    // .then(() => {
    //   alert('Question updated successfully!');
    //   navigate('/admin/manage-questions');
    // });

    console.log('Updating question:', questionData);
    alert('Question updated successfully!');
    navigate('/admin/manage-questions');
  };

  return (
    <div className="app-container">
      <Navbar />
      <div className="content-wrapper">
        <Sidebar />
        <main className="admin-main">
          <h1 className="admin-title">Edit Question</h1>
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

            <button className="btn-save-question" onClick={handleUpdateQuestion}>
              Update Question
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default EditQuestion;