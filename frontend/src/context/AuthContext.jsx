import React, { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '../api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const { user: userData } = await apiClient.get('auth/profile');
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
        await fetchProfile();
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
    <AuthContext.Provider value={{ user, token, loading, login, logout, refreshUser: () => fetchProfile() }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
