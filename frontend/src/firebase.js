// Import Firebase modules
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithEmailAndPassword,
  signOut,
  deleteUser,
} from "firebase/auth";
import { useUserStore } from "./app/store";

// 🔹 Firebase config
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};
// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
const auth = getAuth(app);

// Providers
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

// Functions to handle sign-in
const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    useUserStore.setState({
      userUid: user.uid,
      idToken: user.accessToken,
    });
    return user;
  } catch (error) {
    console.error("Google login error:", error);
    throw error;
  }
};

const signInWithFacebook = async () => {
  try {
    const result = await signInWithPopup(auth, facebookProvider);
    const user = result.user;
    useUserStore.setState({
      userUid: user.uid,
      idToken: user.accessToken,
    });
    return user;
  } catch (error) {
    throw error;
  }
};

const signInManually = async (email, password, displayName) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    await updateProfile(user, {
      displayName: displayName,
    });

    useUserStore.setState({
      userUid: user.uid,
      idToken: user.accessToken,
    });
    return user;
  } catch (err) {
    return err;
  }
};

const login = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    useUserStore.setState({
      userUid: user.uid,
      idToken: user.accessToken,
    });

    return user;
  } catch (err) {
    return err;
  }
};
const logout = async () => {
  try {
    signOut(auth);
    useUserStore.setState({
      userUid: "",
      userObjectId: "",
      idToken: "",
    });

    return { success: true, error: null };
  } catch (error) {
    return { success: false, error: error.message || "sign out error" };
  }
};
const deleteCurrentUser = async () => {
  try {
    const user = auth.currentUser;
    if (user) {
      deleteUser(user);
      return { success: true };
    } else {
      return { success: false, error: "no user signed in" };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
};
// Export everything needed
export {
  auth,
  googleProvider,
  facebookProvider,
  signInWithGoogle,
  signInWithFacebook,
  signInManually,
  login,
  logout,
  deleteCurrentUser,
};
