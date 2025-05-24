import { Conversation, Message, User } from '../types';

// Keys for localStorage
const USERS_KEY = 'intercom_users';
const CONVERSATIONS_KEY = 'intercom_conversations';
const MESSAGES_KEY = 'intercom_messages';
const AUTH_KEY = 'intercom_auth';

// Initial hardcoded users
const initialUsers: User[] = [
  {
    id: '1',
    email: 'agent@example.com',
    name: 'Support Agent',
    role: 'agent',
    avatar: '',
  },
  {
    id: '2',
    email: 'guest@example.com',
    name: 'Guest User',
    role: 'user',
    avatar: '',
  },
];

// Initial sample conversation
const initialConversations: Conversation[] = [
  {
    id: '1',
    userId: '2',
    agentId: '1',
    unreadCount: 0,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
];

// Initial sample messages
const initialMessages: Message[] = [];

// Initialize localStorage with data if it doesn't exist
export const initializeStorage = () => {
  if (!localStorage.getItem(USERS_KEY)) {
    localStorage.setItem(USERS_KEY, JSON.stringify(initialUsers));
  }
  
  if (!localStorage.getItem(CONVERSATIONS_KEY)) {
    localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(initialConversations));
  }
  
  if (!localStorage.getItem(MESSAGES_KEY)) {
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(initialMessages));
  }
};

// User functions
export const getUsers = (): User[] => {
  const users = localStorage.getItem(USERS_KEY);
  return users ? JSON.parse(users) : [];
};

export const getUserById = (id: string): User | undefined => {
  const users = getUsers();
  return users.find(user => user.id === id);
};

// Conversation functions
export const getConversations = (): Conversation[] => {
  const conversations = localStorage.getItem(CONVERSATIONS_KEY);
  return conversations ? JSON.parse(conversations) : [];
};

export const getConversationById = (id: string): Conversation | undefined => {
  const conversations = getConversations();
  return conversations.find(conversation => conversation.id === id);
};

export const saveConversation = (conversation: Conversation): void => {
  const conversations = getConversations();
  const index = conversations.findIndex(c => c.id === conversation.id);
  
  if (index !== -1) {
    conversations[index] = conversation;
  } else {
    conversations.push(conversation);
  }
  
  localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(conversations));
};

// Message functions
export const getMessages = (): Message[] => {
  const messages = localStorage.getItem(MESSAGES_KEY);
  return messages ? JSON.parse(messages) : [];
};

export const getMessagesByConversationId = (conversationId: string): Message[] => {
  const messages = getMessages();
  return messages
    .filter(message => message.conversationId === conversationId)
    .sort((a, b) => a.timestamp - b.timestamp);
};

export const saveMessage = (message: Message): void => {
  const messages = getMessages();
  const index = messages.findIndex(m => m.id === message.id);
  
  if (index !== -1) {
    messages[index] = message;
  } else {
    messages.push(message);
  }
  
  localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
  
  // Update last message in conversation
  const conversation = getConversationById(message.conversationId);
  if (conversation) {
    conversation.lastMessage = message;
    conversation.updatedAt = message.timestamp;
    
    if (message.read === false) {
      conversation.unreadCount += 1;
    }
    
    saveConversation(conversation);
  }
};

// Auth functions
export const saveAuth = (userId: string): void => {
  const user = getUserById(userId);
  if (user) {
    localStorage.setItem(AUTH_KEY, JSON.stringify({ userId, role: user.role }));
  }
};

export const getAuth = (): { userId: string; role: string } | null => {
  const auth = localStorage.getItem(AUTH_KEY);
  return auth ? JSON.parse(auth) : null;
};

export const clearAuth = (): void => {
  localStorage.removeItem(AUTH_KEY);
};

// Helper to generate IDs
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15);
};