import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface NavLinkProps {
  to: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  count?: number;
  highlight?: boolean;
  onClick?: () => void;
}

export const NavLink: React.FC<NavLinkProps> = ({
  to,
  children,
  icon,
  count,
  highlight = false,
  onClick,
}) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`flex items-center px-3 py-2 rounded-md group transition-all ${
        isActive
          ? 'bg-blue-50 text-blue-700'
          : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
      }`}
      onClick={onClick}
    >
      {icon && (
        <span
          className={`mr-3 ${
            isActive ? 'text-blue-600' : 'text-gray-500 group-hover:text-gray-900'
          }`}
        >
          {icon}
        </span>
      )}
      <span className="flex-1">{children}</span>
      {typeof count === 'number' && (
        <span
          className={`px-2 py-0.5 text-xs rounded-full ${
            highlight && count > 0
              ? 'bg-red-100 text-red-800'
              : isActive
              ? 'bg-blue-100 text-blue-800'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          {count}
        </span>
      )}
    </Link>
  );
};