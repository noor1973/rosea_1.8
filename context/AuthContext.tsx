
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { storage } from '../services/storage';

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  resetPassword: (email: string) => Promise<boolean>;
  isAuthenticated: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => 
    storage.get('rosea_current_user', null)
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (currentUser) {
      storage.set('rosea_current_user', currentUser);
    } else {
      storage.remove('rosea_current_user');
    }
  }, [currentUser]);

  const login = async (email: string, password: string): Promise<boolean> => {
    setError(null);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const users: User[] = storage.get('rosea_users', []);
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);

    if (user) {
      // Don't store password in current user state for safety
      const { password, ...safeUser } = user; 
      setCurrentUser(safeUser as User);
      return true;
    } else {
      setError('البريد الإلكتروني أو كلمة المرور غير صحيحة');
      return false;
    }
  };

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    setError(null);
    await new Promise(resolve => setTimeout(resolve, 800));

    const users: User[] = storage.get('rosea_users', []);
    
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      setError('البريد الإلكتروني مستخدم بالفعل');
      return false;
    }

    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      email,
      password, // In real app, hash this!
      createdAt: new Date().toISOString()
    };

    const updatedUsers = [...users, newUser];
    storage.set('rosea_users', updatedUsers);
    
    // Auto login after signup
    const { password: _, ...safeUser } = newUser;
    setCurrentUser(safeUser as User);
    
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const resetPassword = async (email: string): Promise<boolean> => {
    setError(null);
    await new Promise(resolve => setTimeout(resolve, 800));
    // Mock logic - always succeed if email format is valid
    return true;
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      login,
      signup,
      logout,
      resetPassword,
      isAuthenticated: !!currentUser,
      error
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
