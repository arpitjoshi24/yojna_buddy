import React from 'react';
import { useData } from '../contexts/DataContext';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { 
  CalendarDays, 
  CheckSquare, 
  FileText, 
  FolderKanban, 
  BookOpen, 
  Clock,
  AlertTriangle
} from 'lucide-react';

const Dashboard = () => {
  const { projects, tasks, journals, loading } = useData();
  const navigate = useNavigate();

  // Filter upcoming tasks (due within the next 7 days)
  const today = new Date();
  const nextWeek = new Date();
  nextWeek.setDate(today.getDate() + 7);

  const upcomingTasks = tasks
    .filter(task => {
      if (!task.dueDate || task.completed) return false;
      const dueDate = new Date(task.dueDate);
      return dueDate >= today && dueDate <= nextWeek;
    })
    .sort((a, b) => {
      return new Date(a.dueDate as string).getTime() - new Date(b.dueDate as string).getTime();
    });

  // Filter overdue tasks
  const overdueTasks = tasks
    .filter(task => {
      if (!task.dueDate || task.completed) return false;
      const dueDate = new Date(task.dueDate);
      return dueDate < today;
    })
    .sort((a, b) => {
      return new Date(b.dueDate as string).getTime() - new Date(a.dueDate as string).getTime();
    });

  // Get in-progress projects
  const inProgressProjects = projects
    .filter(project => project.status === 'in-progress')
    .sort((a, b) => {
      if (!a.dueDate || !b.dueDate) return 0;
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });

  // Recent journals
  const recentJournals = [...journals]
    .sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    })
    .slice(0, 3);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="pb-16 md:pb-0">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Welcome to Your Dashboard</h1>
        <p className="text-gray-600">
          Today is {format(new Date(), 'EEEE, MMMM do, yyyy')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <DashboardCard
          title="Projects"
          count={projects.length}
          icon={<FolderKanban size={24} className="text-indigo-600" />}
          onClick={() => navigate('/projects')}
          color="bg-indigo-50 hover:bg-indigo-100"
        />
        <DashboardCard
          title="Student Tasks"
          count={tasks.filter(t => t.category === 'school').length}
          icon={<BookOpen size={24} className="text-emerald-600" />}
          onClick={() => navigate('/student')}
          color="bg-emerald-50 hover:bg-emerald-100"
        />
        <DashboardCard
          title="To-Do Items"
          count={tasks.filter(t => !t.completed).length}
          icon={<CheckSquare size={24} className="text-blue-600" />}
          onClick={() => navigate('/todos')}
          color="bg-blue-50 hover:bg-blue-100"
        />
        <DashboardCard
          title="Journal Entries"
          count={journals.length}
          icon={<FileText size={24} className="text-purple-600" />}
          onClick={() => navigate('/journal')}
          color="bg-purple-50 hover:bg-purple-100"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Tasks */}
        <div className="bg-white rounded-lg shadow p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center">
              <Clock size={18} className="mr-2 text-blue-600" />
              Upcoming Tasks
            </h2>
            <button 
              onClick={() => navigate('/todos')}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              View all
            </button>
          </div>
          
          {upcomingTasks.length > 0 ? (
            <div className="space-y-3">
              {upcomingTasks.slice(0, 5).map(task => (
                <div key={task.id} className="flex items-center p-3 bg-gray-50 rounded-md hover:bg-blue-50 transition-colors">
                  <div className="mr-3">
                    <CheckSquare 
                      size={18} 
                      className={`${
                        task.priority === 'high' 
                          ? 'text-red-500' 
                          : task.priority === 'medium' 
                            ? 'text-amber-500' 
                            : 'text-green-500'
                      }`} 
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{task.title}</p>
                    <div className="flex items-center mt-1 text-sm text-gray-500">
                      <CalendarDays size={14} className="mr-1" />
                      {format(new Date(task.dueDate || ''), 'MMM d, yyyy')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No upcoming tasks</p>
              <p className="text-sm mt-1">Enjoy your free time!</p>
            </div>
          )}
        </div>

        {/* Overdue Tasks */}
        <div className="bg-white rounded-lg shadow p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center">
              <AlertTriangle size={18} className="mr-2 text-red-500" />
              Overdue Tasks
            </h2>
            <button 
              onClick={() => navigate('/todos')}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              View all
            </button>
          </div>
          
          {overdueTasks.length > 0 ? (
            <div className="space-y-3">
              {overdueTasks.slice(0, 5).map(task => (
                <div key={task.id} className="flex items-center p-3 bg-red-50 rounded-md hover:bg-red-100 transition-colors">
                  <div className="mr-3">
                    <AlertTriangle size={18} className="text-red-500" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{task.title}</p>
                    <div className="flex items-center mt-1 text-sm text-gray-500">
                      <CalendarDays size={14} className="mr-1" />
                      {format(new Date(task.dueDate || ''), 'MMM d, yyyy')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No overdue tasks</p>
              <p className="text-sm mt-1">You're all caught up!</p>
            </div>
          )}
        </div>

        {/* Recent Journal Entries */}
        <div className="bg-white rounded-lg shadow p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center">
              <FileText size={18} className="mr-2 text-purple-600" />
              Recent Journal Entries
            </h2>
            <button 
              onClick={() => navigate('/journal')}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              View all
            </button>
          </div>
          
          {recentJournals.length > 0 ? (
            <div className="space-y-3">
              {recentJournals.map(journal => (
                <div key={journal.id} className="p-3 bg-purple-50 rounded-md hover:bg-purple-100 transition-colors">
                  <p className="font-medium text-gray-800">{journal.title}</p>
                  <div className="flex items-center mt-1 text-sm text-gray-500">
                    <CalendarDays size={14} className="mr-1" />
                    {format(new Date(journal.date), 'MMM d, yyyy')}
                  </div>
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                    {journal.content}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No journal entries yet</p>
              <p className="text-sm mt-1">Start journaling today!</p>
            </div>
          )}
        </div>
      </div>

      {/* Active Projects */}
      <div className="mt-8 bg-white rounded-lg shadow p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center">
            <FolderKanban size={18} className="mr-2 text-indigo-600" />
            Active Projects
          </h2>
          <button 
            onClick={() => navigate('/projects')}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            View all
          </button>
        </div>

        {inProgressProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {inProgressProjects.slice(0, 3).map(project => (
              <div key={project.id} className="border border-gray-200 rounded-lg p-4 hover:border-indigo-300 hover:shadow-md transition-all">
                <h3 className="font-semibold text-gray-800">{project.title}</h3>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">{project.description}</p>
                <div className="flex justify-between mt-3 text-sm">
                  <span className={`px-2 py-1 rounded-full ${
                    project.priority === 'high' 
                      ? 'bg-red-100 text-red-800' 
                      : project.priority === 'medium' 
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-green-100 text-green-800'
                  }`}>
                    {project.priority.charAt(0).toUpperCase() + project.priority.slice(1)}
                  </span>
                  {project.dueDate && (
                    <span className="text-gray-500">
                      Due: {format(new Date(project.dueDate), 'MMM d')}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No active projects</p>
            <p className="text-sm mt-1">Start a new project to see it here!</p>
          </div>
        )}
      </div>
    </div>
  );
};

interface DashboardCardProps {
  title: string;
  count: number;
  icon: React.ReactNode;
  onClick: () => void;
  color: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ 
  title, 
  count, 
  icon, 
  onClick,
  color
}) => {
  return (
    <div 
      className={`${color} p-5 rounded-lg shadow cursor-pointer transition-transform hover:scale-102`}
      onClick={onClick}
    >
      <div className="flex justify-between">
        <div>
          <p className="text-gray-600 font-medium">{title}</p>
          <p className="text-3xl font-bold mt-2">{count}</p>
        </div>
        <div>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;