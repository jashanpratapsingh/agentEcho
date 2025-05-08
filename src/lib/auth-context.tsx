'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import type { AuthenticatedUser } from './types';
import { TelegramAuthService } from './telegram-auth';

interface AuthContextType {
  user: AuthenticatedUser | null;
  isLoading: boolean;
  login: (phoneNumber: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthenticatedUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authService, setAuthService] = useState<TelegramAuthService | null>(null);

  useEffect(() => {
    // Initialize auth service
    if (!authService && process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN) {
      setAuthService(new TelegramAuthService(process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN));
    }

    // Check for existing session
    const checkSession = async () => {
      try {
        const session = localStorage.getItem('user_session');
        if (session) {
          const userData = JSON.parse(session);
          setUser(userData);
        }
      } catch (error) {
        console.error('Session restoration failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    // Cleanup function
    return () => {
      if (authService) {
        authService.cleanup().catch(console.error);
      }
    };
  }, [authService]);

  const login = async (phoneNumber: string) => {
    if (!authService) {
      throw new Error('Authentication service not initialized');
    }

    try {
      setIsLoading(true);
      const response = await fetch('/api/auth/telegram', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber }),
      });

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Authentication failed');
      }

      const userData: AuthenticatedUser = {
        telegram: {
          id: Date.now(), // This should come from Telegram in production
          phone_number: phoneNumber,
        },
        wallet: {
          publicKey: data.wallet.publicKey,
          privateKey: data.wallet.privateKey,
          createdAt: new Date().toISOString(),
        },
        sessionToken: data.session,
      };

      setUser(userData);
      localStorage.setItem('user_session', JSON.stringify(userData));
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      if (authService) {
        await authService.cleanup();
      }
      setUser(null);
      localStorage.removeItem('user_session');
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
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