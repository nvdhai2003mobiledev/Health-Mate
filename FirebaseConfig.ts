// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAA0Ktn69_CY11EIveV14B_08nLyOiigSg",
  authDomain: "health-mate-84931.firebaseapp.com",
  projectId: "health-mate-84931",
  storageBucket: "health-mate-84931.appspot.com",
  messagingSenderId: "433125638290",
  appId: "1:433125638290:web:78f3233f8956f881d2e64b",
  measurementId: "G-SV5RTGGXD0"
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIREBASE_DB = getFirestore(FIREBASE_APP);
export const FIREBASE_STORAGE = getStorage(FIREBASE_APP);

