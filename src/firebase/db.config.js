// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBHymrSh8O_h_3efoC0q1wmb2WOFlKY0Os",
  authDomain: "new-iotfarm.firebaseapp.com",
  projectId: "new-iotfarm",
  storageBucket: "new-iotfarm.firebasestorage.app",
  messagingSenderId: "959576890023",
  appId: "1:959576890023:web:a6f3cb33dda905d642d982",
  measurementId: "G-YFX787N6T1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;