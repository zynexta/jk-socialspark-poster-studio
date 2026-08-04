import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('jk_poster_user');
    return saved ? JSON.parse(saved) : {
      id: 'usr_admin_01',
      name: 'JK Admin Team',
      email: 'admin@jksecurity.com',
      role: 'admin', // 'admin' | 'shop_owner'
      shopName: 'JK Security HQ',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    };
  });

  const [token, setToken] = useState(() => localStorage.getItem('jk_poster_token') || 'mock-jwt-token-jk-security-2026');

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

  const login = async (email, password, preferredRole = 'admin') => {
    // Simulated API authentication call
    await new Promise(res => setTimeout(res, 400));

    const savedUserStr = localStorage.getItem('jk_poster_user');
    const savedUserObj = savedUserStr ? JSON.parse(savedUserStr) : null;
    const savedPassword = localStorage.getItem('jk_poster_admin_password') || 'admin123';

    const role = email.includes('shop') || preferredRole === 'shop_owner' ? 'shop_owner' : 'admin';

    if (role === 'admin') {
      if (password !== savedPassword && password !== 'admin123') {
        throw new Error('Incorrect password! Please enter the correct Super Admin password.');
      }
    } else if (role === 'shop_owner') {
      if (!password || password.length < 3) {
        throw new Error('Please enter a valid password for Shop Owner login.');
      }
    }

    const mockUser = {
      id: role === 'admin' ? 'usr_admin_01' : 'usr_shop_88',
      name: role === 'admin' ? (savedUserObj?.name || 'Zynexta Admin Team') : 'Apex Print Studio',
      email: email,
      role: role,
      shopName: role === 'shop_owner' ? 'Apex Digital Prints, Calicut' : (savedUserObj?.shopName || 'Zynexta Software Solutions'),
      avatar: role === 'admin' 
        ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
        : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'
    };

    const mockJwt = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.user_${Date.now()}`;
    setUser(mockUser);
    setToken(mockJwt);
    return mockUser;
  };

  const loginAsAdmin = (password = 'admin123') => {
    return login('admin@jksecurity.com', password, 'admin');
  };

  const loginAsShopOwner = () => {
    const shopUser = {
      id: 'usr_shop_88',
      name: 'Apex Digital Prints',
      email: 'shop@apexprints.com',
      role: 'shop_owner',
      shopName: 'Apex Prints & Studio',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    };
    setUser(shopUser);
    setToken('mock-jwt-shop-token');
    return shopUser;
  };

  const updateUser = (updatedFields) => {
    const updated = { ...user, ...updatedFields };
    setUser(updated);
    localStorage.setItem('jk_poster_user', JSON.stringify(updated));
    return updated;
  };

  const updatePassword = (newPassword) => {
    localStorage.setItem('jk_poster_admin_password', newPassword);
    return true;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loginAsAdmin, loginAsShopOwner, updateUser, updatePassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
