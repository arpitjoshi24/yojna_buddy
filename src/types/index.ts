export interface Project {
  id: string;
  title: string;
  description: string;
  dueDate?: string; // ISO string
  status: 'planning' | 'in-progress' | 'completed' | 'on-hold';
  priority: 'low' | 'medium' | 'high';
  userId: string;
  createdAt: string; // ISO string
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: string; // ISO string
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  projectId?: string; // optional link to a project
  category: 'project' | 'school' | 'personal' | 'other';
  userId: string;
  createdAt: string; // ISO string
}

export interface Journal {
  id: string;
  title: string;
  content: string;
  date: string; // ISO string
  mood?: 'great' | 'good' | 'neutral' | 'bad' | 'terrible';
  tags: string[];
  userId: string;
  createdAt: string; // ISO string
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  relatedId?: string; // ID of the related project/task
}

export interface User {
  id: string;
  email: string;
  displayName?: string;
  createdAt: string; // ISO string
}