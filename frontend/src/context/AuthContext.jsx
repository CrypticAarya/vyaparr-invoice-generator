import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (authToken) => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
      const { data } = await axios.get(`${API_URL}/auth/profile`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      
      const userData = data.user;
      setUser(userData);
      localStorage.setItem('vyaparflow_user', JSON.stringify(userData));
    } catch (err) {
      console.error("Session verification failed:", err);
      logout();
    }
  };

  useEffect(() => {
    const hydrate = async () => {
      const storedToken = localStorage.getItem('vyaparflow_token');
      const storedUser = localStorage.getItem('vyaparflow_user');

      if (storedToken) {
        setToken(storedToken);
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
        // Always fetch fresh profile to sync state (onboarding, business details)
        await fetchProfile(storedToken);
      }
      setLoading(false);
    };

    hydrate();
  }, []);

  const login = (userData, authToken) => {
    setToken(authToken);
    setUser(userData);
    localStorage.setItem('vyaparflow_token', authToken);
    localStorage.setItem('vyaparflow_user', JSON.stringify(userData));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('vyaparflow_token');
    localStorage.removeItem('vyaparflow_user');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, refreshUser: () => fetchProfile(token) }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
