import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Users, GraduationCap, Calendar, Bell } from 'lucide-react';
import { StatCard } from '../../components/ui/StatCard';
import { motion } from 'framer-motion';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Admin Dashboard</h1>
          <p className="text-slate-500">Welcome back, {user?.first_name}</p>
        </div>
        <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-xl shadow-sm transition-colors font-medium">
          New Announcement
        </button>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <StatCard title="Total Students" value="1,248" icon={<Users className="w-6 h-6" />} trend="+12%" trendUp={true} />
        <StatCard title="Active Teachers" value="45" icon={<GraduationCap className="w-6 h-6" />} trend="+2" trendUp={true} />
        <StatCard title="Pending Registrations" value="18" icon={<Calendar className="w-6 h-6" />} />
        <StatCard title="Recent Announcements" value="3" icon={<Bell className="w-6 h-6" />} />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-slate-100 p-6">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Pending Registrations</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-slate-500 text-sm border-b border-slate-100">
                  <th className="pb-3 font-medium">Student Name</th>
                  <th className="pb-3 font-medium">Language</th>
                  <th className="pb-3 font-medium">Date Applied</th>
                  <th className="pb-3 font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <tr className="border-b border-slate-50">
                  <td className="py-4 font-medium text-slate-800">Yasmine Ouazzani</td>
                  <td className="py-4 text-slate-600">French</td>
                  <td className="py-4 text-slate-600">Today, 10:30 AM</td>
                  <td className="py-4">
                    <button className="text-primary-600 font-medium hover:underline">Review</button>
                  </td>
                </tr>
                <tr>
                  <td className="py-4 font-medium text-slate-800">Ahmed Khalil</td>
                  <td className="py-4 text-slate-600">English</td>
                  <td className="py-4 text-slate-600">Yesterday</td>
                  <td className="py-4">
                    <button className="text-primary-600 font-medium hover:underline">Review</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-slate-100 p-6">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <button className="w-full flex items-center p-3 rounded-xl hover:bg-slate-50 border border-slate-100 transition-colors text-left text-slate-700">
              <Users className="w-5 h-5 text-primary-500 mr-3" />
              <span className="font-medium">Manage Employees</span>
            </button>
            <button className="w-full flex items-center p-3 rounded-xl hover:bg-slate-50 border border-slate-100 transition-colors text-left text-slate-700">
              <GraduationCap className="w-5 h-5 text-primary-500 mr-3" />
              <span className="font-medium">Student Directory</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
