import React, { useState, useEffect } from "react";
import {
  FileText,
  Check,
  X,
  Loader2,
  Download,
  Mail,
  Phone,
  Calendar,
  Briefcase,
  UserPlus,
  ChevronLeft,
  ChevronRight,
  Search,
  AlertCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../services/api";
import toast from "react-hot-toast";

interface TeacherApplication {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  specialization: string;
  cv_path: string;
  cv_url: string;
  status: "pending" | "accepted" | "rejected";
  created_at: string;
}

const AdminTeacherApplications: React.FC = () => {
  const [applications, setApplications] = useState<TeacherApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<number | null>(null);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await api.get("/teacher-applications");
      setApplications(res.data.data);
    } catch (error) {
      toast.error("Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleAccept = async (id: number) => {
    if (
      !confirm(
        "Are you sure you want to accept this application and create a teacher account?",
      )
    )
      return;

    setProcessingId(id);
    try {
      const res = await api.put(`/teacher-applications/${id}/accept`);
      toast.success(res.data.message);

      // In a real app, we'd show the temporary password in a modal
      if (res.data.data.temporary_password) {
        alert(
          `Account created! Temporary password: ${res.data.data.temporary_password}\nPlease share this with the teacher.`,
        );
      }

      fetchApplications();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Action failed");
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id: number) => {
    if (!confirm("Are you sure you want to reject this application?")) return;

    setProcessingId(id);
    try {
      await api.put(`/teacher-applications/${id}/reject`);
      toast.success("Application rejected");
      fetchApplications();
    } catch (error) {
      toast.error("Action failed");
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">
          Teacher Job Applications
        </h1>
        <p className="text-slate-500 mt-2">
          Review CVs and recruit new teachers for the school.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-primary-600" />
        </div>
      ) : applications.length === 0 ? (
        <div className="bg-white rounded-3xl border border-dashed border-slate-200 p-20 text-center">
          <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-800">
            No applications yet
          </h3>
          <p className="text-slate-500">
            Wait for potential teachers to submit their CVs.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {applications.map((app) => (
            <motion.div
              key={app.id}
              layout
              className={`bg-white rounded-3xl border shadow-sm overflow-hidden transition-all ${
                app.status === "accepted"
                  ? "border-green-100 opacity-75"
                  : app.status === "rejected"
                    ? "border-red-100 opacity-75"
                    : "border-slate-100"
              }`}
            >
              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-600 text-xl font-bold">
                      {app.first_name[0]}
                      {app.last_name[0]}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-slate-800">
                        {app.first_name} {app.last_name}
                      </h2>
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          app.status === "accepted"
                            ? "bg-green-100 text-green-700"
                            : app.status === "rejected"
                              ? "bg-red-100 text-red-700"
                              : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {app.status}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Applied On
                    </p>
                    <p className="text-sm font-medium text-slate-600">
                      {new Date(app.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Mail className="w-4 h-4 text-slate-400" />
                      {app.email}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Phone className="w-4 h-4 text-slate-400" />
                      {app.phone}
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Briefcase className="w-4 h-4 text-slate-400" />
                      {app.specialization}
                    </div>
                    <a
                      href={app.cv_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-primary-600 font-bold hover:underline"
                    >
                      <Download className="w-4 h-4" />
                      Download CV (PDF)
                    </a>
                  </div>
                </div>

                {app.status === "pending" && (
                  <div className="flex gap-4">
                    <button
                      onClick={() => handleAccept(app.id)}
                      disabled={processingId !== null}
                      className="flex-1 flex items-center justify-center gap-2 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-all shadow-lg shadow-green-100"
                    >
                      {processingId === app.id ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <UserPlus className="w-5 h-5" />
                      )}
                      Accept & Create Account
                    </button>
                    <button
                      onClick={() => handleReject(app.id)}
                      disabled={processingId !== null}
                      className="flex-1 flex items-center justify-center gap-2 py-3 bg-white border border-slate-200 text-red-600 rounded-xl font-bold hover:bg-red-50 transition-all"
                    >
                      <X className="w-5 h-5" />
                      Reject Application
                    </button>
                  </div>
                )}

                {app.status === "accepted" && (
                  <div className="p-4 bg-green-50 rounded-2xl flex items-center gap-3 text-green-700 font-medium border border-green-100">
                    <Check className="w-5 h-5" />
                    Teacher account created and CV transferred to profile.
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminTeacherApplications;
