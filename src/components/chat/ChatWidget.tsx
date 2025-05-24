import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useChat } from '../../context/ChatContext';
import MessageBubble from './MessageBubble';

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const { auth } = useAuth();
  const { 
    conversations, 
    messages, 
    sendMessage, 
    createConversation,
    getUserInfo,
    isTyping
  } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Find or create a conversation for the current user
  const getUserConversation = () => {
    if (!auth.currentUser) return null;
    
    let conversation = conversations.find(c => c.userId === auth.currentUser?.id);
    
    if (!conversation && auth.currentUser) {
      conversation = createConversation(auth.currentUser.id);
    }
    
    return conversation;
  };
  
  const conversation = getUserConversation();
  const conversationMessages = conversation ? messages[conversation.id] || [] : [];
  const agent = conversation?.agentId ? getUserInfo(conversation.agentId) : undefined;
  
  // Scroll to bottom when messages change
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [conversationMessages, isOpen, isTyping]);
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !conversation) return;
    
    sendMessage(message, conversation.id);
    setMessage('');
  };
  
  // Toggle chat widget
  const toggleChat = () => {
    setIsOpen(prev => !prev);
  };
  
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end">
      {/* Chat popup */}
      {isOpen && (
        <div className="mb-4 w-[350px] h-[500px] bg-white rounded-lg shadow-xl flex flex-col overflow-hidden animate-fade-in">
          {/* Header */}
          <div className="p-4 bg-[#006eff] text-white flex items-center justify-between">
            <div className="flex items-center">
              {agent?.avatar && (
                <img 
                  src={agent.avatar} 
                  alt={agent.name} 
                  className="w-8 h-8 rounded-full mr-2"
                />
              )}
              <h3 className="font-medium">Chat with {agent?.name || 'Support'}</h3>
            </div>
            <button 
              onClick={toggleChat}
              className="text-white hover:bg-[#0055cc] rounded-full p-1"
            >
              <X size={18} />
            </button>
          </div>
          
          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
            {conversationMessages.length === 0 ? (
              <div className="text-center text-gray-500 mt-4">
                <p>Start a conversation with us!</p>
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
                <span className="ml-2">Agent is typing...</span>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
          
          {/* Input */}
          <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-200 bg-white">
            <div className="flex items-center">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-[#006eff]"
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
      )}
      
      {/* Chat button */}
      <button
        onClick={toggleChat}
        className="rounded-full bg-[#006eff] text-white w-14 h-14 flex items-center justify-center shadow-lg hover:bg-[#0055cc] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#006eff]"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>
    </div>
  );
};

export default ChatWidget;