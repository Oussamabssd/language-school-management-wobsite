import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import {
  GraduationCap, BookOpen, Calendar, Award,
  Star, Loader2, TrendingUp, BarChart3, Clock, MapPin
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Grade {
  id: number;
  grade: string;
  remark: string | null;
  exam: {
    id: number;
    title: string;
    quarter: string;
    exam_date: string;
    max_score: number;
    type: string;
    course: { title: string };
    group: { name: string };
  };
}

type QuarterData = Record<'Q1' | 'Q2' | 'Q3' | 'Q4', Grade[]>;

const QUARTERS = ['Q1', 'Q2', 'Q3', 'Q4'] as const;

const quarterColors = {
  Q1: { badge: 'bg-blue-100 text-blue-700', border: 'border-blue-200', dot: 'bg-blue-500' },
  Q2: { badge: 'bg-purple-100 text-purple-700', border: 'border-purple-200', dot: 'bg-purple-500' },
  Q3: { badge: 'bg-orange-100 text-orange-700', border: 'border-orange-200', dot: 'bg-orange-500' },
  Q4: { badge: 'bg-green-100 text-green-700', border: 'border-green-200', dot: 'bg-green-500' },
};

const StudentExamNotes: React.FC = () => {
  const { user } = useAuth();
  const [quarterData, setQuarterData] = useState<QuarterData>({ Q1: [], Q2: [], Q3: [], Q4: [] });
  const [upcomingExams, setUpcomingExams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeQuarter, setActiveQuarter] = useState<'Q1' | 'Q2' | 'Q3' | 'Q4'>('Q1');

  useEffect(() => {
    const fetchGrades = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const res = await api.get('/student/grades');
        const data = res.data.data as QuarterData;
        // Convert filter objects to arrays
        const normalized: QuarterData = { Q1: [], Q2: [], Q3: [], Q4: [] };
        QUARTERS.forEach(q => {
          const qData = data[q];
          if (qData) {
            normalized[q] = Object.values(qData) as Grade[];
          }
        });
        setQuarterData(normalized);
        // Auto-select first quarter with data
        const firstWithData = QUARTERS.find(q => normalized[q].length > 0);
        if (firstWithData) setActiveQuarter(firstWithData);

        // Fetch upcoming exams
        const examsRes = await api.get('/exams');
        const allExams = examsRes.data.data?.data || examsRes.data.data || [];
        const today = new Date().toISOString().split('T')[0];
        setUpcomingExams(allExams.filter((e: any) => e.exam_date >= today && e.status === 'scheduled'));
      } catch (error) {
        console.error('Failed to load grades');
      } finally {
        setLoading(false);
      }
    };
    fetchGrades();
  }, [user]);

  const totalGrades = QUARTERS.reduce((acc, q) => acc + quarterData[q].length, 0);

  const calcAvg = (grades: Grade[]) => {
    if (!grades.length) return null;
    const sum = grades.reduce((acc, g) => acc + parseFloat(g.grade), 0);
    return (sum / grades.length).toFixed(2);
  };

  const overallAvg = () => {
    const all = QUARTERS.flatMap(q => quarterData[q]);
    if (!all.length) return '—';
    const sum = all.reduce((acc, g) => acc + parseFloat(g.grade), 0);
    return (sum / all.length).toFixed(2);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-primary-600" />
      </div>
    );
  }

  const activeGrades = quarterData[activeQuarter];
  const avgScore = calcAvg(activeGrades);

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">My Exam Results 🎓</h1>
          <p className="text-slate-500 mt-1">Track your academic performance across all quarters.</p>
        </div>

        {/* Overall Stats */}
        <div className="flex gap-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm px-6 py-4 text-center">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Overall Avg</p>
            <p className="text-3xl font-black text-primary-600">{overallAvg()}</p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm px-6 py-4 text-center">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Exams</p>
            <p className="text-3xl font-black text-slate-800">{totalGrades}</p>
          </div>
        </div>
      </div>
      
      {/* Upcoming Exams */}
      {upcomingExams.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary-600" />
            Upcoming Exams
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcomingExams.map((exam) => (
              <div key={exam.id} className="bg-white p-5 rounded-3xl border border-primary-100 shadow-sm shadow-primary-50 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary-50 rounded-full -mr-12 -mt-12 group-hover:scale-110 transition-transform" />
                <div className="relative">
                  <div className="flex justify-between items-start mb-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${quarterColors[exam.quarter as 'Q1'].badge}`}>
                      {exam.quarter}
                    </span>
                    <div className="text-right">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Date</p>
                      <p className="text-sm font-black text-slate-800">{new Date(exam.exam_date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <h3 className="font-bold text-slate-800 text-lg mb-1">{exam.title}</h3>
                  <p className="text-sm text-slate-500 mb-4">{exam.course.title}</p>
                  <div className="flex items-center justify-between text-xs font-bold pt-4 border-t border-slate-50">
                    <span className="flex items-center gap-1 text-slate-500"><Clock className="w-3.5 h-3.5" /> {exam.start_time?.substring(0, 5)}</span>
                    <span className="flex items-center gap-1 text-primary-600 bg-primary-50 px-2 py-1 rounded-lg"><MapPin className="w-3.5 h-3.5" /> {exam.classroom}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quarter Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {QUARTERS.map(q => {
          const grades = quarterData[q];
          const avg = calcAvg(grades);
          const colors = quarterColors[q];
          return (
            <button
              key={q}
              onClick={() => setActiveQuarter(q)}
              className={`relative p-5 rounded-2xl border-2 text-left transition-all ${
                activeQuarter === q
                  ? `${colors.border} shadow-lg bg-white`
                  : 'border-slate-100 bg-white hover:border-slate-200 hover:shadow-sm'
              }`}
            >
              {activeQuarter === q && (
                <div className={`absolute top-3 right-3 w-2 h-2 rounded-full ${colors.dot}`} />
              )}
              <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-3 ${colors.badge}`}>
                {q}
              </span>
              <p className="text-2xl font-black text-slate-800">{avg || '—'}</p>
              <p className="text-xs text-slate-400 font-medium mt-0.5">{grades.length} exam{grades.length !== 1 ? 's' : ''}</p>
            </button>
          );
        })}
      </div>

      {/* Active Quarter Grades */}
      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${quarterColors[activeQuarter].badge}`}>
              {activeQuarter}
            </span>
            <h2 className="text-xl font-bold text-slate-800">Quarter {activeQuarter.replace('Q', '')} Results</h2>
          </div>
          {avgScore && (
            <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-4 py-2">
              <BarChart3 className="w-4 h-4 text-slate-400" />
              <span className="text-sm font-bold text-slate-700">Avg: <span className="text-primary-600">{avgScore}/20</span></span>
            </div>
          )}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeQuarter}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {activeGrades.length === 0 ? (
              <div className="p-16 text-center">
                <GraduationCap className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-slate-800 mb-1">No results yet for {activeQuarter}</h3>
                <p className="text-slate-400">Your grades will appear here once your teacher assigns them.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-50">
                {activeGrades.map((grade) => {
                  const gradeNum = parseFloat(grade.grade);
                  const maxScore = grade.exam.max_score || 20;
                  const percent = Math.min((gradeNum / maxScore) * 100, 100);
                  const isPassing = gradeNum >= maxScore / 2;

                  return (
                    <div key={grade.id} className="p-6 hover:bg-slate-50/50 transition-colors">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4 flex-1">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg shrink-0 ${
                            isPassing ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                          }`}>
                            {gradeNum.toFixed(0)}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-slate-800 mb-0.5">{grade.exam.title}</h3>
                            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mb-3">
                              <span className="flex items-center gap-1.5"><BookOpen className="w-3 h-3" />{grade.exam.course.title}</span>
                              <span className="flex items-center gap-1.5"><Calendar className="w-3 h-3" />{new Date(grade.exam.exam_date).toLocaleDateString()}</span>
                              {grade.exam.type && <span className="flex items-center gap-1.5"><Award className="w-3 h-3" />{grade.exam.type}</span>}
                            </div>
                            {/* Progress bar */}
                            <div className="w-full max-w-xs h-2 bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all ${isPassing ? 'bg-green-400' : 'bg-red-400'}`}
                                style={{ width: `${percent}%` }}
                              />
                            </div>
                            {grade.remark && (
                              <p className="mt-3 text-sm text-slate-500 italic bg-slate-50 rounded-xl px-3 py-2 border border-slate-100">
                                💬 "{grade.remark}"
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-3xl font-black text-slate-800">{gradeNum.toFixed(1)}</div>
                          <div className="text-xs text-slate-400 font-bold">/ {maxScore}</div>
                          <span className={`inline-block mt-2 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                            isPassing ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {isPassing ? 'Pass' : 'Fail'}
                          </span>
                          {gradeNum >= maxScore * 0.8 && (
                            <div className="mt-1 flex justify-end">
                              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default StudentExamNotes;
