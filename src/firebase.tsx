import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDjDC37ckMbF4DEjvlKmCDm6xObaL_O3tg",
  authDomain: "berehynja-96998.firebaseapp.com",
  projectId: "berehynja-96998",
  storageBucket: "berehynja-96998.firebasestorage.app",
  messagingSenderId: "619777605754",
  appId: "1:619777605754:web:ec567e5bc74714b9643bc3",
  measurementId: "G-HPWJEY80ER",
};

const app = initializeApp(firebaseConfig);
// export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
