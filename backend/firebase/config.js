// src/firebase/config.js
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyCv6lzFOL6Om2gEpMDE-K7hTsNmulsb_PE",
  authDomain: "skillduels-39176.firebaseapp.com",
  databaseURL: "https://skillduels-39176-default-rtdb.firebaseio.com",
  projectId: "skillduels-39176",
  storageBucket: "skillduels-39176.firebasestorage.app",
  messagingSenderId: "340070147678",
  appId: "1:340070147678:web:e536728206bff3eafa36cf"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;