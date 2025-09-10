// DO NOT SHARE FIREBASE CONFIG ONLINE
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB0fbsYnAuDQFvpqn1yL69dEaystg2rhYs",
  authDomain: "fir-auth-2a.firebaseapp.com",
  projectId: "fir-auth-2a",
  storageBucket: "fir-auth-2a.firebasestorage.app",
  messagingSenderId: "226162935822",
  appId: "1:226162935822:web:a8d3d3b1c8f066ed2ed45f",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
