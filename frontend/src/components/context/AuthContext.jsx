import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Initialize user from sessionStorage if available
  const [user, setUser] = useState(() => {
    const storedUser = sessionStorage.getItem("user");
    if (!storedUser) return null;
    
    let parsedUser = JSON.parse(storedUser);
    
    // Auto-migrate old nested JWT blobs left in sessionStorage from previous logins
    if (parsedUser && parsedUser.user && !parsedUser.role && parsedUser.token) {
      parsedUser = { ...parsedUser.user, token: parsedUser.token };
      sessionStorage.setItem("user", JSON.stringify(parsedUser)); // Heal the storage instantly
    }
    return parsedUser;
  });

  const login = (userData) => {
    setUser(userData);
    sessionStorage.setItem("user", JSON.stringify(userData)); // persist in session
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem("user"); // clear session
  };

  // Optional: update sessionStorage if user data changes (like profile update)
  useEffect(() => {
    if (user) {
      sessionStorage.setItem("user", JSON.stringify(user));
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
