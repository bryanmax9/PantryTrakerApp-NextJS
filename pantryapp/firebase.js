// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCJzt_TDkjm_M5PP4Hey4FW6yxtGW_AeM4",
  authDomain: "pantryapp-f04ed.firebaseapp.com",
  projectId: "pantryapp-f04ed",
  storageBucket: "pantryapp-f04ed.appspot.com",
  messagingSenderId: "55168617045",
  appId: "1:55168617045:web:aee1715aa3644a06eea2dc",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
export { app, firestore };
