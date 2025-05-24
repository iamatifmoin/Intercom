import React, { useState, useEffect, useRef } from 'react';
import { Send } from 'lucide-react';
import { Conversation } from '../../types';
import { useChat } from '../../context/ChatContext';
import MessageBubble from '../chat/MessageBubble';
import { useAuth } from '../../context/AuthContext';

interface ConversationViewProps {
  conversation: Conversation;
}

const ConversationView: React.FC<ConversationViewProps> = ({ conversation }) => {
  const [message, setMessage] = useState('');
  const { messages, sendMessage, getUserInfo, isTyping } = useChat();
  const { auth } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const conversationMessages = messages[conversation.id] || [];
  const user = getUserInfo(conversation.userId);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversationMessages, isTyping]);
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    sendMessage(message, conversation.id);
    setMessage('');
  };
  
  return (
    <div className="flex flex-col h-full">
      {/* Conversation header */}
      <div className="px-6 py-4 border-b border-gray-200 flex items-center">
        <div className="flex-shrink-0">
          {user?.avatar ? (
            <img 
              src={user.avatar}
              alt={user?.name || 'User'} 
              className="w-10 h-10 rounded-full"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
              <span className="text-gray-600 font-medium">
                {user?.name?.charAt(0) || '?'}
              </span>
            </div>
          )}
        </div>
        <div className="ml-3">
          <h2 className="text-lg font-medium text-gray-900">
            {user?.name || 'Unknown User'}
          </h2>
          <p className="text-sm text-gray-500">
            {user?.email || 'No email available'}
          </p>
        </div>
      </div>
      
      {/* Messages */}
      <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
        {conversationMessages.length === 0 ? (
          <div className="text-center text-gray-500 mt-4">
            <p>No messages in this conversation yet</p>
          </div>
        ) : (
          conversationMessages.map(msg => (
            <MessageBubble
              key={msg.id}
              message={msg}
              isCurrentUser={msg.senderId === auth.currentUser?.id}
              user={getUserInfo(msg.senderId)}
            />
          ))
        )}
        
        {isTyping && (
          <div className="flex items-center text-gray-500 text-sm mt-2 ml-2">
            <div className="flex space-x-1 items-center">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
            <span className="ml-2">User is typing...</span>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input */}
      <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 bg-white">
        <div className="flex items-center">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#006eff] focus:border-[#006eff]"
          />
          <button 
            type="submit"
            disabled={!message.trim()}
            className="ml-2 p-2 rounded-full bg-[#006eff] text-white disabled:opacity-50"
          >
            <Send size={18} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ConversationView;