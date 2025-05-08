'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/lib/auth-context';

export default function TelegramAuth() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const { login } = useAuth();
  const { toast } = useToast();

  const handleAuth = async () => {
    try {
      await login(phoneNumber);
      toast({
        title: "Authentication Successful",
        description: "You have been successfully logged in.",
      });
    } catch (error) {
      console.error('Authentication failed:', error);
      toast({
        variant: "destructive",
        title: "Authentication Failed",
        description: error instanceof Error ? error.message : 'Failed to authenticate with Telegram',
      });
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <Input
        type="tel"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        placeholder="Enter your phone number"
        className="p-2"
      />
      <Button
        onClick={handleAuth}
        disabled={!phoneNumber}
        className="w-full"
      >
        Authenticate with Telegram
      </Button>
    </div>
  );
} 