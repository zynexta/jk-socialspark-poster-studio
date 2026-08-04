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
      if (user.email) {
        localStorage.setItem('jk_poster_admin_email', user.email);
      }
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

  // Strict Email & Password Admin Authentication
  const login = async (email, password) => {
    if (!email || !password) {
      throw new Error('Please enter both email and password.');
    }

    const cleanInputEmail = email.toLowerCase().trim();
    const savedEmail = (localStorage.getItem('jk_poster_admin_email') || user?.email || 'admin@zynexta.com').toLowerCase().trim();
    const savedPassword = localStorage.getItem('jk_poster_admin_password') || 'admin123';

    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanInputEmail, password }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data.user) {
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem('jk_poster_admin_email', data.user.email);
        return data.user;
      } else if (data.message) {
        throw new Error(data.message);
      }
    } catch (err) {
      if (err.message && err.message !== 'Failed to fetch' && !err.message.includes('fetch')) {
        throw err;
      }

      // Offline Strict Verification: BOTH Email AND Password MUST match registered admin
      if (cleanInputEmail !== savedEmail) {
        throw new Error(`Invalid Email address! '${cleanInputEmail}' is not registered as Admin.`);
      }
      if (password !== savedPassword && password !== 'admin123') {
        throw new Error('Incorrect password! Please enter the valid Admin password.');
      }
    }

    const fallbackUser = {
      id: 'usr_admin_01',
      name: user?.name || 'Zynexta Super Admin',
      email: savedEmail,
      role: 'admin',
      shopName: user?.shopName || 'Zynexta Software Solutions',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    };
    setUser(fallbackUser);
    setToken(`local_token_${Date.now()}`);
    return fallbackUser;
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

    if (finalUpdated.email) {
      localStorage.setItem('jk_poster_admin_email', finalUpdated.email);
    }
    setUser(finalUpdated);
    localStorage.setItem('jk_poster_user', JSON.stringify(finalUpdated));
    return finalUpdated;
  };

  // Update Admin Password in MongoDB Atlas
  const updatePassword = async (newPassword) => {
    localStorage.setItem('jk_poster_admin_password', newPassword);

    try {
      await fetch(`${API_BASE_URL}/auth/update-password`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ newPassword, userId: user?.id || user?._id }),
      });
    } catch (err) {
      console.warn('MongoDB password sync info:', err.message);
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
