// import React, { createContext, useContext, useState, useEffect } from "react";

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [isLoggedIn, setIsLoggedIn] = useState(() => {
//     return localStorage.getItem("isLoggedIn") === "true";
//   });

//   const login = () => {
//     localStorage.setItem("isLoggedIn", "true");
//     setIsLoggedIn(true);
//   };

//   const logout = () => {
//     localStorage.removeItem("isLoggedIn");
//     setIsLoggedIn(false);
//   };

//   useEffect(() => {
//     const status = localStorage.getItem("isLoggedIn") === "true";
//     setIsLoggedIn(status);
//   }, []);

//   return (
//     <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);

















// import React, { createContext, useContext, useState, useEffect } from "react";

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(() => {
//     const userData = localStorage.getItem("user");
//     return userData ? JSON.parse(userData) : null;
//   });

//   const login = (userData) => {
//     localStorage.setItem("user", JSON.stringify(userData));
//     setUser(userData);
//   };

//   const logout = () => {
//     localStorage.removeItem("user");
//     setUser(null);
//   };

//   useEffect(() => {
//     const userData = localStorage.getItem("user");
//     if (userData) {
//       setUser(JSON.parse(userData));
//     }
//   }, []);

//   const isLoggedIn = !!user;

//   return (
//     <AuthContext.Provider value={{ user, isLoggedIn, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);









// import React, { createContext, useContext, useState, useEffect } from "react";

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);

//   const login = () => {
//     localStorage.setItem("isLoggedIn", "true");
//     setIsLoggedIn(true);
//   };

//   const logout = () => {
//     localStorage.removeItem("isLoggedIn");
//     localStorage.removeItem("user");
//     setIsLoggedIn(false);
//   };

//   useEffect(() => {
//     // Check if user token exists on app load
//     const userData = JSON.parse(localStorage.getItem("user"));
//     const tokenExists = userData?.token;
//     setIsLoggedIn(!!tokenExists);
//   }, []);

//   return (
//     <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);








// import React, { createContext, useContext, useState, useEffect } from "react";

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);

//   const login = (userData) => {
//     localStorage.setItem("isLoggedIn", "true");
//     localStorage.setItem("user", JSON.stringify(userData)); // Store the user data
//     setIsLoggedIn(true);
//   };

//   const logout = () => {
//     localStorage.removeItem("isLoggedIn");
//     localStorage.removeItem("user");
//     setIsLoggedIn(false);
//   };

//   useEffect(() => {
//     // Check if user is logged in based on 'isLoggedIn' flag in localStorage
//     const isUserLoggedIn = localStorage.getItem("isLoggedIn");
//     if (isUserLoggedIn) {
//       const userData = JSON.parse(localStorage.getItem("user"));
//       const tokenExists = userData?.token;
//       setIsLoggedIn(!!tokenExists); // Ensure the token exists to maintain the login state
//     }
//   }, []);

//   return (
//     <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);









// import React, { createContext, useContext, useState, useEffect } from "react";

// // Create the context
// const AuthContext = createContext();

// // AuthProvider component to wrap around app and provide the context
// export const AuthProvider = ({ children }) => {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);

//   const login = (userData) => {
//     localStorage.setItem("isLoggedIn", "true");
//     localStorage.setItem("user", JSON.stringify(userData)); // Store the user data
//     setIsLoggedIn(true);
//   };

//   const logout = () => {
//     localStorage.removeItem("isLoggedIn");
//     localStorage.removeItem("user");
//     setIsLoggedIn(false);
//   };

//   useEffect(() => {
//     // Check if user is logged in based on 'isLoggedIn' flag in localStorage
//     const isUserLoggedIn = localStorage.getItem("isLoggedIn");

//     // If there's no isLoggedIn flag, don't do anything
//     if (!isUserLoggedIn) return;

//     try {
//       const userData = localStorage.getItem("user");

//       // Check if userData exists and if it's a valid JSON string
//       if (userData) {
//         const parsedData = JSON.parse(userData);
//         const tokenExists = parsedData?.token;

//         // Set isLoggedIn if the token exists
//         setIsLoggedIn(!!tokenExists); // Ensure the token exists to maintain the login state
//       }
//     } catch (error) {
//       console.error("Error parsing user data:", error);
//       // Handle the case where the user data in localStorage is corrupted or invalid
//       logout(); // Log out if parsing fails
//     }
//   }, []);

//   return (
//     <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// // useAuth hook to access AuthContext
// export const useAuth = () => useContext(AuthContext);














import React, { createContext, useContext, useState, useEffect } from "react";

// Create the context
const AuthContext = createContext();

// AuthProvider component to wrap around app and provide the context
export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const login = (userData) => {
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("user", JSON.stringify(userData)); // Store the user data
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
  };

  useEffect(() => {
    // Check if user is logged in based on 'isLoggedIn' flag in localStorage
    const isUserLoggedIn = localStorage.getItem("isLoggedIn");

    // If there's no isLoggedIn flag or user is not logged in, exit early
    if (!isUserLoggedIn) return;

    const userData = localStorage.getItem("user");

    // Check if the user data exists and is a valid JSON string
    if (userData) {
      try {
        const parsedData = JSON.parse(userData);

        // Check if token exists to determine login state
        const tokenExists = parsedData?.token;
        setIsLoggedIn(!!tokenExists); // Ensure the token exists to maintain the login state
      } catch (error) {
        console.error("Error parsing user data:", error);
        // If parsing fails (invalid JSON), log out the user
        logout();
      }
    } else {
      // If no user data, log out the user
      logout();
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// useAuth hook to access AuthContext
export const useAuth = () => useContext(AuthContext);
