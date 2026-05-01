import React from "react";
import { useAuth } from "../context/AuthContext";
import AdminDashboard from "./dashboards/AdminDashboard";
import DirectorDashboard from "./dashboards/DirectorDashboard";
import TeacherDashboard from "./dashboards/TeacherDashboard";
import StudentDashboard from "./dashboards/StudentDashboard";
import { motion } from "framer-motion";

const DashboardHome: React.FC = () => {
  const { user, hasRole } = useAuth();

  if (hasRole("admin")) return <AdminDashboard />;
  if (hasRole("director")) return <DirectorDashboard />;
  if (hasRole("teacher")) return <TeacherDashboard />;
  if (hasRole("student")) return <StudentDashboard />;

  // Generic dashboard for other roles (to be expanded)
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 text-center"
    >
      <div className="w-20 h-20 bg-primary-50 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl font-bold">
        {user?.first_name?.[0]}
      </div>
      <h1 className="text-2xl font-bold text-slate-800 mb-2">
        Welcome, {user?.first_name}!
      </h1>
      <p className="text-slate-500">
        This dashboard is currently under construction for your specific role.
      </p>
    </motion.div>
  );
};

export default DashboardHome;
