import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCIA2tmoQJ2vqEPulzW0tkEwFM4_uXxi74",
  authDomain: "trello-clone-b4671.firebaseapp.com",
  projectId: "trello-clone-b4671",
  storageBucket: "trello-clone-b4671.appspot.com",
  messagingSenderId: "768865203218",
  appId: "1:768865203218:web:8aceb4ad4694cdcd21d4cb",
};

firebase.initializeApp(firebaseConfig);

// Initialize Firebase
export const firebaseInstance = firebase;
export const authService = firebase.auth();
export const db = firebase.firestore();
export const storageService = firebase.storage();
