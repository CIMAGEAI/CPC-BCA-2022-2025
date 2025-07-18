import React, { useContext, useState, useEffect, createContext } from "react";
import { auth, db } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";


const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (user) => {
    if (user) {
      const userDocRef = doc(db, "users", user.uid);
      let retries = 0;
      let docSnap;

      while (retries < 5) {
        try {
          docSnap = await getDoc(userDocRef);
          if (docSnap.exists()) {
            const userData = docSnap.data();
            if (userData.isBlocked) {
              signOut(auth);
            } else {
              setCurrentUser(user);
              setUserRole(userData.role || 'user');
            }
            break; 
          } else {
            await new Promise((res) => setTimeout(res, 500));
            retries++;
          }
        } catch (err) {
          console.error("Error fetching user document:", err);
          break;
        }
      }

      setLoading(false);
    } else {
      setCurrentUser(null);
      setUserRole(null);
      setLoading(false);
    }
  });

  return () => unsubscribe();
}, []);



  const value = {
    currentUser,
    userRole,
    loading,
    isLoggedIn: !!currentUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}