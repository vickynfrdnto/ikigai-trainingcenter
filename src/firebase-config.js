// src/firebase-config.js
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getFunctions } from "firebase/functions";

// Ganti isi object di bawah dengan data dari Firebase Console kamu!
const firebaseConfig = {
  apiKey: "AIzaSyD9Eo0hyxWZw_r5KK5AtQUayQSNpfR9TVM",
  authDomain: "ikigai-trainingcenter.firebaseapp.com",
  databaseURL: "https://ikigai-trainingcenter-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "ikigai-trainingcenter",
  storageBucket: "ikigai-trainingcenter.firebasestorage.app",
  messagingSenderId: "277153605861",
  appId: "1:277153605861:web:19b6b8b13fbb55b833cc0c",
  measurementId: "G-FH0Q4RNDQV"
};

// Inisialisasi Firebase
export const app = initializeApp(firebaseConfig);

// Inisialisasi Realtime Database
export const db = getDatabase(app);
export const functions = getFunctions(app, "asia-southeast1");
