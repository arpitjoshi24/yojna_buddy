import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { format } from 'date-fns';
import { 
  Plus, 
  FolderKanban, 
  MoreHorizontal, 
  Edit, 
  Trash, 
  Clock,
  CheckCircle,
  Pause,
  PlayCircle,
  Calendar,
  
  X,
  Filter
} from 'lucide-react';
import { Project } from '../types';
import { toast } from 'sonner';

const ProjectPlanner = () => {
  const { projects, addProject, updateProject, deleteProject, loading } = useData();
  const [showAddModal, setShowAddModal] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState<Project | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  const filteredProjects = projects.filter(project => {
    const matchesStatus = filterStatus === 'all' || project.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || project.priority === filterPriority;
    return matchesStatus && matchesPriority;
  });

  const handleEditProject = (project: Project) => {
    setProjectToEdit(project);
    setShowAddModal(true);
  };

  const handleRemoveProject = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await deleteProject(id);
        toast.success('Project deleted successfully');
      } catch (error) {
        console.error('Error deleting project:', error);
        toast.error('Failed to delete project');
      }
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: Project['status']) => {
    try {
      await updateProject(id, { status: newStatus });
      toast.success(`Project status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating project status:', error);
      toast.error('Failed to update project status');
    }
  };

  const getStatusIcon = (status: Project['status']) => {
    switch (status) {
      case 'planning':
        return <Clock size={16} className="text-blue-500" />;
      case 'in-progress':
        return <PlayCircle size={16} className="text-amber-500" />;
      case 'completed':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'on-hold':
        return <Pause size={16} className="text-gray-500" />;
      default:
        return <Clock size={16} className="text-blue-500" />;
    }
  };

  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'planning':
        return 'bg-blue-100 text-blue-800';
      case 'in-progress':
        return 'bg-amber-100 text-amber-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'on-hold':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const getPriorityColor = (priority: Project['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-amber-100 text-amber-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
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
          <h1 className="text-2xl font-bold text-gray-800 mb-1">Project Planner</h1>
          <p className="text-gray-600">Plan and track your projects</p>
        </div>
        <div className="mt-4 md:mt-0 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
          <button
            className="flex items-center px-4 py-2 text-sm font-medium rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={16} className="mr-2" />
            Filters {(filterStatus !== 'all' || filterPriority !== 'all') && '(Active)'}
          </button>
          <button
            className="flex items-center px-4 py-2 text-sm font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700"
            onClick={() => {
              setProjectToEdit(null);
              setShowAddModal(true);
            }}
          >
            <Plus size={16} className="mr-2" />
            Add Project
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium text-gray-700">Filter Projects</h3>
            <button 
              className="text-gray-400 hover:text-gray-600"
              onClick={() => setShowFilters(false)}
            >
              <X size={18} />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="all">All Statuses</option>
                <option value="planning">Planning</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="on-hold">On Hold</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <select 
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="all">All Priorities</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map(project => (
            <ProjectCard
              key={project.id}
              project={project}
              onEdit={handleEditProject}
              onDelete={handleRemoveProject}
              onUpdateStatus={handleUpdateStatus}
              getStatusIcon={getStatusIcon}
              getStatusColor={getStatusColor}
              getPriorityColor={getPriorityColor}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <FolderKanban size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">No projects found</h3>
          <p className="text-gray-500 mb-4">
            {projects.length === 0 
              ? "You haven't created any projects yet."
              : "No projects match your filter criteria."
            }
          </p>
          {projects.length === 0 && (
            <button 
              className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700"
              onClick={() => setShowAddModal(true)}
            >
              <Plus size={16} className="mr-2" />
              Create your first project
            </button>
          )}
        </div>
      )}

      {showAddModal && (
        <ProjectModal
          project={projectToEdit}
          onClose={() => {
            setShowAddModal(false);
            setProjectToEdit(null);
          }}
          onSave={async (projectData) => {
            try {
              if (projectToEdit) {
                await updateProject(projectToEdit.id, projectData);
                toast.success('Project updated successfully');
              } else {
                await addProject(projectData as Omit<Project, 'id'>);
                toast.success('Project created successfully');
              }
              setShowAddModal(false);
              setProjectToEdit(null);
            } catch (error) {
              console.error('Error saving project:', error);
              toast.error('Failed to save project');
            }
          }}
        />
      )}
    </div>
  );
};

interface ProjectCardProps {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
  onUpdateStatus: (id: string, status: Project['status']) => void;
  getStatusIcon: (status: Project['status']) => React.ReactNode;
  getStatusColor: (status: Project['status']) => string;
  getPriorityColor: (priority: Project['priority']) => string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onEdit,
  onDelete,
  onUpdateStatus,
  getStatusIcon,
  getStatusColor,
  getPriorityColor
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-5">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">{project.title}</h3>
          <div className="relative">
            <button 
              className="p-1 rounded-full hover:bg-gray-100"
              onClick={() => setShowMenu(!showMenu)}
            >
              <MoreHorizontal size={18} className="text-gray-500" />
            </button>
            
            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                <div className="py-1" role="menu" aria-orientation="vertical">
                  <button
                    className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowMenu(false);
                      onEdit(project);
                    }}
                  >
                    <Edit size={16} className="mr-2" />
                    Edit
                  </button>
                  <button
                    className="flex w-full items-center px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowMenu(false);
                      onDelete(project.id);
                    }}
                  >
                    <Trash size={16} className="mr-2" />
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{project.description}</p>
        
        <div className="flex items-center justify-between mb-3">
          <div className="relative">
            <button 
              className={`inline-flex items-center px-2.5 py-1.5 text-xs font-medium rounded-full ${getStatusColor(project.status)}`}
              onClick={() => setShowStatusMenu(!showStatusMenu)}
            >
              {getStatusIcon(project.status)}
              <span className="ml-1 capitalize">{project.status.replace('-', ' ')}</span>
            </button>
            
            {showStatusMenu && (
              <div className="absolute left-0 mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                <div className="py-1" role="menu" aria-orientation="vertical">
                  <button
                    className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowStatusMenu(false);
                      onUpdateStatus(project.id, 'planning');
                    }}
                  >
                    <Clock size={16} className="mr-2 text-blue-500" />
                    Planning
                  </button>
                  <button
                    className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowStatusMenu(false);
                      onUpdateStatus(project.id, 'in-progress');
                    }}
                  >
                    <PlayCircle size={16} className="mr-2 text-amber-500" />
                    In Progress
                  </button>
                  <button
                    className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowStatusMenu(false);
                      onUpdateStatus(project.id, 'completed');
                    }}
                  >
                    <CheckCircle size={16} className="mr-2 text-green-500" />
                    Completed
                  </button>
                  <button
                    className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowStatusMenu(false);
                      onUpdateStatus(project.id, 'on-hold');
                    }}
                  >
                    <Pause size={16} className="mr-2 text-gray-500" />
                    On Hold
                  </button>
                </div>
              </div>
            )}
          </div>
          
          <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${getPriorityColor(project.priority)}`}>
            {project.priority.charAt(0).toUpperCase() + project.priority.slice(1)}
          </span>
        </div>
        
        {project.dueDate && (
          <div className="flex items-center text-sm text-gray-600">
            <Calendar size={16} className="mr-2" />
            <span>
              Due: {format(new Date(project.dueDate), 'MMM d, yyyy')}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
  onSave: (project: Partial<Project>) => void;
}

const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose, onSave }) => {
  const [title, setTitle] = useState(project?.title || '');
  const [description, setDescription] = useState(project?.description || '');
  const [dueDate, setDueDate] = useState(project?.dueDate ? project.dueDate.split('T')[0] : '');
  const [status, setStatus] = useState<Project['status']>(project?.status || 'planning');
  const [priority, setPriority] = useState<Project['priority']>(project?.priority || 'medium');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const projectData: Partial<Project> = {
      title,
      description,
      status,
      priority,
    };

    if (dueDate) {
      projectData.dueDate = new Date(dueDate).toISOString();
    }

    onSave(projectData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b border-gray-200 px-6 py-4">
          <h3 className="text-lg font-medium text-gray-900">
            {project ? 'Edit Project' : 'Create New Project'}
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
              Project Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              required
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="description">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              required
              rows={3}
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
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="status">
              Status
            </label>
            <select
              id="status"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={status}
              onChange={(e) => setStatus(e.target.value as Project['status'])}
            >
              <option value="planning">Planning</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="on-hold">On Hold</option>
            </select>
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
              {project ? 'Update Project' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectPlanner;