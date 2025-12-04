// App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Profile from "./components/Profile";
import Categories from "./components/Categories";
import StartBattle from "./components/StartBattle";
import AdminPanel from "./components/AdminPanel";
import AddQuestion from "./components/AddQuestion";
import ManageQuestions from "./components/ManageQuestions";
import AddCategory from "./components/AddCategory";
import ManageCategories from "./components/ManageCategories";
import EditQuestion from "./components/EditQuestion";
import Quiz from "./components/Quiz";
import BattleResults from "./components/BattleResults";
import SoloQuiz from "./components/SoloQuiz";
import Leaderboard from "./components/Leaderboard";
import Achievements from "./components/Achievements";
import Friends from "./components/Friends";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/category" element={<Categories />} />
      <Route path="/start-battle" element={<StartBattle />} />
      <Route path="/quiz" element={<Quiz />} />
      <Route path="/admin" element={<AdminPanel />} />
      <Route path="/admin/add-question" element={<AddQuestion />} />
      <Route path="/admin/manage-questions" element={<ManageQuestions />} />
      <Route path="/admin/edit-question/:id" element={<EditQuestion />} />
      <Route path="/admin/add-category" element={<AddCategory />} />
      <Route path="/admin/manage-categories" element={<ManageCategories />} />
      <Route path="/battle-results" element={<BattleResults />} />
      <Route path="/solo-quiz" element={<SoloQuiz />} />
      <Route path="/leaderboard" element={<Leaderboard />} />
      <Route path="/achievements" element={<Achievements />} />
      <Route path="/friends" element={<Friends />} />
    </Routes>
  );
}

export default App;
