import React, { useState, useEffect } from "react";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import type { Course, Timetable, ApiResponse } from "../../types";
import {
  BookOpen,
  Calendar,
  Users,
  Clock,
  MapPin,
  GraduationCap,
  ChevronRight,
  Loader2,
  AlertCircle,
  FileText,
  X,
  Download,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [timetables, setTimetables] = useState<Timetable[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const fetchStudentData = async () => {
    if (!user?.groups || user.groups.length === 0) {
      setLoading(false);
      return;
    }

    try {
      const [coursesRes, timetableRes] = await Promise.all([
        api.get<ApiResponse<Course[]>>(
          user.groups?.[0]?.id
            ? `/courses/group/${user.groups[0].id}`
            : `/courses/teacher/${user.id}`,
        ), // Placeholder for courses
        api.get<ApiResponse<Timetable[]>>(`/timetables/student/${user.id}`),
      ]);

      setCourses(
        Array.isArray(coursesRes.data.data) ? coursesRes.data.data : [],
      );
      setTimetables(
        Array.isArray(timetableRes.data.data) ? timetableRes.data.data : [],
      );
    } catch (error) {
      console.error("Failed to load student data", error);
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
          <h1 className="text-3xl font-bold text-slate-800">
            Welcome back, {user?.first_name}! 👋
          </h1>
          <p className="text-slate-500 mt-2">
            Check your classes and keep up with your progress.
          </p>
        </div>
        {mainGroup ? (
          <div className="flex items-center gap-4 bg-primary-50 p-4 rounded-2xl border border-primary-100">
            <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center text-primary-600">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-primary-600 font-bold uppercase tracking-wider">
                My Group
              </p>
              <h3 className="text-lg font-bold text-slate-800">
                {mainGroup.name}
              </h3>
              <p className="text-xs text-slate-500">{mainGroup.level?.name}</p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-4 bg-amber-50 p-4 rounded-2xl border border-amber-100">
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-amber-600 font-bold uppercase tracking-wider">
                Status
              </p>
              <h3 className="text-sm font-bold text-slate-800">
                No Group Assigned
              </h3>
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
              <p className="text-slate-500">
                No courses assigned to your group yet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {courses.map((course) => (
                <motion.div
                  key={course.id}
                  whileHover={{ y: -4 }}
                  onClick={() => setSelectedCourse(course)}
                  className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group cursor-pointer"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                      <GraduationCap className="w-6 h-6" />
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-primary-500 transition-colors" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 mb-1">
                    {course.title}
                  </h3>
                  <p className="text-sm text-slate-500 line-clamp-2 mb-4">
                    {course.description}
                  </p>

                  {course.file_path && (
                    <a
                      href={course.file_path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-slate-50 text-slate-700 rounded-xl text-xs font-bold hover:bg-primary-50 hover:text-primary-600 transition-colors"
                    >
                      <FileText className="w-4 h-4" />
                      Download Materials
                    </a>
                  )}

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
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Next Classes
              </span>
            </div>
            <div className="divide-y divide-slate-50">
              {timetables.length === 0 ? (
                <div className="p-8 text-center text-slate-400">
                  <p>No classes scheduled yet.</p>
                </div>
              ) : (
                timetables
                  .sort((a, b) => a.day_of_week.localeCompare(b.day_of_week))
                  .map((item) => (
                    <div
                      key={item.id}
                      className="p-5 hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                          {item.day_of_week}
                        </span>
                        <span className="text-sm font-bold text-slate-700">
                          {item.start_time.substring(0, 5)} -{" "}
                          {item.end_time.substring(0, 5)}
                        </span>
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

      <CourseDetailModal
        course={selectedCourse}
        onClose={() => setSelectedCourse(null)}
      />
    </div>
  );
};

export default StudentDashboard;

// ── Course Detail Modal ───────────────────────────────────
const CourseDetailModal: React.FC<{
  course: Course | null;
  onClose: () => void;
}> = ({ course, onClose }) => (
  <AnimatePresence>
    {course && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        />
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden"
        >
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary-600" />
              Course Details
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-white transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="p-8 space-y-6">
            <div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">
                {course.title}
              </h3>
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-xs font-bold uppercase tracking-wider">
                  {course.group?.name}
                </span>
                <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wider">
                  {course.status}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-bold text-slate-700 uppercase text-xs tracking-widest">
                Description
              </h4>
              <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                {course.description || "No description provided."}
              </p>
            </div>

            {course.file_path && (
              <div className="space-y-4 pt-6 border-t border-slate-50">
                <h4 className="font-bold text-slate-700 uppercase text-xs tracking-widest">
                  Learning Materials
                </h4>
                <a
                  href={course.file_path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-primary-200 transition-all"
                >
                  <div className="p-3 bg-white text-primary-600 rounded-xl shadow-sm group-hover:bg-primary-600 group-hover:text-white transition-colors">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-slate-800">
                      Course Document (PDF/DOC)
                    </p>
                    <p className="text-xs text-slate-500">
                      Click to open or download
                    </p>
                  </div>
                  <Download className="w-5 h-5 text-slate-400 group-hover:text-primary-600" />
                </a>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);
