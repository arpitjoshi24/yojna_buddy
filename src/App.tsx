import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import Dashboard from './pages/Dashboard';
import ProjectPlanner from './pages/ProjectPlanner';
import StudentPlanner from './pages/StudentPlanner';
import TodoList from './pages/TodoList';
import Journal from './pages/Journal';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

function App() {
  // Set document title
  useEffect(() => {
    document.title = "PlanIt - Your Personal Planner";
  }, []);

  return (
    <Router>
      <AuthProvider>
        <DataProvider>
          <Toaster position="top-right" richColors />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/projects" element={<ProjectPlanner />} />
              <Route path="/student" element={<StudentPlanner />} />
              <Route path="/todos" element={<TodoList />} />
              <Route path="/journal" element={<Journal />} />
            </Route>
            
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </DataProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;