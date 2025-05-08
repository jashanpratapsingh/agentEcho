import { AuthenticatedUser } from './types';

export class StorageService {
  async saveUser(user: AuthenticatedUser): Promise<void> {
    const response = await fetch('/api/storage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to save user data');
    }
  }

  async getUser(telegramId: number): Promise<AuthenticatedUser | null> {
    try {
      const response = await fetch(`/api/storage?id=${telegramId}`);
      
      if (!response.ok) {
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to get user:', error);
      return null;
    }
  }

  async getAllUsers(): Promise<AuthenticatedUser[]> {
    try {
      const response = await fetch('/api/storage');
      
      if (!response.ok) {
        return [];
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to get users:', error);
      return [];
    }
  }

  async deleteUser(telegramId: number): Promise<void> {
    try {
      const response = await fetch(`/api/storage?id=${telegramId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete user');
      }
    } catch (error) {
      console.error('Failed to delete user:', error);
      throw error;
    }
  }
} 