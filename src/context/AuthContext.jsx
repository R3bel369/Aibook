import React, { createContext, useContext, useState, useEffect } from 'react';
import { DEFAULT_USER } from '../data/mockData';
import { supabase, checkSupabaseConnection } from '../lib/supabase';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('app_user_profile');
    return saved ? JSON.parse(saved) : DEFAULT_USER;
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const savedAuth = localStorage.getItem('app_is_authenticated');
    return savedAuth ? JSON.parse(savedAuth) : true; // Default to authenticated for instant demo
  });

  const [supabaseStatus, setSupabaseStatus] = useState({
    isConfigured: true,
    isConnected: true,
    url: 'https://nyiwbgfdfjjdenaigpzz.supabase.co'
  });

  useEffect(() => {
    checkSupabaseConnection().then(status => {
      setSupabaseStatus(status);
    });
  }, []);

  useEffect(() => {
    localStorage.setItem('app_user_profile', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('app_is_authenticated', JSON.stringify(isAuthenticated));
  }, [isAuthenticated]);

  const login = (email, password) => {
    setIsAuthenticated(true);
    setUser(prev => ({ ...prev, email: email || prev.email }));
    return true;
  };

  const loginWithGoogle = () => {
    setIsAuthenticated(true);
    return true;
  };

  const signup = (userData) => {
    const updated = {
      ...user,
      ...userData,
      currencySymbol: userData.currency === 'USD' ? '$' : userData.currency === 'EUR' ? '€' : userData.currency === 'GBP' ? '£' : '₹'
    };
    setUser(updated);
    setIsAuthenticated(true);
    return true;
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  const updateProfile = (updatedFields) => {
    setUser(prev => {
      const next = { ...prev, ...updatedFields };
      if (updatedFields.currency) {
        next.currencySymbol = updatedFields.currency === 'USD' ? '$' : updatedFields.currency === 'EUR' ? '€' : updatedFields.currency === 'GBP' ? '£' : '₹';
      }
      return next;
    });
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      supabase,
      supabaseStatus,
      login,
      loginWithGoogle,
      signup,
      logout,
      updateProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}

