// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBv-BWr9VK_q3KijgicP3Y1bAveIts_rZA",
  authDomain: "icodeeditor.firebaseapp.com",
  projectId: "icodeeditor",
  storageBucket: "icodeeditor.appspot.com",
  messagingSenderId: "607564624842",
  appId: "1:607564624842:web:b9b7a54f6d287d18745533",
  measurementId: "G-5KVF4XJFRV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase Auth and Google Auth Provider
const auth = getAuth(app); // Initialize auth
const googleProvider = new GoogleAuthProvider();

// Export the initialized services
export { auth, googleProvider, signInWithPopup, signOut };