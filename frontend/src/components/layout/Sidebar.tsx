import React from 'react';
import { 
  Users, 
  Calendar, 
  Clock, 
  Bookmark, 
  Video,
  Store,
  GamepadIcon,
  ChevronDown
} from 'lucide-react';

interface SidebarProps {
  user: {
    name: string;
    avatar: string;
  };
}

const Sidebar: React.FC<SidebarProps> = ({ user }) => {
  const menuItems = [
    { icon: Users, label: 'Friends', color: 'text-blue-500' },
    { icon: Calendar, label: 'Events', color: 'text-red-500' },
    { icon: Clock, label: 'Memories', color: 'text-blue-600' },
    { icon: Bookmark, label: 'Saved', color: 'text-purple-500' },
    { icon: Video, label: 'Watch', color: 'text-blue-500' },
    { icon: Store, label: 'Marketplace', color: 'text-blue-500' },
    { icon: GamepadIcon, label: 'Gaming', color: 'text-blue-600' },
  ];

  const shortcuts = [
    { name: 'React Developers', avatar: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=40&h=40&fit=crop&crop=face' },
    { name: 'Web Design', avatar: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=40&h=40&fit=crop&crop=face' },
    { name: 'JavaScript Community', avatar: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=40&h=40&fit=crop&crop=face' },
    { name: 'UI/UX Designers', avatar: 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=40&h=40&fit=crop&crop=face' },
  ];

  return (
    <div className="w-80 bg-white h-screen overflow-y-auto scrollbar-hide">
      <div className="p-4 space-y-2">
        {/* User Profile */}
        <div className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-lg cursor-pointer">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-9 h-9 rounded-full object-cover"
          />
          <span className="font-medium text-gray-900">{user.name}</span>
        </div>

        {/* Menu Items */}
        {menuItems.map((item, index) => (
          <div key={index} className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-lg cursor-pointer">
            <item.icon className={`w-9 h-9 ${item.color} p-2 bg-gray-100 rounded-lg`} />
            <span className="font-medium text-gray-900">{item.label}</span>
          </div>
        ))}

        {/* See More */}
        <div className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-lg cursor-pointer">
          <div className="w-9 h-9 bg-gray-200 rounded-lg flex items-center justify-center">
            <ChevronDown className="w-5 h-5 text-gray-600" />
          </div>
          <span className="font-medium text-gray-900">See more</span>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 my-4"></div>

        {/* Your Shortcuts */}
        <div className="space-y-2">
          <h3 className="text-gray-600 font-semibold text-sm px-2">Your shortcuts</h3>
          {shortcuts.map((shortcut, index) => (
            <div key={index} className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-lg cursor-pointer">
              <img
                src={shortcut.avatar}
                alt={shortcut.name}
                className="w-9 h-9 rounded-lg object-cover"
              />
              <span className="font-medium text-gray-900">{shortcut.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
