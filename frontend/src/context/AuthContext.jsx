import { createContext, useContext, useEffect, useState } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('nh_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('nh_token');
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .get('/me')
      .then((res) => {
        setUser(res.data);
        localStorage.setItem('nh_user', JSON.stringify(res.data));
      })
      .catch(() => {
        localStorage.removeItem('nh_token');
        localStorage.removeItem('nh_user');
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (no_hp, password) => {
    const res = await api.post('/login', { no_hp, password });
    localStorage.setItem('nh_token', res.data.token);
    localStorage.setItem('nh_user', JSON.stringify(res.data.user));
    setUser(res.data.user);
    return res.data.user;
  };

  const register = async (payload) => {
    const res = await api.post('/register', payload);
    localStorage.setItem('nh_token', res.data.token);
    localStorage.setItem('nh_user', JSON.stringify(res.data.user));
    setUser(res.data.user);
    return res.data.user;
  };

  const logout = async () => {
    try {
      await api.post('/logout');
    } catch (e) {
      // abaikan error, tetap logout di sisi client
    }
    localStorage.removeItem('nh_token');
    localStorage.removeItem('nh_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAdmin: user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
