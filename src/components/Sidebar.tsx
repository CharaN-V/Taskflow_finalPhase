import React from 'react';
import { useTaskContext } from '../context/TaskContext';
import { NavLink } from './ui/NavLink';
import { 
  LayoutDashboard, 
  CheckSquare, 
  ListTodo, 
  AlertCircle, 
  Clock, 
  Settings, 
  BarChart
} from 'lucide-react';

interface SidebarProps {
  isMobile: boolean;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isMobile, isOpen, onClose }) => {
  const { 
    getOverdueTasksCount, 
    getPendingTasksCount, 
    getInProgressTasksCount, 
    getCompletedTasksCount 
  } = useTaskContext();

  const menuItems = [
    {
      title: 'Dashboard',
      icon: <LayoutDashboard size={20} />,
      path: '/',
    },
    {
      title: 'Tasks',
      icon: <ListTodo size={20} />,
      path: '/tasks',
      count: getPendingTasksCount() + getInProgressTasksCount(),
    },
    {
      title: 'In Progress',
      icon: <Clock size={20} />,
      path: '/in-progress',
      count: getInProgressTasksCount(),
    },
    {
      title: 'Completed',
      icon: <CheckSquare size={20} />,
      path: '/completed',
      count: getCompletedTasksCount(),
    },
    {
      title: 'Overdue',
      icon: <AlertCircle size={20} />,
      path: '/overdue',
      count: getOverdueTasksCount(),
      highlight: true,
    },
    {
      title: 'Analytics',
      icon: <BarChart size={20} />,
      path: '/analytics',
    },
    {
      title: 'Settings',
      icon: <Settings size={20} />,
      path: '/settings',
    },
  ];

  // If this is a mobile sidebar that's closed, don't render anything
  if (isMobile && !isOpen) {
    return null;
  }

  const handleNavClick = () => {
    if (isMobile) {
      onClose();
    }
  };

  return (
    <div 
      className={`bg-white border-r border-gray-200 flex flex-col
        ${isMobile ? 'fixed inset-y-0 left-0 z-40 w-64 transform transition-transform duration-300 ease-in-out' : 'min-h-screen'}
        ${isMobile && !isOpen ? '-translate-x-full' : 'translate-x-0'}`}
    >
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-xl font-bold text-blue-600 flex items-center">
          <CheckSquare className="mr-2" size={24} />
          TaskFlow
        </h1>
      </div>
      
      <nav className="flex-1 px-2 py-4 space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            icon={item.icon}
            count={item.count}
            highlight={item.highlight}
            onClick={handleNavClick}
          >
            {item.title}
          </NavLink>
        ))}
      </nav>
      
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
            Y
          </div>
          <div className="ml-2">
            <p className="text-sm font-medium text-gray-700">Your Account</p>
            <p className="text-xs text-gray-500">you@example.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};