import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { apiClient, wsClient, isAuthenticated } from '../utils/api';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthContextType extends AuthState {
  login: (username: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

interface RegisterData {
  email: string;
  username: string;
  full_name: string;
  password: string;
}

type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'LOGOUT' };

const initialState: AuthState = {
  user: null,
  isLoading: true,
  isAuthenticated: false,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
        isLoading: false,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
      };
    default:
      return state;
  }
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const refreshUser = async () => {
    try {
      console.log('refreshUser: Checking if authenticated...', isAuthenticated());
      if (isAuthenticated()) {
        console.log('refreshUser: User is authenticated, fetching user data...');
        const userData = await apiClient.getCurrentUser() as any;
        console.log('refreshUser: User data received:', userData);
        // Transform backend user data to match frontend User type
        const user: User = {
          id: userData.id?.toString() || '',
          name: userData.full_name || userData.username || 'Unknown User',
          avatar: userData.avatar_url || `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face`,
          isOnline: true // Default to online for now
        };
        console.log('refreshUser: Setting user:', user);
        dispatch({ type: 'SET_USER', payload: user });
      } else {
        console.log('refreshUser: User is not authenticated');
        dispatch({ type: 'SET_USER', payload: null });
      }
    } catch (error) {
      console.error('Failed to fetch user:', error);
      dispatch({ type: 'SET_USER', payload: null });
    }
  };

  const login = async (username: string, password: string) => {
    console.log('login: Starting login process...');
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      console.log('login: Calling apiClient.login...');
      await apiClient.login(username, password);
      console.log('login: Login successful, refreshing user...');
      await refreshUser();
      console.log('login: Login process completed');
    } catch (error) {
      console.error('login: Login failed:', error);
      dispatch({ type: 'SET_LOADING', payload: false });
      throw error;
    }
  };

  const register = async (userData: RegisterData) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      await apiClient.register(userData);
      // After registration, user needs to login
      dispatch({ type: 'SET_LOADING', payload: false });
    } catch (error) {
      dispatch({ type: 'SET_LOADING', payload: false });
      throw error;
    }
  };

  const logout = async () => {
    try {
      await apiClient.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      dispatch({ type: 'LOGOUT' });
      wsClient.disconnect();
    }
  };

  // Initialize user on mount
  useEffect(() => {
    refreshUser();
  }, []);

  // Connect to WebSocket when user is authenticated
  useEffect(() => {
    if (state.isAuthenticated && state.user) {
      wsClient.connect();
    }
  }, [state.isAuthenticated, state.user]);

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
