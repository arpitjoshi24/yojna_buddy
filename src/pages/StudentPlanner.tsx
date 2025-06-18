import React, { useState, useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import { format, parseISO, isToday, isThisWeek, isFuture, isPast } from 'date-fns';
import {
  Plus,
  BookOpen,
  Clock,
  Calendar,
  CheckCircle,
  Edit,
  Trash,
  X,
  ChevronDown,
  Filter,
  BookMarked,
} from 'lucide-react';
import { Task } from '../types';
import { toast } from 'sonner';

const StudentPlanner = () => {
  const { tasks, addTask, updateTask, deleteTask, loading } = useData();
  const [showAddModal, setShowAddModal] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [timeFilter, setTimeFilter] = useState<'all' | 'today' | 'week' | 'upcoming' | 'past'>('all');
  const [showFilters, setShowFilters] = useState(false);

  // Only show tasks with category 'school'
  const studentTasks = tasks.filter(task => task.category === 'school');

  // Apply time filter
  const filteredTasks = useMemo(() => {
    return studentTasks.filter(task => {
      if (!task.dueDate) return timeFilter === 'all';
      const dueDate = parseISO(task.dueDate);
      
      switch (timeFilter) {
        case 'today':
          return isToday(dueDate);
        case 'week':
          return isThisWeek(dueDate, { weekStartsOn: 1 });
        case 'upcoming':
          return isFuture(dueDate);
        case 'past':
          return isPast(dueDate);
        case 'all':
        default:
          return true;
      }
    });
  }, [studentTasks, timeFilter]);

  const handleTaskComplete = async (id: string, completed: boolean) => {
    try {
      await updateTask(id, { completed });
      toast.success(`Task marked as ${completed ? 'completed' : 'incomplete'}`);
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Failed to update task');
    }
  };

  const groupedTasks = useMemo(() => {
    const grouped: Record<string, Task[]> = {
      'Overdue': [],
      'Today': [],
      'Tomorrow': [],
      'This Week': [],
      'Upcoming': [],
      'Completed': []
    };

    filteredTasks.forEach(task => {
      if (task.completed) {
        grouped['Completed'].push(task);
        return;
      }

      if (!task.dueDate) {
        grouped['Upcoming'].push(task);
        return;
      }

      const dueDate = parseISO(task.dueDate);
      const now = new Date();
      
      if (isPast(dueDate) && !isToday(dueDate)) {
        grouped['Overdue'].push(task);
      } else if (isToday(dueDate)) {
        grouped['Today'].push(task);
      } else if (
        dueDate.getDate() === now.getDate() + 1 &&
        dueDate.getMonth() === now.getMonth() &&
        dueDate.getFullYear() === now.getFullYear()
      ) {
        grouped['Tomorrow'].push(task);
      } else if (isThisWeek(dueDate, { weekStartsOn: 1 })) {
        grouped['This Week'].push(task);
      } else {
        grouped['Upcoming'].push(task);
      }
    });

    // Sort tasks by priority within each group
    Object.keys(grouped).forEach(key => {
      grouped[key].sort((a, b) => {
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      });
    });

    return grouped;
  }, [filteredTasks]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="pb-16 md:pb-0">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-1">Student Planner</h1>
          <p className="text-gray-600">Track your assignments, classes and study sessions</p>
        </div>
        <div className="mt-4 md:mt-0 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
          <button
            className="flex items-center px-4 py-2 text-sm font-medium rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={16} className="mr-2" />
            Filters {timeFilter !== 'all' && '(Active)'}
          </button>
          <button
            className="flex items-center px-4 py-2 text-sm font-medium rounded-md bg-emerald-600 text-white hover:bg-emerald-700"
            onClick={() => {
              setTaskToEdit(null);
              setShowAddModal(true);
            }}
          >
            <Plus size={16} className="mr-2" />
            Add Assignment
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium text-gray-700">Filter Assignments</h3>
            <button 
              className="text-gray-400 hover:text-gray-600"
              onClick={() => setShowFilters(false)}
            >
              <X size={18} />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                timeFilter === 'all' 
                  ? 'bg-emerald-100 text-emerald-800' 
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
              onClick={() => setTimeFilter('all')}
            >
              All
            </button>
            <button
              className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                timeFilter === 'today' 
                  ? 'bg-emerald-100 text-emerald-800' 
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
              onClick={() => setTimeFilter('today')}
            >
              Today
            </button>
            <button
              className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                timeFilter === 'week' 
                  ? 'bg-emerald-100 text-emerald-800' 
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
              onClick={() => setTimeFilter('week')}
            >
              This Week
            </button>
            <button
              className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                timeFilter === 'upcoming' 
                  ? 'bg-emerald-100 text-emerald-800' 
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
              onClick={() => setTimeFilter('upcoming')}
            >
              Upcoming
            </button>
            <button
              className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                timeFilter === 'past' 
                  ? 'bg-emerald-100 text-emerald-800' 
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
              onClick={() => setTimeFilter('past')}
            >
              Past
            </button>
          </div>
        </div>
      )}

      {filteredTasks.length > 0 ? (
        <div className="space-y-6">
          {Object.entries(groupedTasks).map(([group, tasks]) => {
            if (tasks.length === 0) return null;
            
            return (
              <TaskGroup
                key={group}
                title={group}
                tasks={tasks}
                onComplete={handleTaskComplete}
                onEdit={task => {
                  setTaskToEdit(task);
                  setShowAddModal(true);
                }}
                onDelete={async (id) => {
                  if (window.confirm('Are you sure you want to delete this task?')) {
                    try {
                      await deleteTask(id);
                      toast.success('Task deleted successfully');
                    } catch (error) {
                      console.error('Error deleting task:', error);
                      toast.error('Failed to delete task');
                    }
                  }
                }}
              />
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <BookOpen size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">No assignments found</h3>
          <p className="text-gray-500 mb-4">
            {studentTasks.length === 0
              ? "You haven't created any assignments yet."
              : "No assignments match your filter criteria."
            }
          </p>
          {studentTasks.length === 0 && (
            <button 
              className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md bg-emerald-600 text-white hover:bg-emerald-700"
              onClick={() => setShowAddModal(true)}
            >
              <Plus size={16} className="mr-2" />
              Create your first assignment
            </button>
          )}
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
                toast.success('Assignment updated successfully');
              } else {
                await addTask({
                  ...taskData,
                  category: 'school',
                  completed: false
                } as Omit<Task, 'id'>);
                toast.success('Assignment created successfully');
              }
              setShowAddModal(false);
              setTaskToEdit(null);
            } catch (error) {
              console.error('Error saving task:', error);
              toast.error('Failed to save assignment');
            }
          }}
        />
      )}
    </div>
  );
};

