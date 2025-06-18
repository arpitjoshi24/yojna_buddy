import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  LayoutDashboard, 
  BookOpen, 
  CheckSquare, 
  FileText, 
  FolderKanban,
  Bell,
  LogOut,
  Menu,
  X,
  Settings
} from 'lucide-react';
import NotificationPanel from './NotificationPanel';

const Layout = () => {
  const { logout, currentUser } = useAuth();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  const navItems = [
    { to: '/', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { to: '/projects', icon: <FolderKanban size={20} />, label: 'Projects' },
    { to: '/student', icon: <BookOpen size={20} />, label: 'Student' },
    { to: '/todos', icon: <CheckSquare size={20} />, label: 'To-Do List' },
    { to: '/journal', icon: <FileText size={20} />, label: 'Journal' },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b border-gray-200 p-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <LayoutDashboard className="text-blue-600" size={24} />
          <span className="text-xl font-semibold">YojnaBuddy</span>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-full hover:bg-gray-100"
          >
            <Bell size={20} />
          </button>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white absolute top-16 left-0 right-0 z-50 border-b border-gray-200">
          <nav className="flex flex-col p-4">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center space-x-2 p-3 rounded-lg ${
                    isActive
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`
                }
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            ))}
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 p-3 mt-4 text-red-600 hover:bg-red-50 rounded-lg"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </nav>
        </div>
      )}

      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex md:flex-col md:w-64 bg-white border-r border-gray-200">
        <div className="p-6 flex items-center space-x-2">
          <LayoutDashboard className="text-blue-600" size={24} />
          <span className="text-xl font-semibold">YojnaBuddy</span>
        </div>
        <nav className="flex-1 overflow-y-auto p-4">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center space-x-3 p-3 mb-2 rounded-lg ${
                  isActive
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`
              }
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center">
                {currentUser?.email?.[0].toUpperCase() || 'U'}
              </div>
              <div className="text-sm">
                <p className="font-medium">{currentUser?.email}</p>
              </div>
            </div>
            <button 
              className="text-gray-500 hover:text-gray-700"
              aria-label="Settings"
            >
              <Settings size={18} />
            </button>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 w-full p-2 text-red-600 hover:bg-red-50 rounded-lg"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 overflow-x-hidden">
        {/* Desktop Header */}
        <header className="hidden md:flex h-16 bg-white border-b border-gray-200 items-center px-6 justify-between">
          <h1 className="text-xl font-semibold text-gray-800">
            {location.pathname === '/' && 'Dashboard'}
            {location.pathname === '/projects' && 'Project Planner'}
            {location.pathname === '/student' && 'Student Planner'}
            {location.pathname === '/todos' && 'To-Do List'}
            {location.pathname === '/journal' && 'Journal'}
          </h1>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-full hover:bg-gray-100"
              aria-label="Notifications"
            >
              <Bell size={20} />
            </button>
          </div>
        </header>

        {/* Notification Panel */}
        {showNotifications && (
          <div className="absolute right-4 top-16 z-50">
            <NotificationPanel onClose={() => setShowNotifications(false)} />
          </div>
        )}

        {/* Page Content */}
        <main className="p-4 md:p-6">
          <Outlet />
        </main>

        {/* Mobile Footer Navigation */}
        <footer className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
          <nav className="flex justify-between px-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex flex-col items-center py-3 px-2 ${
                    isActive ? 'text-blue-600' : 'text-gray-500 hover:text-blue-600'
                  }`
                }
              >
                {item.icon}
                <span className="text-xs mt-1">{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </footer>
      </div>
    </div>
  );
};

export default Layout;