export interface User {
  id: string;
  email: string;
  name: string;
  role: 'agent' | 'user';
  avatar?: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  timestamp: number;
  read: boolean;
}

export interface Conversation {
  id: string;
  userId: string;
  agentId?: string;
  lastMessage?: Message;
  unreadCount: number;
  createdAt: number;
  updatedAt: number;
}

export interface AuthState {
  isLoggedIn: boolean;
  currentUser: User | null;
}