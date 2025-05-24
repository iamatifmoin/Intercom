import React from 'react';
import { User, Clock, MessageSquare, Calendar } from 'lucide-react';
import { useChat } from '../../context/ChatContext';

interface UserProfileProps {
  conversationId: string;
}

const UserProfile: React.FC<UserProfileProps> = ({ conversationId }) => {
  const { conversations, getUserInfo, messages } = useChat();
  
  const conversation = conversations.find(c => c.id === conversationId);
  if (!conversation) return null;
  
  const user = getUserInfo(conversation.userId);
  const conversationMessages = messages[conversationId] || [];
  
  // Format date
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <div className="h-full p-6 overflow-y-auto">
      <div className="text-center mb-6">
        <div className="mx-auto">
          {user?.avatar ? (
            <img 
              src={user.avatar}
              alt={user?.name || 'User'} 
              className="w-20 h-20 rounded-full mx-auto"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center mx-auto">
              <User size={32} className="text-gray-600" />
            </div>
          )}
        </div>
        <h2 className="mt-4 text-xl font-medium text-gray-900">
          {user?.name || 'Unknown User'}
        </h2>
        <p className="text-sm text-gray-500">
          {user?.email || 'No email available'}
        </p>
      </div>
      
      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Conversation Info</h3>
        
        <div className="space-y-4">
          <div className="flex items-center">
            <Calendar size={18} className="text-gray-400 mr-2" />
            <div>
              <p className="text-sm font-medium text-gray-500">Started</p>
              <p className="text-sm text-gray-900">{formatDate(conversation.createdAt)}</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <Clock size={18} className="text-gray-400 mr-2" />
            <div>
              <p className="text-sm font-medium text-gray-500">Last active</p>
              <p className="text-sm text-gray-900">{formatDate(conversation.updatedAt)}</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <MessageSquare size={18} className="text-gray-400 mr-2" />
            <div>
              <p className="text-sm font-medium text-gray-500">Total messages</p>
              <p className="text-sm text-gray-900">{conversationMessages.length}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="border-t border-gray-200 pt-6 mt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">User Tags</h3>
        
        <div className="flex flex-wrap gap-2">
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
            New Customer
          </span>
          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
            Premium Plan
          </span>
          <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
            Mobile User
          </span>
        </div>
      </div>
      
      <div className="border-t border-gray-200 pt-6 mt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Notes</h3>
        
        <div className="bg-white border border-gray-200 rounded-md p-3">
          <p className="text-sm text-gray-500 italic">
            No notes added yet. Notes will appear here.
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;