interface TaskGroupProps {
  title: string;
  tasks: Task[];
  onComplete: (id: string, completed: boolean) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

const TaskGroup: React.FC<TaskGroupProps> = ({ title, tasks, onComplete, onEdit, onDelete }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <button 
        className="w-full flex items-center justify-between p-4 text-left bg-gray-50 hover:bg-gray-100"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <div className="flex items-center">
          {title === 'Overdue' && <Clock className="mr-2 text-red-500" size={18} />}
          {title === 'Today' && <Calendar className="mr-2 text-blue-500" size={18} />}
          {title === 'Tomorrow' && <Calendar className="mr-2 text-emerald-500" size={18} />}
          {title === 'This Week' && <Calendar className="mr-2 text-purple-500" size={18} />}
          {title === 'Upcoming' && <Clock className="mr-2 text-gray-500" size={18} />}
          {title === 'Completed' && <CheckCircle className="mr-2 text-green-500" size={18} />}
          <h3 className="font-medium text-gray-900">{title} <span className="text-gray-500 ml-1">({tasks.length})</span></h3>
        </div>
        <ChevronDown 
          size={18} 
          className={`text-gray-500 transform transition-transform ${isCollapsed ? 'rotate-180' : ''}`} 
        />
      </button>
      
      {!isCollapsed && (
        <ul>
          {tasks.map(task => (
            <li 
              key={task.id}
              className={`border-t border-gray-100 transition-colors ${
                task.completed ? 'bg-gray-50' : ''
              }`}
            >
              <div className="flex items-start p-4">
                <div className="flex-shrink-0 pt-0.5">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => onComplete(task.id, !task.completed)}
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
                    <div className="flex items-center ml-2">
                      {task.priority === 'high' && (
                        <span className="flex-shrink-0 w-2 h-2 rounded-full bg-red-500 mr-2" title="High priority" />
                      )}
                      {task.priority === 'medium' && (
                        <span className="flex-shrink-0 w-2 h-2 rounded-full bg-amber-500 mr-2" title="Medium priority" />
                      )}
                      <div className="flex">
                        <button
                          className="text-gray-400 hover:text-gray-600 mr-2"
                          onClick={() => onEdit(task)}
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          className="text-gray-400 hover:text-red-600"
                          onClick={() => onDelete(task.id)}
                        >
                          <Trash size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {task.description && (
                    <p className={`text-sm ${
                      task.completed ? 'text-gray-400' : 'text-gray-600'
                    } mt-1`}>
                      {task.description}
                    </p>
                  )}
                  
                  {task.dueDate && (
                    <div className="flex items-center mt-2 text-xs text-gray-500">
                      <Calendar size={14} className="mr-1" />
                      <span>Due: {format(parseISO(task.dueDate), 'MMM d, yyyy')}</span>
                    </div>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
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
      category: 'school',
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
            <BookMarked size={18} className="mr-2 text-emerald-600" />
            {task ? 'Edit Assignment' : 'Add New Assignment'}
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
              Assignment Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              required
              placeholder="Math homework, Essay draft, etc."
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
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
              placeholder="Additional details about this assignment..."
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="dueDate">
              Due Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="dueDate"
              required
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
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
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 border border-transparent rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {task ? 'Update Assignment' : 'Add Assignment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentPlanner;