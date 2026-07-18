import React, { createContext, useContext, useState, useEffect } from 'react';
import { login, signup } from '../api';

interface AuthContextType {
  token: string | null;
  isAuthenticated: boolean;
  user: any;
  loginUser: (data: URLSearchParams) => Promise<void>;
  signupUser: (data: any) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      // Decode JWT payload to get email
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser({ email: payload.sub });
      } catch (e) {
        console.error("Failed to decode token", e);
      }
    } else {
      localStorage.removeItem('token');
      setUser(null);
    }
  }, [token]);

  const loginUser = async (data: URLSearchParams) => {
    const res = await login(data);
    setToken(res.access_token);
  };

  const signupUser = async (data: any) => {
    const res = await signup(data);
    setToken(res.access_token);
  };

  const logout = () => {
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, isAuthenticated: !!token, user, loginUser, signupUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
