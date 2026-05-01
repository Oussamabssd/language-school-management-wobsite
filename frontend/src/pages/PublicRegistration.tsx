import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import type { Language, Level, ApiResponse } from "../types";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  BookOpen,
  GraduationCap,
  Loader2,
  CheckCircle,
  Lock,
  Heart,
} from "lucide-react";

const PublicRegistration: React.FC = () => {
  const navigate = useNavigate();
  const [languages, setLanguages] = useState<Language[]>([]);
  const [levels, setLevels] = useState<Level[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    date_of_birth: "",
    address: "",
    language_id: "",
    level_id: "",
    password: "",
    password_confirmation: "",
    parent_name: "",
    parent_email: "",
    parent_phone: "",
  });

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const response = await api.get<ApiResponse<any>>("/languages");
        // Handle both direct array and paginated response { data: { data: [] } }
        const data = response.data.data;
        setLanguages(Array.isArray(data) ? data : data.data || []);
      } catch (error) {
        console.error("Failed to fetch languages");
      }
    };
    fetchLanguages();
  }, []);

  useEffect(() => {
    if (formData.language_id) {
      const fetchLevels = async () => {
        try {
          const response = await api.get<ApiResponse<any>>(
            `/languages/${formData.language_id}/levels`,
          );
          // Handle both direct array and wrapped response { data: { data: [] } }
          const data = response.data.data;
          setLevels(Array.isArray(data) ? data : data.data || []);
        } catch (error) {
          console.error("Failed to fetch levels");
        }
      };
      fetchLevels();
    } else {
      setLevels([]);
    }
  }, [formData.language_id]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    if (formData.password !== formData.password_confirmation) {
      toast.error("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      await api.post("/registrations", formData);
      setIsSubmitted(true);
      toast.success("Registration request submitted successfully!");
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to submit registration",
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
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
          <h2 className="text-3xl font-bold text-slate-800 mb-4">
            Request Received!
          </h2>
          <p className="text-slate-600 mb-8">
            Thank you,{" "}
            <span className="font-semibold">{formData.full_name}</span>. Your
            registration request for the language course has been submitted. Our
            team will review it and get back to you via email shortly.
          </p>
          <button
            onClick={() => navigate("/")}
            className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium transition-all"
          >
            Back to Home
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-600 text-white shadow-lg mb-4 text-2xl font-bold">
            E
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 mb-3 tracking-tight">
            Join SpeakUp School
          </h1>
          <p className="text-lg text-slate-600 max-w-lg mx-auto mb-4">
            Fill out the form below to start your language learning journey with
            us.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="text-primary-600 hover:text-primary-700 font-semibold text-sm transition-all"
          >
            Already have an account? Sign In
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100"
        >
          <div className="h-2 bg-primary-600 w-full"></div>
          <form onSubmit={handleSubmit} className="p-8 md:p-10 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 flex items-center">
                  <User className="w-4 h-4 mr-2 text-primary-500" /> Full Name
                </label>
                <input
                  type="text"
                  name="full_name"
                  required
                  value={formData.full_name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                  placeholder="John Doe"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 flex items-center">
                  <Mail className="w-4 h-4 mr-2 text-primary-500" /> Email
                  Address
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                  placeholder="john@example.com"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 flex items-center">
                  <Phone className="w-4 h-4 mr-2 text-primary-500" /> Phone
                  Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                  placeholder="+1 234 567 890"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-primary-500" /> Date of
                  Birth
                </label>
                <input
                  type="date"
                  name="date_of_birth"
                  required
                  value={formData.date_of_birth}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 flex items-center">
                <MapPin className="w-4 h-4 mr-2 text-primary-500" /> Home
                Address
              </label>
              <textarea
                name="address"
                required
                rows={2}
                value={formData.address}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all resize-none"
                placeholder="123 Main St, City, Country"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 flex items-center">
                  <Lock className="w-4 h-4 mr-2 text-primary-500" /> Choose
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                  placeholder="Min. 8 characters"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 flex items-center">
                  <Lock className="w-4 h-4 mr-2 text-primary-500" /> Confirm
                  Password
                </label>
                <input
                  type="password"
                  name="password_confirmation"
                  required
                  value={formData.password_confirmation}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                  placeholder="Repeat your password"
                />
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100">
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
                <Heart className="w-5 h-5 mr-2 text-primary-500" /> Parent
                Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 flex items-center">
                    <User className="w-4 h-4 mr-2 text-primary-500" /> Parent
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="parent_name"
                    required
                    value={formData.parent_name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                    placeholder="Parent's Name"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 flex items-center">
                    <Mail className="w-4 h-4 mr-2 text-primary-500" /> Parent
                    Email
                  </label>
                  <input
                    type="email"
                    name="parent_email"
                    required
                    value={formData.parent_email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                    placeholder="parent@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 flex items-center">
                    <Phone className="w-4 h-4 mr-2 text-primary-500" /> Parent
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="parent_phone"
                    required
                    value={formData.parent_phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                    placeholder="Parent's Phone"
                  />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-100">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 flex items-center">
                  <BookOpen className="w-4 h-4 mr-2 text-primary-500" /> Select
                  Language
                </label>
                <select
                  name="language_id"
                  required
                  value={formData.language_id}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all bg-white"
                >
                  <option value="">-- Choose a Language --</option>
                  {languages.map((lang) => (
                    <option key={lang.id} value={lang.id}>
                      {lang.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 flex items-center">
                  <GraduationCap className="w-4 h-4 mr-2 text-primary-500" />{" "}
                  Preferred Level (Optional)
                </label>
                <select
                  name="level_id"
                  value={formData.level_id}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all bg-white disabled:bg-slate-50 disabled:cursor-not-allowed"
                  disabled={!formData.language_id}
                >
                  <option value="">-- Let us determine for you --</option>
                  {levels.map((lvl) => (
                    <option key={lvl.id} value={lvl.id}>
                      {lvl.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="pt-6">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-primary-600 hover:bg-primary-500 text-white rounded-2xl font-bold text-lg shadow-lg shadow-primary-600/20 transition-all flex items-center justify-center disabled:opacity-70"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin mr-2" />
                    Submitting...
                  </>
                ) : (
                  "Submit Registration Request"
                )}
              </button>
              <p className="text-center text-xs text-slate-400 mt-4 italic">
                By submitting, you agree to be contacted by our administration
                team.
              </p>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default PublicRegistration;
