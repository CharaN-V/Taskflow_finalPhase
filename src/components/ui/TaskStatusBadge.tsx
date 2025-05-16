import React from 'react';
import { TaskStatus } from '../../types';

type TaskStatusBadgeProps = {
  status: TaskStatus;
  onClick?: () => void;
};

export const TaskStatusBadge: React.FC<TaskStatusBadgeProps> = ({ status, onClick }) => {
  const getStatusStyles = (status: TaskStatus): { bg: string; text: string } => {
    switch (status) {
      case 'pending':
        return { bg: 'bg-yellow-100', text: 'text-yellow-800' };
      case 'in-progress':
        return { bg: 'bg-blue-100', text: 'text-blue-800' };
      case 'completed':
        return { bg: 'bg-green-100', text: 'text-green-800' };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-800' };
    }
  };

  const getStatusDisplay = (status: TaskStatus): string => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'in-progress':
        return 'In Progress';
      case 'completed':
        return 'Completed';
      default:
        return status;
    }
  };

  const { bg, text } = getStatusStyles(status);

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium cursor-pointer ${bg} ${text}`}
      onClick={onClick}
    >
      {getStatusDisplay(status)}
    </span>
  );
};