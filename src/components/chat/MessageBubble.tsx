import React from 'react';
import { Message, User } from '../../types';

interface MessageBubbleProps {
  message: Message;
  isCurrentUser: boolean;
  user?: User;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ 
  message, 
  isCurrentUser,
  user
}) => {
  // Format time
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-4`}>
      {!isCurrentUser && user?.avatar && (
        <div className="flex-shrink-0 mr-2">
          <img 
            src={user.avatar} 
            alt={user.name} 
            className="w-8 h-8 rounded-full"
          />
        </div>
      )}
      <div className="flex flex-col">
        <div
          className={`px-4 py-2 rounded-xl max-w-xs ${
            isCurrentUser
              ? 'bg-[#006eff] text-white ml-auto'
              : 'bg-gray-100 text-black'
          }`}
        >
          <p className="text-sm">{message.content}</p>
        </div>
        <span className={`text-xs text-gray-500 mt-1 ${isCurrentUser ? 'text-right' : 'text-left'}`}>
          {formatTime(message.timestamp)}
        </span>
      </div>
      {isCurrentUser && user?.avatar && (
        <div className="flex-shrink-0 ml-2">
          <img 
            src={user.avatar} 
            alt={user.name} 
            className="w-8 h-8 rounded-full"
          />
        </div>
      )}
    </div>
  );
};

export default MessageBubble;