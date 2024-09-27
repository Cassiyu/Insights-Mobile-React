import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence} from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyCmOFUqFioa_vINO9mdQ3M5b5Ye0oTIC74",
  authDomain: "br.com.fiap.insights",
  projectId: "loginsignup-insights",
  storageBucket: "loginsignup-insights.appspot.com",
  messagingSenderId: "725919194629",
  appId: "1:725919194629:android:1f236fa98992002179066c",
};

const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

export { auth };
