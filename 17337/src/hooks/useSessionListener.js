import { useEffect } from 'react';
import { getAuth, signOut } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

const useSessionListener = (user) => {
  useEffect(() => {
    const sessionId = localStorage.getItem('sessionId');

    if (user && sessionId) {
      const docRef = doc(db, 'users', user.uid, 'sessions', sessionId);

      const unsubscribe = onSnapshot(docRef, (doc) => {
        if (!doc.exists()) {
          console.log("Session was revoked remotely. Forcing logout.");
          signOut(getAuth()).then(() => {
            localStorage.removeItem('sessionId');
            window.location.href = '/login?message=logged_out_remotely';
          });
        }
      });

      return () => unsubscribe();
    }
  }, [user]);
};

export default useSessionListener;