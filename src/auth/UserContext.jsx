import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext(null);

const API_URL = 'http://localhost:5000/api/auth';

export const UserProvider = ({ children }) => {
  // Restore session from localStorage on load
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return !!localStorage.getItem('scaler_user');
  });
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('scaler_user');
    return saved ? JSON.parse(saved) : null;
  });

  const userSignup = async (email, password) => {
    const res = await fetch(`${API_URL}/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    setIsLoggedIn(true);
    setUser(data.user);
    localStorage.setItem('scaler_user', JSON.stringify(data.user));
    localStorage.setItem('scaler_token', data.token);
    return data;
  };

  const userLogin = async (email, password) => {
    const res = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    setIsLoggedIn(true);
    setUser(data.user);
    localStorage.setItem('scaler_user', JSON.stringify(data.user));
    localStorage.setItem('scaler_token', data.token);
    return data;
  };

  const userLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem('scaler_user');
    localStorage.removeItem('scaler_token');
  };

  return (
    <UserContext.Provider value={{ isLoggedIn, user, userSignup, userLogin, userLogout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
