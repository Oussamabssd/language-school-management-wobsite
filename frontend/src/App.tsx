import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";

import Login from "./pages/auth/Login";
import DashboardLayout from "./components/layout/DashboardLayout";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import DashboardHome from "./pages/DashboardHome";
import PublicRegistration from "./pages/PublicRegistration";
import AdminRegistrations from "./pages/admin/AdminRegistrations";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminGroups from "./pages/admin/AdminGroups";
import AdminAcademic from "./pages/admin/AdminAcademic";
import DirectorTimetable from "./pages/director/DirectorTimetable";
import StudentDashboard from "./pages/dashboards/StudentDashboard";
import ParentDashboard from "./pages/dashboards/ParentDashboard";

import TeacherCourses from "./pages/teacher/TeacherCourses";
import TeacherAssignments from "./pages/teacher/TeacherAssignments";
import StudentHomework from "./pages/student/StudentHomework";
import StudentExamNotes from "./pages/student/StudentExamNotes";
import AnnouncementManagement from "./pages/announcements/AnnouncementManagement";
import AnnouncementList from "./pages/announcements/AnnouncementList";
import TeacherProfile from "./pages/teacher/TeacherProfile";
import TeacherApply from "./pages/TeacherApply";
import AdminTeacherApplications from "./pages/admin/AdminTeacherApplications";
import EmployeePayments from "./pages/accountant/EmployeePayments";
import StudentPayments from "./pages/accountant/StudentPayments";
import Expenses from "./pages/accountant/Expenses";
import AdminExams from "./pages/admin/AdminExams";
import TeacherGrades from "./pages/teacher/TeacherGrades";

const Timetable = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold">Timetable</h1>
  </div>
);
const Unauthorized = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold text-red-600">Unauthorized Access</h1>
  </div>
);

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register-request" element={<PublicRegistration />} />
          <Route path="/teacher-apply" element={<TeacherApply />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Protected Routes inside Dashboard Layout */}
          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/" element={<DashboardHome />} />

              <Route
                element={
                  <ProtectedRoute
                    allowedRoles={["admin", "director", "secretary"]}
                  />
                }
              >
                <Route path="/admin/users" element={<AdminUsers />} />
                <Route path="/admin/groups" element={<AdminGroups />} />
                <Route path="/admin/academic" element={<AdminAcademic />} />
                <Route
                  path="/admin/registrations"
                  element={<AdminRegistrations />}
                />
              </Route>

              {/* Director Routes */}
              <Route
                element={
                  <ProtectedRoute allowedRoles={["admin", "director"]} />
                }
              >
                <Route
                  path="/director/timetable"
                  element={<DirectorTimetable />}
                />
              </Route>

              {/* Management Routes (Admin, Director, Secretary) */}
              <Route
                element={
                  <ProtectedRoute
                    allowedRoles={["admin", "director", "secretary"]}
                  />
                }
              >
                <Route
                  path="/announcements"
                  element={<AnnouncementManagement />}
                />
                <Route
                  path="/admin/teacher-applications"
                  element={<AdminTeacherApplications />}
                />
                <Route path="/admin/exams" element={<AdminExams />} />
              </Route>

              {/* Common/Teacher Routes */}
              <Route
                element={
                  <ProtectedRoute
                    allowedRoles={["admin", "director", "teacher"]}
                  />
                }
              >
                <Route path="/courses" element={<TeacherCourses />} />
                <Route path="/teacher/courses" element={<TeacherCourses />} />
                <Route path="/assignments" element={<TeacherAssignments />} />
                <Route
                  path="/teacher/assignments"
                  element={<TeacherAssignments />}
                />
                <Route path="/teacher/grades" element={<TeacherGrades />} />
                <Route path="/teacher/profile" element={<TeacherProfile />} />
                <Route path="/timetable" element={<Timetable />} />
              </Route>

              {/* Feed Routes (All authenticated users can see the announcement feed) */}
              <Route
                path="/announcements/feed"
                element={<AnnouncementList />}
              />

              {/* Student Routes */}
              <Route element={<ProtectedRoute allowedRoles={["student"]} />}>
                <Route
                  path="/student/dashboard"
                  element={<StudentDashboard />}
                />
                <Route path="/student/homework" element={<StudentHomework />} />
                <Route path="/student/grades" element={<StudentExamNotes />} />
              </Route>

              {/* Parent Routes */}
              <Route element={<ProtectedRoute allowedRoles={["parent"]} />}>
                <Route path="/parent/dashboard" element={<ParentDashboard />} />
              </Route>

              {/* Accountant Routes */}
              <Route
                element={
                  <ProtectedRoute allowedRoles={["admin", "accountant"]} />
                }
              >
                <Route
                  path="/accountant/payments"
                  element={<EmployeePayments />}
                />
                <Route
                  path="/accountant/student-payments"
                  element={<StudentPayments />}
                />
                <Route path="/accountant/expenses" element={<Expenses />} />
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
