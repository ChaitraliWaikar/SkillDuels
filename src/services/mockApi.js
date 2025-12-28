/**
 * Mock API Service
 * Simulates backend calls using LocalStorage
 */

const STORAGE_KEYS = {
  USERS: 'skillduels_users',
  CATEGORIES: 'skillduels_categories',
  QUESTIONS: 'skillduels_questions',
  BATTLES: 'skillduels_battles',
  LEADERBOARD: 'skillduels_leaderboard'
};

// Initial Seed Data
const SEED_DATA = {
  categories: [
    { id: 1, name: 'Aptitude', icon: '🧠' },
    { id: 2, name: 'Logical Reasoning', icon: '🧩' },
    { id: 3, name: 'General Knowledge', icon: '🌍' },
    { id: 4, name: 'Verbal', icon: '🗣️' },
    { id: 5, name: 'Computer Science', icon: '💻' }
  ],
  questions: [
    // Aptitude
    { id: 1, question: 'What is 15% of 200?', options: ['20', '25', '30', '35'], correctAnswer: 2, categoryId: 1 },
    { id: 2, question: 'If a train travels 60 km in 45 minutes, what is its speed in km/h?', options: ['60', '70', '80', '90'], correctAnswer: 2, categoryId: 1 },
    // Logical
    { id: 6, question: 'If all cats are animals and some animals are dogs, then?', options: ['All cats are dogs', 'Some cats are dogs', 'No conclusion', 'All dogs are cats'], correctAnswer: 2, categoryId: 2 },
    // GK
    { id: 11, question: 'What is the capital of France?', options: ['London', 'Berlin', 'Paris', 'Madrid'], correctAnswer: 2, categoryId: 3 },
    // Verbal
    { id: 16, question: 'Synonym of "Happy":', options: ['Sad', 'Joyful', 'Angry', 'Tired'], correctAnswer: 1, categoryId: 4 },
    // Computer Science
    { id: 17, question: 'Which data structure is used to implement recursion?', options: ['Queue', 'Heap', 'Stack', 'Graph'], correctAnswer: 2, categoryId: 5 },
    { id: 18, question: 'What is a deadlock condition?', options: ['Process runs forever', 'Two or more processes wait indefinitely for resources', 'Memory overflow', 'CPU starvation'], correctAnswer: 1, categoryId: 5 },
    { id: 19, question: 'Which traversal of a BST gives sorted output?', options: ['Preorder', 'Postorder', 'Inorder', 'Level order'], correctAnswer: 2, categoryId: 5 },
    { id: 20, question: 'Which hashing technique resolves collisions?', options: ['Binary search', 'Linear probing', 'Recursion', 'Traversal'], correctAnswer: 1, categoryId: 5 },
    { id: 21, question: 'Which HTTP method is idempotent?', options: ['POST', 'PUT', 'PATCH', 'CONNECT'], correctAnswer: 1, categoryId: 5 },
    { id: 22, question: 'Which scheduling algorithm may cause starvation?', options: ['FCFS', 'Round Robin', 'Priority Scheduling', 'SJF'], correctAnswer: 2, categoryId: 5 },
    { id: 23, question: 'What does ACID stand for in DBMS?', options: ['Atomicity, Consistency, Isolation, Durability', 'Accuracy, Consistency, Integrity, Durability', 'Atomicity, Concurrency, Isolation, Dependency', 'Access, Control, Integrity, Data'], correctAnswer: 0, categoryId: 5 },
    { id: 24, question: 'Which algorithm is used in TCP congestion control?', options: ['Dijkstra', 'Slow Start', 'Bellman-Ford', 'A*'], correctAnswer: 1, categoryId: 5 }
  ],
  users: [
    { id: 'u1', username: 'DemoUser', password: 'password', xp: 1200, level: 5, profilePicture: null }
  ]
};

// Helper to get data
const getData = (key) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
};

// Helper to set data
const setData = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// Initialize Storage if empty
// Initialize Storage if empty or outdated
const initializeStorage = () => {
  // --- Categories ---
  const storedCategories = getData(STORAGE_KEYS.CATEGORIES);
  if (!storedCategories) {
    setData(STORAGE_KEYS.CATEGORIES, SEED_DATA.categories);
  } else {
    // Merge missing categories (e.g., Computer Science)
    let updated = false;
    SEED_DATA.categories.forEach(seedCat => {
      if (!storedCategories.find(c => c.id === seedCat.id)) {
        storedCategories.push(seedCat);
        updated = true;
      }
      // Also update icons if missing
      const existing = storedCategories.find(c => c.id === seedCat.id);
      if (existing && !existing.icon && seedCat.icon) {
        existing.icon = seedCat.icon;
        updated = true;
      }
    });
    if (updated) setData(STORAGE_KEYS.CATEGORIES, storedCategories);
  }

  // --- Questions ---
  const storedQuestions = getData(STORAGE_KEYS.QUESTIONS);
  if (!storedQuestions) {
    setData(STORAGE_KEYS.QUESTIONS, SEED_DATA.questions);
  } else {
    // Merge missing questions
    let updated = false;
    SEED_DATA.questions.forEach(seedQ => {
      if (!storedQuestions.find(q => q.id === seedQ.id)) {
        storedQuestions.push(seedQ);
        updated = true;
      }
    });
    if (updated) setData(STORAGE_KEYS.QUESTIONS, storedQuestions);
  }

  // --- Users ---
  if (!getData(STORAGE_KEYS.USERS)) setData(STORAGE_KEYS.USERS, SEED_DATA.users);
};

