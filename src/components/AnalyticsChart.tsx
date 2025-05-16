import React from 'react';
import { useTaskContext } from '../context/TaskContext';

export const AnalyticsChart: React.FC = () => {
  const { tasks, categories, getCategoryById } = useTaskContext();
  
  // Group tasks by category
  const tasksByCategory = categories.map(category => {
    const categoryTasks = tasks.filter(task => task.categoryId === category.id);
    const completed = categoryTasks.filter(task => task.status === 'completed').length;
    const total = categoryTasks.length;
    const percentage = total > 0 ? (completed / total) * 100 : 0;
    
    return {
      id: category.id,
      name: category.name,
      color: category.color,
      completed,
      total,
      percentage
    };
  });
  
  // Calculate task status stats
  const statusStats = {
    pending: tasks.filter(t => t.status === 'pending').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    completed: tasks.filter(t => t.status === 'completed').length
  };
  
  const statusTotal = statusStats.pending + statusStats.inProgress + statusStats.completed;
  
  // Timeline data - tasks by week
  const getTasksByTimeframe = () => {
    const now = new Date();
    
    const thisWeekStart = new Date(now);
    thisWeekStart.setDate(now.getDate() - now.getDay()); // Start of current week (Sunday)
    thisWeekStart.setHours(0, 0, 0, 0);
    
    const lastWeekStart = new Date(thisWeekStart);
    lastWeekStart.setDate(lastWeekStart.getDate() - 7); // Start of last week
    
    const twoWeeksAgoStart = new Date(lastWeekStart);
    twoWeeksAgoStart.setDate(twoWeeksAgoStart.getDate() - 7); // Start of two weeks ago
    
    // Count tasks created in each period
    const thisWeek = tasks.filter(t => new Date(t.createdAt) >= thisWeekStart).length;
    const lastWeek = tasks.filter(t => 
      new Date(t.createdAt) >= lastWeekStart && new Date(t.createdAt) < thisWeekStart
    ).length;
    const twoWeeksAgo = tasks.filter(t => 
      new Date(t.createdAt) >= twoWeeksAgoStart && new Date(t.createdAt) < lastWeekStart
    ).length;
    
    return [
      { label: '2 Weeks Ago', value: twoWeeksAgo },
      { label: 'Last Week', value: lastWeek },
      { label: 'This Week', value: thisWeek }
    ];
  };
  
  const timelineData = getTasksByTimeframe();
  const maxTimelineValue = Math.max(...timelineData.map(d => d.value), 5); // Ensure a minimum scale
  
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Analytics</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Progress */}
        <div className="border border-gray-200 rounded-lg p-4 shadow-sm">
          <h3 className="text-base font-medium text-gray-700 mb-4">Completion by Category</h3>
          {tasksByCategory.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No categories found</p>
          ) : (
            <div className="space-y-4">
              {tasksByCategory.map(cat => (
                <div key={cat.id}>
                  <div className="flex justify-between mb-1">
                    <span style={{ color: cat.color }} className="font-medium">{cat.name}</span>
                    <span className="text-xs text-gray-500">{cat.completed}/{cat.total}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="h-2.5 rounded-full"
                      style={{ width: `${cat.percentage}%`, backgroundColor: cat.color }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Status Distribution */}
        <div className="border border-gray-200 rounded-lg p-4 shadow-sm">
          <h3 className="text-base font-medium text-gray-700 mb-4">Status Distribution</h3>
          <div className="flex justify-center items-center h-40 relative">
            {statusTotal === 0 ? (
              <p className="text-gray-500">No tasks found</p>
            ) : (
              <>
                <div className="w-32 h-32 rounded-full border-8 border-gray-100 relative">
                  {/* Pending segment */}
                  <div 
                    className="absolute inset-0 bg-yellow-500"
                    style={{ 
                      clipPath: `polygon(50% 50%, 50% 0%, ${100 * (statusStats.pending / statusTotal) + 50}% 0%)` 
                    }}
                  ></div>
                  
                  {/* In Progress segment */}
                  <div 
                    className="absolute inset-0 bg-blue-500"
                    style={{ 
                      clipPath: `polygon(50% 50%, ${50 + 100 * (statusStats.pending / statusTotal)}% 0%, 100% 0%, 100% ${100 * ((statusStats.pending + statusStats.inProgress) / statusTotal)}%)` 
                    }}
                  ></div>
                  
                  {/* Completed segment */}
                  <div 
                    className="absolute inset-0 bg-green-500"
                    style={{ 
                      clipPath: `polygon(50% 50%, 100% ${100 * ((statusStats.pending + statusStats.inProgress) / statusTotal)}%, 100% 100%, 0% 100%, 0% 0%, 50% 0%)` 
                    }}
                  ></div>
                  
                  <div className="absolute inset-0 rounded-full flex items-center justify-center bg-white" style={{ transform: 'scale(0.65)' }}>
                    <span className="text-gray-800 font-bold text-sm">{statusTotal} Tasks</span>
                  </div>
                </div>
                
                <div className="absolute bottom-0 w-full flex justify-around">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full mr-1"></div>
                    <span className="text-xs text-gray-600">Pending ({statusStats.pending})</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-1"></div>
                    <span className="text-xs text-gray-600">In Progress ({statusStats.inProgress})</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
                    <span className="text-xs text-gray-600">Completed ({statusStats.completed})</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
        
        {/* Timeline Chart */}
        <div className="border border-gray-200 rounded-lg p-4 shadow-sm col-span-1 lg:col-span-2">
          <h3 className="text-base font-medium text-gray-700 mb-4">Tasks Created</h3>
          <div className="h-40 flex items-end justify-around">
            {timelineData.map((item, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="flex-1 w-16 flex flex-col justify-end">
                  <div 
                    className="w-full bg-blue-500 rounded-t-sm transition-all duration-500"
                    style={{ height: `${Math.max((item.value / maxTimelineValue) * 100, 5)}%` }}
                  ></div>
                </div>
                <div className="mt-2 text-xs text-gray-600">{item.label}</div>
                <div className="text-sm font-medium">{item.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};