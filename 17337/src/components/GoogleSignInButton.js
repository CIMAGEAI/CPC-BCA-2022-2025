import React from 'react';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { db } from '../firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

const GoogleSignInButton = ({ onSuccess, onError }) => {
  const handleGoogleSignIn = async () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userDocRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(userDocRef);
      if (!docSnap.exists()) {
        await setDoc(userDocRef, {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          createdAt: serverTimestamp(),
          provider: 'google',
          role: 'user',
          isBlocked: false
        });
      }

      if (onSuccess) {
        onSuccess(user);
      }

    } catch (error) {
      console.error("Error signing in with Google:", error);
      if (onError) {
        onError("Failed to sign in with Google.");
      }
    }
  };

  return (
    <button type="button" className="google-btn" onClick={handleGoogleSignIn}>
      <img src="/images/google.png" alt="Google Logo" />
      Sign in with Google
    </button>
  );
};

export default GoogleSignInButton;