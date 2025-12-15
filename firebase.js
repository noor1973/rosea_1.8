import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";

export const firebaseConfig = {
  apiKey: "XXXX",
  authDomain: "XXXX",
  projectId: "XXXX",
  storageBucket: "XXXX",
  messagingSenderId: "XXXX",
  appId: "XXXX"
};

export const app = initializeApp(firebaseConfig);
