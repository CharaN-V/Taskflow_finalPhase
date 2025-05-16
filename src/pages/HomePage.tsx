import React, { useState } from 'react';
import { useTaskContext } from '../context/TaskContext';
import { DashboardStats } from '../components/DashboardStats';
import { TaskList } from '../components/TaskList';
import { CategoryManager } from '../components/CategoryManager';
import { TaskForm } from '../components/TaskForm';
import { isOverdue } from '../utils/dateUtils';

export const HomePage: React.FC = () => {
  const { tasks } = useTaskContext();
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);

  const recentTasks = [...tasks]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const overdueTasks = tasks.filter(
    (task) => task.status !== 'completed' && isOverdue(task.dueDate)
  );

  return (
    <div className="p-4 md:p-6 space-y-6">
      <DashboardStats />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TaskList 
            tasks={recentTasks} 
            title="Recent Tasks" 
          />
        </div>
        
        <div>
          <CategoryManager />
        </div>
      </div>
      
      {overdueTasks.length > 0 && (
        <TaskList 
          tasks={overdueTasks} 
          title="Overdue Tasks" 
        />
      )}
      
      <TaskForm 
        isOpen={isTaskFormOpen} 
        onClose={() => setIsTaskFormOpen(false)} 
      />
    </div>
  );
};