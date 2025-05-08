import TelegramBot from 'node-telegram-bot-api';

// Global bot instance
let botInstance: TelegramBot | null = null;

export class TelegramService {
  private static bot: TelegramBot;

  static initialize(token: string) {
    if (!botInstance) {
      botInstance = new TelegramBot(token, {
        polling: false // We'll use webhooks in production
      });
    }
    return botInstance;
  }

  static async sendAuthCode(phoneNumber: string): Promise<string> {
    if (!botInstance) {
      throw new Error('Telegram bot not initialized');
    }

    try {
      // In a real implementation, you would:
      // 1. Send a verification code via Telegram
      // 2. Store the code temporarily
      // 3. Return a session ID
      
      // For now, we'll just generate a session ID
      return `session_${Date.now()}_${phoneNumber.replace(/[^0-9]/g, '')}`;
    } catch (error) {
      console.error('Failed to send auth code:', error);
      throw new Error('Failed to send authentication code');
    }
  }

  static async cleanup() {
    if (botInstance) {
      await botInstance.close();
      botInstance = null;
    }
  }
} 