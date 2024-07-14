import {getApp, getApps, initializeApp} from 'firebase/app'
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth'
import {getFirestore} from 'firebase/firestore'
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getStorage } from 'firebase/storage';


const firebaseConfig = {
  apiKey: "AIzaSyADrwxflwclXuzE8IJLXyceRIMrckHMxtY",
  authDomain: "hacker-ramp-ef65e.firebaseapp.com",
  projectId: "hacker-ramp-ef65e",
  storageBucket: "hacker-ramp-ef65e.appspot.com",
  messagingSenderId: "35544732441",
  appId: "1:35544732441:web:c1f0c494aeaf4b741f2b88"
};

const app = getApps.length > 0 ? getApp() : initializeApp(firebaseConfig)

const firebaseAuth = getAuth(app)
const firestoreDB = getFirestore(app)
const storage = getStorage(app);

export{app, firebaseAuth, firestoreDB, storage}
