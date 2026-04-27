import React, { useState, useEffect } from 'react';
import { 
  Heart, Calendar, AlertCircle, MessageSquare, 
  GraduationCap, Loader2, User, Clock, MapPin, BookOpen,
  BarChart3, Star
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api';
import toast from 'react-hot-toast';

interface Student {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  groups: any[];
}

const QUARTERS = ['Q1', 'Q2', 'Q3', 'Q4'] as const;
type TabType = 'timetable' | 'absences' | 'grades' | 'remarks';

const quarterColors: Record<string, string> = {
  Q1: 'bg-blue-100 text-blue-700',
  Q2: 'bg-purple-100 text-purple-700',
  Q3: 'bg-orange-100 text-orange-700',
  Q4: 'bg-green-100 text-green-700',
};

const ParentDashboard: React.FC = () => {
  const [children, setChildren] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('timetable');
  const [data, setData] = useState<any[] | Record<string, any[]>>([]);
  const [upcomingExams, setUpcomingExams] = useState<any[]>([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [gradeQuarter, setGradeQuarter] = useState<'Q1'|'Q2'|'Q3'|'Q4'>('Q1');

  useEffect(() => {
    const fetchChildren = async () => {
      try {
        const res = await api.get('/parent/students');
        const kids = res.data.data;
        setChildren(kids);
        if (kids.length > 0) setSelectedStudent(kids[0]);
      } catch (error) {
        toast.error('Failed to load children data');
      } finally {
        setLoading(false);
      }
    };
    fetchChildren();
  }, []);

  useEffect(() => {
    if (!selectedStudent) return;
    const fetchTabData = async () => {
      setDataLoading(true);
      try {
        let res;
        if (activeTab === 'grades') {
          res = await api.get(`/parent/students/${selectedStudent.id}/grades`);
          // Normalize filter objects to arrays
          const raw = res.data.data as Record<string, any>;
          const normalized: Record<string, any[]> = {};
          QUARTERS.forEach(q => { normalized[q] = raw[q] ? Object.values(raw[q]) : []; });
          setData(normalized);
        } else {
          res = await api.get(`/parent/students/${selectedStudent.id}/${activeTab}`);
          const tabData = res.data.data?.data || res.data.data;
          setData(Array.isArray(tabData) ? tabData : []);
        }

        // Fetch upcoming exams if on grades tab
        if (activeTab === 'grades') {
          const examsRes = await api.get('/exams');
          const allExams = examsRes.data.data?.data || examsRes.data.data || [];
          const today = new Date().toISOString().split('T')[0];
          setUpcomingExams(allExams.filter((e: any) => e.exam_date >= today && e.status === 'scheduled'));
        } else {
          setUpcomingExams([]);
        }
      } catch (error) {
        console.error('Failed to fetch tab data');
      } finally {
        setDataLoading(false);
      }
    };
    fetchTabData();
  }, [selectedStudent, activeTab]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  const gradeData = (data as Record<string, any[]>);
  const activeGrades = activeTab === 'grades' ? (gradeData[gradeQuarter] || []) : [];
  const calcAvg = (grades: any[]) => {
    if (!grades.length) return '—';
    return (grades.reduce((a, g) => a + parseFloat(g.grade), 0) / grades.length).toFixed(1);
  };

  const tabs: { key: TabType; label: string; icon: React.ReactNode }[] = [
    { key: 'timetable', label: 'Timetable', icon: <Calendar className="w-4 h-4" /> },
    { key: 'absences', label: 'Absences', icon: <AlertCircle className="w-4 h-4" /> },
    { key: 'grades', label: 'Grades', icon: <GraduationCap className="w-4 h-4" /> },
    { key: 'remarks', label: 'Remarks', icon: <MessageSquare className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
            <Heart className="w-8 h-8 text-red-500" /> Parent Dashboard
          </h1>
          <p className="text-slate-500 mt-1">Monitor your children's progress and attendance.</p>
        </div>

        {children.length > 1 && (
          <div className="flex gap-2 bg-white p-1 rounded-2xl border border-slate-200 shadow-sm">
            {children.map(child => (
              <button
                key={child.id}
                onClick={() => setSelectedStudent(child)}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                  selectedStudent?.id === child.id
                    ? 'bg-primary-600 text-white shadow-md shadow-primary-200'
                    : 'text-slate-500 hover:bg-slate-50'
                }`}
              >{child.first_name}</button>
            ))}
          </div>
        )}
      </div>

      {selectedStudent && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Student Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold border-4 border-white shadow-lg">
                  {selectedStudent.first_name[0]}{selectedStudent.last_name[0]}
                </div>
                <h2 className="text-xl font-bold text-slate-800">{selectedStudent.first_name} {selectedStudent.last_name}</h2>
                <p className="text-sm text-slate-500">{selectedStudent.email}</p>
              </div>
              <div className="space-y-4 pt-4 border-t border-slate-50">
                <div className="flex items-center gap-3 text-sm">
                  <GraduationCap className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-600 font-medium">{selectedStudent.groups?.[0]?.name || 'No Group'}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <BookOpen className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-600 font-medium">{selectedStudent.groups?.[0]?.level?.name || 'Beginner'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Tabs */}
            <div className="flex bg-slate-100/50 p-1.5 rounded-2xl w-fit">
              {tabs.map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                    activeTab === tab.key
                      ? 'bg-white text-primary-600 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 min-h-[400px]">
              {dataLoading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="w-6 h-6 animate-spin text-primary-600" />
                </div>
              ) : (
                <div className="p-6">
                  <AnimatePresence mode="wait">
                    <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>

                      {/* Timetable Tab */}
                      {activeTab === 'timetable' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {(data as any[]).length > 0 ? (data as any[]).map((item: any) => (
                            <div key={item.id} className="p-4 rounded-2xl border border-slate-50 bg-slate-50/50 flex gap-4">
                              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center font-bold">
                                {item.course?.title?.[0]}
                              </div>
                              <div>
                                <h4 className="font-bold text-slate-800">{item.course?.title}</h4>
                                <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {item.day_of_week} {item.start_time} - {item.end_time}</span>
                                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {item.room}</span>
                                </div>
                                <div className="flex items-center gap-1 mt-2 text-xs font-medium text-slate-600">
                                  <User className="w-3 h-3" /> Prof. {item.teacher?.last_name}
                                </div>
                              </div>
                            </div>
                          )) : (
                            <div className="col-span-2 py-12 text-center text-slate-400">No classes scheduled yet.</div>
                          )}
                        </div>
                      )}

                      {/* Absences Tab */}
                      {activeTab === 'absences' && (
                        <div className="space-y-4">
                          {(data as any[]).length > 0 ? (data as any[]).map((item: any) => (
                            <div key={item.id} className="flex items-center justify-between p-4 rounded-2xl border border-red-50 bg-red-50/30">
                              <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
                                  <AlertCircle className="w-5 h-5" />
                                </div>
                                <div>
                                <p className="font-bold text-slate-800">Absent: {item.course?.title || 'Class'}</p>
                                  <p className="text-xs text-slate-500">{new Date(item.date).toLocaleDateString()}</p>
                                </div>
                              </div>
                              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                item.status === 'justified' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                              }`}>
                                {item.status === 'justified' ? 'Justified' : 'Unjustified'}
                              </span>
                            </div>
                          )) : (
                            <div className="py-12 text-center text-slate-400">Perfect attendance! No absences recorded.</div>
                          )}
                        </div>
                      )}

                      {/* Grades Tab */}
                      {activeTab === 'grades' && (
                        <div>
                          {/* Upcoming Exams for child */}
                          {upcomingExams.length > 0 && (
                            <div className="mb-8 space-y-3">
                              <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <Calendar className="w-4 h-4" /> Upcoming Exams
                              </h3>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {upcomingExams.map(exam => (
                                  <div key={exam.id} className="p-4 rounded-2xl border border-primary-100 bg-primary-50/30 flex justify-between items-center">
                                    <div>
                                      <p className="font-bold text-slate-800 text-sm">{exam.title}</p>
                                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{exam.course.title} · {new Date(exam.exam_date).toLocaleDateString()}</p>
                                    </div>
                                    <div className="text-right">
                                      <span className="block text-[10px] font-black text-primary-600 bg-white px-2 py-0.5 rounded-lg border border-primary-100">{exam.start_time?.substring(0, 5)}</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Quarter selector */}
                          <div className="flex gap-2 mb-6">
                            {QUARTERS.map(q => (
                              <button
                                key={q}
                                onClick={() => setGradeQuarter(q)}
                                className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                                  gradeQuarter === q ? 'bg-slate-900 text-white' : `${quarterColors[q]} hover:opacity-80`
                                }`}
                              >{q}</button>
                            ))}
                          </div>

                          {activeGrades.length > 0 && (
                            <div className="flex items-center gap-3 mb-4 px-4 py-3 bg-slate-50 rounded-xl border border-slate-100">
                              <BarChart3 className="w-4 h-4 text-slate-400" />
                              <span className="text-sm font-bold text-slate-700">
                                Average: <span className="text-primary-600">{calcAvg(activeGrades)}/20</span>
                              </span>
                              <span className="text-sm text-slate-400">·</span>
                              <span className="text-sm text-slate-500">{activeGrades.length} exam(s)</span>
                            </div>
                          )}

                          <div className="space-y-4">
                            {activeGrades.length > 0 ? activeGrades.map((item: any) => {
                              const gradeNum = parseFloat(item.grade);
                              const maxScore = item.exam?.max_score || 20;
                              const isPassing = gradeNum >= maxScore / 2;
                              const percent = Math.min((gradeNum / maxScore) * 100, 100);
                              return (
                                <div key={item.id} className="p-5 rounded-2xl border border-slate-100 bg-slate-50/30">
                                  <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 mb-1">
                                        <h4 className="font-bold text-slate-800">{item.exam?.title}</h4>
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${quarterColors[item.exam?.quarter]}`}>
                                          {item.exam?.quarter}
                                        </span>
                                      </div>
                                      <p className="text-xs text-primary-600 font-bold uppercase tracking-wider mb-3">
                                        {item.exam?.course?.title}
                                      </p>
                                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                        <div className={`h-full rounded-full ${isPassing ? 'bg-green-400' : 'bg-red-400'}`} style={{ width: `${percent}%` }} />
                                      </div>
                                      {item.remark && (
                                        <p className="mt-2 text-xs text-slate-500 italic">💬 "{item.remark}"</p>
                                      )}
                                    </div>
                                    <div className="text-right shrink-0">
                                      <div className="text-2xl font-black text-slate-800">{gradeNum.toFixed(1)}</div>
                                      <div className="text-xs text-slate-400">/ {maxScore}</div>
                                      <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                                        isPassing ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                      }`}>{isPassing ? 'Pass' : 'Fail'}</span>
                                      {gradeNum >= maxScore * 0.8 && <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 mt-1 ml-auto" />}
                                    </div>
                                  </div>
                                </div>
                              );
                            }) : (
                              <div className="py-12 text-center text-slate-400">
                                <GraduationCap className="w-12 h-12 mx-auto mb-3 text-slate-200" />
                                No grades available for {gradeQuarter}.
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Remarks Tab */}
                      {activeTab === 'remarks' && (
                        <div className="space-y-4">
                          {(data as any[]).length > 0 ? (data as any[]).map((item: any) => (
                            <div key={`${item.type}-${item.id}`} className="p-5 rounded-2xl border border-slate-50 bg-slate-50/50">
                              <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center gap-2">
                                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                    item.type === 'Homework' ? 'bg-primary-100 text-primary-600' : 'bg-amber-100 text-amber-600'
                                  }`}>
                                    <MessageSquare className="w-4 h-4" />
                                  </div>
                                  <div>
                                    <span className="font-bold text-slate-700 block leading-tight">{item.type} Remark</span>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.title}</span>
                                  </div>
                                </div>
                                <span className="text-xs text-slate-400">{new Date(item.date).toLocaleDateString()}</span>
                              </div>
                              <p className="text-slate-600 text-sm italic">"{item.remark}"</p>
                              <div className="mt-3 text-xs font-bold text-primary-600">
                                Course: {typeof item.course === 'object' ? item.course?.title : item.course}
                              </div>
                            </div>
                          )) : (
                            <div className="py-12 text-center text-slate-400">No teacher remarks available at this moment.</div>
                          )}
                        </div>
                      )}

                    </motion.div>
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParentDashboard;
