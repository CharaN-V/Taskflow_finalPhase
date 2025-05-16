import React, { useState } from 'react';
import { useTaskContext } from '../context/TaskContext';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { Settings, Plus, X } from 'lucide-react';

export const CategoryManager: React.FC = () => {
  const { categories, addCategory, deleteCategory, getTasksByCategory } = useTaskContext();
  const [isOpen, setIsOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryColor, setNewCategoryColor] = useState('#3B82F6');

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCategoryName.trim()) {
      addCategory({
        name: newCategoryName.trim(),
        color: newCategoryColor,
      });
      setNewCategoryName('');
      setNewCategoryColor('#3B82F6');
    }
  };

  const handleDeleteCategory = (id: string) => {
    const tasksInCategory = getTasksByCategory(id);
    if (tasksInCategory.length > 0) {
      if (
        confirm(
          `This category contains ${tasksInCategory.length} task(s). Deleting it will not remove the tasks but they will no longer be categorized. Continue?`
        )
      ) {
        deleteCategory(id);
      }
    } else {
      deleteCategory(id);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Categories</h2>
        <Button 
          variant="outline" 
          onClick={toggleOpen}
          icon={<Settings size={16} />}
        >
          {isOpen ? 'Done' : 'Manage'}
        </Button>
      </div>
      
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <div 
              key={category.id}
              className={`flex items-center ${isOpen ? 'bg-gray-50 p-2 rounded' : ''}`}
            >
              <Badge text={category.name} color={category.color} />
              {isOpen && (
                <button
                  onClick={() => handleDeleteCategory(category.id)}
                  className="ml-2 text-gray-400 hover:text-red-500"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          ))}
        </div>
        
        {isOpen && (
          <form onSubmit={handleAddCategory} className="mt-4 space-y-3">
            <div>
              <label htmlFor="categoryName" className="block text-sm font-medium text-gray-700">
                New Category
              </label>
              <div className="mt-1 flex">
                <input
                  type="text"
                  id="categoryName"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="Category name"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
                <input
                  type="color"
                  value={newCategoryColor}
                  onChange={(e) => setNewCategoryColor(e.target.value)}
                  className="h-full border border-gray-300 rounded-r-md"
                />
              </div>
            </div>
            <Button 
              type="submit" 
              variant="primary"
              fullWidth
              icon={<Plus size={16} />}
            >
              Add Category
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};