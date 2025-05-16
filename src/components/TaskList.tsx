import React, { useState } from 'react';
import { Task, TaskStatus } from '../types';
import { TaskCard } from './TaskCard';
import { TaskForm } from './TaskForm';
import { Button } from './ui/Button';
import { PlusCircle, Filter, SortAsc, SortDesc } from 'lucide-react';

interface TaskListProps {
  tasks: Task[];
  title: string;
}

type SortField = 'dueDate' | 'title' | 'status';
type SortDirection = 'asc' | 'desc';
type FilterStatus = TaskStatus | 'all';

export const TaskList: React.FC<TaskListProps> = ({ tasks, title }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editTask, setEditTask] = useState<Task | undefined>(undefined);
  const [sortField, setSortField] = useState<SortField>('dueDate');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');

  const handleCreateTask = () => {
    setEditTask(undefined);
    setIsFormOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditTask(task);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditTask(undefined);
  };

  const toggleSortDirection = () => {
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      toggleSortDirection();
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortTasks = (tasksToSort: Task[]): Task[] => {
    return [...tasksToSort].sort((a, b) => {
      let comparison = 0;
      
      switch (sortField) {
        case 'dueDate':
          comparison = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
          break;
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'status':
          const statusOrder: Record<TaskStatus, number> = {
            'pending': 0,
            'in-progress': 1,
            'completed': 2
          };
          comparison = statusOrder[a.status] - statusOrder[b.status];
          break;
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  };

  const filterTasks = (tasksToFilter: Task[]): Task[] => {
    if (filterStatus === 'all') {
      return tasksToFilter;
    }
    
    return tasksToFilter.filter(task => task.status === filterStatus);
  };

  const processedTasks = sortTasks(filterTasks(tasks));

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">{title}</h2>
        <Button 
          variant="primary" 
          onClick={handleCreateTask}
          icon={<PlusCircle size={18} />}
        >
          New Task
        </Button>
      </div>
      
      <div className="flex flex-wrap gap-2 mb-4">
        <div className="flex items-center">
          <span className="mr-2 text-sm text-gray-600">Filter:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
            className="text-sm border border-gray-300 rounded-md p-1"
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        
        <div className="flex items-center ml-auto">
          <span className="mr-2 text-sm text-gray-600">Sort by:</span>
          <select
            value={sortField}
            onChange={(e) => handleSort(e.target.value as SortField)}
            className="text-sm border border-gray-300 rounded-md p-1 mr-1"
          >
            <option value="dueDate">Due Date</option>
            <option value="title">Title</option>
            <option value="status">Status</option>
          </select>
          <button
            onClick={toggleSortDirection}
            className="p-1 text-gray-500 hover:text-gray-700"
          >
            {sortDirection === 'asc' ? <SortAsc size={18} /> : <SortDesc size={18} />}
          </button>
        </div>
      </div>
      
      {processedTasks.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No tasks found</p>
          <Button 
            variant="outline" 
            onClick={handleCreateTask}
            className="mt-4"
            icon={<PlusCircle size={18} />}
          >
            Create Your First Task
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {processedTasks.map((task) => (
            <TaskCard key={task.id} task={task} onEdit={handleEditTask} />
          ))}
        </div>
      )}
      
      <TaskForm 
        task={editTask} 
        onClose={handleCloseForm} 
        isOpen={isFormOpen} 
      />
    </div>
  );
};