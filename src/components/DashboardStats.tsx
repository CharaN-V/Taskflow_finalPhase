import React from 'react';
import { useTaskContext } from '../context/TaskContext';
import { 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  ListTodo, 
  TrendingUp
} from 'lucide-react';

export const DashboardStats: React.FC = () => {
  const { 
    getCompletedTasksCount, 
    getPendingTasksCount, 
    getInProgressTasksCount, 
    getOverdueTasksCount,
    getTaskCompletionRate 
  } = useTaskContext();
  
  const stats = [
    {
      title: 'Pending Tasks',
      value: getPendingTasksCount(),
      icon: <ListTodo className="text-gray-500" size={22} />,
      color: 'bg-blue-50 text-blue-600',
    },
    {
      title: 'In Progress',
      value: getInProgressTasksCount(),
      icon: <Clock className="text-gray-500" size={22} />,
      color: 'bg-yellow-50 text-yellow-600',
    },
    {
      title: 'Completed',
      value: getCompletedTasksCount(),
      icon: <CheckCircle className="text-gray-500" size={22} />,
      color: 'bg-green-50 text-green-600',
    },
    {
      title: 'Overdue',
      value: getOverdueTasksCount(),
      icon: <AlertCircle className="text-gray-500" size={22} />,
      color: 'bg-red-50 text-red-600',
    },
  ];

  // Calculate completion rate for the progress bar
  const completionRate = getTaskCompletionRate();
  
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-5">Overview</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {stats.map((stat) => (
          <div key={stat.title} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="mr-2">{stat.icon}</div>
              <span className={`text-3xl font-bold ${stat.color}`}>{stat.value}</span>
            </div>
            <p className="mt-2 text-sm text-gray-600">{stat.title}</p>
          </div>
        ))}
      </div>
      
      <div className="border border-gray-200 rounded-lg p-4 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-base font-medium text-gray-700">Completion Rate</h3>
          <div className="flex items-center">
            <TrendingUp size={16} className="mr-1 text-green-500" />
            <span className="text-sm font-medium text-green-500">{completionRate.toFixed(1)}%</span>
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-blue-600 h-2.5 rounded-full"
            style={{ width: `${completionRate}%` }}
          ></div>
        </div>
        <div className="mt-2 flex justify-between text-xs text-gray-500">
          <span>0%</span>
          <span>50%</span>
          <span>100%</span>
        </div>
      </div>
    </div>
  );
};