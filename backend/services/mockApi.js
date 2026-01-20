/**
 * Mock API Service - COMPLETE FIX
 * Simulates backend calls using LocalStorage
 */

const STORAGE_KEYS = {
  USERS: 'skillduels_users',
  CATEGORIES: 'skillduels_categories',
  QUESTIONS: 'skillduels_questions',
  BATTLES: 'skillduels_battles',
  LEADERBOARD: 'skillduels_leaderboard'
};

// Initial Seed Data with MORE questions
const SEED_DATA = {
  categories: [
    { id: 1, name: 'Aptitude', icon: '🧠' },
    { id: 2, name: 'Logical Reasoning', icon: '🧩' },
    { id: 3, name: 'General Knowledge', icon: '🌍' },
    { id: 4, name: 'Verbal', icon: '🗣️' },
    { id: 5, name: 'Computer Science', icon: '💻' }
  ],
  questions: [
    // Aptitude (categoryId: 1)
    { id: 1, question: 'What is 15% of 200?', options: ['20', '25', '30', '35'], correctAnswer: 2, categoryId: 1 },
    { id: 2, question: 'If a train travels 60 km in 45 minutes, what is its speed in km/h?', options: ['60', '70', '80', '90'], correctAnswer: 2, categoryId: 1 },
    { id: 3, question: 'What is the compound interest on $1000 for 2 years at 10% per annum?', options: ['$200', '$210', '$220', '$230'], correctAnswer: 1, categoryId: 1 },
    { id: 4, question: 'A shopkeeper sells an item at 20% profit. If cost price is $100, what is selling price?', options: ['$110', '$115', '$120', '$125'], correctAnswer: 2, categoryId: 1 },
    { id: 5, question: 'The average of 5 numbers is 20. If one number is excluded, average becomes 18. What is the excluded number?', options: ['24', '26', '28', '30'], correctAnswer: 2, categoryId: 1 },
    
    // Logical Reasoning (categoryId: 2)
    { id: 6, question: 'If all cats are animals and some animals are dogs, then?', options: ['All cats are dogs', 'Some cats are dogs', 'No conclusion', 'All dogs are cats'], correctAnswer: 2, categoryId: 2 },
    { id: 7, question: 'Complete the series: 2, 6, 12, 20, 30, ?', options: ['40', '42', '44', '46'], correctAnswer: 1, categoryId: 2 },
    { id: 8, question: 'If CODING is written as DPEJOH, how is BEST written?', options: ['CFTU', 'CFST', 'ADRS', 'CDTU'], correctAnswer: 0, categoryId: 2 },
    { id: 9, question: 'Which number comes next: 1, 4, 9, 16, 25, ?', options: ['30', '32', '36', '40'], correctAnswer: 2, categoryId: 2 },
    { id: 10, question: 'If A is taller than B, and B is taller than C, who is the shortest?', options: ['A', 'B', 'C', 'Cannot determine'], correctAnswer: 2, categoryId: 2 },
    
    // General Knowledge (categoryId: 3)
    { id: 11, question: 'What is the capital of France?', options: ['London', 'Berlin', 'Paris', 'Madrid'], correctAnswer: 2, categoryId: 3 },
    { id: 12, question: 'Who wrote "Romeo and Juliet"?', options: ['Charles Dickens', 'William Shakespeare', 'Jane Austen', 'Mark Twain'], correctAnswer: 1, categoryId: 3 },
    { id: 13, question: 'What is the largest planet in our solar system?', options: ['Earth', 'Mars', 'Jupiter', 'Saturn'], correctAnswer: 2, categoryId: 3 },
    { id: 14, question: 'In which year did World War II end?', options: ['1943', '1944', '1945', '1946'], correctAnswer: 2, categoryId: 3 },
    { id: 15, question: 'What is the currency of Japan?', options: ['Yuan', 'Won', 'Yen', 'Ringgit'], correctAnswer: 2, categoryId: 3 },
    
    // Verbal (categoryId: 4)
    { id: 16, question: 'Synonym of "Happy":', options: ['Sad', 'Joyful', 'Angry', 'Tired'], correctAnswer: 1, categoryId: 4 },
    { id: 17, question: 'Antonym of "Brave":', options: ['Courageous', 'Cowardly', 'Bold', 'Fearless'], correctAnswer: 1, categoryId: 4 },
    { id: 18, question: 'Choose the correctly spelled word:', options: ['Occassion', 'Occasion', 'Ocasion', 'Occation'], correctAnswer: 1, categoryId: 4 },
    { id: 19, question: 'Complete the idiom: "A blessing in ___"', options: ['disguise', 'time', 'heaven', 'trouble'], correctAnswer: 0, categoryId: 4 },
    { id: 20, question: 'Which word is a noun?', options: ['Quickly', 'Beautiful', 'Happiness', 'Running'], correctAnswer: 2, categoryId: 4 },
    
    // Computer Science (categoryId: 5)
    { id: 21, question: 'Which data structure is used to implement recursion?', options: ['Queue', 'Heap', 'Stack', 'Graph'], correctAnswer: 2, categoryId: 5 },
    { id: 22, question: 'What is a deadlock condition?', options: ['Process runs forever', 'Two or more processes wait indefinitely', 'Memory overflow', 'CPU starvation'], correctAnswer: 1, categoryId: 5 },
    { id: 23, question: 'Which traversal of BST gives sorted output?', options: ['Preorder', 'Postorder', 'Inorder', 'Level order'], correctAnswer: 2, categoryId: 5 },
    { id: 24, question: 'Which hashing technique resolves collisions?', options: ['Binary search', 'Linear probing', 'Recursion', 'Traversal'], correctAnswer: 1, categoryId: 5 },
    { id: 25, question: 'Which HTTP method is idempotent?', options: ['POST', 'PUT', 'PATCH', 'CONNECT'], correctAnswer: 1, categoryId: 5 },
    { id: 26, question: 'What does ACID stand for in DBMS?', options: ['Atomicity, Consistency, Isolation, Durability', 'Accuracy, Consistency, Integrity, Durability', 'Atomicity, Concurrency, Isolation, Dependency', 'Access, Control, Integrity, Data'], correctAnswer: 0, categoryId: 5 },
    { id: 27, question: 'Time complexity of binary search:', options: ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'], correctAnswer: 1, categoryId: 5 },
    { id: 28, question: 'What is polymorphism in OOP?', options: ['Hiding data', 'Many forms of same method', 'Inheriting properties', 'Creating objects'], correctAnswer: 1, categoryId: 5 }
  ],
  users: []
};

// Helper functions
const getData = (key) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error(`Error getting data for ${key}:`, error);
    return null;
  }
};

const setData = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error(`Error setting data for ${key}:`, error);
    return false;
  }
};

// Initialize Storage
const initializeStorage = () => {
  console.log("🔄 Initializing mockApi storage...");
  
  // Categories
  const storedCategories = getData(STORAGE_KEYS.CATEGORIES);
  if (!storedCategories) {
    setData(STORAGE_KEYS.CATEGORIES, SEED_DATA.categories);
    console.log("✅ Categories initialized");
  } else {
    let updated = false;
    SEED_DATA.categories.forEach(seedCat => {
      const exists = storedCategories.find(c => c.id === seedCat.id);
      if (!exists) {
        storedCategories.push(seedCat);
        updated = true;
      } else if (!exists.icon && seedCat.icon) {
        exists.icon = seedCat.icon;
        updated = true;
      }
    });
    if (updated) {
      setData(STORAGE_KEYS.CATEGORIES, storedCategories);
      console.log("✅ Categories updated");
    }
  }

  // Questions
  const storedQuestions = getData(STORAGE_KEYS.QUESTIONS);
  if (!storedQuestions) {
    setData(STORAGE_KEYS.QUESTIONS, SEED_DATA.questions);
    console.log(`✅ Questions initialized (${SEED_DATA.questions.length} questions)`);
  } else {
    let updated = false;
    SEED_DATA.questions.forEach(seedQ => {
      if (!storedQuestions.find(q => q.id === seedQ.id)) {
        storedQuestions.push(seedQ);
        updated = true;
      }
    });
    if (updated) {
      setData(STORAGE_KEYS.QUESTIONS, storedQuestions);
      console.log(`✅ Questions updated (${storedQuestions.length} total questions)`);
    }
  }

  // Users
  if (!getData(STORAGE_KEYS.USERS)) {
    setData(STORAGE_KEYS.USERS, SEED_DATA.users);
    console.log("✅ Users initialized");
  }
  
  console.log("✅ mockApi storage initialization complete");
};

// Initialize on import
initializeStorage();

