import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import type { Course, Timetable, ApiResponse } from '../../types';
import { 
  BookOpen, Calendar, Users, 
  Clock, MapPin, GraduationCap,
  ChevronRight, Loader2, AlertCircle
} from 'lucide-react';
import { motion } from 'framer-motion';

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [timetables, setTimetables] = useState<Timetable[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStudentData = async () => {
    if (!user?.groups || user.groups.length === 0) {
      setLoading(false);
      return;
    }

    try {
      const [coursesRes, timetableRes] = await Promise.all([
        api.get<ApiResponse<Course[]>>(user.groups?.[0]?.id ? `/courses/group/${user.groups[0].id}` : `/courses/teacher/${user.id}`), // Placeholder for courses
        api.get<ApiResponse<Timetable[]>>(`/timetables/student/${user.id}`)
      ]);

      setCourses(Array.isArray(coursesRes.data.data) ? coursesRes.data.data : []);
      setTimetables(Array.isArray(timetableRes.data.data) ? timetableRes.data.data : []);
    } catch (error) {
      console.error('Failed to load student data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentData();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  const mainGroup = user?.groups?.[0];

  return (
    <div className="space-y-8 pb-12">
      {/* Welcome Header */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Welcome back, {user?.first_name}! 👋</h1>
          <p className="text-slate-500 mt-2">Check your classes and keep up with your progress.</p>
        </div>
        {mainGroup ? (
          <div className="flex items-center gap-4 bg-primary-50 p-4 rounded-2xl border border-primary-100">
            <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center text-primary-600">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-primary-600 font-bold uppercase tracking-wider">My Group</p>
              <h3 className="text-lg font-bold text-slate-800">{mainGroup.name}</h3>
              <p className="text-xs text-slate-500">{mainGroup.level?.name}</p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-4 bg-amber-50 p-4 rounded-2xl border border-amber-100">
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-amber-600 font-bold uppercase tracking-wider">Status</p>
              <h3 className="text-sm font-bold text-slate-800">No Group Assigned</h3>
              <p className="text-xs text-slate-500">Contact admin</p>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Courses Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary-600" />
              My Courses
            </h2>
          </div>

          {courses.length === 0 ? (
            <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center">
              <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500">No courses assigned to your group yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {courses.map((course) => (
                <motion.div 
                  key={course.id}
                  whileHover={{ y: -4 }}
                  className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                      <GraduationCap className="w-6 h-6" />
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-primary-500 transition-colors" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 mb-1">{course.title}</h3>
                  <p className="text-sm text-slate-500 line-clamp-2 mb-4">{course.description}</p>
                  <div className="flex items-center gap-4 pt-4 border-t border-slate-50">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                      <Clock className="w-4 h-4 text-slate-400" />
                      {course.status}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Timetable Sidebar */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary-600" />
            Weekly Schedule
          </h2>

          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-4 bg-slate-50/50 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Next Classes</span>
            </div>
            <div className="divide-y divide-slate-50">
              {timetables.length === 0 ? (
                <div className="p-8 text-center text-slate-400">
                  <p>No classes scheduled yet.</p>
                </div>
              ) : (
                timetables.sort((a, b) => a.day_of_week.localeCompare(b.day_of_week)).map((item) => (
                  <div key={item.id} className="p-5 hover:bg-slate-50 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                        {item.day_of_week}
                      </span>
                      <span className="text-sm font-bold text-slate-700">{item.start_time.substring(0, 5)} - {item.end_time.substring(0, 5)}</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <MapPin className="w-4 h-4 text-slate-400" />
                        Room: {item.room}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
