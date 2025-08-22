// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  "projectId": "leadflow-ze79n",
  "appId": "1:369234901417:web:d5606b49c8324accd86cb8",
  "storageBucket": "leadflow-ze79n.firebasestorage.app",
  "apiKey": "AIzaSyCLmvu3l55uefZPUc4rXJEtn6gSDjv1rH4",
  "authDomain": "leadflow-ze79n.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "369234901417"
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
