import React, { useState } from "react";
import {
  Upload,
  Send,
  FileText,
  CheckCircle,
  AlertCircle,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import api from "../services/api";
import toast from "react-hot-toast";

const TeacherApply: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    specialization: "",
    cv: null as File | null,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.cv) {
      toast.error("Please upload your CV");
      return;
    }

    setLoading(true);
    const data = new FormData();
    data.append("first_name", formData.first_name);
    data.append("last_name", formData.last_name);
    data.append("email", formData.email);
    data.append("phone", formData.phone);
    data.append("specialization", formData.specialization);
    data.append("cv", formData.cv);

    try {
      await api.post("/teacher-applications", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSubmitted(true);
      toast.success("Application submitted successfully!");
    } catch (error: any) {
      if (error.response?.status === 422 && error.response?.data?.errors) {
        const errors = error.response.data.errors;
        const firstError = Object.values(errors)[0] as string[];
        toast.error(firstError[0] || "Validation failed");
      } else {
        toast.error(error.response?.data?.message || "Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white rounded-3xl shadow-xl p-10 text-center"
        >
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-bold text-slate-800 mb-4">
            Application Received!
          </h1>
          <p className="text-slate-600 mb-8">
            Thank you for your interest in joining our team. Our administration
            will review your CV and contact you shortly via email.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-primary-600 font-bold hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 py-12">
      <div className="w-full max-w-2xl">
        <Link
          to="/login"
          className="inline-flex items-center gap-2 text-slate-500 hover:text-primary-600 font-medium mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Login
        </Link>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="bg-primary-600 p-8 text-white text-center">
            <h1 className="text-3xl font-bold">Join Our Teaching Team</h1>
            <p className="text-primary-100 mt-2">
              Submit your CV and we'll get back to you.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-10 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">
                  First Name
                </label>
                <input
                  required
                  type="text"
                  value={formData.first_name}
                  onChange={(e) =>
                    setFormData({ ...formData, first_name: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-primary-50 outline-none transition-all"
                  placeholder="John"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">
                  Last Name
                </label>
                <input
                  required
                  type="text"
                  value={formData.last_name}
                  onChange={(e) =>
                    setFormData({ ...formData, last_name: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-primary-50 outline-none transition-all"
                  placeholder="Doe"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">
                  Email Address
                </label>
                <input
                  required
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-primary-50 outline-none transition-all"
                  placeholder="john@example.com"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">
                  Phone Number
                </label>
                <input
                  required
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-primary-50 outline-none transition-all"
                  placeholder="+212 600 000000"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">
                Specialization / Subject
              </label>
              <input
                required
                type="text"
                value={formData.specialization}
                onChange={(e) =>
                  setFormData({ ...formData, specialization: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-primary-50 outline-none transition-all"
                placeholder="e.g. English Language, Mathematics, Physics..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">
                Upload CV (PDF)
              </label>
              <div className="relative">
                <input
                  required
                  type="file"
                  accept=".pdf"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      cv: e.target.files?.[0] || null,
                    })
                  }
                  className="hidden"
                  id="cv-upload"
                />
                <label
                  htmlFor="cv-upload"
                  className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-200 rounded-2xl hover:bg-slate-50 hover:border-primary-300 cursor-pointer transition-all"
                >
                  {formData.cv ? (
                    <>
                      <FileText className="w-10 h-10 text-green-500 mb-2" />
                      <span className="font-bold text-slate-700">
                        {formData.cv.name}
                      </span>
                      <span className="text-xs text-slate-400 mt-1">
                        Click to change file
                      </span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-10 h-10 text-slate-300 mb-2" />
                      <span className="font-bold text-slate-600">
                        Drop your PDF here or click to browse
                      </span>
                      <span className="text-xs text-slate-400 mt-1">
                        Maximum file size: 5MB
                      </span>
                    </>
                  )}
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-primary-600 text-white rounded-2xl font-bold shadow-xl shadow-primary-200 hover:bg-primary-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Submitting Application...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Submit Application
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TeacherApply;