export const mockApi = {
  // Categories
  getCategories: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const categories = getData(STORAGE_KEYS.CATEGORIES) || [];
        console.log("📦 getCategories called, returning:", categories.length, "categories");
        resolve(categories);
      }, 200);
    });
  },

  addCategory: async (name, icon = '📚') => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const categories = getData(STORAGE_KEYS.CATEGORIES) || [];
        const newCategory = { 
          id: Date.now(), 
          name, 
          icon 
        };
        categories.push(newCategory);
        setData(STORAGE_KEYS.CATEGORIES, categories);
        console.log("✅ Category added:", newCategory);
        resolve(newCategory);
      }, 200);
    });
  },

  updateCategory: async (id, name, icon) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const categories = getData(STORAGE_KEYS.CATEGORIES) || [];
        const index = categories.findIndex(c => c.id === id);
        if (index !== -1) {
          categories[index] = { ...categories[index], name, icon: icon || categories[index].icon };
          setData(STORAGE_KEYS.CATEGORIES, categories);
          console.log("✅ Category updated:", categories[index]);
          resolve(categories[index]);
        } else {
          resolve(null);
        }
      }, 200);
    });
  },

  deleteCategory: async (id) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let categories = getData(STORAGE_KEYS.CATEGORIES) || [];
        categories = categories.filter(c => c.id !== id);
        setData(STORAGE_KEYS.CATEGORIES, categories);
        
        // Also delete all questions in this category
        let questions = getData(STORAGE_KEYS.QUESTIONS) || [];
        questions = questions.filter(q => Number(q.categoryId) !== Number(id));
        setData(STORAGE_KEYS.QUESTIONS, questions);
        
        console.log("✅ Category deleted:", id);
        resolve({ success: true });
      }, 200);
    });
  },

  // Questions - FIXED VERSION
  getQuestions: async (categoryId = null) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const allQuestions = getData(STORAGE_KEYS.QUESTIONS) || [];
        
        if (categoryId) {
          const filtered = allQuestions.filter(q => {
            return Number(q.categoryId) === Number(categoryId);
          });
          
          console.log(`📦 getQuestions called for category ${categoryId}`);
          console.log(`   Found ${filtered.length} questions`);
          
          resolve(filtered);
        } else {
          console.log(`📦 getQuestions called (all categories)`);
          console.log(`   Total questions: ${allQuestions.length}`);
          resolve(allQuestions);
        }
      }, 200);
    });
  },

  getQuestionById: async (id) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const questions = getData(STORAGE_KEYS.QUESTIONS) || [];
        const question = questions.find(q => q.id === Number(id));
        console.log("📦 getQuestionById called for:", id, question);
        resolve(question || null);
      }, 200);
    });
  },

  addQuestion: async (questionData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const questions = getData(STORAGE_KEYS.QUESTIONS) || [];
        const newQuestion = { 
          ...questionData, 
          id: Date.now(),
          categoryId: Number(questionData.categoryId),
          correctAnswer: Number(questionData.correctAnswer),
          createdAt: new Date().toISOString()
        };
        questions.push(newQuestion);
        setData(STORAGE_KEYS.QUESTIONS, questions);
        console.log("✅ Question added:", newQuestion);
        resolve(newQuestion);
      }, 200);
    });
  },

  updateQuestion: async (id, questionData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const questions = getData(STORAGE_KEYS.QUESTIONS) || [];
        const index = questions.findIndex(q => q.id === Number(id));
        if (index !== -1) {
          questions[index] = { 
            ...questions[index], 
            ...questionData,
            categoryId: Number(questionData.categoryId),
            correctAnswer: Number(questionData.correctAnswer),
            updatedAt: new Date().toISOString()
          };
          setData(STORAGE_KEYS.QUESTIONS, questions);
          console.log("✅ Question updated:", questions[index]);
          resolve(questions[index]);
        } else {
          resolve(null);
        }
      }, 200);
    });
  },

  deleteQuestion: async (id) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let questions = getData(STORAGE_KEYS.QUESTIONS) || [];
        questions = questions.filter(q => q.id !== Number(id));
        setData(STORAGE_KEYS.QUESTIONS, questions);
        console.log("✅ Question deleted:", id);
        resolve({ success: true });
      }, 200);
    });
  },

  // Debug function
  debugStorage: () => {
    const categories = getData(STORAGE_KEYS.CATEGORIES);
    const questions = getData(STORAGE_KEYS.QUESTIONS);
    
    console.log("=== STORAGE DEBUG ===");
    console.log("Categories:", categories);
    console.log("Questions:", questions);
    console.log("Questions by category:");
    categories?.forEach(cat => {
      const catQuestions = questions?.filter(q => Number(q.categoryId) === Number(cat.id));
      console.log(`  ${cat.name} (ID: ${cat.id}): ${catQuestions.length} questions`);
    });
    console.log("====================");
  },

  // Clear all data (for testing)
  clearAllData: () => {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
    initializeStorage();
    console.log("✅ All data cleared and reinitialized");
  }
};