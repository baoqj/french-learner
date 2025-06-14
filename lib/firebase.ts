// lib/firebase.ts

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCn1Yu13v4oUnZSI4mrYZP3IIjiPD2L0fk",
  authDomain: "volala.firebaseapp.com",
  projectId: "volala",
  storageBucket: "volala.firebasestorage.app",
  messagingSenderId: "836873328236",
  appId: "1:836873328236:web:37925ed7b193701796aa49",
  measurementId: "G-15NDJ2GJV2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

const auth = getAuth(app);
console.log("Firebase Auth initialized:", auth); // 检查 auth 是否初始化成功

export { auth };