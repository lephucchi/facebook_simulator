import React, { useState, useEffect } from 'react';
import { Search, Edit, MoreHorizontal } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import ChatWindow from './ChatWindow';
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
  const [chats, setChats] = useState<Chat[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeChat, setActiveChat] = useState<User | null>(null);
  const { user: _currentUser } = useAuth();

  // Mock chat data
  useEffect(() => {
    const mockChats: Chat[] = [
      {
        id: '1',
        user: {
          id: '2',
          name: 'Sarah Wilson',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b87c?w=50&h=50&fit=crop&crop=face',
          isOnline: true
        },
        lastMessage: 'Hey! How are you doing today? I was thinking we could catch up over coffee sometime this week.',
        timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
        unreadCount: 2,
        isOnline: true
      },
      {
        id: '2',
        user: {
          id: '3',
          name: 'Mike Johnson',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face',
          isOnline: false
        },
        lastMessage: 'Thanks for sharing that article! It was really insightful and helped me understand the topic better.',
        timestamp: new Date(Date.now() - 3600000), // 1 hour ago
        unreadCount: 0,
        isOnline: false
      },
      {
        id: '3',
        user: {
          id: '4',
          name: 'Emma Davis',
          avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face',
          isOnline: true
        },
        lastMessage: 'See you at the meeting tomorrow! Don\'t forget to bring the presentation slides.',
        timestamp: new Date(Date.now() - 7200000), // 2 hours ago
        unreadCount: 1,
        isOnline: true
      },
      {
        id: '4',
        user: {
          id: '5',
          name: 'James Brown',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face',
          isOnline: false
        },
        lastMessage: 'The project is coming along nicely. I should have the final version ready by Friday.',
        timestamp: new Date(Date.now() - 86400000), // 1 day ago
        unreadCount: 0,
        isOnline: false
      },
      {
        id: '5',
        user: {
          id: '6',
          name: 'Lisa Anderson',
          avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=50&h=50&fit=crop&crop=face',
          isOnline: true
        },
        lastMessage: 'Happy birthday! 🎉 Hope you have a wonderful day filled with joy and laughter.',
        timestamp: new Date(Date.now() - 172800000), // 2 days ago
        unreadCount: 0,
        isOnline: true
      }
    ];
    setChats(mockChats);
  }, []);

  const filteredChats = chats.filter(chat =>
    chat.user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleChatClick = (chat: Chat) => {
    setActiveChat(chat.user);
    if (onChatSelect) {
      onChatSelect(chat.user);
    }
    // Mark as read
    setChats(prev => prev.map(c => 
      c.id === chat.id ? { ...c, unreadCount: 0 } : c
    ));
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'now';
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;
    return date.toLocaleDateString();
  };

  const truncateMessage = (message: string, maxLength: number = 50) => {
    return message.length > maxLength ? message.substring(0, maxLength) + '...' : message;
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Chats</h2>
          <div className="flex items-center space-x-2">
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <MoreHorizontal className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Edit className="w-5 h-5 text-gray-600" />
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

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {filteredChats.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            {searchQuery ? 'No chats found' : 'No conversations yet'}
          </div>
        ) : (
          <div className="space-y-1">
            {filteredChats.map((chat) => (
              <button
                key={chat.id}
                onClick={() => handleChatClick(chat)}
                className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 transition-colors text-left"
              >
                <div className="relative flex-shrink-0">
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
                  <div className="flex items-center justify-between mb-1">
                    <div className={`font-medium text-sm truncate ${chat.unreadCount > 0 ? 'text-gray-900' : 'text-gray-800'}`}>
                      {chat.user.name}
                    </div>
                    <div className="text-xs text-gray-500 flex-shrink-0">
                      {formatTime(chat.timestamp)}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className={`text-sm truncate ${chat.unreadCount > 0 ? 'font-medium text-gray-900' : 'text-gray-600'}`}>
                      {truncateMessage(chat.lastMessage)}
                    </div>
                    {chat.unreadCount > 0 && (
                      <div className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center ml-2 flex-shrink-0">
                        {chat.unreadCount > 9 ? '9+' : chat.unreadCount}
                      </div>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Active Chat Window */}
      {activeChat && (
        <div className="fixed bottom-0 right-4 z-50">
          <ChatWindow
            recipient={activeChat}
            onClose={() => setActiveChat(null)}
            onMinimize={() => {}}
            isMinimized={false}
          />
        </div>
      )}
    </div>
  );
};

export default ChatList;
