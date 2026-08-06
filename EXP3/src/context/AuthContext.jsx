import React, { createContext, useContext, useState, useEffect } from 'react';
import { isTokenValid, decodeToken } from '../utils/mockJwt';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for token on mount
    const token = localStorage.getItem('jwt_token');
    if (token && isTokenValid(token)) {
      const decoded = decodeToken(token);
      setUser(decoded);
    } else {
      localStorage.removeItem('jwt_token');
    }
    setLoading(false);
  }, []);

  const login = (token) => {
    localStorage.setItem('jwt_token', token);
    setUser(decodeToken(token));
  };

  const logout = () => {
    localStorage.removeItem('jwt_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
