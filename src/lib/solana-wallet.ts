import { Keypair, Connection, PublicKey } from '@solana/web3.js';
import * as fs from 'fs';
import * as path from 'path';

export class SolanaWalletService {
  private connection: Connection;

  constructor(endpoint: string = 'https://api.mainnet-beta.solana.com') {
    this.connection = new Connection(endpoint);
  }

  async createWallet(): Promise<{ publicKey: string; privateKey: string }> {
    const keypair = Keypair.generate();
    
    const walletData = {
      publicKey: keypair.publicKey.toString(),
      privateKey: Buffer.from(keypair.secretKey).toString('hex'),
      createdAt: new Date().toISOString()
    };

    return walletData;
  }

  async saveWalletToFile(walletData: any, userId: string): Promise<void> {
    const walletDir = path.join(process.cwd(), 'wallets');
    
    if (!fs.existsSync(walletDir)) {
      fs.mkdirSync(walletDir, { recursive: true });
    }

    const filePath = path.join(walletDir, `${userId}.json`);
    fs.writeFileSync(filePath, JSON.stringify(walletData, null, 2));
  }
} 