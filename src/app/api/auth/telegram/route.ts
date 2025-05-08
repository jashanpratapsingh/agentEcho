import { NextResponse } from 'next/server';
import { TelegramService } from '@/lib/server/telegram-service';
import { SolanaWalletService } from '@/lib/solana-wallet';
import { StorageService } from '@/lib/storage-service';
import type { AuthenticatedUser } from '@/lib/types';

const storage = new StorageService();

// Initialize the Telegram service
TelegramService.initialize(process.env.TELEGRAM_BOT_TOKEN!);

export async function POST(req: Request) {
  try {
    const { phoneNumber } = await req.json();

    // Get session from Telegram service
    const session = await TelegramService.sendAuthCode(phoneNumber);

    // Create Solana wallet
    const solanaWallet = new SolanaWalletService();
    const walletData = await solanaWallet.createWallet();

    // Create user data
    const userData: AuthenticatedUser = {
      telegram: {
        id: Date.now(), // This should come from actual Telegram verification
        phone_number: phoneNumber,
        // Add other Telegram user fields when implementing actual Telegram auth
      },
      wallet: {
        publicKey: walletData.publicKey,
        privateKey: walletData.privateKey,
        createdAt: new Date().toISOString(),
      },
      sessionToken: session,
    };

    // Save user data
    await storage.saveUser(userData);

    // Return response without sensitive data
    return NextResponse.json({
      success: true,
      session,
      wallet: {
        publicKey: walletData.publicKey
      }
    });
  } catch (error) {
    console.error('Authentication error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
} 