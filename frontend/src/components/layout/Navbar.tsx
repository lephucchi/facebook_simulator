import React from 'react';
import { 
  Home, 
  Search, 
  Video, 
  Store, 
  Menu, 
  Bell,
  LogIn
} from 'lucide-react';
import { cn } from '../../utils';
import ProfileDropdown from '../ui/ProfileDropdown';
import MessengerDropdown from '../ui/MessengerDropdown';
import type { User } from '../../types';

interface NavbarProps {
  user?: User;
}

const Navbar: React.FC<NavbarProps> = ({ user }) => {
  const navItems = [
    { icon: Home, label: 'Home', isActive: true, onClick: () => window.location.href = '/' },
    { icon: Video, label: 'Videos' },
    { icon: Store, label: 'Shop' },
    { icon: Menu, label: 'Menu' },
  ];

  return (
    <nav className="bg-white shadow-md border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          {/* Left Section - Logo and Search */}
          <div className="flex items-center space-x-4">
            <div className="text-2xl font-bold text-blue-600">
              facebook
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search Facebook"
                className="pl-10 pr-4 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
              />
            </div>
          </div>

          {/* Center Section - Navigation */}
          <div className="flex items-center space-x-2">
            {navItems.map((item, index) => (
              <button
                key={index}
                onClick={item.onClick}
                className={cn(
                  "flex items-center justify-center w-28 h-12 rounded-lg transition-colors relative",
                  item.isActive 
                    ? "text-blue-600" 
                    : "text-gray-600 hover:bg-gray-100"
                )}
              >
                <item.icon className="w-6 h-6" />
                {item.isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-t-md" />
                )}
              </button>
            ))}
          </div>

          {/* Right Section - User Actions */}
          <div className="flex items-center space-x-2">
            {user ? (
              <>
                <MessengerDropdown />
                <button className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                  <Bell className="w-5 h-5 text-gray-600" />
                </button>
                <ProfileDropdown user={user} />
              </>
            ) : (
              <button 
                onClick={() => window.location.href = '/login'}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <LogIn className="w-4 h-4" />
                <span>Login</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
