import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Search, Video, Edit } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { apiClient } from '../../utils/api';
import ChatWindow from '../chat/ChatWindow';
import type { User } from '../../types';

interface MessengerDropdownProps {
  onChatOpen?: (user: User) => void;
}

interface Chat {
  id: string;
  user: User;
  lastMessage: string;
  timestamp: Date;
  unreadCount: number;
  isOnline: boolean;
}

const MessengerDropdown: React.FC<MessengerDropdownProps> = ({ onChatOpen }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChat, setActiveChat] = useState<User | null>(null);
  const [loadingChats, setLoadingChats] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user: currentUser } = useAuth();

  // Load chats from backend
  const loadChats = async () => {
    if (!currentUser) return;
    
    try {
      setLoadingChats(true);
      const chatsData = await apiClient.getChats();
      
      // Transform backend data to frontend format
      const transformedChats: Chat[] = (chatsData as any[]).map((chat: any) => ({
        id: chat.user.id.toString(),
        user: {
          id: chat.user.id.toString(),
          name: chat.user.full_name || chat.user.username,
          avatar: chat.user.avatar_url || `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face`,
          isOnline: chat.user.is_online || false
        },
        lastMessage: chat.last_message?.content || 'No messages yet',
        timestamp: chat.last_message ? new Date(chat.last_message.created_at) : new Date(),
        unreadCount: chat.unread_count || 0,
        isOnline: chat.user.is_online || false
      }));
      
      setChats(transformedChats);
    } catch (error) {
      console.error('Failed to load chats:', error);
      // Fallback to localStorage
      loadChatsFromLocalStorage();
    } finally {
      setLoadingChats(false);
    }
  };

  // Fallback: Load chats from localStorage
  const loadChatsFromLocalStorage = () => {
    const savedChats = localStorage.getItem('fb_simulator_chats');
    if (savedChats) {
      try {
        const parsedChats = JSON.parse(savedChats);
        setChats(parsedChats.map((chat: any) => ({
          ...chat,
          timestamp: new Date(chat.timestamp)
        })));
        return;
      } catch (error) {
        console.error('Failed to parse saved chats:', error);
      }
    }

    // Default mock chats if no saved data
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
      }
    ];
    setChats(mockChats);
    localStorage.setItem('fb_simulator_chats', JSON.stringify(mockChats));
  };

  // Load chats when component mounts or user changes
  useEffect(() => {
    if (currentUser) {
      loadChats();
    }
  }, [currentUser]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const filteredChats = chats.filter(chat =>
    chat.user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleChatClick = (chat: Chat) => {
    setActiveChat(chat.user);
    setIsOpen(false);
    if (onChatOpen) {
      onChatOpen(chat.user);
    }
    
    // Mark chat as read (set unreadCount to 0)
    const updatedChats = chats.map(c => 
      c.id === chat.id ? { ...c, unreadCount: 0 } : c
    );
    setChats(updatedChats);
    
    // Save updated chats to localStorage
    localStorage.setItem('fb_simulator_chats', JSON.stringify(updatedChats));
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
    return `${diffDays}d`;
  };

  const totalUnreadCount = chats.reduce((sum, chat) => sum + chat.unreadCount, 0);

  return (
    <>
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
        >
          <MessageCircle className="w-5 h-5 text-gray-600" />
          {totalUnreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {totalUnreadCount > 9 ? '9+' : totalUnreadCount}
            </span>
          )}
        </button>

        {isOpen && (
          <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
            {/* Header */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900">Chats</h3>
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
            <div className="max-h-80 overflow-y-auto">
              {filteredChats.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  {searchQuery ? 'No chats found' : 'No chats yet'}
                </div>
              ) : (
                filteredChats.map((chat) => (
                  <button
                    key={chat.id}
                    onClick={() => handleChatClick(chat)}
                    className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 transition-colors text-left"
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

            {/* Footer */}
            <div className="p-3 border-t border-gray-200">
              <button className="w-full text-center text-blue-600 hover:text-blue-700 text-sm font-medium">
                See all in Messenger
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Chat Window */}
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
    </>
  );
};

export default MessengerDropdown;
