import { Task, Category, User } from '../types';

export const initialCategories: Category[] = [
  { id: '1', name: 'Work', color: '#3B82F6' }, // Blue
  { id: '2', name: 'Personal', color: '#10B981' }, // Green
  { id: '3', name: 'Urgent', color: '#EF4444' }, // Red
  { id: '4', name: 'Learning', color: '#8B5CF6' }, // Purple
  { id: '5', name: 'Meetings', color: '#F97316' }, // Orange
];

export const initialUsers: User[] = [
  {
    id: '1',
    name: 'You',
    email: 'you@example.com',
    avatar: 'https://i.pravatar.cc/150?img=1',
  },
  {
    id: '2',
    name: 'Alex Johnson',
    email: 'alex@example.com',
    avatar: 'https://i.pravatar.cc/150?img=2',
  },
  {
    id: '3',
    name: 'Sam Williams',
    email: 'sam@example.com',
    avatar: 'https://i.pravatar.cc/150?img=3',
  },
  {
    id: '4',
    name: 'Taylor Miller',
    email: 'taylor@example.com',
    avatar: 'https://i.pravatar.cc/150?img=4',
  },
];

// One week ago
const oneWeekAgo = new Date();
oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

// Tomorrow
const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);

// Next week
const nextWeek = new Date();
nextWeek.setDate(nextWeek.getDate() + 7);

export const initialTasks: Task[] = [
  {
    id: '1',
    title: 'Complete project proposal',
    description: 'Draft the initial project proposal for the client meeting',
    dueDate: tomorrow.toISOString(),
    categoryId: '1', // Work
    status: 'in-progress',
    assignedTo: '1', // Self
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Buy groceries',
    description: 'Milk, eggs, bread, fruits, and vegetables',
    dueDate: new Date().toISOString(),
    categoryId: '2', // Personal
    status: 'pending',
    assignedTo: '1', // Self
    createdAt: oneWeekAgo.toISOString(),
    updatedAt: oneWeekAgo.toISOString(),
  },
  {
    id: '3',
    title: 'Schedule team meeting',
    description: 'Coordinate with all team members for the weekly sync',
    dueDate: tomorrow.toISOString(),
    categoryId: '5', // Meetings
    status: 'pending',
    assignedTo: '3', // Sam
    createdAt: oneWeekAgo.toISOString(),
    updatedAt: oneWeekAgo.toISOString(),
  },
  {
    id: '4',
    title: 'Fix login page bug',
    description: 'Users unable to reset password',
    dueDate: new Date().toISOString(),
    categoryId: '3', // Urgent
    status: 'completed',
    assignedTo: '2', // Alex
    createdAt: oneWeekAgo.toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '5',
    title: 'Learn React hooks',
    description: 'Go through documentation and tutorials',
    dueDate: nextWeek.toISOString(),
    categoryId: '4', // Learning
    status: 'in-progress',
    assignedTo: '1', // Self
    createdAt: oneWeekAgo.toISOString(),
    updatedAt: oneWeekAgo.toISOString(),
  },
];