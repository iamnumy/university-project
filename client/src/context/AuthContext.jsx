import { createContext, useContext, useEffect, useState } from 'react';
import {
  apiLogin,
  apiMe,
  apiRegister,
  getToken,
  setToken,
} from '../api/client.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState('loading'); // loading | ready

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setStatus('ready');
      return;
    }
    apiMe()
      .then((data) => setUser(data.user))
      .catch(() => setToken(null))
      .finally(() => setStatus('ready'));
  }, []);

  const login = async (email, password) => {
    const data = await apiLogin({ email, password });
    setToken(data.token);
    setUser(data.user);
    return data.user;
  };

  const register = async (name, email, password) => {
    const data = await apiRegister({ name, email, password });
    setToken(data.token);
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, status, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
