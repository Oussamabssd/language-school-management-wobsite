import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import type { Course, ApiResponse } from '../../types';
import toast from 'react-hot-toast';
import { 
  BookOpen, Plus, Upload, Loader2, X, 
  Download, ChevronRight, Edit3, Trash2, 
  Users
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TeacherCourses: React.FC = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    group_id: '',
    status: 'active',
    file: null as File | null
  });

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const res = await api.get<ApiResponse<Course[]>>(`/courses/teacher/${user?.id}`);
      const coursesData = (res.data.data as any).data || res.data.data;
      setCourses(Array.isArray(coursesData) ? coursesData : []);
    } catch (error) {
      toast.error('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('group_id', formData.group_id);
    data.append('status', formData.status);
    if (formData.file) data.append('file', formData.file);

    try {
      if (editingCourse) {
        await api.post(`/courses/${editingCourse.id}?_method=PUT`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Course updated');
      } else {
        await api.post('/courses', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Course created and shared');
      }
      setShowAddModal(false);
      setEditingCourse(null);
      resetForm();
      fetchCourses();
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to save course';
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    setFormData({
      title: course.title,
      description: course.description || '',
      group_id: course.group?.id.toString() || '',
      status: course.status || 'active',
      file: null
    });
    setShowAddModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this course?')) return;
    try {
      await api.delete(`/courses/${id}`);
      toast.success('Course deleted');
      fetchCourses();
    } catch (error) {
      toast.error('Failed to delete course');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      group_id: '',
      status: 'active',
      file: null
    });
  };

  const teachingGroups = (user as any)?.teaching_groups || [];

  return (
    <div className="space-y-8 pb-12">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 text-premium">Course Management</h1>
          <p className="text-slate-500 mt-1">Create and share course materials with your groups.</p>
        </div>
        <button 
          onClick={() => { resetForm(); setEditingCourse(null); setShowAddModal(true); }}
          className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-2xl font-bold hover:bg-primary-700 transition-all shadow-lg shadow-primary-200"
        >
          <Plus className="w-5 h-5" />
          Create Course
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-primary-600" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <motion.div 
              key={course.id}
              whileHover={{ y: -5 }}
              className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-primary-50 text-primary-600 rounded-2xl group-hover:bg-primary-600 group-hover:text-white transition-colors">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleEdit(course)} className="p-2 hover:bg-slate-100 rounded-xl text-slate-500 hover:text-primary-600"><Edit3 className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(course.id)} className="p-2 hover:bg-slate-100 rounded-xl text-slate-500 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>

              <h3 className="text-lg font-bold text-slate-800 mb-1">{course.title}</h3>
              <div className="flex items-center gap-2 mb-4">
                <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                  {course.group?.name || 'Unknown Group'}
                </span>
                <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                  course.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {course.status}
                </span>
              </div>

              <p className="text-sm text-slate-500 mb-6 line-clamp-2">
                {course.description || 'No description provided.'}
              </p>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Users className="w-4 h-4 text-slate-400" />
                  <span>{course.group?.students?.length || 0} Students enrolled</span>
                </div>
                {course.file_path && (
                  <a 
                    href={course.file_path as string} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-primary-600 hover:underline font-medium"
                  >
                    <Download className="w-4 h-4" />
                    Course Materials (PDF)
                  </a>
                )}
              </div>

              <button 
                onClick={() => handleEdit(course)}
                className="w-full py-3 bg-slate-50 text-slate-600 rounded-xl font-bold hover:bg-primary-50 hover:text-primary-600 transition-colors flex items-center justify-center gap-2"
              >
                View Details
                <ChevronRight className="w-4 h-4" />
              </button>
            </motion.div>
          ))}

          {courses.length === 0 && (
            <div className="col-span-full bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center">
              <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-800 mb-2">No courses created yet</h3>
              <p className="text-slate-500 mb-6">Start by sharing your first course with a group.</p>
              <button 
                onClick={() => setShowAddModal(true)}
                className="px-6 py-2 bg-white border border-slate-200 rounded-xl font-bold hover:bg-slate-50 transition-colors"
              >
                Share First Course
              </button>
            </div>
          )}
        </div>
      )}

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="text-xl font-bold">{editingCourse ? 'Edit Course' : 'Create New Course'}</h3>
                <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-slate-200 rounded-xl transition-colors"><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Course Title</label>
                  <input 
                    required
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="e.g., Introduction to English Literature"
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Target Group</label>
                  <select 
                    required
                    value={formData.group_id}
                    onChange={(e) => setFormData({...formData, group_id: e.target.value})}
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-primary-500 outline-none transition-all bg-white"
                  >
                    <option value="">Select a group</option>
                    {teachingGroups.map((g: any) => (
                      <option key={g.id} value={g.id}>{g.name}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Status</label>
                    <select 
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value})}
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-primary-500 outline-none transition-all bg-white"
                    >
                      <option value="active">Active</option>
                      <option value="draft">Draft</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Course PDF</label>
                    <div className="relative">
                      <input 
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => setFormData({...formData, file: e.target.files?.[0] || null})}
                        className="hidden"
                        id="course-file-upload"
                      />
                      <label 
                        htmlFor="course-file-upload"
                        className="flex items-center gap-2 px-4 py-3 rounded-2xl border border-slate-200 border-dashed hover:bg-slate-50 cursor-pointer transition-all"
                      >
                        <Upload className="w-4 h-4 text-slate-400" />
                        <span className="text-sm text-slate-500 truncate">
                          {formData.file ? formData.file.name : (editingCourse?.file_path ? 'Change PDF' : 'Upload PDF')}
                        </span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Description</label>
                  <textarea 
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-primary-500 outline-none transition-all resize-none"
                    placeholder="Describe the course content..."
                  />
                </div>

                <button 
                  type="submit"
                  disabled={saving}
                  className="w-full py-4 bg-primary-600 text-white rounded-2xl font-bold shadow-xl shadow-primary-100 hover:bg-primary-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : (editingCourse ? 'Update Course' : 'Create & Share Course')}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TeacherCourses;
