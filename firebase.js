import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBMSRujHeiQuQ8IhxLbOjJ3hEwDvXInEEI",
  authDomain: "rosea-3ecae.firebaseapp.com",
  projectId: "rosea-3ecae",
  storageBucket: "rosea-3ecae.appspot.com",
  messagingSenderId: "75900264594",
  appId: "1:75900264594:web:b80478d88a2bf86594064b",
  measurementId: "G-R6QFW1EYZC"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
