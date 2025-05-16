import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/Button';
import { Menu, Bell, Search, Plus, LogOut } from 'lucide-react';

interface HeaderProps {
  onToggleSidebar: () => void;
  onCreateTask: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar, onCreateTask }) => {
  const location = useLocation();
  const { signOut } = useAuth();
  
  const getPageTitle = (path: string): string => {
    switch (path) {
      case '/':
        return 'Dashboard';
      case '/tasks':
        return 'All Tasks';
      case '/in-progress':
        return 'In Progress';
      case '/completed':
        return 'Completed Tasks';
      case '/overdue':
        return 'Overdue Tasks';
      case '/analytics':
        return 'Analytics';
      case '/settings':
        return 'Settings';
      default:
        return 'TaskFlow';
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button
              type="button"
              className="text-gray-500 hover:text-gray-600 lg:hidden"
              onClick={onToggleSidebar}
            >
              <Menu size={24} />
            </button>
            <h1 className="ml-2 lg:ml-0 text-xl font-semibold text-gray-800">
              {getPageTitle(location.pathname)}
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative hidden sm:block">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={16} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search tasks..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <Button 
              variant="primary" 
              onClick={onCreateTask}
              icon={<Plus size={16} />}
              className="hidden sm:flex"
            >
              New Task
            </Button>
            
            <button className="relative p-1 text-gray-500 hover:text-gray-600">
              <Bell size={20} />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            <Button
              variant="outline"
              onClick={handleSignOut}
              icon={<LogOut size={16} />}
              className="ml-2"
            >
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};