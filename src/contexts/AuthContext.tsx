import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  isPaidUser?: boolean;
  walletBalance?: number;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isPaidUser: boolean;
  upgradeToPaid: () => void;
  addToWallet: (amount: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Load user from localStorage on mount
    const storedUser = localStorage.getItem('cumpani_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('cumpani_user');
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock authentication - in production, this would call an API
    const storedUsers = localStorage.getItem('cumpani_users');
    const users = storedUsers ? JSON.parse(storedUsers) : [];
    
    const foundUser = users.find((u: { email: string; password: string; id: string; name: string }) => u.email === email && u.password === password);
    
    if (foundUser) {
      const userData = { id: foundUser.id, email: foundUser.email, name: foundUser.name };
      setUser(userData);
      localStorage.setItem('cumpani_user', JSON.stringify(userData));
      return true;
    }
    
    return false;
  };

  const signup = async (email: string, password: string, name: string): Promise<boolean> => {
    // Mock signup - in production, this would call an API
    const storedUsers = localStorage.getItem('cumpani_users');
    const users = storedUsers ? JSON.parse(storedUsers) : [];
    
    // Check if user already exists
    if (users.find((u: { email: string }) => u.email === email)) {
      return false;
    }
    
    const newUser = {
      id: Date.now().toString(),
      email,
      password, // WARNING: In production, passwords must be hashed on the server side
      name
    };
    
    users.push(newUser);
    localStorage.setItem('cumpani_users', JSON.stringify(users));
    
    const userData = { id: newUser.id, email: newUser.email, name: newUser.name };
    setUser(userData);
    localStorage.setItem('cumpani_user', JSON.stringify(userData));
    
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('cumpani_user');
  };

  const upgradeToPaid = () => {
    if (user) {
      const updatedUser = { ...user, isPaidUser: true, walletBalance: user.walletBalance || 0 };
      setUser(updatedUser);
      localStorage.setItem('cumpani_user', JSON.stringify(updatedUser));
    }
  };

  const addToWallet = (amount: number) => {
    if (user) {
      const updatedUser = { 
        ...user, 
        walletBalance: (user.walletBalance || 0) + amount 
      };
      setUser(updatedUser);
      localStorage.setItem('cumpani_user', JSON.stringify(updatedUser));
    }
  };

  const value = {
    user,
    login,
    signup,
    logout,
    isAuthenticated: !!user,
    isPaidUser: !!user?.isPaidUser,
    upgradeToPaid,
    addToWallet,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
