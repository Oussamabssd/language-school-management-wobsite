import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { 
  Calendar, Clock, MapPin, Plus, Edit2, Trash2, 
  Search, Filter, ChevronDown, CheckCircle2, 
  AlertCircle, Loader2, BookOpen, Users, Bell
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

interface Exam {
  id: number;
  title: string;
  description: string | null;
  quarter: 'Q1' | 'Q2' | 'Q3' | 'Q4';
  exam_date: string;
  start_time: string | null;
  end_time: string | null;
  classroom: string | null;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  is_announced: boolean;
  course: { id: number; title: string };
  group: { id: number; name: string };
}

interface Group {
  id: number;
  name: string;
}

interface Course {
  id: number;
  title: string;
}

const AdminExams: React.FC = () => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingExam, setEditingExam] = useState<Exam | null>(null);
  const [filterQuarter, setFilterQuarter] = useState<string>('All');
  const [filterGroup, setFilterGroup] = useState<string>('All');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    course_id: '',
    group_id: '',
    quarter: 'Q1',
    exam_date: '',
    start_time: '',
    end_time: '',
    classroom: '',
    status: 'scheduled',
    is_announced: false
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [examsRes, groupsRes, coursesRes] = await Promise.all([
        api.get('/exams'),
        api.get('/groups'),
        api.get('/courses')
      ]);
      const examsData = examsRes.data.data?.data || examsRes.data.data;
      setExams(Array.isArray(examsData) ? examsData : []);
      
      const groupsData = groupsRes.data.data?.data || groupsRes.data.data;
      setGroups(Array.isArray(groupsData) ? groupsData : []);
      
      const coursesData = coursesRes.data.data?.data || coursesRes.data.data;
      setCourses(Array.isArray(coursesData) ? coursesData : []);
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingExam) {
        await api.put(`/exams/${editingExam.id}`, formData);
        toast.success('Exam updated successfully');
      } else {
        await api.post('/exams', formData);
        toast.success('Exam created successfully');
      }
      setShowModal(false);
      setEditingExam(null);
      setFormData({
        title: '', description: '', course_id: '', group_id: '',
        quarter: 'Q1', exam_date: '', start_time: '', end_time: '',
        classroom: '', status: 'scheduled', is_announced: false
      });
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this exam?')) return;
    try {
      await api.delete(`/exams/${id}`);
      toast.success('Exam deleted');
      fetchData();
    } catch (error) {
      toast.error('Failed to delete exam');
    }
  };

  const openEditModal = (exam: Exam) => {
    setEditingExam(exam);
    setFormData({
      title: exam.title,
      description: exam.description || '',
      course_id: exam.course.id.toString(),
      group_id: exam.group.id.toString(),
      quarter: exam.quarter,
      exam_date: exam.exam_date,
      start_time: exam.start_time || '',
      end_time: exam.end_time || '',
      classroom: exam.classroom || '',
      status: exam.status,
      is_announced: exam.is_announced
    });
    setShowModal(true);
  };

  const toggleAnnounce = async (exam: Exam) => {
    try {
      await api.put(`/exams/${exam.id}`, { is_announced: !exam.is_announced });
      toast.success(exam.is_announced ? 'Exam unannounced' : 'Exam announced! 📢');
      fetchData();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const filteredExams = exams.filter(exam => {
    const matchQuarter = filterQuarter === 'All' || exam.quarter === filterQuarter;
    const matchGroup = filterGroup === 'All' || exam.group.id.toString() === filterGroup;
    return matchQuarter && matchGroup;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Exam Management 📝</h1>
          <p className="text-slate-500 mt-1">Schedule and manage exams for all groups and quarters.</p>
        </div>
        <button 
          onClick={() => { setEditingExam(null); setShowModal(true); }}
          className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
        >
          <Plus className="w-5 h-5" /> Schedule New Exam
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl border border-slate-200">
          <Filter className="w-4 h-4 text-slate-400" />
          <select 
            value={filterQuarter}
            onChange={(e) => setFilterQuarter(e.target.value)}
            className="bg-transparent border-none outline-none text-sm font-bold text-slate-700"
          >
            <option value="All">All Quarters</option>
            <option value="Q1">Quarter 1</option>
            <option value="Q2">Quarter 2</option>
            <option value="Q3">Quarter 3</option>
            <option value="Q4">Quarter 4</option>
          </select>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl border border-slate-200">
          <Users className="w-4 h-4 text-slate-400" />
          <select 
            value={filterGroup}
            onChange={(e) => setFilterGroup(e.target.value)}
            className="bg-transparent border-none outline-none text-sm font-bold text-slate-700"
          >
            <option value="All">All Groups</option>
            {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
          </select>
        </div>
      </div>

      {/* Exams Grid */}
      {filteredExams.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm">
          <Calendar className="w-16 h-16 text-slate-200 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-800 mb-2">No exams scheduled</h3>
          <p className="text-slate-500">Try adjusting your filters or create a new exam.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExams.map((exam) => (
            <motion.div 
              layout
              key={exam.id}
              className="bg-white rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all p-6 relative group"
            >
              <div className="flex justify-between items-start mb-6">
                <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                  exam.quarter === 'Q1' ? 'bg-blue-100 text-blue-700' :
                  exam.quarter === 'Q2' ? 'bg-purple-100 text-purple-700' :
                  exam.quarter === 'Q3' ? 'bg-orange-100 text-orange-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {exam.quarter}
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEditModal(exam)} className="p-2 bg-slate-50 text-slate-600 rounded-xl hover:bg-primary-50 hover:text-primary-600 transition-all">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(exam.id)} className="p-2 bg-slate-50 text-slate-600 rounded-xl hover:bg-red-50 hover:text-red-600 transition-all">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <h3 className="text-xl font-bold text-slate-900 mb-1">{exam.title}</h3>
              <p className="text-sm font-bold text-primary-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                <BookOpen className="w-3.5 h-3.5" /> {exam.course.title}
              </p>

              <div className="space-y-3 pt-4 border-t border-slate-50">
                <div className="flex items-center gap-3 text-sm text-slate-600 font-medium">
                  <Users className="w-4 h-4 text-slate-400" />
                  <span>Group: <span className="font-bold text-slate-800">{exam.group.name}</span></span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-600 font-medium">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span>{new Date(exam.exam_date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-600 font-medium">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span>{exam.start_time} - {exam.end_time}</span>
                </div>
                {exam.classroom && (
                  <div className="flex items-center gap-3 text-sm text-slate-600 font-medium">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <span>Room: {exam.classroom}</span>
                  </div>
                )}
              </div>

              <div className="mt-6 flex items-center justify-between gap-2">
                <span className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full ${
                  exam.status === 'scheduled' ? 'bg-blue-50 text-blue-600' :
                  exam.status === 'completed' ? 'bg-green-50 text-green-600' :
                  'bg-slate-50 text-slate-600'
                }`}>
                  {exam.status === 'scheduled' ? <Clock className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
                  {exam.status.toUpperCase()}
                </span>

                <button
                  onClick={() => toggleAnnounce(exam)}
                  className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full transition-all ${
                    exam.is_announced 
                      ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' 
                      : 'bg-slate-100 text-slate-400 hover:bg-primary-600 hover:text-white'
                  }`}
                >
                  <Bell className={`w-3 h-3 ${exam.is_announced ? 'fill-current' : ''}`} />
                  {exam.is_announced ? 'ANNOUNCED' : 'ANNOUNCE'}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-[40px] shadow-2xl w-full max-w-2xl overflow-hidden"
            >
              <div className="p-8 md:p-12 overflow-y-auto max-h-[90vh]">
                <h2 className="text-3xl font-bold text-slate-900 mb-2">
                  {editingExam ? 'Edit Exam' : 'Schedule New Exam'}
                </h2>
                <p className="text-slate-500 mb-8">Fill in the details to {editingExam ? 'update' : 'create'} the exam.</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 ml-1">Title</label>
                      <input
                        type="text"
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all font-medium"
                        placeholder="e.g., Final Exam English"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 ml-1">Quarter</label>
                      <select
                        required
                        value={formData.quarter}
                        onChange={(e) => setFormData({...formData, quarter: e.target.value as any})}
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all font-medium"
                      >
                        <option value="Q1">Quarter 1 (Q1)</option>
                        <option value="Q2">Quarter 2 (Q2)</option>
                        <option value="Q3">Quarter 3 (Q3)</option>
                        <option value="Q4">Quarter 4 (Q4)</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 ml-1">Group</label>
                      <select
                        required
                        value={formData.group_id}
                        onChange={(e) => setFormData({...formData, group_id: e.target.value})}
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all font-medium"
                      >
                        <option value="">-- Select Group --</option>
                        {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 ml-1">Course</label>
                      <select
                        required
                        value={formData.course_id}
                        onChange={(e) => setFormData({...formData, course_id: e.target.value})}
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all font-medium"
                      >
                        <option value="">-- Select Course --</option>
                        {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 ml-1">Exam Date</label>
                      <input
                        type="date"
                        required
                        value={formData.exam_date}
                        onChange={(e) => setFormData({...formData, exam_date: e.target.value})}
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all font-medium"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 ml-1">Classroom / Room</label>
                      <input
                        type="text"
                        value={formData.classroom}
                        onChange={(e) => setFormData({...formData, classroom: e.target.value})}
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all font-medium"
                        placeholder="e.g., Room 102"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 ml-1">Start Time</label>
                      <input
                        type="time"
                        value={formData.start_time}
                        onChange={(e) => setFormData({...formData, start_time: e.target.value})}
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all font-medium"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 ml-1">End Time</label>
                      <input
                        type="time"
                        value={formData.end_time}
                        onChange={(e) => setFormData({...formData, end_time: e.target.value})}
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all font-medium"
                      />
                    </div>
                  </div>

                  <div className="pt-8 flex gap-4">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="flex-1 py-4 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl font-bold transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold transition-all shadow-xl shadow-slate-200"
                    >
                      {editingExam ? 'Update Exam' : 'Schedule Exam'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminExams;
