'use client';

import { useAuth } from '@/lib/auth-context';
import TelegramAuth from '@/components/TelegramAuth';
import { Loader2 } from 'lucide-react';

export function AuthGate({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">
            {user ? 'Logging out...' : 'Loading...'}
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold mb-8">Welcome to Agent Echo</h1>
        <div className="w-full max-w-md">
          <TelegramAuth />
        </div>
      </div>
    );
  }

  return <>{children}</>;
} 