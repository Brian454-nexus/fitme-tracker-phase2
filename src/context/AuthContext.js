import React, { createContext, useState, useContext, useEffect } from "react";

// Create the authentication context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in (from localStorage)
  useEffect(() => {
    const user = localStorage.getItem("fitmeUser");
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
    setLoading(false);
  }, []);

  // Sign in function
  const signIn = (email, password) => {
    // This is a mock implementation
    // In a real app, you would call your authentication API
    return new Promise((resolve, reject) => {
      try {
        // Mock successful login
        const user = { id: 1, email, name: email.split('@')[0] };
        setCurrentUser(user);
        localStorage.setItem("fitmeUser", JSON.stringify(user));
        resolve(user);
      } catch (error) {
        reject(error);
      }
    });
  };

  // Sign up function
  const signUp = (name, email, password) => {
    // This is a mock implementation
    // In a real app, you would call your registration API
    return new Promise((resolve, reject) => {
      try {
        // Mock successful registration
        const user = { id: Date.now(), email, name };
        setCurrentUser(user);
        localStorage.setItem("fitmeUser", JSON.stringify(user));
        resolve(user);
      } catch (error) {
        reject(error);
      }
    });
  };

  // Sign out function
  const signOut = () => {
    setCurrentUser(null);
    localStorage.removeItem("fitmeUser");
  };

  // Google sign in function
  const signInWithGoogle = () => {
    // This is a mock implementation
    // In a real app, you would implement Google OAuth
    return new Promise((resolve, reject) => {
      try {
        // Mock successful Google login
        const user = { 
          id: Date.now(), 
          email: "user@gmail.com", 
          name: "Google User",
          provider: "google" 
        };
        setCurrentUser(user);
        localStorage.setItem("fitmeUser", JSON.stringify(user));
        resolve(user);
      } catch (error) {
        reject(error);
      }
    });
  };

  const value = {
    currentUser,
    loading,
    signIn,
    signUp,
    signOut,
    signInWithGoogle
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;