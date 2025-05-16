import React, { useState } from 'react';
import { Task } from '../types';
import { formatDate, isOverdue, isToday } from '../utils/dateUtils';
import { useTaskContext } from '../context/TaskContext';
import { Badge } from './ui/Badge';
import { TaskStatusBadge } from './ui/TaskStatusBadge';
import { Button } from './ui/Button';
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  Trash, 
  Edit,
  User
} from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit }) => {
  const { updateTaskStatus, deleteTask, getCategoryById, getUserById } = useTaskContext();
  const [isExpanded, setIsExpanded] = useState(false);

  const category = task.category_id ? getCategoryById(task.category_id) : null;
  const assignedUser = task.assigned_to ? getUserById(task.assigned_to) : null;
  
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleStatusUpdate = async (status: 'pending' | 'in-progress' | 'completed') => {
    try {
      await updateTaskStatus(task.id, status);
    } catch (error) {
      console.error('Error updating task status:', error);
      alert('Failed to update task status. Please try again.');
    }
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(task.id);
      } catch (error) {
        console.error('Error deleting task:', error);
        alert('Failed to delete task. Please try again.');
      }
    }
  };

  const getDateClasses = () => {
    if (isOverdue(task.due_date) && task.status !== 'completed') {
      return 'text-red-600 font-medium';
    }
    if (isToday(task.due_date) && task.status !== 'completed') {
      return 'text-orange-600 font-medium';
    }
    return 'text-gray-600';
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 transition-all duration-200 hover:shadow-lg">
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-medium text-gray-900 mr-2">{task.title}</h3>
          {category && <Badge text={category.name} color={category.color} />}
        </div>
        
        <div className="flex items-center text-sm text-gray-500 mb-4">
          <Calendar size={16} className="mr-1" />
          <span className={getDateClasses()}>{formatDate(task.due_date)}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <TaskStatusBadge 
            status={task.status} 
            onClick={() => {
              const nextStatus = {
                'pending': 'in-progress',
                'in-progress': 'completed',
                'completed': 'pending'
              }[task.status] as 'pending' | 'in-progress' | 'completed';
              handleStatusUpdate(nextStatus);
            }} 
          />
          
          {assignedUser && (
            <div className="flex items-center text-sm text-gray-600">
              <User size={16} className="mr-1" />
              <span>{assignedUser.name}</span>
            </div>
          )}
        </div>
        
        <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'mt-4 max-h-96' : 'max-h-0'}`}>
          {task.description && (
            <p className="text-gray-600 mb-4">{task.description}</p>
          )}
          
          <div className="flex flex-wrap gap-2 mt-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onEdit(task)}
              icon={<Edit size={16} />}
            >
              Edit
            </Button>
            <Button 
              variant="danger" 
              size="sm" 
              onClick={handleDelete}
              icon={<Trash size={16} />}
            >
              Delete
            </Button>
          </div>
        </div>
      </div>
      
      <button 
        className="w-full text-center py-2 text-sm text-gray-500 hover:bg-gray-50 rounded-b-lg border-t border-gray-200 transition-colors"
        onClick={toggleExpand}
      >
        {isExpanded ? 'Show Less' : 'Show More'}
      </button>
    </div>
  );
};