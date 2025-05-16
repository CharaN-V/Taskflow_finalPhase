import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTaskContext } from '../context/TaskContext';
import { TaskList } from '../components/TaskList';
import { TaskForm } from '../components/TaskForm';
import { isOverdue } from '../utils/dateUtils';
import { TaskStatus } from '../types';

export const FilteredTasksPage: React.FC = () => {
  const { filter } = useParams<{ filter: string }>();
  const { tasks } = useTaskContext();
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);

  const getFilteredTasks = () => {
    switch (filter) {
      case 'in-progress':
        return tasks.filter(task => task.status === 'in-progress');
      case 'completed':
        return tasks.filter(task => task.status === 'completed');
      case 'overdue':
        return tasks.filter(task => 
          task.status !== 'completed' && isOverdue(task.dueDate)
        );
      default:
        return tasks;
    }
  };

  const getPageTitle = () => {
    switch (filter) {
      case 'in-progress':
        return 'In Progress Tasks';
      case 'completed':
        return 'Completed Tasks';
      case 'overdue':
        return 'Overdue Tasks';
      default:
        return 'Tasks';
    }
  };

  const filteredTasks = getFilteredTasks();

  return (
    <div className="p-4 md:p-6 space-y-6">
      <TaskList 
        tasks={filteredTasks} 
        title={getPageTitle()} 
      />
      
      <TaskForm 
        isOpen={isTaskFormOpen} 
        onClose={() => setIsTaskFormOpen(false)} 
      />
    </div>
  );
};