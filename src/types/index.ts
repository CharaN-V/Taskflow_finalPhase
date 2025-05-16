export type Category = {
  id: string;
  name: string;
  color: string;
  user_id: string;
};

export type TaskStatus = 'pending' | 'in-progress' | 'completed';

export type Task = {
  id: string;
  title: string;
  description: string | null;
  due_date: string;
  status: TaskStatus;
  category_id: string | null;
  created_by: string;
  assigned_to: string | null;
  created_at: string;
  updated_at: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
};