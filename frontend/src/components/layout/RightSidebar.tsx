import React, { useState } from 'react';
import { MoreHorizontal, Search } from 'lucide-react';
import ChatWindow from '../chat/ChatWindow';
import type { User } from '../../types';

interface RightSidebarProps {}

const RightSidebar: React.FC<RightSidebarProps> = () => {
  const [openChats, setOpenChats] = useState<{ user: User; isMinimized: boolean }[]>([]);

  const onlineContacts: User[] = [
    { id: '1', name: 'Emma Wilson', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=40&h=40&fit=crop&crop=face', isOnline: true },
    { id: '2', name: 'James Rodriguez', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face', isOnline: true },
    { id: '3', name: 'Sarah Chen', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face', isOnline: true },
    { id: '4', name: 'Michael Johnson', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face', isOnline: true },
    { id: '5', name: 'Lisa Anderson', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=40&h=40&fit=crop&crop=face', isOnline: true },
    { id: '6', name: 'David Kim', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=40&h=40&fit=crop&crop=face', isOnline: false },
    { id: '7', name: 'Rachel Green', avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=40&h=40&fit=crop&crop=face', isOnline: false },
  ];

  const handleChatOpen = (user: User) => {
    const existingChat = openChats.find(chat => chat.user.id === user.id);
    if (!existingChat) {
      setOpenChats(prev => [...prev, { user, isMinimized: false }]);
    } else {
      setOpenChats(prev => 
        prev.map(chat => 
          chat.user.id === user.id 
            ? { ...chat, isMinimized: false }
            : chat
        )
      );
    }
  };

  const handleChatClose = (userId: string) => {
    setOpenChats(prev => prev.filter(chat => chat.user.id !== userId));
  };

  const handleChatMinimize = (userId: string) => {
    setOpenChats(prev => 
      prev.map(chat => 
        chat.user.id === userId 
          ? { ...chat, isMinimized: !chat.isMinimized }
          : chat
      )
    );
  };

  const sponsoredAds = [
    {
      title: 'Online Course Platform',
      description: 'Learn new skills with our comprehensive courses',
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=200&h=100&fit=crop',
      sponsor: 'EduTech'
    },
    {
      title: 'Fitness App',
      description: 'Get fit with personalized workout plans',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=100&fit=crop',
      sponsor: 'FitLife'
    }
  ];

  return (
    <div className="w-80 bg-white h-screen overflow-y-auto scrollbar-hide">
      <div className="p-4 space-y-6">
        {/* Sponsored */}
        <div>
          <h3 className="text-gray-600 font-semibold text-sm mb-3">Sponsored</h3>
          <div className="space-y-4">
            {sponsoredAds.map((ad, index) => (
              <div key={index} className="flex space-x-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                <img
                  src={ad.image}
                  alt={ad.title}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 text-sm">{ad.title}</h4>
                  <p className="text-gray-600 text-xs mt-1">{ad.description}</p>
                  <p className="text-gray-500 text-xs mt-1">{ad.sponsor}</p>
                </div>
                <button className="p-1 hover:bg-gray-100 rounded-full">
                  <MoreHorizontal className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200"></div>

        {/* Contacts */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-gray-600 font-semibold text-sm">Contacts</h3>
            <div className="flex space-x-2">
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <Search className="w-4 h-4 text-gray-500" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <MoreHorizontal className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          </div>
          
          <div className="space-y-2">
            {onlineContacts.map((contact, index) => (
              <div 
                key={index} 
                className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-lg cursor-pointer"
                onClick={() => handleChatOpen(contact)}
              >
                <div className="relative">
                  <img
                    src={contact.avatar}
                    alt={contact.name}
                    className="w-9 h-9 rounded-full object-cover"
                  />
                  {contact.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                  )}
                </div>
                <span className="font-medium text-gray-900 text-sm">{contact.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Windows */}
        {openChats.map((chat) => (
          <ChatWindow
            key={chat.user.id}
            recipient={chat.user}
            onClose={() => handleChatClose(chat.user.id)}
            onMinimize={() => handleChatMinimize(chat.user.id)}
            isMinimized={chat.isMinimized}
          />
        ))}
      </div>
    </div>
  );
};

export default RightSidebar;
