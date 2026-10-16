import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@halal_scanner_auth_state';

const AuthContext = createContext({
  user: null,
  token: null,
  isLoading: true,
  signup: async () => {},
  login: async () => {},
  logout: async () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAuth = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          const { user: u, token: t } = JSON.parse(stored);
          setUser(u);
          setToken(t);
        }
      } catch (e) {
        // Ignore storage errors
      } finally {
        setIsLoading(false);
      }
    };
    loadAuth();
  }, []);

  const signup = async (email, password) => {
    const newUser = { email, id: Date.now().toString() };
    const newToken = `token-${Date.now()}`;
    setUser(newUser);
    setToken(newToken);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ user: newUser, token: newToken }));
  };

  const login = async (email, password) => {
    const newUser = { email, id: Date.now().toString() };
    const newToken = `token-${Date.now()}`;
    setUser(newUser);
    setToken(newToken);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ user: newUser, token: newToken }));
  };

  const logout = async () => {
    setUser(null);
    setToken(null);
    await AsyncStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
