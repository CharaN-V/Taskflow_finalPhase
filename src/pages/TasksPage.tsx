import React, { useState } from 'react';
import { useTaskContext } from '../context/TaskContext';
import { TaskList } from '../components/TaskList';
import { TaskForm } from '../components/TaskForm';

export const TasksPage: React.FC = () => {
  const { tasks, categories } = useTaskContext();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  
  const filteredTasks = activeCategory 
    ? tasks.filter(task => task.categoryId === activeCategory)
    : tasks;

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="bg-white shadow rounded-lg p-4">
        <div className="flex items-center space-x-2 overflow-x-auto pb-2">
          <button
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              activeCategory === null
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => setActiveCategory(null)}
          >
            All
          </button>
          
          {categories.map(category => (
            <button
              key={category.id}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                activeCategory === category.id
                  ? 'text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              style={{
                backgroundColor: activeCategory === category.id ? category.color : undefined
              }}
              onClick={() => setActiveCategory(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>
      
      <TaskList 
        tasks={filteredTasks} 
        title={activeCategory 
          ? `${categories.find(c => c.id === activeCategory)?.name} Tasks` 
          : "All Tasks"
        } 
      />
      
      <TaskForm 
        isOpen={isTaskFormOpen} 
        onClose={() => setIsTaskFormOpen(false)} 
      />
    </div>
  );
};