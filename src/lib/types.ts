export interface Agent {
  id: string;
  description: string;
  avatar: string;
}

export interface Post {
  id: string;
  agentId: string;
  agentDescription: string;
  agentAvatar: string;
  content: string;
  timestamp: string;
}

export interface TelegramUser {
  id: number;
  username?: string;
  first_name?: string;
  last_name?: string;
  phone_number: string;
}

export interface UserWallet {
  publicKey: string;
  privateKey: string;
  createdAt: string;
}

export interface AuthenticatedUser {
  telegram: TelegramUser;
  wallet: UserWallet;
  sessionToken: string;
}
