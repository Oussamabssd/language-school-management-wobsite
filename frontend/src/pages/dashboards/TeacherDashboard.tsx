import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import type { Timetable, ApiResponse, Group } from '../../types';
import { 
  Calendar, Users, 
  Clock, MapPin,
  ChevronRight, Loader2,
  X, Trophy, GraduationCap, BarChart
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const TeacherDashboard: React.FC = () => {
  const { user } = useAuth();
  const [timetables, setTimetables] = useState<Timetable[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [selectedSession, setSelectedSession] = useState<Timetable | null>(null);
  const [sessionAttendance, setSessionAttendance] = useState<Record<number, {status: string, reason: string}>>({});
  const [savingAttendance, setSavingAttendance] = useState(false);

  const fetchTeacherData = async () => {
    if (!user) return;

    try {
      const timetableRes = await api.get<ApiResponse<Timetable[]>>(`/timetables/teacher/${user.id}`);
      const timetableData = (timetableRes.data.data as any).data || timetableRes.data.data;
      setTimetables(Array.isArray(timetableData) ? timetableData : []);
    } catch (error) {
      console.error('Failed to load teacher data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeacherData();
  }, [user]);

  const handleOpenAttendance = async (session: Timetable) => {
    setSelectedSession(session);
    setSessionAttendance({});
    try {
      const today = new Date().toISOString().split('T')[0];
      const res = await api.get<ApiResponse<any[]>>(`/absences/timetable/${session.id}/${today}`);
      const existing = res.data.data;
      const initial: Record<number, {status: string, reason: string}> = {};
      existing.forEach((abs: any) => {
        initial[abs.student_id] = { status: abs.status, reason: abs.reason || '' };
      });
      setSessionAttendance(initial);
    } catch (error) {
      console.error('Failed to load existing attendance');
    }
  };

  const handleSaveAttendance = async () => {
    if (!selectedSession) return;
    setSavingAttendance(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      const absences = Object.entries(sessionAttendance).map(([studentId, data]) => ({
        student_id: parseInt(studentId),
        status: data.status,
        reason: data.reason
      }));

      await api.post('/absences/bulk', {
        timetable_id: selectedSession.id,
        date: today,
        absences
      });
      toast.success('Attendance updated');
      setSelectedSession(null);
    } catch (error) {
      toast.error('Failed to update attendance');
    } finally {
      setSavingAttendance(false);
    }
  };

  const toggleAttendance = (studentId: number) => {
    setSessionAttendance(prev => {
      const current = prev[studentId]?.status;
      const nextStatus = current === 'absent' ? 'present' : 'absent';
      return {
        ...prev,
        [studentId]: { status: nextStatus, reason: '' }
      };
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  const teachingGroups = user?.teaching_groups || [];

  return (
    <div className="space-y-8 pb-12 relative">
      {/* Welcome Header */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Hello, {user?.first_name}! 👋</h1>
          <p className="text-slate-500 mt-2">Here's what's happening with your classes today.</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-primary-50 px-6 py-4 rounded-2xl border border-primary-100 text-center">
            <p className="text-xs text-primary-600 font-bold uppercase tracking-wider mb-1">My Groups</p>
            <h3 className="text-2xl font-bold text-slate-800">{teachingGroups.length}</h3>
          </div>
          <div className="bg-blue-50 px-6 py-4 rounded-2xl border border-blue-100 text-center">
            <p className="text-xs text-blue-600 font-bold uppercase tracking-wider mb-1">Sessions</p>
            <h3 className="text-2xl font-bold text-slate-800">{timetables.length}</h3>
          </div>
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => window.location.href = '/teacher/grades'}
            className="bg-amber-50 px-6 py-4 rounded-2xl border border-amber-100 text-center cursor-pointer hover:bg-amber-100 transition-colors"
          >
            <p className="text-xs text-amber-600 font-bold uppercase tracking-wider mb-1">Academic</p>
            <div className="flex items-center justify-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              <h3 className="text-xl font-bold text-slate-800">Grades</h3>
            </div>
          </motion.button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Groups Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Users className="w-5 h-5 text-primary-600" />
              My Assigned Groups
            </h2>
          </div>

          {teachingGroups.length === 0 ? (
            <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center">
              <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500">You haven't been assigned to any groups yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {teachingGroups.map((group) => (
                <motion.div 
                  key={group.id}
                  whileHover={{ y: -4 }}
                  className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group cursor-pointer"
                  onClick={() => setSelectedGroup(group)}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-primary-50 text-primary-600 rounded-2xl">
                      <Users className="w-6 h-6" />
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-primary-500 transition-colors" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 mb-1">{group.name}</h3>
                  <p className="text-sm text-slate-500 mb-4">{group.level?.name || 'No Level'}</p>
                  <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                      <Users className="w-4 h-4 text-slate-400" />
                      {group.students?.length || 0} Members
                    </div>
                    <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase ${
                      group.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {group.status}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Schedule Sidebar */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary-600" />
            My Weekly Schedule
          </h2>

          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-4 bg-slate-50/50 border-b border-slate-100 flex justify-between items-center">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Scheduled Sessions</span>
            </div>
            <div className="divide-y divide-slate-50 max-h-[600px] overflow-y-auto">
              {timetables.length === 0 ? (
                <div className="p-8 text-center text-slate-400">
                  <p>No classes scheduled for you.</p>
                </div>
              ) : (
                timetables
                  .sort((a, b) => {
                    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
                    const dayDiff = days.indexOf(a.day_of_week) - days.indexOf(b.day_of_week);
                    if (dayDiff !== 0) return dayDiff;
                    return a.start_time.localeCompare(b.start_time);
                  })
                  .map((item) => (
                    <div key={item.id} className="p-5 hover:bg-slate-50 transition-colors group/item">
                      <div className="flex justify-between items-start mb-3">
                        <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                          {item.day_of_week}
                        </span>
                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          {item.start_time.substring(0, 5)} - {item.end_time.substring(0, 5)}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-bold text-slate-800">{item.group?.name || 'Group Session'}</h4>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm text-slate-500">
                            <MapPin className="w-4 h-4 text-slate-400" />
                            Room: {item.room || 'N/A'}
                          </div>
                          <button 
                            onClick={() => handleOpenAttendance(item)}
                            className="text-xs font-bold text-primary-600 hover:text-primary-700 opacity-0 group-hover/item:opacity-100 transition-all flex items-center gap-1 bg-primary-50 px-2 py-1 rounded-lg"
                          >
                            Mark Attendance
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Group Members Modal */}
      <AnimatePresence>
        {selectedGroup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedGroup(null)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div>
                  <h3 className="text-xl font-bold text-slate-800">{selectedGroup.name} - Members</h3>
                  <p className="text-sm text-slate-500">{selectedGroup.students?.length || 0} students enrolled</p>
                </div>
                <button 
                  onClick={() => setSelectedGroup(null)}
                  className="p-2 hover:bg-slate-200 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>
              <div className="p-6 max-h-[60vh] overflow-y-auto">
                {(!selectedGroup.students || selectedGroup.students.length === 0) ? (
                  <div className="text-center py-12 text-slate-400">
                    <Users className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    <p>No students enrolled in this group yet.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedGroup.students.map((student) => (
                      <div key={student.id} className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                        <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold">
                          {student.first_name[0]}{student.last_name[0]}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 text-sm">{student.first_name} {student.last_name}</p>
                          <p className="text-xs text-slate-500">{student.email}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end">
                <button 
                  onClick={() => setSelectedGroup(null)}
                  className="px-6 py-2 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Attendance Modal */}
      <AnimatePresence>
        {selectedSession && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedSession(null)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                <div className="flex justify-between items-center mb-1">
                  <h3 className="text-xl font-bold text-slate-800">Attendance Marking</h3>
                  <button onClick={() => setSelectedSession(null)} className="p-2 hover:bg-slate-200 rounded-xl"><X className="w-5 h-5 text-slate-500" /></button>
                </div>
                <p className="text-sm text-slate-500">
                  {selectedSession.group?.name} • {selectedSession.day_of_week} • {selectedSession.start_time.substring(0, 5)}
                </p>
              </div>

              <div className="p-6 max-h-[60vh] overflow-y-auto space-y-3">
                {(!selectedSession.group?.students || selectedSession.group.students.length === 0) ? (
                  <p className="text-center py-8 text-slate-400 italic font-medium">No students in this group.</p>
                ) : (
                  selectedSession.group.students.map((student) => {
                    const isAbsent = sessionAttendance[student.id]?.status === 'absent';
                    return (
                      <div 
                        key={student.id} 
                        onClick={() => toggleAttendance(student.id)}
                        className={`flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer ${
                          isAbsent ? 'bg-red-50 border-red-100' : 'bg-green-50 border-green-100'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                            isAbsent ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                          }`}>
                            {student.first_name[0]}{student.last_name[0]}
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 text-sm">{student.first_name} {student.last_name}</p>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                              {isAbsent ? 'Absent' : 'Present'}
                            </p>
                          </div>
                        </div>
                        <div className={`w-6 h-6 rounded-lg flex items-center justify-center border-2 ${
                          isAbsent ? 'bg-red-600 border-red-600 text-white' : 'bg-white border-green-200'
                        }`}>
                          {isAbsent && <X className="w-4 h-4" />}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-3">
                <button 
                  onClick={() => setSelectedSession(null)}
                  className="flex-1 px-6 py-3 bg-white border border-slate-200 rounded-2xl font-bold text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSaveAttendance}
                  disabled={savingAttendance || !selectedSession.group?.students?.length}
                  className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-2xl font-bold hover:bg-primary-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary-200 disabled:opacity-50"
                >
                  {savingAttendance ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Save Attendance'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TeacherDashboard;
