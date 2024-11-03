import { initializeApp, getApps, getApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getDatabase } from "firebase/database";
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyB_5bz_d2DaMEPNTJYUUWT9h-1rZGDXuYk",
  authDomain: "insights-cd225.firebaseapp.com",
  projectId: "insights-cd225",
  storageBucket: "insights-cd225.appspot.com",
  messagingSenderId: "470968856190",
  appId: "1:470968856190:web:94ba1875622a3ca2a5322f",
  measurementId: "G-N3W09TDF3Q"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

const database = getDatabase(app);

export { auth, database };