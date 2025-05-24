import React from 'react';
import { Conversation } from '../../types';
import { useChat } from '../../context/ChatContext';

interface ConversationsListProps {
  conversations: Conversation[];
  activeConversation: Conversation | null;
  onSelectConversation: (conversation: Conversation) => void;
}

const ConversationsList: React.FC<ConversationsListProps> = ({
  conversations,
  activeConversation,
  onSelectConversation,
}) => {
  const { getUserInfo, messages } = useChat();

  // Sort conversations by update time (newest first)
  const sortedConversations = [...conversations].sort(
    (a, b) => b.updatedAt - a.updatedAt
  );

  // Get last message preview
  const getLastMessagePreview = (conversationId: string) => {
    const conversationMessages = messages[conversationId] || [];
    if (conversationMessages.length === 0) return 'No messages yet';
    
    const lastMessage = conversationMessages[conversationMessages.length - 1];
    return lastMessage.content.length > 30
      ? `${lastMessage.content.substring(0, 30)}...`
      : lastMessage.content;
  };

  // Format time
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    
    // If today, show time
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    }
    
    // If this year, show month and day
    if (date.getFullYear() === now.getFullYear()) {
      return date.toLocaleDateString([], { 
        month: 'short', 
        day: 'numeric' 
      });
    }
    
    // Otherwise show date
    return date.toLocaleDateString([], { 
      year: 'numeric',
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="divide-y divide-gray-200">
      {sortedConversations.length === 0 ? (
        <div className="p-4 text-center text-gray-500">
          No conversations yet
        </div>
      ) : (
        sortedConversations.map((conversation) => {
          const user = getUserInfo(conversation.userId);
          
          return (
            <div
              key={conversation.id}
              onClick={() => onSelectConversation(conversation)}
              className={`p-4 cursor-pointer hover:bg-gray-100 transition-colors ${
                activeConversation?.id === conversation.id ? 'bg-gray-100' : ''
              }`}
            >
              <div className="flex items-start">
                <div className="relative flex-shrink-0">
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-10 h-10 rounded-full"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                      <span className="text-gray-600 font-medium">
                        {user?.name?.charAt(0) || '?'}
                      </span>
                    </div>
                  )}
                  
                  {conversation.unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                      {conversation.unreadCount}
                    </span>
                  )}
                </div>
                
                <div className="ml-3 flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {user?.name || 'Unknown User'}
                    </h3>
                    <span className="text-xs text-gray-500">
                      {formatTime(conversation.updatedAt)}
                    </span>
                  </div>
                  
                  <p className={`text-sm ${
                    conversation.unreadCount > 0 
                      ? 'text-gray-900 font-medium' 
                      : 'text-gray-500'
                  } truncate`}>
                    {getLastMessagePreview(conversation.id)}
                  </p>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default ConversationsList;