// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "prepping-19d2d.firebaseapp.com",
  projectId: "prepping-19d2d",
  storageBucket: "prepping-19d2d.appspot.com",
  messagingSenderId: "1035407447322",
  appId: "1:1035407447322:web:765e870fac5bf15c82c8a3",
  measurementId: "G-9KSP7WT08X",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
