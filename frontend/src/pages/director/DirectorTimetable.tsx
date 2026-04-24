import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import type { Timetable, Group, User, ApiResponse } from '../../types';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, Plus, Trash2, Loader2, X, 
  Filter, Users
} from 'lucide-react';

const DAYS = [
  { key: 'monday', label: 'Monday' },
  { key: 'tuesday', label: 'Tuesday' },
  { key: 'wednesday', label: 'Wednesday' },
  { key: 'thursday', label: 'Thursday' },
  { key: 'friday', label: 'Friday' },
  { key: 'saturday', label: 'Saturday' },
  { key: 'sunday', label: 'Sunday' }
];

const DirectorTimetable: React.FC = () => {
  const [timetables, setTimetables] = useState<Timetable[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [teachers, setTeachers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGroup, setSelectedGroup] = useState<string>('');
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    group_id: '',
    teacher_id: '',
    day_of_week: 'monday',
    start_time: '09:00',
    end_time: '11:00',
    room: '',
    academic_year: '2025-2026'
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [groupsRes, teachersRes] = await Promise.all([
        api.get<ApiResponse<{data: Group[]}>>('/groups'),
        api.get<ApiResponse<{data: User[]}>>('/teachers')
      ]);
      
      const groupsData = (groupsRes.data.data as any).data || groupsRes.data.data;
      setGroups(groupsData);
      
      const teachersData = (teachersRes.data.data as any).data || teachersRes.data.data;
      setTeachers(teachersData);
      
      if (selectedGroup) {
        const res = await api.get<ApiResponse<Timetable[]>>(`/timetables/group/${selectedGroup}`);
        setTimetables(res.data.data);
      } else {
        // Just fetch all if no group selected, although filtered view is better
        const res = await api.get<ApiResponse<{data: Timetable[]}>>('/timetables');
        setTimetables(res.data.data.data);
      }
    } catch (error) {
      toast.error('Failed to load timetable data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedGroup]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      await api.post('/timetables', formData);
      toast.success('Timetable entry created');
      setShowAddModal(false);
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save timetable');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this session?')) return;
    try {
      await api.delete(`/timetables/${id}`);
      toast.success('Session deleted');
      fetchData();
    } catch (error) {
      toast.error('Failed to delete session');
    }
  };

  const getDaySessions = (dayKey: string) => {
    return timetables
      .filter(t => t.day_of_week === dayKey)
      .sort((a, b) => a.start_time.localeCompare(b.start_time));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Academic Timetable</h1>
          <p className="text-slate-500">Manage schedules for all groups</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <select 
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 font-medium text-slate-700"
            >
              <option value="">All Groups</option>
              {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
            </select>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition-all shadow-lg"
          >
            <Plus className="w-5 h-5" />
            Add Session
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
        {DAYS.map(day => (
          <div key={day.key} className="flex flex-col gap-4">
            <div className="bg-slate-100 p-3 rounded-xl text-center">
              <span className="font-bold text-slate-700 uppercase text-xs tracking-wider">{day.label}</span>
            </div>
            <div className="flex flex-col gap-3 min-h-[500px]">
              {getDaySessions(day.key).map(session => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={session.id}
                  className="group relative bg-white p-4 rounded-2xl shadow-sm border border-slate-100 hover:border-primary-200 hover:shadow-md transition-all"
                >
                  <div className="space-y-2">
                    <div className="text-xs font-bold text-primary-600 uppercase tracking-tight">
                      {session.start_time.substring(0, 5)} - {session.end_time.substring(0, 5)}
                    </div>
                    <div className="font-bold text-slate-800 leading-tight">{session.group?.name}</div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <Users className="w-3 h-3" />
                      <span>{session.teacher?.name}</span>
                    </div>
                    {session.room && (
                      <div className="flex items-center gap-1.5 text-xs text-slate-400">
                        <MapPin className="w-3 h-3" />
                        <span>Room: {session.room}</span>
                      </div>
                    )}
                  </div>
                  <button 
                    onClick={() => handleDelete(session.id)}
                    className="absolute -top-2 -right-2 p-1.5 bg-red-50 text-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </motion.div>
              ))}
              {getDaySessions(day.key).length === 0 && !loading && (
                <div className="flex-1 rounded-2xl border-2 border-dashed border-slate-100 flex items-center justify-center p-4">
                  <span className="text-slate-300 text-[10px] font-bold uppercase">No sessions</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Session Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="text-xl font-bold">Add Timetable Session</h3>
                <button onClick={() => setShowAddModal(false)}><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleSubmit} className="p-8 space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Group</label>
                  <select 
                    required
                    value={formData.group_id}
                    onChange={(e) => setFormData({...formData, group_id: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none bg-white"
                  >
                    <option value="">Select a group</option>
                    {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Teacher</label>
                  <select 
                    required
                    value={formData.teacher_id}
                    onChange={(e) => setFormData({...formData, teacher_id: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none bg-white"
                  >
                    <option value="">Select a teacher</option>
                    {teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Day</label>
                  <select 
                    required
                    value={formData.day_of_week}
                    onChange={(e) => setFormData({...formData, day_of_week: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none bg-white"
                  >
                    {DAYS.map(d => <option key={d.key} value={d.key}>{d.label}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Start Time</label>
                    <input 
                      required
                      type="time" 
                      value={formData.start_time}
                      onChange={(e) => setFormData({...formData, start_time: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">End Time</label>
                    <input 
                      required
                      type="time" 
                      value={formData.end_time}
                      onChange={(e) => setFormData({...formData, end_time: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Room / Classroom</label>
                  <input 
                    type="text" 
                    value={formData.room}
                    onChange={(e) => setFormData({...formData, room: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none"
                    placeholder="e.g., Room 102"
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={formLoading}
                  className="w-full py-4 bg-primary-600 text-white rounded-2xl font-bold shadow-xl flex items-center justify-center gap-2 hover:bg-primary-700 transition-all"
                >
                  {formLoading && <Loader2 className="w-5 h-5 animate-spin" />}
                  Save Schedule
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DirectorTimetable;
