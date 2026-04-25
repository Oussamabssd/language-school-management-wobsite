import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import type { ApiResponse } from '../../types';
import { 
  GraduationCap, BookOpen, Calendar, 
  Loader2,
  Award, Star
} from 'lucide-react';
import { motion } from 'framer-motion';

interface ExamGrade {
  id: number;
  exam: {
    id: number;
    title: string;
    type: string;
    max_score: number;
    date: string;
    course: {
      title: string;
    }
  };
  score: string;
  remark: string | null;
}

const StudentExamNotes: React.FC = () => {
  const { user } = useAuth();
  const [grades, setGrades] = useState<ExamGrade[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      // Fetch exam grades for this student
      const res = await api.get<ApiResponse<ExamGrade[]>>(`/grades/student/${user.id}`);
      setGrades(res.data.data);
    } catch (error) {
      console.error('Failed to load exam grades');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-primary-600" />
      </div>
    );
  }

  const averageGrade = grades.length > 0 
    ? (grades.reduce((acc, g) => acc + parseFloat(g.score), 0) / grades.length).toFixed(2)
    : '0.00';

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">My Exam Results 🎓</h1>
          <p className="text-slate-500 mt-2">Track your academic performance across all subjects.</p>
        </div>
        
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-6">
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Average</span>
            <span className="text-3xl font-black text-primary-600">{averageGrade}</span>
          </div>
          <div className="w-px h-10 bg-slate-100" />
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Exams</span>
            <span className="text-3xl font-black text-slate-800">{grades.length}</span>
          </div>
        </div>
      </div>

      {grades.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm">
          <GraduationCap className="w-16 h-16 text-slate-200 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-800 mb-2">No exam results yet</h3>
          <p className="text-slate-500">Your grades will appear here once your exams are corrected.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {grades.map((grade) => (
            <motion.div 
              key={grade.id}
              whileHover={{ y: -5 }}
              className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden group"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div className="p-3 bg-primary-50 text-primary-600 rounded-2xl group-hover:bg-primary-600 group-hover:text-white transition-colors">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-3xl font-black text-slate-800">{parseFloat(grade.score).toFixed(2)}</span>
                    <span className="text-xs font-bold text-slate-400">/ {grade.exam.max_score}</span>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-slate-800 mb-1">{grade.exam.title}</h3>
                <p className="text-xs text-primary-600 font-bold uppercase tracking-wider mb-4">
                  {grade.exam.course.title}
                </p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(grade.exam.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Award className="w-4 h-4 text-yellow-500" />
                    <span>Type: {grade.exam.type}</span>
                  </div>
                </div>

                {grade.remark && (
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 italic text-sm text-slate-600">
                    "{grade.remark}"
                  </div>
                )}
              </div>
              
              <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex justify-between items-center">
                <span className={`text-[10px] font-black uppercase tracking-widest ${
                  parseFloat(grade.score) >= grade.exam.max_score / 2 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {parseFloat(grade.score) >= grade.exam.max_score / 2 ? 'Passed' : 'Failed'}
                </span>
                <Star className={`w-4 h-4 ${parseFloat(grade.score) >= grade.exam.max_score * 0.8 ? 'text-yellow-400 fill-yellow-400' : 'text-slate-200'}`} />
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentExamNotes;
