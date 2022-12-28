// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDyeqOEU4NHIa5VIiKawywZcb5GThk5FCI",
  authDomain: "whatsapp-clone-e336d.firebaseapp.com",
  projectId: "whatsapp-clone-e336d",
  storageBucket: "whatsapp-clone-e336d.appspot.com",
  messagingSenderId: "514394677706",
  appId: "1:514394677706:web:7d2f5debe1b308f1f2ef33"
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

const db = getFirestore(app)
const auth = getAuth(app)
const provider = new GoogleAuthProvider()
export {db, auth, provider};