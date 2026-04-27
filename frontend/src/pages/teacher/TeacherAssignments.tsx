import React, { useState, useEffect } from "react";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import type { Course, ApiResponse } from "../../types";
import toast from "react-hot-toast";
import {
  FileText,
  Plus,
  Upload,
  Loader2,
  X,
  Calendar as CalendarIcon,
  Download,
  CheckCircle,
  ChevronRight,
  Edit3,
  AlertCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Assignment {
  id: number;
  title: string;
  description: string;
  due_date: string;
  file_path: string | null;
  course?: Course;
  status: "draft" | "published" | "closed";
}

interface SubmissionData {
  student: {
    id: number;
    first_name: string;
    last_name: string;
  };
  submission: {
    id: number;
    grade: number;
    teacher_remark: string;
  } | null;
}

const TeacherAssignments: React.FC = () => {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showGradeModal, setShowGradeModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] =
    useState<Assignment | null>(null);
  const [submissions, setSubmissions] = useState<SubmissionData[]>([]);
  const [gradingLoading, setGradingLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    group_id: "",
    course_id: "",
    due_date: "",
    file: null as File | null,
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      // Get teacher's assignments
      const assignmentsRes =
        await api.get<ApiResponse<{ data: Assignment[] }>>("/assignments");
      const assignmentsData =
        (assignmentsRes.data.data as any).data || assignmentsRes.data.data;
      setAssignments(Array.isArray(assignmentsData) ? assignmentsData : []);
    } catch (error) {
      toast.error("Failed to load assignments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  // When group changes, fetch its courses
  const handleGroupChange = async (groupId: string) => {
    setFormData((prev) => ({ ...prev, group_id: groupId, course_id: "" }));
    if (!groupId) {
      setCourses([]);
      return;
    }
    try {
      const res = await api.get<ApiResponse<Course[]>>(
        `/courses/group/${groupId}`,
      );
      const coursesData = (res.data.data as any).data || res.data.data;
      const coursesArray = Array.isArray(coursesData) ? coursesData : [];
      setCourses(coursesArray);

      console.log("Courses for group:", groupId, coursesArray);

      if (coursesArray.length === 0) {
        toast.error(
          "No courses found for this group. Please contact the director.",
        );
      } else {
        // Auto-select the first course regardless of count, but usually it's one
        setFormData((prev) => ({
          ...prev,
          course_id: coursesArray[0].id.toString(),
        }));
      }
    } catch (error) {
      toast.error("Failed to load courses for this group");
    }
  };

  // Initial auto-selection if teacher has only one group
  useEffect(() => {
    const teachingGroups = (user as any)?.teaching_groups || [];
    if (teachingGroups.length === 1 && !formData.group_id) {
      handleGroupChange(teachingGroups[0].id.toString());
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.course_id) {
      toast.error("Please select a course first");
      return;
    }

    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("course_id", formData.course_id);
    data.append("teacher_id", user?.id.toString() || "");
    if (formData.due_date) data.append("due_date", formData.due_date);
    if (formData.file) data.append("file", formData.file);

    try {
      await api.post("/assignments", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Assignment created successfully");
      setShowAddModal(false);
      // Reset non-course fields
      setFormData((prev) => ({
        ...prev,
        title: "",
        description: "",
        file: null,
        due_date: "",
      }));
      fetchData();
    } catch (error: any) {
      console.error("Upload error:", error.response?.data);
      const message =
        error.response?.data?.message || "Failed to create assignment";
      const errors = error.response?.data?.errors;
      if (errors) {
        const firstError = Object.values(errors)[0] as string[];
        toast.error(firstError[0] || message);
      } else {
        toast.error(message);
      }
    }
  };

  const handleOpenGrading = async (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setGradingLoading(true);
    setShowGradeModal(true);
    try {
      const res = await api.get<ApiResponse<SubmissionData[]>>(
        `/assignments/${assignment.id}/submissions`,
      );
      setSubmissions(res.data.data);
    } catch (error) {
      toast.error("Failed to load submissions");
    } finally {
      setGradingLoading(false);
    }
  };

  const handleSaveGrade = async (
    studentId: number,
    grade: string,
    remark: string,
  ) => {
    try {
      await api.post(
        `/assignments/${selectedAssignment?.id}/students/${studentId}/grade`,
        {
          grade,
          teacher_remark: remark,
        },
      );
      toast.success("Grade saved");
    } catch (error) {
      toast.error("Failed to save grade");
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Homework Management
          </h1>
          <p className="text-slate-500">
            Create and grade assignments for your students.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-2xl font-bold hover:bg-primary-700 transition-all shadow-lg shadow-primary-200"
        >
          <Plus className="w-5 h-5" />
          New Homework
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-primary-600" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assignments.map((assignment) => (
            <motion.div
              key={assignment.id}
              whileHover={{ y: -5 }}
              className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl group-hover:bg-primary-600 group-hover:text-white transition-colors">
                  <FileText className="w-6 h-6" />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleOpenGrading(assignment)}
                    className="p-2 hover:bg-slate-100 rounded-xl text-slate-500 hover:text-primary-600 transition-colors"
                    title="Grade Students"
                  >
                    <CheckCircle className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <h3 className="text-lg font-bold text-slate-800 mb-1">
                {assignment.title}
              </h3>
              <p className="text-xs text-primary-600 font-bold uppercase tracking-wider mb-3">
                {assignment.course?.title || "General"}
              </p>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <CalendarIcon className="w-4 h-4" />
                  <span>
                    Due:{" "}
                    {assignment.due_date
                      ? new Date(assignment.due_date).toLocaleDateString()
                      : "No deadline"}
                  </span>
                </div>
                {assignment.file_path && (
                  <a
                    href={assignment.file_path}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-primary-600 hover:underline font-medium"
                  >
                    <Download className="w-4 h-4" />
                    Download PDF
                  </a>
                )}
              </div>

              <button
                onClick={() => handleOpenGrading(assignment)}
                className="w-full py-3 bg-slate-50 text-slate-600 rounded-xl font-bold hover:bg-primary-50 hover:text-primary-600 transition-colors flex items-center justify-center gap-2"
              >
                Manage & Grade
                <ChevronRight className="w-4 h-4" />
              </button>
            </motion.div>
          ))}

          {assignments.length === 0 && (
            <div className="col-span-full bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center">
              <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-800 mb-2">
                No homework created yet
              </h3>
              <p className="text-slate-500 mb-6">
                Start by creating your first assignment for your students.
              </p>
              <button
                onClick={() => setShowAddModal(true)}
                className="px-6 py-2 bg-white border border-slate-200 rounded-xl font-bold hover:bg-slate-50 transition-colors"
              >
                Create Homework
              </button>
            </div>
          )}
        </div>
      )}

      {/* Add Assignment Modal */}
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
                <h3 className="text-xl font-bold">Create New Homework</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 hover:bg-slate-200 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">
                    Homework Title
                  </label>
                  <input
                    required
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="e.g., French Verb Conjugation"
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">
                    Group
                  </label>
                  <select
                    required
                    value={formData.group_id}
                    onChange={(e) => handleGroupChange(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-primary-500 outline-none transition-all bg-white"
                  >
                    <option value="">Select a group</option>
                    {((user as any)?.teaching_groups || []).map((g: any) => (
                      <option key={g.id} value={g.id}>
                        {g.name}
                      </option>
                    ))}
                  </select>
                </div>

                {formData.group_id && courses.length === 0 && (
                  <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-700 text-sm">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <p>
                      This group has no courses. Homework cannot be created.
                      Please contact the director to add a course to this group.
                    </p>
                  </div>
                )}

                {courses.length > 1 && (
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">
                      Course
                    </label>
                    <select
                      required
                      value={formData.course_id}
                      onChange={(e) =>
                        setFormData({ ...formData, course_id: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-primary-500 outline-none transition-all bg-white"
                    >
                      <option value="">Select a course</option>
                      {courses.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.title}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">
                      Due Date
                    </label>
                    <input
                      type="date"
                      value={formData.due_date}
                      onChange={(e) =>
                        setFormData({ ...formData, due_date: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">
                      Homework PDF
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            file: e.target.files?.[0] || null,
                          })
                        }
                        className="hidden"
                        id="file-upload"
                      />
                      <label
                        htmlFor="file-upload"
                        className="flex items-center gap-2 px-4 py-3 rounded-2xl border border-slate-200 border-dashed hover:bg-slate-50 cursor-pointer transition-all"
                      >
                        <Upload className="w-4 h-4 text-slate-400" />
                        <span className="text-sm text-slate-500 truncate">
                          {formData.file ? formData.file.name : "Upload PDF"}
                        </span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">
                    Instructions (Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-primary-500 outline-none transition-all resize-none"
                    placeholder="Provide additional details..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-primary-600 text-white rounded-2xl font-bold shadow-xl shadow-primary-100 hover:bg-primary-700 transition-all flex items-center justify-center gap-2"
                >
                  Create Assignment
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Grading Modal */}
      <AnimatePresence>
        {showGradeModal && selectedAssignment && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div>
                  <h3 className="text-xl font-bold">
                    Grading: {selectedAssignment.title}
                  </h3>
                  <p className="text-sm text-slate-500">
                    Enter grades and remarks for each student.
                  </p>
                </div>
                <button
                  onClick={() => setShowGradeModal(false)}
                  className="p-2 hover:bg-slate-200 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-8 max-h-[70vh] overflow-y-auto">
                {gradingLoading ? (
                  <div className="flex flex-col items-center justify-center py-20 space-y-4">
                    <Loader2 className="w-10 h-10 animate-spin text-primary-600" />
                    <p className="text-slate-500 font-medium">
                      Loading student list...
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {submissions.map((item) => (
                      <div
                        key={item.student.id}
                        className="flex flex-col md:flex-row items-start md:items-center gap-6 p-6 rounded-2xl bg-slate-50 border border-slate-100"
                      >
                        <div className="flex items-center gap-4 min-w-[200px]">
                          <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold">
                            {item.student.first_name[0]}
                            {item.student.last_name[0]}
                          </div>
                          <div>
                            <p className="font-bold text-slate-800">
                              {item.student.first_name} {item.student.last_name}
                            </p>
                            <p className="text-xs text-slate-500">
                              Student ID: #{item.student.id}
                            </p>
                          </div>
                        </div>

                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                          <div className="flex items-center gap-2">
                            <label className="text-xs font-bold text-slate-400 uppercase w-12">
                              Grade
                            </label>
                            <input
                              type="number"
                              step="0.25"
                              min="0"
                              max="20"
                              placeholder="0.00"
                              defaultValue={item.submission?.grade}
                              onBlur={(e) =>
                                handleSaveGrade(
                                  item.student.id,
                                  e.target.value,
                                  (
                                    document.getElementById(
                                      `remark-${item.student.id}`,
                                    ) as HTMLInputElement
                                  ).value,
                                )
                              }
                              className="w-24 px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 outline-none text-center font-bold"
                            />
                            <span className="text-slate-400 font-bold">
                              / 20
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <label className="text-xs font-bold text-slate-400 uppercase w-16">
                              Remark
                            </label>
                            <input
                              id={`remark-${item.student.id}`}
                              type="text"
                              placeholder="Good job! / Need more work..."
                              defaultValue={item.submission?.teacher_remark}
                              onBlur={(e) =>
                                handleSaveGrade(
                                  item.student.id,
                                  (
                                    document.getElementById(
                                      `grade-${item.student.id}`,
                                    ) as HTMLInputElement
                                  )?.value ||
                                    item.submission?.grade?.toString() ||
                                    "",
                                  e.target.value,
                                )
                              }
                              className="flex-1 px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 outline-none text-sm"
                            />
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            const grade = (
                              document.querySelector(
                                `input[defaultValue="${item.submission?.grade}"]`,
                              ) as HTMLInputElement
                            )?.value;
                            const remark = (
                              document.getElementById(
                                `remark-${item.student.id}`,
                              ) as HTMLInputElement
                            ).value;
                            handleSaveGrade(item.student.id, grade, remark);
                          }}
                          className="p-2 bg-white border border-slate-200 rounded-xl text-primary-600 hover:bg-primary-600 hover:text-white transition-all shadow-sm"
                        >
                          <Edit3 className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => setShowGradeModal(false)}
                  className="px-8 py-3 bg-white border border-slate-200 rounded-2xl font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TeacherAssignments;
