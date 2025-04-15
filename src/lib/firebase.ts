
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCyJJWdS_DVa6X5monosZRgAW7eD1HmTi0",
  authDomain: "floodmonitoring-9d704.firebaseapp.com",
  databaseURL: "https://floodmonitoring-9d704-default-rtdb.firebaseio.com",
  projectId: "floodmonitoring-9d704",
  storageBucket: "floodmonitoring-9d704.firebasestorage.app",
  messagingSenderId: "703983777705",
  appId: "1:703983777705:web:54e0420717b8e23569b6b8",
  measurementId: "G-XDEBM4FGS4"
};

export const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
