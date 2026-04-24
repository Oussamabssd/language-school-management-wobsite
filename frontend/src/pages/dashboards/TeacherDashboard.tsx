import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { BookOpen, Calendar, CheckSquare, Clock } from 'lucide-react';
import { StatCard } from '../../components/ui/StatCard';
import { motion } from 'framer-motion';

const TeacherDashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Teacher Dashboard</h1>
          <p className="text-slate-500">Welcome back, {user?.first_name}</p>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <StatCard title="My Courses" value="4" icon={<BookOpen className="w-6 h-6" />} />
        <StatCard title="Upcoming Classes" value="2" icon={<Clock className="w-6 h-6" />} />
        <StatCard title="Assignments to Grade" value="34" icon={<CheckSquare className="w-6 h-6" />} />
        <StatCard title="My Students" value="58" icon={<Calendar className="w-6 h-6" />} />
      </motion.div>

      <div className="bg-white rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-slate-100 p-6">
        <h2 className="text-lg font-bold text-slate-800 mb-4">Today's Schedule</h2>
        <div className="space-y-4">
          <div className="flex items-center p-4 rounded-xl bg-slate-50 border border-slate-100">
            <div className="w-16 h-16 rounded-xl bg-primary-100 text-primary-700 flex flex-col items-center justify-center font-bold mr-4">
              <span className="text-sm">09:00</span>
            </div>
            <div>
              <h4 className="font-bold text-slate-800">English Foundations</h4>
              <p className="text-sm text-slate-500">Group: EN-A1-G1 • Room 101</p>
            </div>
            <div className="ml-auto">
              <button className="text-sm bg-white border border-slate-200 hover:bg-slate-50 px-3 py-1.5 rounded-lg font-medium text-slate-700">Mark Attendance</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
