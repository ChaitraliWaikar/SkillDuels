/* eslint-disable react-hooks/set-state-in-effect */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import '../styles/adminpanel.css';

const ManageQuestions = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');

  // Fetch questions and categories
  useEffect(() => {
    // fetch('/api/admin/questions')
    //   .then(res => res.json())
    //   .then(data => {
    //     setQuestions(data.questions);
    //     setFilteredQuestions(data.questions);
    //   });

    // fetch('/api/admin/categories')
    //   .then(res => res.json())
    //   .then(data => setCategories(data.categories));

    // Mock questions data for ALL categories (5 questions each)
    const mockQuestions = [
      // Aptitude Questions
      { id: 1, category: 'Aptitude', question: 'What is 15% of 200?', options: ['20', '25', '30', '35'], correctAnswer: 2, createdAt: '2024-01-15' },
      { id: 2, category: 'Aptitude', question: 'If a train travels 60 km in 45 minutes, what is its speed in km/h?', options: ['60', '70', '80', '90'], correctAnswer: 2, createdAt: '2024-01-14' },
      { id: 3, category: 'Aptitude', question: 'A number increased by 20% becomes 60. What is the number?', options: ['40', '45', '50', '55'], correctAnswer: 2, createdAt: '2024-01-13' },
      { id: 4, category: 'Aptitude', question: 'The ratio of 5:8 is equal to?', options: ['15:24', '10:13', '20:32', '25:30'], correctAnswer: 0, createdAt: '2024-01-12' },
      { id: 5, category: 'Aptitude', question: 'What is the average of 10, 20, 30, 40, 50?', options: ['25', '30', '35', '40'], correctAnswer: 1, createdAt: '2024-01-11' },
      
      // Logical Reasoning Questions
      { id: 6, category: 'Logical Reasoning', question: 'If all cats are animals and some animals are dogs, then?', options: ['All cats are dogs', 'Some cats are dogs', 'No conclusion', 'All dogs are cats'], correctAnswer: 2, createdAt: '2024-01-15' },
      { id: 7, category: 'Logical Reasoning', question: 'What comes next: 2, 6, 12, 20, 30, ?', options: ['38', '40', '42', '44'], correctAnswer: 2, createdAt: '2024-01-14' },
      { id: 8, category: 'Logical Reasoning', question: 'If CODE is written as DPEF, how is MIND written?', options: ['NKOE', 'NJOE', 'NJND', 'NKND'], correctAnswer: 1, createdAt: '2024-01-13' },
      { id: 9, category: 'Logical Reasoning', question: 'A is taller than B. C is shorter than B. Who is the shortest?', options: ['A', 'B', 'C', 'Cannot determine'], correctAnswer: 2, createdAt: '2024-01-12' },
      { id: 10, category: 'Logical Reasoning', question: 'Complete the series: AB, CD, EF, ?', options: ['GH', 'HI', 'IJ', 'FG'], correctAnswer: 0, createdAt: '2024-01-11' },
      
      // General Knowledge Questions
      { id: 11, category: 'General Knowledge', question: 'What is the capital of France?', options: ['London', 'Berlin', 'Paris', 'Madrid'], correctAnswer: 2, createdAt: '2024-01-15' },
      { id: 12, category: 'General Knowledge', question: 'Who wrote "Romeo and Juliet"?', options: ['Charles Dickens', 'William Shakespeare', 'Jane Austen', 'Mark Twain'], correctAnswer: 1, createdAt: '2024-01-14' },
      { id: 13, category: 'General Knowledge', question: 'Which planet is known as the Red Planet?', options: ['Venus', 'Mars', 'Jupiter', 'Saturn'], correctAnswer: 1, createdAt: '2024-01-13' },
      { id: 14, category: 'General Knowledge', question: 'In which year did World War II end?', options: ['1943', '1944', '1945', '1946'], correctAnswer: 2, createdAt: '2024-01-12' },
      { id: 15, category: 'General Knowledge', question: 'What is the largest ocean on Earth?', options: ['Atlantic', 'Indian', 'Arctic', 'Pacific'], correctAnswer: 3, createdAt: '2024-01-11' },
      
      // Verbal Questions
      { id: 16, category: 'Verbal', question: 'Synonym of "Happy":', options: ['Sad', 'Joyful', 'Angry', 'Tired'], correctAnswer: 1, createdAt: '2024-01-15' },
      { id: 17, category: 'Verbal', question: 'Antonym of "Brave":', options: ['Coward', 'Strong', 'Bold', 'Fearless'], correctAnswer: 0, createdAt: '2024-01-14' },
      { id: 18, category: 'Verbal', question: 'Fill in the blank: She is good ___ mathematics.', options: ['in', 'at', 'on', 'with'], correctAnswer: 1, createdAt: '2024-01-13' },
      { id: 19, category: 'Verbal', question: 'Choose the correctly spelled word:', options: ['Occassion', 'Occasion', 'Ocasion', 'Occation'], correctAnswer: 1, createdAt: '2024-01-12' },
      { id: 20, category: 'Verbal', question: 'Complete the idiom: "A piece of ___"', options: ['bread', 'cake', 'stone', 'wood'], correctAnswer: 1, createdAt: '2024-01-11' }
    ];
    
    setQuestions(mockQuestions);
    setFilteredQuestions(mockQuestions);

    setCategories([
      { id: 1, name: 'Aptitude' },
      { id: 2, name: 'Logical Reasoning' },
      { id: 3, name: 'General Knowledge' },
      { id: 4, name: 'Verbal' }
    ]);
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = [...questions];

    if (searchTerm) {
      filtered = filtered.filter(q => 
        q.question.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterCategory) {
      filtered = filtered.filter(q => q.category === filterCategory);
    }

    if (sortOrder === 'asc') {
      filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else {
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    setFilteredQuestions(filtered);
  }, [searchTerm, filterCategory, sortOrder, questions]);

  const handleEdit = (questionId) => {
    navigate(`/admin/edit-question/${questionId}`);
  };

  const handleDelete = (questionId) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      // fetch(`/api/admin/questions/${questionId}`, { method: 'DELETE' })
      //   .then(() => {
      //     setQuestions(questions.filter(q => q.id !== questionId));
      //   });

      setQuestions(questions.filter(q => q.id !== questionId));
      alert('Question deleted successfully!');
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
              {categories.map(cat => (
                <option key={cat.id} value={cat.name}>{cat.name}</option>
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