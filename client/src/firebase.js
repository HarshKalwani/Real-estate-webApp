// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-73e95.firebaseapp.com",
  projectId: "mern-estate-73e95",
  storageBucket: "mern-estate-73e95.appspot.com",
  messagingSenderId: "364901710625",
  appId: "1:364901710625:web:1e18bcd9a4ed10592a1c60"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);