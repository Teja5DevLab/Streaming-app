import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDPc46j2Gj0OkgVuGZGpVjN_GoMEv3mAcc",
  authDomain: "streaming-423310.firebaseapp.com",
  projectId: "streaming-423310",
  storageBucket: "streaming-423310.appspot.com",
  messagingSenderId: "498060982615",
  appId: "1:498060982615:web:2e67f722a49d2903c0e612",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

const signInWithGoogle = () => {
  return signInWithPopup(auth, provider);
};

const logOut = () => {
  return signOut(auth);
};

export { auth, signInWithGoogle, logOut, db };
