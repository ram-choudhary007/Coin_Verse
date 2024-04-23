import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCWa-L6n3LyLcZ3f2ksNoHTyQEGWcs_9dA",
  authDomain: "crypto-verse-214.firebaseapp.com",
  projectId: "crypto-verse-214",
  storageBucket: "crypto-verse-214.appspot.com",
  messagingSenderId: "933928695444",
  appId: "1:933928695444:web:60bbe9e4b1e3b790dbe681",
  measurementId: "G-3PHKYN1GJV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app); // Initialize Firestore
// const analytics = getAnalytics(app);
export const googleProvider = new GoogleAuthProvider();
export {auth, db};