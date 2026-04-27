import React, { useState, useEffect } from "react";
import api from "../../services/api";
import type {
  Group,
  Level,
  Language,
  User,
  ApiResponse,
  PaginatedResponse,
} from "../../types";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Plus,
  Edit2,
  Trash2,
  Loader2,
  X,
  UserMinus,
  BookOpen,
} from "lucide-react";

import { Link } from "react-router-dom";

const AdminGroups: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [levels, setLevels] = useState<Level[]>([]);
  const [teachers, setTeachers] = useState<User[]>([]);
  const [students, setStudents] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [page] = useState(1);

  // Modal states
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [showStudentsModal, setShowStudentsModal] = useState(false);
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    level_id: "",
    teacher_id: "",
    max_students: 20,
    academic_year: "2025-2026",
    status: "active",
  });

  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [selectedStudentToAdd, setSelectedStudentToAdd] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const [groupsRes, langsRes, teachersRes, studentsRes] = await Promise.all(
        [
          api.get<ApiResponse<PaginatedResponse<Group>>>("/groups", {
            params: { page },
          }),
          api.get<ApiResponse<Language[]>>("/languages"),
          api.get<ApiResponse<PaginatedResponse<User>>>("/teachers"),
          api.get<ApiResponse<PaginatedResponse<User>>>("/students"),
        ],
      );

      setGroups(groupsRes.data.data.data);
      // setTotalPages(groupsRes.data.data.meta.last_page);

      // Handle potential pagination for languages
      const languagesData =
        (langsRes.data.data as any).data || langsRes.data.data;
      setLanguages(languagesData);

      setTeachers(teachersRes.data.data.data);
      setStudents(studentsRes.data.data.data);
    } catch (error) {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page]);

  const handleLanguageChange = async (langId: string) => {
    setSelectedLanguage(langId);
    if (!langId) {
      setLevels([]);
      return;
    }
    try {
      const response = await api.get<ApiResponse<Level[]>>(
        `/languages/${langId}/levels`,
      );
      // Correctly handle the paginated response if necessary, or simple array
      const levelData = (response.data.data as any).data || response.data.data;
      setLevels(levelData);
    } catch (error) {
      toast.error("Failed to load levels");
    }
  };

  const handleEditGroup = (group: Group) => {
    setEditingGroup(group);
    setFormData({
      name: group.name,
      level_id: group.level_id?.toString() || "",
      teacher_id: group.teacher_id?.toString() || "",
      max_students: group.max_students,
      academic_year: group.academic_year,
      status: group.status,
    });
    // Set language to trigger level fetch
    if (group.level?.language_id) {
      handleLanguageChange(group.level.language_id.toString());
    }
    setShowGroupModal(true);
  };

  const handleGroupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      if (editingGroup) {
        await api.put(`/groups/${editingGroup.id}`, formData);
        toast.success("Group updated successfully");
      } else {
        await api.post("/groups", formData);
        toast.success("Group created successfully");
      }
      setShowGroupModal(false);
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to save group");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteGroup = async (id: number) => {
    if (!confirm("Are you sure you want to delete this group?")) return;
    try {
      await api.delete(`/groups/${id}`);
      toast.success("Group deleted");
      fetchData();
    } catch (error) {
      toast.error("Failed to delete group");
    }
  };

  const handleManageStudents = (group: Group) => {
    setSelectedGroup(group);
    setShowStudentsModal(true);
  };

  const addStudentToGroup = async () => {
    if (!selectedGroup || !selectedStudentToAdd) return;
    try {
      await api.post(
        `/groups/${selectedGroup.id}/students/${selectedStudentToAdd}`,
        {
          enrolled_at: new Date().toISOString().split("T")[0],
        },
      );
      toast.success("Student added to group");
      setSelectedStudentToAdd("");
      // Refresh selected group data
      const res = await api.get<ApiResponse<Group>>(
        `/groups/${selectedGroup.id}`,
      );
      setSelectedGroup(res.data.data);
      fetchData();
    } catch (error) {
      toast.error("Failed to add student");
    }
  };

  const removeStudentFromGroup = async (studentId: number) => {
    if (!selectedGroup) return;
    try {
      await api.delete(`/groups/${selectedGroup.id}/students/${studentId}`);
      toast.success("Student removed");
      // Refresh selected group data
      const res = await api.get<ApiResponse<Group>>(
        `/groups/${selectedGroup.id}`,
      );
      setSelectedGroup(res.data.data);
      fetchData();
    } catch (error) {
      toast.error("Failed to remove student");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Group Management
          </h1>
          <p className="text-slate-500 font-medium">
            Create and organize student groups
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            to="/admin/academic"
            className="flex items-center gap-2 px-5 py-3 bg-white border border-slate-200 text-slate-600 rounded-2xl font-bold hover:bg-slate-50 transition-all shadow-sm"
          >
            <BookOpen className="w-5 h-5" />
            Curriculum
          </Link>
          <button
            onClick={() => {
              setEditingGroup(null);
              setShowGroupModal(true);
            }}
            className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-2xl font-bold hover:bg-primary-700 transition-all shadow-lg shadow-primary-200"
          >
            <Plus className="w-5 h-5" />
            Create Group
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">
                  Group Name
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">
                  Language / Level
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">
                  Teacher
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">
                  Capacity
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary-500" />
                  </td>
                </tr>
              ) : groups.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-8 text-center text-slate-500"
                  >
                    No groups found
                  </td>
                </tr>
              ) : (
                groups.map((group) => (
                  <tr
                    key={group.id}
                    className="hover:bg-slate-50/50 transition-all"
                  >
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-800">
                        {group.name}
                      </div>
                      <div className="text-xs text-slate-400">
                        {group.academic_year}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary-50 text-primary-700 w-fit">
                          {group.level?.name}
                        </span>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                          {languages.find(
                            (l) => l.id === group.level?.language_id,
                          )?.name || "Language"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {group.teacher ? (
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 text-xs font-bold">
                            {group.teacher.first_name?.[0]}
                            {group.teacher.last_name?.[0]}
                          </div>
                          <span className="text-slate-700 font-medium">
                            {group.teacher.name}
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">
                          No teacher assigned
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <div className="text-sm font-bold text-slate-700">
                          {group.students?.length || 0} / {group.max_students}
                        </div>
                        <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary-500"
                            style={{
                              width: `${Math.min(100, ((group.students?.length || 0) / group.max_students) * 100)}%`,
                            }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleManageStudents(group)}
                          className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
                          title="Manage Students"
                        >
                          <Users className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEditGroup(group)}
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteGroup(group.id)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Group Modal */}
      <AnimatePresence>
        {showGroupModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h3 className="text-xl font-bold">
                  {editingGroup ? "Edit Group" : "Create Group"}
                </h3>
                <button onClick={() => setShowGroupModal(false)}>
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleGroupSubmit} className="p-6 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold">Group Name</label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="English A1 - Group 1"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold">Language</label>
                    <select
                      required
                      value={selectedLanguage}
                      onChange={(e) => handleLanguageChange(e.target.value)}
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 outline-none bg-white"
                    >
                      <option value="">Select</option>
                      {languages.map((l) => (
                        <option key={l.id} value={l.id}>
                          {l.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold">Level</label>
                    <select
                      required
                      disabled={!selectedLanguage}
                      value={formData.level_id}
                      onChange={(e) =>
                        setFormData({ ...formData, level_id: e.target.value })
                      }
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 outline-none bg-white disabled:bg-slate-50"
                    >
                      <option value="">Select</option>
                      {levels.map((l) => (
                        <option key={l.id} value={l.id}>
                          {l.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold">Teacher</label>
                  <select
                    value={formData.teacher_id}
                    onChange={(e) =>
                      setFormData({ ...formData, teacher_id: e.target.value })
                    }
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 outline-none bg-white"
                  >
                    <option value="">No teacher assigned</option>
                    {teachers.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold">Max Students</label>
                    <input
                      type="number"
                      value={formData.max_students}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          max_students: parseInt(e.target.value),
                        })
                      }
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold">Year</label>
                    <input
                      type="text"
                      value={formData.academic_year}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          academic_year: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 outline-none"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="w-full py-3 bg-primary-600 text-white rounded-xl font-bold shadow-lg flex items-center justify-center gap-2"
                >
                  {formLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editingGroup ? "Update" : "Create"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Students Management Modal */}
      <AnimatePresence>
        {showStudentsModal && selectedGroup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold">Manage Students</h3>
                  <p className="text-sm text-slate-500">{selectedGroup.name}</p>
                </div>
                <button onClick={() => setShowStudentsModal(false)}>
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                <div className="flex gap-2">
                  <select
                    value={selectedStudentToAdd}
                    onChange={(e) => setSelectedStudentToAdd(e.target.value)}
                    className="flex-1 px-4 py-2 rounded-xl border border-slate-200 outline-none bg-white"
                  >
                    <option value="">Select a student to add</option>
                    {students.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.email})
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={addStudentToGroup}
                    className="px-4 py-2 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700"
                  >
                    Add Student
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-3">
                  {selectedGroup.students?.map((student) => (
                    <div
                      key={student.id}
                      className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-primary-100 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold">
                          {student.first_name?.[0]}
                          {student.last_name?.[0]}
                        </div>
                        <div>
                          <div className="font-bold text-slate-800">
                            {student.name}
                          </div>
                          <div className="text-xs text-slate-500">
                            {student.email}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => removeStudentFromGroup(student.id)}
                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                      >
                        <UserMinus className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {(!selectedGroup.students ||
                    selectedGroup.students.length === 0) && (
                    <div className="text-center py-8 text-slate-400">
                      No students in this group yet
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminGroups;
