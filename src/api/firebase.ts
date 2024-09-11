import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCmOFUqFioa_vINO9mdQ3M5b5Ye0oTIC74",
  authDomain: "br.com.fiap.insights",
  projectId: "loginsignup-insights",
  storageBucket: "loginsignup-insights.appspot.com",
  messagingSenderId: "725919194629",
  appId: "1:725919194629:android:1f236fa98992002179066c",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
