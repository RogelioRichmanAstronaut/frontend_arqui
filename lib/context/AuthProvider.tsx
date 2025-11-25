// File: lib/context/AuthProvider.tsx
"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';

type AuthContextValue = { token?: string | null; setToken: (t: string | null) => void };
const AuthContext = createContext<AuthContextValue>({ token: null, setToken: (_t: string | null) => {} });

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  
  // Load token from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedToken = localStorage.getItem('auth_token');
      if (savedToken) {
        setToken(savedToken);
      }
    }
  }, []);
  
  // Save token to localStorage whenever it changes
  const setTokenWrapper = (t: string | null) => {
    setToken(t);
    if (typeof window !== 'undefined') {
      if (t) {
        localStorage.setItem('auth_token', t);
      } else {
        localStorage.removeItem('auth_token');
      }
    }
  };
  
  return <AuthContext.Provider value={{ token, setToken: setTokenWrapper }}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  return useContext(AuthContext);
}

export default AuthProvider;
