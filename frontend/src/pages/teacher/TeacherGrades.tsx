import React, { useState, useEffect } from "react";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import {
  GraduationCap,
  Search,
  Save,
  CheckCircle2,
  Loader2,
  BookOpen,
  Users,
  ChevronDown,
  AlertCircle,
  Trophy,
  BarChart3,
  Bell,
  BellOff,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

interface Exam {
  id: number;
  title: string;
  quarter: string;
  exam_date: string;
  status: string;
  is_announced: boolean;
  max_score: number;
  course: { id: number; title: string };
  group: { id: number; name: string };
}

interface Student {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}

interface GradeEntry {
  studentId: number;
  grade: string;
  remark: string;
  existingId?: number;
}

const TeacherGrades: React.FC = () => {
  const { user } = useAuth();
  const [exams, setExams] = useState<Exam[]>([]);
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [gradeEntries, setGradeEntries] = useState<Record<number, GradeEntry>>(
    {},
  );
  const [rankings, setRankings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [rankingLoading, setRankingLoading] = useState(false);
  const [viewMode, setViewMode] = useState<"grading" | "ranking">("grading");
  const [saving, setSaving] = useState(false);
  const [filterQ, setFilterQ] = useState("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchExams = async () => {
      setLoading(true);
      try {
        const res = await api.get("/exams");
        const data = res.data.data?.data || res.data.data;
        setExams(Array.isArray(data) ? data : []);
      } catch {
        toast.error("Failed to load exams");
      } finally {
        setLoading(false);
      }
    };
    fetchExams();
  }, []);

  const fetchRankings = async (groupId: number, quarter: string) => {
    setRankingLoading(true);
    try {
      const res = await api.get(
        `/grades/ranking/${groupId}?quarter=${quarter}`,
      );
      setRankings(res.data.data);
    } catch {
      toast.error("Failed to load rankings");
    } finally {
      setRankingLoading(false);
    }
  };

  const handleSelectExam = async (exam: Exam) => {
    setSelectedExam(exam);
    if (viewMode === "ranking") {
      fetchRankings(exam.group.id, exam.quarter);
    } else {
      setLoading(true);
      setGradeEntries({});
      try {
        // Fetch students in the group
        const groupRes = await api.get(`/groups/${exam.group.id}`);
        const groupStudents: Student[] = groupRes.data.data?.students || [];
        setStudents(groupStudents);

        // Fetch existing grades for this exam
        const gradesRes = await api.get(`/grades?exam_id=${exam.id}`);
        const existingGrades: any[] = gradesRes.data.data || [];

        const map: Record<number, GradeEntry> = {};
        groupStudents.forEach((s) => {
          const existing = existingGrades.find(
            (g: any) => g.student?.id === s.id || g.student_id === s.id,
          );
          map[s.id] = {
            studentId: s.id,
            grade: existing ? existing.grade?.toString() : "",
            remark: existing ? existing.remark || "" : "",
            existingId: existing?.id,
          };
        });
        setGradeEntries(map);
      } catch {
        toast.error("Failed to load student list");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSave = async () => {
    if (!selectedExam || !user) return;
    setSaving(true);
    let successCount = 0;
    let errorCount = 0;

    for (const [, entry] of Object.entries(gradeEntries)) {
      if (!entry.grade) continue; // skip empty
      const payload = {
        exam_id: selectedExam.id,
        student_id: entry.studentId,
        grade: parseFloat(entry.grade),
        remark: entry.remark,
        teacher_id: user.id,
      };
      try {
        if (entry.existingId) {
          await api.put(`/grades/${entry.existingId}`, payload);
        } else {
          await api.post("/grades", payload);
        }
        successCount++;
      } catch {
        errorCount++;
      }
    }

    setSaving(false);
    if (successCount > 0)
      toast.success(`${successCount} grade(s) saved successfully`);
    if (errorCount > 0) toast.error(`${errorCount} grade(s) failed to save`);
    // Refresh
    if (selectedExam) handleSelectExam(selectedExam);
  };

  const filteredExams = exams.filter((e) => {
    const matchQ = filterQ === "All" || e.quarter === filterQ;
    return matchQ;
  });

  const filteredStudents = students.filter((s) =>
    `${s.first_name} ${s.last_name}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  const quarterColors: Record<string, string> = {
    Q1: "bg-blue-100 text-blue-700",
    Q2: "bg-purple-100 text-purple-700",
    Q3: "bg-orange-100 text-orange-700",
    Q4: "bg-green-100 text-green-700",
  };

  const toggleAnnounce = async () => {
    if (!selectedExam) return;
    try {
      const newVal = !selectedExam.is_announced;
      await api.put(`/exams/${selectedExam.id}`, { is_announced: newVal });
      setSelectedExam({ ...selectedExam, is_announced: newVal });
      setExams((prev) =>
        prev.map((e) =>
          e.id === selectedExam.id ? { ...e, is_announced: newVal } : e,
        ),
      );
      toast.success(
        newVal
          ? "Grades announced to students! 📢"
          : "Grades hidden from students.",
      );
    } catch {
      toast.error("Failed to update announcement status");
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">
          Grade Management 🎓
        </h1>
        <p className="text-slate-500 mt-1">
          Select an exam and assign grades to your students.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Exam list */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4">
            <div className="flex gap-2 mb-4">
              {["All", "Q1", "Q2", "Q3", "Q4"].map((q) => (
                <button
                  key={q}
                  onClick={() => setFilterQ(q)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    filterQ === q
                      ? "bg-slate-900 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {q}
                </button>
              ))}
            </div>

            <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
              {loading && !selectedExam ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-primary-600" />
                </div>
              ) : filteredExams.length === 0 ? (
                <p className="text-center text-slate-400 py-8 text-sm">
                  No exams found
                </p>
              ) : (
                filteredExams.map((exam) => (
                  <button
                    key={exam.id}
                    onClick={() => handleSelectExam(exam)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all ${
                      selectedExam?.id === exam.id
                        ? "border-primary-500 bg-primary-50 shadow-sm"
                        : "border-slate-100 hover:border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="font-bold text-slate-800 text-sm leading-tight">
                        {exam.title}
                      </span>
                      <span
                        className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-black ${quarterColors[exam.quarter]}`}
                      >
                        {exam.quarter}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <BookOpen className="w-3 h-3" />
                      <span>{exam.course.title}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                      <Users className="w-3 h-3" />
                      <span>{exam.group.name}</span>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right: Grading table */}
        <div className="lg:col-span-2">
          {!selectedExam ? (
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-12 text-center h-full flex flex-col items-center justify-center">
              <GraduationCap className="w-16 h-16 text-slate-200 mb-4" />
              <h3 className="text-xl font-bold text-slate-800 mb-2">
                Select an Exam
              </h3>
              <p className="text-slate-500">
                Choose an exam from the left panel to start assigning grades.
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
              {/* Header */}
              <div className="p-6 border-b border-slate-100">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-black ${quarterColors[selectedExam.quarter]}`}
                      >
                        {selectedExam.quarter}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">
                        {new Date(selectedExam.exam_date).toLocaleDateString()}
                      </span>
                    </div>
                    <h2 className="text-xl font-bold text-slate-800">
                      {selectedExam.title}
                    </h2>
                    <p className="text-sm text-slate-500 mt-0.5">
                      {selectedExam.course.title} · {selectedExam.group.name} ·
                      Max: {selectedExam.max_score || 20}/20
                    </p>
                  </div>

                  <div className="flex gap-2 bg-slate-100 p-1.5 rounded-2xl">
                    <button
                      onClick={() => setViewMode("grading")}
                      className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                        viewMode === "grading"
                          ? "bg-white text-primary-600 shadow-sm"
                          : "text-slate-500 hover:text-slate-700"
                      }`}
                    >
                      Grading
                    </button>
                    <button
                      onClick={() => {
                        setViewMode("ranking");
                        fetchRankings(
                          selectedExam.group.id,
                          selectedExam.quarter,
                        );
                      }}
                      className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                        viewMode === "ranking"
                          ? "bg-white text-primary-600 shadow-sm"
                          : "text-slate-500 hover:text-slate-700"
                      }`}
                    >
                      Ranking
                    </button>
                  </div>

                  {viewMode === "grading" && (
                    <div className="flex items-center gap-3">
                      <button
                        onClick={toggleAnnounce}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all ${
                          selectedExam.is_announced
                            ? "bg-amber-100 text-amber-700"
                            : "bg-slate-100 text-slate-400 hover:bg-slate-200"
                        }`}
                        title={
                          selectedExam.is_announced
                            ? "Visible to students"
                            : "Hidden from students"
                        }
                      >
                        {selectedExam.is_announced ? (
                          <Bell className="w-4 h-4 fill-current" />
                        ) : (
                          <BellOff className="w-4 h-4" />
                        )}
                        {selectedExam.is_announced ? "Announced" : "Draft"}
                      </button>

                      <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-lg disabled:opacity-60"
                      >
                        {saving ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Save className="w-4 h-4" />
                        )}
                        Save Grades
                      </button>
                    </div>
                  )}
                </div>

                {viewMode === "grading" && (
                  <div className="relative mt-4">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                      placeholder="Search student..."
                    />
                  </div>
                )}
              </div>

              {/* Content */}
              {viewMode === "grading" ? (
                <>
                  {loading ? (
                    <div className="flex justify-center py-12">
                      <Loader2 className="w-6 h-6 animate-spin text-primary-600" />
                    </div>
                  ) : filteredStudents.length === 0 ? (
                    <div className="p-12 text-center text-slate-400">
                      <AlertCircle className="w-10 h-10 mx-auto mb-3 text-slate-200" />
                      <p className="font-medium">
                        No students found in this group
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-slate-50/80">
                            <th className="text-left text-xs font-black text-slate-400 uppercase tracking-wider px-6 py-4">
                              #
                            </th>
                            <th className="text-left text-xs font-black text-slate-400 uppercase tracking-wider px-6 py-4">
                              Student
                            </th>
                            <th className="text-left text-xs font-black text-slate-400 uppercase tracking-wider px-6 py-4">
                              Grade /20
                            </th>
                            <th className="text-left text-xs font-black text-slate-400 uppercase tracking-wider px-6 py-4">
                              Remark
                            </th>
                            <th className="text-left text-xs font-black text-slate-400 uppercase tracking-wider px-6 py-4">
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                          {filteredStudents.map((student, idx) => {
                            const entry = gradeEntries[student.id] || {
                              grade: "",
                              remark: "",
                              studentId: student.id,
                            };
                            const gradeNum = parseFloat(entry.grade);
                            const isPassing =
                              !isNaN(gradeNum) && gradeNum >= 10;

                            return (
                              <tr
                                key={student.id}
                                className="hover:bg-slate-50/50 transition-colors"
                              >
                                <td className="px-6 py-4 text-sm text-slate-400 font-bold">
                                  {idx + 1}
                                </td>
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-sm">
                                      {student.first_name[0]}
                                      {student.last_name[0]}
                                    </div>
                                    <div>
                                      <p className="font-bold text-slate-800 text-sm">
                                        {student.first_name} {student.last_name}
                                      </p>
                                      <p className="text-xs text-slate-400">
                                        {student.email}
                                      </p>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  <input
                                    type="number"
                                    min="0"
                                    max={selectedExam.max_score || 20}
                                    step="0.5"
                                    value={entry.grade}
                                    onChange={(e) =>
                                      setGradeEntries((prev) => ({
                                        ...prev,
                                        [student.id]: {
                                          ...prev[student.id],
                                          studentId: student.id,
                                          grade: e.target.value,
                                        },
                                      }))
                                    }
                                    className="w-24 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-center font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                                    placeholder="—"
                                  />
                                </td>
                                <td className="px-6 py-4">
                                  <input
                                    type="text"
                                    value={entry.remark}
                                    onChange={(e) =>
                                      setGradeEntries((prev) => ({
                                        ...prev,
                                        [student.id]: {
                                          ...prev[student.id],
                                          studentId: student.id,
                                          remark: e.target.value,
                                        },
                                      }))
                                    }
                                    className="w-full max-w-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                                    placeholder="Optional comment..."
                                  />
                                </td>
                                <td className="px-6 py-4">
                                  {entry.grade ? (
                                    <span
                                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                        isPassing
                                          ? "bg-green-100 text-green-700"
                                          : "bg-red-100 text-red-700"
                                      }`}
                                    >
                                      <CheckCircle2 className="w-3 h-3" />
                                      {isPassing ? "Pass" : "Fail"}
                                    </span>
                                  ) : (
                                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                                      Pending
                                    </span>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </>
              ) : (
                <div className="p-8">
                  {rankingLoading ? (
                    <div className="flex justify-center py-12">
                      <Loader2 className="w-6 h-6 animate-spin text-primary-600" />
                    </div>
                  ) : rankings.length === 0 ? (
                    <div className="text-center py-12 text-slate-400">
                      No rankings available for this quarter yet.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {rankings.map((rank, idx) => (
                        <div
                          key={rank.student_id}
                          className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100"
                        >
                          <div className="flex items-center gap-4">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm ${
                                idx === 0
                                  ? "bg-yellow-100 text-yellow-700"
                                  : idx === 1
                                    ? "bg-slate-200 text-slate-700"
                                    : idx === 2
                                      ? "bg-orange-100 text-orange-700"
                                      : "text-slate-400"
                              }`}
                            >
                              {idx + 1}
                            </div>
                            <div>
                              <p className="font-bold text-slate-800">
                                {rank.name}
                              </p>
                              <p className="text-xs text-slate-500">
                                {rank.exams_count} exams taken
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xl font-black text-primary-600">
                              {rank.average}
                            </div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                              Avg Score
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherGrades;
