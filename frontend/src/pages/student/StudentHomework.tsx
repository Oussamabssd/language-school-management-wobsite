import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import type { ApiResponse } from '../../types';
import { 
  FileText, Download, Clock, 
  CheckCircle2, AlertCircle, Loader2,
  Trophy, MessageSquare
} from 'lucide-react';
import { motion } from 'framer-motion';

interface Homework {
  id: number;
  title: string;
  description: string;
  due_date: string;
  file_path: string | null;
  teacher?: {
    first_name: string;
    last_name: string;
  };
  course?: {
    title: string;
  };
}

interface GradeInfo {
  id: number;
  assignment_id: number;
  grade: string | null;
  teacher_remark: string | null;
  assignment?: Homework;
}

const StudentHomework: React.FC = () => {
  const { user } = useAuth();
  const [homeworks, setHomeworks] = useState<Homework[]>([]);
  const [grades, setGrades] = useState<Record<number, GradeInfo>>({});
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      // For simplicity, let's fetch homeworks for the student's group
      // If student has multiple groups, we'd need to handle that. 
      // Using the first group for now.
      const groupId = user.groups?.[0]?.id;
      if (groupId) {
        const homeworkRes = await api.get<ApiResponse<Homework[]>>(`/assignments`); 
        // Note: Filtered by course/group on backend is better, but let's assume we get relevant ones
        const allHomework = (homeworkRes.data.data as any).data || homeworkRes.data.data;
        setHomeworks(allHomework);

        // Fetch grades for this student
        const gradesRes = await api.get<ApiResponse<GradeInfo[]>>(`/students/${user.id}/homework-grades`);
        const gradesMap = (gradesRes.data.data as GradeInfo[]).reduce((acc, curr) => {
          acc[curr.assignment_id] = curr;
          return acc;
        }, {} as Record<number, GradeInfo>);
        setGrades(gradesMap);
      }
    } catch (error) {
      console.error('Failed to load homework');
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

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">My Homework 📚</h1>
        <p className="text-slate-500 mt-2">View your assignments, download documents, and check your grades.</p>
      </div>

      {homeworks.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <FileText className="w-10 h-10 text-slate-300" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">No homework assigned yet</h3>
          <p className="text-slate-500">Check back later for new assignments from your teachers.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {homeworks.map((hw) => {
            const gradeInfo = grades[hw.id];
            const isDone = !!gradeInfo && gradeInfo.grade !== null && gradeInfo.grade !== undefined;
            const isPastDue = hw.due_date && new Date(hw.due_date) < new Date();

            return (
              <motion.div 
                key={hw.id}
                whileHover={{ y: -4 }}
                className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col"
              >
                <div className="p-6 flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-2xl ${isDone ? 'bg-green-50 text-green-600' : 'bg-primary-50 text-primary-600'}`}>
                        <FileText className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-800">{hw.title}</h3>
                        <p className="text-xs text-primary-600 font-bold uppercase tracking-wider">
                          {hw.course?.title} • {hw.teacher?.first_name} {hw.teacher?.last_name}
                        </p>
                      </div>
                    </div>
                    {isDone ? (
                      <span className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                        <CheckCircle2 className="w-3 h-3" />
                        GRADED
                      </span>
                    ) : isPastDue ? (
                      <span className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold">
                        <AlertCircle className="w-3 h-3" />
                        OVERDUE
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">
                        <Clock className="w-3 h-3" />
                        PENDING
                      </span>
                    )}
                  </div>

                  <p className="text-slate-600 text-sm mb-6 line-clamp-2">
                    {hw.description || 'No additional instructions provided.'}
                  </p>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Due Date</p>
                      <p className="text-sm font-bold text-slate-700">
                        {hw.due_date ? new Date(hw.due_date).toLocaleDateString() : 'No deadline'}
                      </p>
                    </div>
                    {hw.file_path && (
                      <a 
                        href={hw.file_path}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-4 rounded-2xl bg-primary-50 border border-primary-100 hover:bg-primary-100 transition-colors group"
                      >
                        <p className="text-[10px] font-bold text-primary-400 uppercase mb-1">Document</p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-primary-700">Download PDF</span>
                          <Download className="w-4 h-4 text-primary-600 group-hover:translate-y-0.5 transition-transform" />
                        </div>
                      </a>
                    )}
                  </div>

                  {/* Feedback Section */}
                  {isDone && (
                    <div className="mt-4 pt-4 border-t border-slate-50 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Trophy className="w-5 h-5 text-yellow-500" />
                          <span className="text-sm font-bold text-slate-700">My Grade</span>
                        </div>
                        <div className="text-2xl font-black text-primary-600">
                          {gradeInfo.grade} <span className="text-sm font-bold text-slate-300">/ 20</span>
                        </div>
                      </div>
                      {gradeInfo.teacher_remark && (
                        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100">
                          <div className="flex items-center gap-2 mb-2">
                            <MessageSquare className="w-4 h-4 text-amber-600" />
                            <span className="text-xs font-bold text-amber-700 uppercase">Teacher's Remark</span>
                          </div>
                          <p className="text-sm text-amber-800 italic">"{gradeInfo.teacher_remark}"</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default StudentHomework;
