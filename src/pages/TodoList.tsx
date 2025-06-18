import React, { useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import { Task } from '../types';
import { 
  CheckSquare, 
  Plus, 
  Search, 
  Trash, 
  Edit, 
  XCircle,
  Calendar,
  Filter,
  X
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

const TodoList = () => {
  const { tasks, addTask, updateTask, deleteTask, loading } = useData();
  const [personalTasks, setPersonalTasks] = useState<Task[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCompleted, setShowCompleted] = useState(true);
  const [filterPriority, setFilterPriority] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [showFilters, setShowFilters] = useState(false);

  // Filter to only include personal tasks (not school or project related)
  useEffect(() => {
    const filtered = tasks.filter(task => task.category === 'personal' || task.category === 'other');
    
    // Apply search filter
    let result = filtered;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(task => 
        task.title.toLowerCase().includes(term) || 
        (task.description && task.description.toLowerCase().includes(term))
      );
    }
    
    // Apply completed filter
    if (!showCompleted) {
      result = result.filter(task => !task.completed);
    }
    
    // Apply priority filter
    if (filterPriority !== 'all') {
      result = result.filter(task => task.priority === filterPriority);
    }
    
    // Sort by completion status, then by due date, then by priority
    result.sort((a, b) => {
      // First sort by completion status
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }
      
      // Then by due date
      if (a.dueDate && b.dueDate) {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      } else if (a.dueDate) {
        return -1;
      } else if (b.dueDate) {
        return 1;
      }
      
      // Then by priority
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
    
    setPersonalTasks(result);
  }, [tasks, searchTerm, showCompleted, filterPriority]);

  const handleMarkComplete = async (id: string, completed: boolean) => {
    try {
      await updateTask(id, { completed });
      toast.success(`Task marked as ${completed ? 'completed' : 'incomplete'}`);
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Failed to update task');
    }
  };

  const handleDeleteTask = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(id);
        toast.success('Task deleted successfully');
      } catch (error) {
        console.error('Error deleting task:', error);
        toast.error('Failed to delete task');
      }
    }
  };

  const handleEditTask = (task: Task) => {
    setTaskToEdit(task);
    setShowAddModal(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="pb-16 md:pb-0">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-1">To-Do List</h1>
          <p className="text-gray-600">Manage your daily tasks and reminders</p>
        </div>
        <div className="mt-4 md:mt-0 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
          <button
            className="flex items-center px-4 py-2 text-sm font-medium rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={16} className="mr-2" />
            Filters {(filterPriority !== 'all' || !showCompleted) && '(Active)'}
          </button>
          <button
            className="flex items-center px-4 py-2 text-sm font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700"
            onClick={() => {
              setTaskToEdit(null);
              setShowAddModal(true);
            }}
          >
            <Plus size={16} className="mr-2" />
            Add Task
          </button>
        </div>
      </div>

      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={18} className="text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search tasks..."
          className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <button
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={() => setSearchTerm('')}
          >
            <XCircle size={16} className="text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </div>

      {showFilters && (
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium text-gray-700">Filter Tasks</h3>
            <button 
              className="text-gray-400 hover:text-gray-600"
              onClick={() => setShowFilters(false)}
            >
              <X size={18} />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Show Completed Tasks</label>
              <div className="relative inline-block w-10 mr-2 align-middle select-none">
                <input 
                  type="checkbox" 
                  checked={showCompleted}
                  onChange={() => setShowCompleted(!showCompleted)}
                  className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                />
                <label 
                  className={`toggle-label block overflow-hidden h-6 rounded-full ${showCompleted ? 'bg-blue-500' : 'bg-gray-300'} cursor-pointer`}
                ></label>
              </div>
              <span className="text-gray-700 text-sm">
                {showCompleted ? 'Showing all tasks' : 'Hiding completed tasks'}
              </span>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <select 
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value as 'all' | 'high' | 'medium' | 'low')}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="all">All Priorities</option>
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {personalTasks.length > 0 ? (
        <div className="bg-white rounded-lg shadow">
          <ul className="divide-y divide-gray-200">
            {personalTasks.map(task => (
              <li 
                key={task.id} 
                className={`p-4 hover:bg-gray-50 transition-colors ${task.completed ? 'bg-gray-50' : ''}`}
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0 pt-0.5">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => handleMarkComplete(task.id, !task.completed)}
                      className={`h-5 w-5 rounded border-gray-300 text-${
                        task.priority === 'high' 
                          ? 'red' 
                          : task.priority === 'medium' 
                            ? 'amber' 
                            : 'green'
                      }-600 focus:ring-0`}
                    />
                  </div>
                  <div className="ml-3 flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className={`text-sm font-medium ${
                        task.completed ? 'text-gray-500 line-through' : 'text-gray-900'
                      }`}>
                        {task.title}
                      </p>
                      <div className="flex items-center ml-4">
                        <button
                          className="text-gray-400 hover:text-gray-600 mr-2"
                          onClick={() => handleEditTask(task)}
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          className="text-gray-400 hover:text-red-600"
                          onClick={() => handleDeleteTask(task.id)}
                        >
                          <Trash size={16} />
                        </button>
                      </div>
                    </div>
                    
                    {task.description && (
                      <p className={`text-sm ${
                        task.completed ? 'text-gray-400' : 'text-gray-600'
                      } mt-1`}>
                        {task.description}
                      </p>
                    )}
                    
                    <div className="mt-2 flex items-center text-xs text-gray-500">
                      {task.dueDate && (
                        <div className="flex items-center">
                          <Calendar size={14} className="mr-1" />
                          <span>
                            Due: {format(new Date(task.dueDate), 'MMM d, yyyy')}
                          </span>
                        </div>
                      )}
                      
                      <span className={`ml-4 px-2 py-0.5 rounded-full text-xs ${
                        task.priority === 'high' 
                          ? 'bg-red-100 text-red-800' 
                          : task.priority === 'medium' 
                            ? 'bg-amber-100 text-amber-800' 
                            : 'bg-green-100 text-green-800'
                      }`}>
                        {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <CheckSquare size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">No tasks found</h3>
          <p className="text-gray-500 mb-4">
            {tasks.some(t => t.category === 'personal' || t.category === 'other')
              ? "No tasks match your search or filter criteria."
              : "You haven't created any tasks yet."
            }
          </p>
          <button 
            className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700"
            onClick={() => setShowAddModal(true)}
          >
            <Plus size={16} className="mr-2" />
            Add a new task
          </button>
        </div>
      )}

      {showAddModal && (
        <TaskModal
          task={taskToEdit}
          onClose={() => {
            setShowAddModal(false);
            setTaskToEdit(null);
          }}
          onSave={async (taskData) => {
            try {
              if (taskToEdit) {
                await updateTask(taskToEdit.id, taskData);
                toast.success('Task updated successfully');
              } else {
                await addTask({
                  ...taskData,
                  category: 'personal',
                  completed: false
                } as Omit<Task, 'id'>);
                toast.success('Task created successfully');
              }
              setShowAddModal(false);
              setTaskToEdit(null);
            } catch (error) {
              console.error('Error saving task:', error);
              toast.error('Failed to save task');
            }
          }}
        />
      )}

      <style jsx>{`
        .toggle-checkbox:checked {
          transform: translateX(1rem);
          border-color: white;
        }
        .toggle-label {
          transition: background-color 0.2s ease;
        }
      `}</style>
    </div>
  );
};

interface TaskModalProps {
  task: Task | null;
  onClose: () => void;
  onSave: (task: Partial<Task>) => void;
}

const TaskModal: React.FC<TaskModalProps> = ({ task, onClose, onSave }) => {
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [dueDate, setDueDate] = useState(task?.dueDate ? task.dueDate.split('T')[0] : '');
  const [priority, setPriority] = useState<Task['priority']>(task?.priority || 'medium');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const taskData: Partial<Task> = {
      title,
      description,
      priority,
    };

    if (dueDate) {
      taskData.dueDate = new Date(dueDate).toISOString();
    }

    onSave(taskData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b border-gray-200 px-6 py-4">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <CheckSquare size={18} className="mr-2 text-blue-600" />
            {task ? 'Edit Task' : 'Add New Task'}
          </h3>
          <button
            className="text-gray-400 hover:text-gray-500"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="px-6 py-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="title">
              Task Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              required
              placeholder="What needs to be done?"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="description">
              Details
            </label>
            <textarea
              id="description"
              rows={3}
              placeholder="Add more details about this task..."
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="dueDate">
              Due Date
            </label>
            <input
              type="date"
              id="dueDate"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Priority
            </label>
            <div className="flex space-x-4">
              <label className="inline-flex items-center">
                <input 
                  type="radio" 
                  name="priority" 
                  value="low" 
                  checked={priority === 'low'}
                  onChange={() => setPriority('low')}
                  className="h-4 w-4 text-green-600 focus:ring-green-500"
                />
                <span className="ml-2 text-sm text-gray-700">Low</span>
              </label>
              
              <label className="inline-flex items-center">
                <input 
                  type="radio" 
                  name="priority" 
                  value="medium"
                  checked={priority === 'medium'} 
                  onChange={() => setPriority('medium')}
                  className="h-4 w-4 text-amber-600 focus:ring-amber-500" 
                />
                <span className="ml-2 text-sm text-gray-700">Medium</span>
              </label>
              
              <label className="inline-flex items-center">
                <input 
                  type="radio" 
                  name="priority" 
                  value="high"
                  checked={priority === 'high'}
                  onChange={() => setPriority('high')} 
                  className="h-4 w-4 text-red-600 focus:ring-red-500"
                />
                <span className="ml-2 text-sm text-gray-700">High</span>
              </label>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {task ? 'Update Task' : 'Add Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TodoList;