import React from 'react';
import { AnalyticsChart } from '../components/AnalyticsChart';
import { useTaskContext } from '../context/TaskContext';

export const AnalyticsPage: React.FC = () => {
  const { 
    tasks, 
    categories, 
    getTasksByCategory,
    getCompletedTasksCount,
    getPendingTasksCount,
    getInProgressTasksCount,
    getTaskCompletionRate 
  } = useTaskContext();

  // Calculate weekly stats
  const getWeeklyStats = () => {
    const now = new Date();
    const oneWeekAgo = new Date(now);
    oneWeekAgo.setDate(now.getDate() - 7);
    
    const tasksThisWeek = tasks.filter(task => new Date(task.createdAt) >= oneWeekAgo);
    const completedThisWeek = tasksThisWeek.filter(task => task.status === 'completed');
    
    return {
      created: tasksThisWeek.length,
      completed: completedThisWeek.length
    };
  };

  const weeklyStats = getWeeklyStats();

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="text-sm font-medium text-gray-500 mb-2">Tasks Created This Week</div>
          <div className="text-3xl font-bold text-gray-800">{weeklyStats.created}</div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="text-sm font-medium text-gray-500 mb-2">Tasks Completed This Week</div>
          <div className="text-3xl font-bold text-green-600">{weeklyStats.completed}</div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="text-sm font-medium text-gray-500 mb-2">Overall Completion Rate</div>
          <div className="text-3xl font-bold text-blue-600">{getTaskCompletionRate().toFixed(1)}%</div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="text-sm font-medium text-gray-500 mb-2">Current Workload</div>
          <div className="text-3xl font-bold text-gray-800">{getPendingTasksCount() + getInProgressTasksCount()}</div>
          <div className="text-xs text-gray-500 mt-1">
            <span className="text-yellow-600">{getPendingTasksCount()} pending</span> · 
            <span className="text-blue-600 ml-1">{getInProgressTasksCount()} in progress</span>
          </div>
        </div>
      </div>
      
      <AnalyticsChart />
      
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Category Analysis</h2>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Tasks
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Completed
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  In Progress
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pending
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Completion Rate
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {categories.map(category => {
                const categoryTasks = getTasksByCategory(category.id);
                const completed = categoryTasks.filter(t => t.status === 'completed').length;
                const inProgress = categoryTasks.filter(t => t.status === 'in-progress').length;
                const pending = categoryTasks.filter(t => t.status === 'pending').length;
                const completionRate = categoryTasks.length > 0 
                  ? (completed / categoryTasks.length) * 100 
                  : 0;
                
                return (
                  <tr key={category.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: category.color }}></div>
                        <div className="text-sm font-medium text-gray-900">{category.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {categoryTasks.length}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {completed}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {inProgress}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        {pending}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {completionRate.toFixed(1)}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};