import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';

import Login from './pages/auth/Login';
import DashboardLayout from './components/layout/DashboardLayout';
import ProtectedRoute from './components/layout/ProtectedRoute';
import DashboardHome from './pages/DashboardHome';

// Placeholder components for routing
const Users = () => <div className="p-6"><h1 className="text-2xl font-bold">Users Management</h1></div>;
const Courses = () => <div className="p-6"><h1 className="text-2xl font-bold">Courses</h1></div>;
const Timetable = () => <div className="p-6"><h1 className="text-2xl font-bold">Timetable</h1></div>;
const Unauthorized = () => <div className="p-6"><h1 className="text-2xl font-bold text-red-600">Unauthorized Access</h1></div>;

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Protected Routes inside Dashboard Layout */}
          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/" element={<DashboardHome />} />
              <Route path="/timetable" element={<Timetable />} />
              
              {/* Admin Routes */}
              <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                <Route path="/admin/users" element={<Users />} />
              </Route>
              
              {/* Director/Teacher Routes */}
              <Route element={<ProtectedRoute allowedRoles={['admin', 'director', 'teacher']} />}>
                <Route path="/courses" element={<Courses />} />
              </Route>
              
            </Route>
          </Route>
          
          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
