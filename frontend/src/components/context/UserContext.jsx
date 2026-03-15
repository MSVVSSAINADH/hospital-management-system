import React, { createContext, useState, useEffect } from 'react';

// Create a context for the user object
export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Load user data from localStorage on initial render
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (e) {
      console.error('Failed to parse user data from localStorage', e);
      // Clear invalid data to prevent future errors
      localStorage.removeItem('user');
    }
  }, []); // Empty dependency array ensures this runs only once

  // Function to log in the user and update context
  const loginUser = (userData) => {
    // Save user data to localStorage
    localStorage.setItem('user', JSON.stringify(userData));
    // Update the state
    setUser(userData);
  };

  // Function to log out the user and clear context
  const logoutUser = () => {
    // Clear user data from localStorage
    localStorage.removeItem('user');
    // Clear the state
    setUser(null);
  };

  const contextValue = {
    user,
    loginUser,
    logoutUser,
  };

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
};