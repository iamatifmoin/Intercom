import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthState, User } from '../types';
import { clearAuth, getAuth, getUserById, saveAuth } from '../utils/storage';

interface AuthContextType {
  auth: AuthState;
  login: (email: string, password: string) => boolean;
  loginAsGuest: () => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [auth, setAuth] = useState<AuthState>({
    isLoggedIn: false,
    currentUser: null,
  });

  useEffect(() => {
    // Check if user is already logged in
    const savedAuth = getAuth();
    if (savedAuth) {
      const user = getUserById(savedAuth.userId);
      if (user) {
        setAuth({
          isLoggedIn: true,
          currentUser: user,
        });
      }
    } else {
      // Auto-login as guest if no auth exists
      loginAsGuest();
    }
  }, []);

  const login = (email: string, password: string): boolean => {
    if (email === 'agent@example.com' && password === 'agent123') {
      const user = getUserById('1'); // Agent user ID
      if (user) {
        setAuth({
          isLoggedIn: true,
          currentUser: user,
        });
        saveAuth(user.id);
        return true;
      }
    }
    return false;
  };

  const loginAsGuest = (): boolean => {
    const user = getUserById('2'); // Guest user ID
    if (user) {
      setAuth({
        isLoggedIn: true,
        currentUser: user,
      });
      saveAuth(user.id);
      return true;
    }
    return false;
  };

  const logout = (): void => {
    setAuth({
      isLoggedIn: false,
      currentUser: null,
    });
    clearAuth();
  };

  return (
    <AuthContext.Provider value={{ auth, login, loginAsGuest, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};