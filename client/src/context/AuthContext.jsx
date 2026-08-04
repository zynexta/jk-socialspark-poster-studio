import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('jk_poster_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem('jk_poster_token') || null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('jk_poster_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('jk_poster_user');
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('jk_poster_token', token);
    } else {
      localStorage.removeItem('jk_poster_token');
    }
  }, [token]);

  // Strict MongoDB Atlas API Login (100% Database Driven - No hardcoded fallback credentials)
  const login = async (email, password) => {
    if (!email || !password) {
      throw new Error('Please enter both email and password.');
    }

    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data.message || 'Incorrect email or password! Authentication failed.');
    }

    const authenticatedUser = data.user;
    const authenticatedToken = data.token;

    setUser(authenticatedUser);
    setToken(authenticatedToken);
    return authenticatedUser;
  };

  // Update Admin Profile in MongoDB Atlas
  const updateUser = async (updatedFields) => {
    let finalUpdated = { ...user, ...updatedFields };

    try {
      const res = await fetch(`${API_BASE_URL}/auth/update-profile`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ...updatedFields, userId: user?.id || user?._id }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          finalUpdated = { ...finalUpdated, ...data.user };
        }
      }
    } catch (err) {
      console.warn('MongoDB profile sync info:', err.message);
    }

    setUser(finalUpdated);
    localStorage.setItem('jk_poster_user', JSON.stringify(finalUpdated));
    return finalUpdated;
  };

  // Update Admin Password in MongoDB Atlas
  const updatePassword = async (newPassword) => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/update-password`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ newPassword, userId: user?.id || user?._id }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Failed to update password in MongoDB Atlas');
      }
    } catch (err) {
      console.warn('MongoDB password sync info:', err.message);
      throw err;
    }

    return true;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        login,
        updateUser,
        updatePassword,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