initializeStorage();

export const mockApi = {
  // --- Categories ---
  getCategories: async () => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(getData(STORAGE_KEYS.CATEGORIES) || []), 300);
    });
  },

  addCategory: async (name) => {
    return new Promise((resolve) => {
      const categories = getData(STORAGE_KEYS.CATEGORIES) || [];
      const newCategory = { id: Date.now(), name };
      categories.push(newCategory);
      setData(STORAGE_KEYS.CATEGORIES, categories);
      setTimeout(() => resolve(newCategory), 300);
    });
  },

  deleteCategory: async (id) => {
    return new Promise((resolve) => {
      let categories = getData(STORAGE_KEYS.CATEGORIES) || [];
      categories = categories.filter(c => c.id !== id);
      setData(STORAGE_KEYS.CATEGORIES, categories);
      setTimeout(() => resolve({ success: true }), 300);
    });
  },

  // --- Questions ---
  getQuestions: async (categoryId = null) => {
    return new Promise((resolve) => {
      const questions = getData(STORAGE_KEYS.QUESTIONS) || [];
      if (categoryId) {
        resolve(questions.filter(q => q.categoryId == categoryId));
      } else {
        resolve(questions);
      }
    });
  },

  addQuestion: async (questionData) => {
    return new Promise((resolve) => {
      const questions = getData(STORAGE_KEYS.QUESTIONS) || [];
      const newQuestion = { ...questionData, id: Date.now() };
      questions.push(newQuestion);
      setData(STORAGE_KEYS.QUESTIONS, questions);
      setTimeout(() => resolve(newQuestion), 300);
    });
  },

  deleteQuestion: async (id) => {
    return new Promise((resolve) => {
      let questions = getData(STORAGE_KEYS.QUESTIONS) || [];
      questions = questions.filter(q => q.id !== id);
      setData(STORAGE_KEYS.QUESTIONS, questions);
      setTimeout(() => resolve({ success: true }), 300);
    });
  },

  // --- Users / Auth ---
  login: async (username, password) => {
    return new Promise((resolve, reject) => {
      const users = getData(STORAGE_KEYS.USERS) || [];
      const user = users.find(u => u.username === username && u.password === password);
      if (user) {
        setTimeout(() => resolve({ user, token: 'mock-jwt-token' }), 500);
      } else {
        setTimeout(() => reject(new Error('Invalid credentials')), 500);
      }
    });
  },

  register: async (userData) => {
    return new Promise((resolve) => {
      const users = getData(STORAGE_KEYS.USERS) || [];
      const newUser = { ...userData, id: Date.now(), xp: 0, level: 1 };
      users.push(newUser);
      setData(STORAGE_KEYS.USERS, users);
      setTimeout(() => resolve({ user: newUser, token: 'mock-jwt-token' }), 500);
    });
  },

  // --- Leaderboard ---
  getLeaderboard: async () => {
    return new Promise((resolve) => {
      const users = getData(STORAGE_KEYS.USERS) || [];
      // Sort by XP descending
      const sorted = [...users].sort((a, b) => b.xp - a.xp);
      setTimeout(() => resolve(sorted), 300);
    });
  },

  updateUserStats: async (userId, stats) => {
    return new Promise((resolve) => {
      const users = getData(STORAGE_KEYS.USERS) || [];
      const userIndex = users.findIndex(u => u.id === userId);

      if (userIndex !== -1) {
        const user = users[userIndex];
        // Update stats
        user.xp = (user.xp || 0) + (stats.xpEarned || 0);
        user.wins = (user.wins || 0) + (stats.isWin ? 1 : 0);
        user.totalBattles = (user.totalBattles || 0) + 1;
        if (stats.badge) user.bestBadge = stats.badge; // Simplified badge logic

        users[userIndex] = user;
        setData(STORAGE_KEYS.USERS, users);
        setTimeout(() => resolve(user), 300);
      } else {
        resolve(null);
      }
    });
  }
};
