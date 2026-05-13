import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check localStorage on mount
    const storedToken = localStorage.getItem('vyaparflow_token');
    const storedUser = localStorage.getItem('vyaparflow_user');

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error("Auth hydration failed:", err);
        localStorage.removeItem('vyaparflow_token');
        localStorage.removeItem('vyaparflow_refresh_token');
        localStorage.removeItem('vyaparflow_user');
      }
    }
    setLoading(false);
  }, []);

  const login = (userData, authToken, refreshToken) => {
    setToken(authToken);
    setUser(userData);
    localStorage.setItem('vyaparflow_token', authToken);
    if (refreshToken) {
      localStorage.setItem('vyaparflow_refresh_token', refreshToken);
    }
    localStorage.setItem('vyaparflow_user', JSON.stringify(userData));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('vyaparflow_token');
    localStorage.removeItem('vyaparflow_refresh_token');
    localStorage.removeItem('vyaparflow_user');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
