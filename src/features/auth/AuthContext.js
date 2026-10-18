import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@halal_scanner_auth_state';

const AuthContext = createContext({
  user: null,
  token: null,
  refreshToken: null,
  isLoading: true,
  signup: async () => {},
  login: async () => {},
  logout: async () => {},
  refreshAccessToken: async () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAuth = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          const { user: u, token: t, refreshToken: rt } = JSON.parse(stored);
          setUser(u);
          setToken(t);
          setRefreshToken(rt || null);
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
    const newRefresh = `refresh-${Date.now()}`;
    setUser(newUser);
    setToken(newToken);
    setRefreshToken(newRefresh);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ user: newUser, token: newToken, refreshToken: newRefresh }));
  };

  const login = async (email, password) => {
    const newUser = { email, id: Date.now().toString() };
    const newToken = `token-${Date.now()}`;
    const newRefresh = `refresh-${Date.now()}`;
    setUser(newUser);
    setToken(newToken);
    setRefreshToken(newRefresh);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ user: newUser, token: newToken, refreshToken: newRefresh }));
  };

  const logout = async () => {
    setUser(null);
    setToken(null);
    setRefreshToken(null);
    await AsyncStorage.removeItem(STORAGE_KEY);
  };

  const refreshAccessToken = async () => {
    if (!refreshToken) return null;
    const newToken = `token-${Date.now()}`;
    setToken(newToken);
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        data.token = newToken;
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      }
    } catch (e) {
      // Ignore
    }
    return newToken;
  };

  return (
    <AuthContext.Provider value={{ user, token, refreshToken, isLoading, signup, login, logout, refreshAccessToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
