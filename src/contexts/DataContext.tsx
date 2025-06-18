import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { Project, Task, Journal, Notification } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';

interface DataContextType {
  projects: Project[];
  tasks: Task[];
  journals: Journal[];
  notifications: Notification[];
  addProject: (project: Omit<Project, 'id'>) => Promise<void>;
  updateProject: (id: string, data: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  addTask: (task: Omit<Task, 'id'>) => Promise<void>;
  updateTask: (id: string, data: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  addJournal: (journal: Omit<Journal, 'id'>) => Promise<void>;
  updateJournal: (id: string, data: Partial<Journal>) => Promise<void>;
  deleteJournal: (id: string) => Promise<void>;
  loading: boolean;
}

const DataContext = createContext<DataContextType | null>(null);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

const API_URL = 'http://localhost:5000/api';

export const DataProvider = ({ children }: { children: React.ReactNode }) => {
  const { currentUser } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [journals, setJournals] = useState<Journal[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      setProjects([]);
      setTasks([]);
      setJournals([]);
      setNotifications([]);
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const [projectsRes, tasksRes, journalsRes] = await Promise.all([
          fetch(`${API_URL}/projects/${currentUser.uid}`),
          fetch(`${API_URL}/tasks/${currentUser.uid}`),
          fetch(`${API_URL}/journals/${currentUser.uid}`)
        ]);

        const [projectsData, tasksData, journalsData] = await Promise.all([
          projectsRes.json(),
          tasksRes.json(),
          journalsRes.json()
        ]);

        setProjects(projectsData);
        setTasks(tasksData);
        setJournals(journalsData);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser]);

  // Generate notifications based on approaching deadlines
  useEffect(() => {
    if (tasks.length === 0) return;

    const now = new Date();
    const notifications: Notification[] = [];

    tasks.forEach(task => {
      if (!task.dueDate || task.completed) return;
      
      const dueDate = new Date(task.dueDate);
      const timeDiff = dueDate.getTime() - now.getTime();
      const daysDiff = timeDiff / (1000 * 3600 * 24);

      if (daysDiff < 0) {
        notifications.push({
          id: uuidv4(),
          title: 'Overdue Task',
          message: `Task "${task.title}" is overdue!`,
          type: 'error',
          relatedId: task.id
        });
      } else if (daysDiff <= 1) {
        notifications.push({
          id: uuidv4(),
          title: 'Due Soon',
          message: `Task "${task.title}" is due within 24 hours!`,
          type: 'warning',
          relatedId: task.id
        });
      } else if (daysDiff <= 3) {
        notifications.push({
          id: uuidv4(),
          title: 'Upcoming',
          message: `Task "${task.title}" is due in ${Math.ceil(daysDiff)} days`,
          type: 'info',
          relatedId: task.id
        });
      }
    });

    setNotifications(notifications);
  }, [tasks]);

  const addProject = async (project: Omit<Project, 'id'>) => {
    if (!currentUser) return;
    try {
      const response = await fetch(`${API_URL}/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...project, userId: currentUser.uid })
      });
      const newProject = await response.json();
      setProjects([...projects, newProject]);
    } catch (error) {
      console.error('Error adding project:', error);
      throw error;
    }
  };

  const updateProject = async (id: string, data: Partial<Project>) => {
    try {
      const response = await fetch(`${API_URL}/projects/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const updatedProject = await response.json();
      setProjects(projects.map(p => p.id === id ? updatedProject : p));
    } catch (error) {
      console.error('Error updating project:', error);
      throw error;
    }
  };

  const deleteProject = async (id: string) => {
    try {
      await fetch(`${API_URL}/projects/${id}`, { method: 'DELETE' });
      setProjects(projects.filter(p => p.id !== id));
    } catch (error) {
      console.error('Error deleting project:', error);
      throw error;
    }
  };

  const addTask = async (task: Omit<Task, 'id'>) => {
    if (!currentUser) return;
    try {
      const response = await fetch(`${API_URL}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...task, userId: currentUser.uid })
      });
      const newTask = await response.json();
      setTasks([...tasks, newTask]);
    } catch (error) {
      console.error('Error adding task:', error);
      throw error;
    }
  };

  const updateTask = async (id: string, data: Partial<Task>) => {
    try {
      const response = await fetch(`${API_URL}/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const updatedTask = await response.json();
      setTasks(tasks.map(t => t.id === id ? updatedTask : t));
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await fetch(`${API_URL}/tasks/${id}`, { method: 'DELETE' });
      setTasks(tasks.filter(t => t.id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  };

  const addJournal = async (journal: Omit<Journal, 'id'>) => {
    if (!currentUser) return;
    try {
      const response = await fetch(`${API_URL}/journals`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...journal, userId: currentUser.uid })
      });
      const newJournal = await response.json();
      setJournals([...journals, newJournal]);
    } catch (error) {
      console.error('Error adding journal:', error);
      throw error;
    }
  };

  const updateJournal = async (id: string, data: Partial<Journal>) => {
    try {
      const response = await fetch(`${API_URL}/journals/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const updatedJournal = await response.json();
      setJournals(journals.map(j => j.id === id ? updatedJournal : j));
    } catch (error) {
      console.error('Error updating journal:', error);
      throw error;
    }
  };

  const deleteJournal = async (id: string) => {
    try {
      await fetch(`${API_URL}/journals/${id}`, { method: 'DELETE' });
      setJournals(journals.filter(j => j.id !== id));
    } catch (error) {
      console.error('Error deleting journal:', error);
      throw error;
    }
  };

  const value = {
    projects,
    tasks,
    journals,
    notifications,
    addProject,
    updateProject,
    deleteProject,
    addTask,
    updateTask,
    deleteTask,
    addJournal,
    updateJournal,
    deleteJournal,
    loading
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};