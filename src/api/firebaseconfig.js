import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
 apiKey: "AIzaSyAHHckRgyV8XmUYUQLHlPWP8BRkSXQpMO0",
  authDomain: "hysun-87790.firebaseapp.com",
  projectId: "hysun-87790",
  storageBucket: "hysun-87790.appspot.com",
  messagingSenderId: "36290194308",
  appId: "1:36290194308:web:34810ef8f38d729af1cbd1",
  measurementId: "G-T11K68S65H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };
