import React from "react";
import { useAuth } from "../../context/AuthContext";
import { Users, BookOpen, Calendar, ClipboardCheck } from "lucide-react";
import { StatCard } from "../../components/ui/StatCard";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const DirectorDashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Director Dashboard</h1>
          <p className="text-slate-500 text-sm">Academic Management Overview</p>
        </div>
        <div className="text-sm font-medium text-slate-600 bg-slate-100 px-4 py-2 rounded-xl">
          Term: Fall 2024
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <StatCard
          title="Active Groups"
          value="24"
          icon={<Users className="w-6 h-6" />}
          trend="+3"
          trendUp={true}
        />
        <StatCard
          title="Total Languages"
          value="6"
          icon={<BookOpen className="w-6 h-6" />}
        />
        <StatCard
          title="Sessions Today"
          value="12"
          icon={<Calendar className="w-6 h-6" />}
        />
        <StatCard
          title="Exams Scheduled"
          value="8"
          icon={<ClipboardCheck className="w-6 h-6" />}
        />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-slate-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-slate-800">Recent Academic Activity</h2>
            <Link to="/admin/groups" className="text-primary-600 text-sm font-medium hover:underline">View All Groups</Link>
          </div>
          
          <div className="space-y-4">
            {[
              { title: "New Group Created", desc: "English B1 - Night Shift", time: "2 hours ago" },
              { title: "Timetable Updated", desc: "French A2 - Room 102", time: "5 hours ago" },
              { title: "Teacher Assigned", desc: "Mr. Smith assigned to English A1", time: "Yesterday" },
            ].map((item, i) => (
              <div key={i} className="flex items-start space-x-4 p-4 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                <div className="w-2 h-2 rounded-full bg-primary-500 mt-2"></div>
                <div>
                  <h4 className="font-semibold text-slate-800 text-sm">{item.title}</h4>
                  <p className="text-slate-500 text-xs">{item.desc}</p>
                  <span className="text-[10px] text-slate-400 mt-1 block">{item.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-slate-100 p-6">
            <h2 className="text-lg font-bold text-slate-800 mb-4">Academic Quick Actions</h2>
            <div className="space-y-3">
              <Link to="/admin/groups" className="w-full flex items-center p-3 rounded-xl hover:bg-primary-50 border border-slate-100 hover:border-primary-100 transition-all text-left text-slate-700 hover:text-primary-700">
                <Users className="w-5 h-5 text-primary-500 mr-3" />
                <span className="font-medium">Manage Groups</span>
              </Link>
              <Link to="/admin/academic" className="w-full flex items-center p-3 rounded-xl hover:bg-primary-50 border border-slate-100 hover:border-primary-100 transition-all text-left text-slate-700 hover:text-primary-700">
                <BookOpen className="w-5 h-5 text-primary-500 mr-3" />
                <span className="font-medium">Languages & Levels</span>
              </Link>
              <Link to="/director/timetable" className="w-full flex items-center p-3 rounded-xl hover:bg-primary-50 border border-slate-100 hover:border-primary-100 transition-all text-left text-slate-700 hover:text-primary-700">
                <Calendar className="w-5 h-5 text-primary-500 mr-3" />
                <span className="font-medium">Manage Timetable</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DirectorDashboard;
