// src/Context/AuthContext.jsx - Simplified for Cloud Functions
import React, { createContext, useContext, useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../firebase/config";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const calculateLevel = (xp) => Math.floor(xp / 100) + 1;

  const calculateRank = (xp) => {
    if (xp >= 5000) return "Gold III";
    if (xp >= 4000) return "Gold II";
    if (xp >= 3000) return "Gold I";
    if (xp >= 2000) return "Silver III";
    if (xp >= 1500) return "Silver II";
    if (xp >= 1000) return "Silver I";
    if (xp >= 500) return "Bronze III";
    if (xp >= 250) return "Bronze II";
    return "Bronze I";
  };

  // Sign up function - Cloud Function will create document automatically
  const signup = async (email, password, username) => {
    try {
      console.log("🔄 Starting signup...");

      // Create Auth user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log("✅ Auth user created:", user.uid);

      // Update display name (Cloud Function will pick this up)
      await updateProfile(user, { displayName: username });
      console.log("✅ Display name set:", username);

      // Cloud Function will automatically create the Firestore document
      console.log("⏳ Waiting for Cloud Function to create document...");
      
      // Wait for document to be created by Cloud Function
      await waitForUserDocument(user.uid);

      return userCredential;
    } catch (error) {
      console.error("❌ Signup error:", error.code, error.message);
      throw error;
    }
  };

  // Wait for Cloud Function to create user document
  const waitForUserDocument = async (uid, maxAttempts = 10) => {
    for (let i = 0; i < maxAttempts; i++) {
      try {
        const userDoc = await getDoc(doc(db, "users", uid));
        if (userDoc.exists()) {
          console.log("✅ User document found!");
          return userDoc.data();
        }
        
        console.log(`⏳ Waiting for document... (${i + 1}/${maxAttempts})`);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
      } catch (error) {
        console.error("Error checking for document:", error);
      }
    }
    
    console.warn("⚠️ Document not created by Cloud Function");
    return null;
  };

  // Login function
  const login = async (email, password) => {
    try {
      console.log("🔄 Logging in...");
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Update last login
      try {
        await updateDoc(doc(db, "users", userCredential.user.uid), {
          lastLogin: new Date().toISOString(),
        });
        console.log("✅ Last login updated");
      } catch (err) {
        console.warn("⚠️ Could not update last login:", err);
      }

      return userCredential;
    } catch (error) {
      console.error("❌ Login error:", error);
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await signOut(auth);
      setUserData(null);
      setUserRole(null);
      console.log("✅ Logged out");
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  };

  // Fetch user data
  const fetchUserData = async (uid, retries = 5) => {
    for (let i = 0; i < retries; i++) {
      try {
        console.log(`🔄 Fetching user data (attempt ${i + 1}/${retries})...`);
        
        const userDoc = await getDoc(doc(db, "users", uid));

        if (userDoc.exists()) {
          const data = userDoc.data();
          console.log("✅ User data loaded:", data.username, "| Role:", data.role);
          return data;
        }

        // Wait before retry
        if (i < retries - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      } catch (error) {
        console.error(`❌ Fetch error (attempt ${i + 1}):`, error);
        if (i === retries - 1) throw error;
      }
    }

    console.error("❌ User document not found after retries");
    return null;
  };

  // Update user stats
  const updateUserStats = async (uid, updates) => {
    try {
      const userRef = doc(db, "users", uid);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        throw new Error("User document not found");
      }

      const currentData = userDoc.data();
      const newXP = (currentData.xp || 0) + (updates.xpEarned || 0);
      const newLevel = calculateLevel(newXP);
      const newRank = calculateRank(newXP);

      const newWins = (currentData.wins || 0) + (updates.isWin ? 1 : 0);
      const newLosses = (currentData.losses || 0) + (updates.isWin ? 0 : 1);
      const newTotalBattles = (currentData.totalBattles || 0) + 1;
      const newWinRate = newTotalBattles > 0 ? Math.round((newWins / newTotalBattles) * 100) : 0;

      let newStreak = currentData.streak || 0;
      newStreak = updates.isWin ? newStreak + 1 : 0;

      const badgeOrder = ["Bronze I", "Bronze II", "Bronze III", "Silver I", "Silver II", "Silver III", "Gold I", "Gold II", "Gold III"];
      const currentBadgeIndex = badgeOrder.indexOf(currentData.badge || "Bronze I");
      const newBadgeIndex = badgeOrder.indexOf(newRank);
      const bestBadge = newBadgeIndex > currentBadgeIndex ? newRank : (currentData.badge || "Bronze I");

      await updateDoc(userRef, {
        xp: newXP,
        level: newLevel,
        rank: newRank,
        badge: bestBadge,
        wins: newWins,
        losses: newLosses,
        totalBattles: newTotalBattles,
        winRate: newWinRate,
        streak: newStreak,
      });

      const updatedData = await fetchUserData(uid);
      setUserData(updatedData);
      return updatedData;
    } catch (error) {
      console.error("Error updating stats:", error);
      throw error;
    }
  };

  // Update user profile
  const updateUserProfile = async (uid, updates) => {
    try {
      const userRef = doc(db, "users", uid);
      await updateDoc(userRef, updates);

      if (updates.username) {
        await updateProfile(auth.currentUser, { displayName: updates.username });
      }

      const updatedData = await fetchUserData(uid);
      setUserData(updatedData);
      return updatedData;
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  };

  // Auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log("🔄 Auth state changed:", user ? user.uid : "logged out");
      
      setCurrentUser(user);

      if (user) {
        try {
          const data = await fetchUserData(user.uid);
          setUserData(data);
          setUserRole(data?.role || "user");
          console.log("✅ User loaded | Role:", data?.role);
        } catch (error) {
          console.error("Failed to load user data:", error);
          setUserData(null);
          setUserRole(null);
        }
      } else {
        setUserData(null);
        setUserRole(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userRole,
    userData,
    signup,
    login,
    logout,
    isAdmin: userRole === "admin",
    updateUserStats,
    updateUserProfile,
    fetchUserData,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};