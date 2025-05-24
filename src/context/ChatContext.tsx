import React, { createContext, useContext, useEffect, useState } from 'react';
import { Conversation, Message, User } from '../types';
import { 
  getConversations, 
  getMessagesByConversationId, 
  getUserById, 
  saveMessage, 
  generateId,
  saveConversation
} from '../utils/storage';
import { useAuth } from './AuthContext';

interface ChatContextType {
  conversations: Conversation[];
  messages: Record<string, Message[]>;
  activeConversation: Conversation | null;
  setActiveConversation: (conversation: Conversation | null) => void;
  sendMessage: (content: string, conversationId: string) => void;
  markAsRead: (conversationId: string) => void;
  getUserInfo: (userId: string) => User | undefined;
  createConversation: (userId: string) => Conversation;
  isTyping: boolean;
  setIsTyping: (value: boolean) => void;
}

export const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { auth } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [isTyping, setIsTyping] = useState(false);

  // Load conversations whenever auth changes
  useEffect(() => {
    if (auth.currentUser) {
      loadConversations();
    }
  }, [auth.currentUser]);

  // Poll for new messages every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (auth.currentUser) {
        loadConversations();
        Object.keys(messages).forEach(conversationId => {
          loadMessages(conversationId);
        });
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [auth.currentUser, messages]);

  const loadConversations = () => {
    if (!auth.currentUser) return;

    const allConversations = getConversations();
    let userConversations: Conversation[];

    if (auth.currentUser.role === 'agent') {
      userConversations = allConversations;
    } else {
      userConversations = allConversations.filter(
        (conv) => conv.userId === auth.currentUser?.id
      );
    }

    setConversations(userConversations);

    userConversations.forEach((conv) => {
      loadMessages(conv.id);
    });
  };

  const loadMessages = (conversationId: string) => {
    const conversationMessages = getMessagesByConversationId(conversationId);
    setMessages((prev) => ({
      ...prev,
      [conversationId]: conversationMessages,
    }));
  };

  const sendMessage = (content: string, conversationId: string) => {
    if (!auth.currentUser) return;

    const newMessage: Message = {
      id: generateId(),
      conversationId,
      senderId: auth.currentUser.id,
      content,
      timestamp: Date.now(),
      read: false,
    };

    saveMessage(newMessage);
    loadMessages(conversationId);
    loadConversations();

    if (auth.currentUser.role === 'user') {
      simulateAgentResponse(conversationId);
    }
  };

  const simulateAgentResponse = (conversationId: string) => {
    setIsTyping(true);
    const delay = Math.floor(Math.random() * 2000) + 1000;

    setTimeout(() => {
      setIsTyping(false);
      
      const conversation = getConversations().find(c => c.id === conversationId);
      if (!conversation || !conversation.agentId) return;

      const responses = [
        "I'll look into that for you right away.",
        "Thanks for reaching out. How can I help further?",
        "I understand your concern. Let me check what I can do.",
        "Is there anything else you'd like to know?",
        "That's a great question. Here's what you need to know..."
      ];

      const randomResponse = responses[Math.floor(Math.random() * responses.length)];

      const newMessage: Message = {
        id: generateId(),
        conversationId,
        senderId: conversation.agentId,
        content: randomResponse,
        timestamp: Date.now(),
        read: auth.currentUser?.role === 'agent',
      };

      saveMessage(newMessage);
      loadMessages(conversationId);
      loadConversations();
    }, delay);
  };

  const markAsRead = (conversationId: string) => {
    if (!auth.currentUser) return;

    const conversation = conversations.find((c) => c.id === conversationId);
    if (!conversation) return;

    const updatedMessages = messages[conversationId]?.map((msg) => {
      if (msg.senderId !== auth.currentUser?.id && !msg.read) {
        const updatedMsg = { ...msg, read: true };
        saveMessage(updatedMsg);
        return updatedMsg;
      }
      return msg;
    });

    if (updatedMessages) {
      setMessages((prev) => ({
        ...prev,
        [conversationId]: updatedMessages,
      }));

      const updatedConversation = {
        ...conversation,
        unreadCount: 0,
      };
      saveConversation(updatedConversation);

      setConversations((prev) =>
        prev.map((c) => (c.id === conversationId ? updatedConversation : c))
      );
    }
  };

  const getUserInfo = (userId: string) => {
    return getUserById(userId);
  };

  const createConversation = (userId: string): Conversation => {
    const newConversation: Conversation = {
      id: generateId(),
      userId,
      agentId: '1',
      unreadCount: 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    saveConversation(newConversation);
    loadConversations();
    return newConversation;
  };

  return (
    <ChatContext.Provider
      value={{
        conversations,
        messages,
        activeConversation,
        setActiveConversation,
        sendMessage,
        markAsRead,
        getUserInfo,
        createConversation,
        isTyping,
        setIsTyping,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};