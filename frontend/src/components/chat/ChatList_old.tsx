import React, { useState, useEffect } from 'react';
import { Search, Video, Edit } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import type { User } from '../../types';

interface Chat {
  id: string;
  user: User;
  lastMessage: string;
  timestamp: Date;
  unreadCount: number;
  isOnline: boolean;
}

interface ChatListProps {
  onChatSelect?: (user: User) => void;
}

const ChatList: React.FC<ChatListProps> = ({ onChatSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [chats, setChats] = useState<Chat[]>([]);
  const { user: _currentUser } = useAuth();

  // Mock chat data
  useEffect(() => {
    const mockChats: Chat[] = [
      {
        id: '1',
        user: {
          id: '2',
          name: 'Sarah Wilson',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b87c?w=40&h=40&fit=crop&crop=face',
          isOnline: true
        },
        lastMessage: 'Hey! How are you doing today?',
        timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
        unreadCount: 2,
        isOnline: true
      },
      {
        id: '2',
        user: {
          id: '3',
          name: 'Mike Johnson',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
          isOnline: false
        },
        lastMessage: 'Thanks for sharing that article!',
        timestamp: new Date(Date.now() - 3600000), // 1 hour ago
        unreadCount: 0,
        isOnline: false
      },
      {
        id: '3',
        user: {
          id: '4',
          name: 'Emma Davis',
          avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face',
          isOnline: true
        },
        lastMessage: 'See you at the meeting tomorrow',
        timestamp: new Date(Date.now() - 7200000), // 2 hours ago
        unreadCount: 1,
        isOnline: true
      },
      {
        id: '4',
        user: {
          id: '5',
          name: 'Alex Chen',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
          isOnline: false
        },
        lastMessage: 'Great job on the presentation!',
        timestamp: new Date(Date.now() - 14400000), // 4 hours ago
        unreadCount: 0,
        isOnline: false
      }
    ];
    setChats(mockChats);
  }, []);

  const filteredChats = chats.filter(chat =>
    chat.user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'now';
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    return `${diffDays}d`;
  };

  const handleChatClick = (chat: Chat) => {
    if (onChatSelect) {
      onChatSelect(chat.user);
    }
  };

  return (
    <div className="bg-white h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xl font-semibold text-gray-900">Chats</h3>
          <div className="flex items-center space-x-2">
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <Video className="w-4 h-4 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <Edit className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search Messenger"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Chats List */}
      <div className="flex-1 overflow-y-auto">
        {filteredChats.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            {searchQuery ? 'No chats found' : 'No chats yet'}
          </div>
        ) : (
          filteredChats.map((chat) => (
            <button
              key={chat.id}
              onClick={() => handleChatClick(chat)}
              className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 transition-colors text-left border-b border-gray-100"
            >
              <div className="relative">
                <img
                  src={chat.user.avatar}
                  alt={chat.user.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                {chat.isOnline && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div className="font-medium text-gray-900 truncate">
                    {chat.user.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatTime(chat.timestamp)}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600 truncate">
                    {chat.lastMessage}
                  </div>
                  {chat.unreadCount > 0 && (
                    <div className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center ml-2">
                      {chat.unreadCount}
                    </div>
                  )}
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export default ChatList;