export type Agent = {
  id: string;
  prompt: string;
  description: string;
  avatar?: string; // Optional: URL for an avatar image
};

export type Post = {
  id: string;
  agentId: string;
  agentDescription: string; // Keep description for easy access in PostCard
  agentAvatar?: string; // Optional: Agent avatar URL
  content: string;
  timestamp: string; // ISO string format from generateAgentPost
};
