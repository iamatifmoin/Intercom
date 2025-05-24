import React, { useEffect } from 'react';
import { useChat } from '../../context/ChatContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import ConversationsList from './ConversationsList';
import ConversationView from './ConversationView';
import UserProfile from './UserProfile';
import Header from './Header';

const AgentDashboard: React.FC = () => {
  const { auth } = useAuth();
  const { conversations, activeConversation, setActiveConversation } = useChat();
  const navigate = useNavigate();

  // Redirect if not an agent
  useEffect(() => {
    if (!auth.isLoggedIn) {
      navigate('/login');
    } else if (auth.currentUser?.role !== 'agent') {
      navigate('/');
    }
  }, [auth, navigate]);

  // Set first conversation as active if none is selected
  useEffect(() => {
    if (conversations.length > 0 && !activeConversation) {
      setActiveConversation(conversations[0]);
    }
  }, [conversations, activeConversation, setActiveConversation]);

  if (!auth.isLoggedIn || auth.currentUser?.role !== 'agent') {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="flex flex-col h-screen bg-white">
      <Header />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Left Column - Conversations List */}
        <div className="w-1/4 border-r border-gray-200 bg-gray-50 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-800">Inbox</h2>
            <p className="text-sm text-gray-500">
              {conversations.length} conversation{conversations.length !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="flex-1 overflow-y-auto">
            <ConversationsList 
              conversations={conversations}
              activeConversation={activeConversation}
              onSelectConversation={setActiveConversation}
            />
          </div>
        </div>
        
        {/* Middle Column - Conversation View */}
        <div className="flex-1 flex flex-col bg-white">
          {activeConversation ? (
            <ConversationView conversation={activeConversation} />
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <p>Select a conversation to start chatting</p>
            </div>
          )}
        </div>
        
        {/* Right Column - User Profile */}
        <div className="w-1/4 border-l border-gray-200 bg-gray-50">
          {activeConversation && (
            <UserProfile conversationId={activeConversation.id} />
          )}
        </div>
      </div>
    </div>
  );
};

export default AgentDashboard;