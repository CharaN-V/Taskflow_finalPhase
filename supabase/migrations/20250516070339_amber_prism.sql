/*
  # Initial Schema Setup for TaskFlow

  1. New Tables
    - `users` - Extended user profile data
      - `id` (uuid, matches auth.users)
      - `name` (text)
      - `avatar_url` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `categories` - Task categories
      - `id` (uuid)
      - `name` (text)
      - `color` (text)
      - `user_id` (uuid)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `tasks` - Main tasks table
      - `id` (uuid)
      - `title` (text)
      - `description` (text)
      - `due_date` (timestamp)
      - `status` (task_status)
      - `category_id` (uuid)
      - `created_by` (uuid)
      - `assigned_to` (uuid)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Custom Types
    - `task_status` enum for task states

  3. Security
    - Enable RLS on all tables
    - Add policies for authenticated access
*/

-- Create custom types
CREATE TYPE task_status AS ENUM ('pending', 'in-progress', 'completed');

-- Create users table
CREATE TABLE users (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  name text NOT NULL,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create categories table
CREATE TABLE categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  color text NOT NULL,
  user_id uuid REFERENCES users(id) NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create tasks table
CREATE TABLE tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  due_date timestamptz NOT NULL,
  status task_status DEFAULT 'pending',
  category_id uuid REFERENCES categories(id),
  created_by uuid REFERENCES users(id) NOT NULL,
  assigned_to uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Users can read their own profile"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Create policies for categories table
CREATE POLICY "Users can read their categories"
  ON categories
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create their own categories"
  ON categories
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own categories"
  ON categories
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own categories"
  ON categories
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Create policies for tasks table
CREATE POLICY "Users can read tasks they created or are assigned to"
  ON tasks
  FOR SELECT
  TO authenticated
  USING (
    created_by = auth.uid() OR 
    assigned_to = auth.uid()
  );

CREATE POLICY "Users can create tasks"
  ON tasks
  FOR INSERT
  TO authenticated
  WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can update tasks they created or are assigned to"
  ON tasks
  FOR UPDATE
  TO authenticated
  USING (
    created_by = auth.uid() OR 
    assigned_to = auth.uid()
  );

CREATE POLICY "Users can delete tasks they created"
  ON tasks
  FOR DELETE
  TO authenticated
  USING (created_by = auth.uid());

-- Create indexes for better performance
CREATE INDEX tasks_category_id_idx ON tasks(category_id);
CREATE INDEX tasks_created_by_idx ON tasks(created_by);
CREATE INDEX tasks_assigned_to_idx ON tasks(assigned_to);
CREATE INDEX categories_user_id_idx ON categories(user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at
  BEFORE UPDATE ON tasks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();