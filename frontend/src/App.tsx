import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';

import Login from './pages/auth/Login';
import DashboardLayout from './components/layout/DashboardLayout';
import ProtectedRoute from './components/layout/ProtectedRoute';
import DashboardHome from './pages/DashboardHome';
import PublicRegistration from './pages/PublicRegistration';
import AdminRegistrations from './pages/admin/AdminRegistrations';
import AdminUsers from './pages/admin/AdminUsers';
import DirectorGroups from './pages/director/DirectorGroups';
import DirectorTimetable from './pages/director/DirectorTimetable';
import StudentDashboard from './pages/dashboards/StudentDashboard';

import TeacherCourses from './pages/teacher/TeacherCourses';
import TeacherAssignments from './pages/teacher/TeacherAssignments';
import StudentHomework from './pages/student/StudentHomework';
import StudentExamNotes from './pages/student/StudentExamNotes';

const Timetable = () => <div className="p-6"><h1 className="text-2xl font-bold">Timetable</h1></div>;
const TeacherGrades = () => <div className="p-6"><h1 className="text-2xl font-bold">Manage Grades</h1></div>;
const Unauthorized = () => <div className="p-6"><h1 className="text-2xl font-bold text-red-600">Unauthorized Access</h1></div>;

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register-request" element={<PublicRegistration />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Protected Routes inside Dashboard Layout */}
          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/" element={<DashboardHome />} />
              
              {/* Admin Routes */}
              <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                <Route path="/admin/users" element={<AdminUsers />} />
                <Route path="/admin/registrations" element={<AdminRegistrations />} />
              </Route>
              
              {/* Director Routes */}
              <Route element={<ProtectedRoute allowedRoles={['admin', 'director']} />}>
                <Route path="/director/groups" element={<DirectorGroups />} />
                <Route path="/director/timetable" element={<DirectorTimetable />} />
              </Route>
              
              {/* Common/Teacher Routes */}
              <Route element={<ProtectedRoute allowedRoles={['admin', 'director', 'teacher']} />}>
                <Route path="/courses" element={<TeacherCourses />} />
                <Route path="/teacher/courses" element={<TeacherCourses />} />
                <Route path="/assignments" element={<TeacherAssignments />} />
                <Route path="/teacher/assignments" element={<TeacherAssignments />} />
                <Route path="/teacher/grades" element={<TeacherGrades />} />
                <Route path="/timetable" element={<Timetable />} />
              </Route>
              
              {/* Student Routes */}
              <Route element={<ProtectedRoute allowedRoles={['student']} />}>
                <Route path="/student/dashboard" element={<StudentDashboard />} />
                <Route path="/student/homework" element={<StudentHomework />} />
                <Route path="/student/grades" element={<StudentExamNotes />} />
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
