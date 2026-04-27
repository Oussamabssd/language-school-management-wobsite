import React, { useState, useEffect } from "react";
import api from "../../services/api";
import type { Language, Level, ApiResponse } from "../../types";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Plus,
  Edit2,
  Trash2,
  Loader2,
  X,
  ChevronRight,
  Layers,
} from "lucide-react";

const AdminAcademic: React.FC = () => {
  const [languages, setLanguages] = useState<Language[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(
    null,
  );
  const [levels, setLevels] = useState<Level[]>([]);
  const [loading, setLoading] = useState(true);
  const [levelsLoading, setLevelsLoading] = useState(false);

  const [showLangModal, setShowLangModal] = useState(false);
  const [showLevelModal, setShowLevelModal] = useState(false);
  const [editingLang, setEditingLang] = useState<Language | null>(null);
  const [editingLevel, setEditingLevel] = useState<Level | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  const [langForm, setLangForm] = useState({ name: "", code: "" });
  const [levelForm, setLevelForm] = useState({
    name: "",
    description: "",
    order: 1,
  });

  const fetchLanguages = async () => {
    setLoading(true);
    try {
      const res = await api.get<ApiResponse<Language[]>>("/languages");
      const data = (res.data.data as any).data || res.data.data;
      setLanguages(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error("Failed to load languages");
    } finally {
      setLoading(false);
    }
  };

  const fetchLevels = async (langId: number) => {
    setLevelsLoading(true);
    try {
      const res = await api.get<ApiResponse<Level[]>>(
        `/languages/${langId}/levels`,
      );
      const data = (res.data.data as any).data || res.data.data;
      setLevels(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error("Failed to load levels");
    } finally {
      setLevelsLoading(false);
    }
  };

  useEffect(() => {
    fetchLanguages();
  }, []);

  const handleSelectLanguage = (lang: Language) => {
    setSelectedLanguage(lang);
    fetchLevels(lang.id);
  };

  const handleLangSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      if (editingLang) {
        await api.put(`/languages/${editingLang.id}`, langForm);
        toast.success("Language updated");
      } else {
        await api.post("/languages", langForm);
        toast.success("Language created");
      }
      setShowLangModal(false);
      fetchLanguages();
    } catch (error) {
      toast.error("Operation failed");
    } finally {
      setFormLoading(false);
    }
  };

  const handleLevelSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLanguage) return;
    setFormLoading(true);
    try {
      if (editingLevel) {
        await api.put(`/levels/${editingLevel.id}`, {
          ...levelForm,
          language_id: selectedLanguage.id,
        });
        toast.success("Level updated");
      } else {
        await api.post("/levels", {
          ...levelForm,
          language_id: selectedLanguage.id,
        });
        toast.success("Level created");
      }
      setShowLevelModal(false);
      fetchLevels(selectedLanguage.id);
    } catch (error) {
      toast.error("Operation failed");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteLang = async (id: number) => {
    if (!confirm("Delete language and all its levels?")) return;
    try {
      await api.delete(`/languages/${id}`);
      toast.success("Language deleted");
      if (selectedLanguage?.id === id) setSelectedLanguage(null);
      fetchLanguages();
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  const handleDeleteLevel = async (id: number) => {
    if (!confirm("Delete this level?")) return;
    try {
      await api.delete(`/levels/${id}`);
      toast.success("Level deleted");
      if (selectedLanguage) fetchLevels(selectedLanguage.id);
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Academic Structure
          </h1>
          <p className="text-slate-500 font-medium">
            Manage languages and curriculum levels
          </p>
        </div>
        <button
          onClick={() => {
            setEditingLang(null);
            setLangForm({ name: "", code: "" });
            setShowLangModal(true);
          }}
          className="bg-primary-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-primary-700 transition-all shadow-lg shadow-primary-200"
        >
          <Plus className="w-5 h-5" /> Add Language
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Languages List */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest ml-2">
            Languages
          </h2>
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
            </div>
          ) : (
            <div className="space-y-3">
              {languages.map((lang) => (
                <div
                  key={lang.id}
                  onClick={() => handleSelectLanguage(lang)}
                  className={`group relative p-5 rounded-3xl border transition-all cursor-pointer ${
                    selectedLanguage?.id === lang.id
                      ? "bg-white border-primary-500 shadow-xl shadow-primary-50"
                      : "bg-white border-slate-100 hover:border-primary-200"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-bold ${
                          selectedLanguage?.id === lang.id
                            ? "bg-primary-600 text-white"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {lang.code || lang.name[0].toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-800">
                          {lang.name}
                        </h3>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                          {lang.code || "LANG"}
                        </p>
                      </div>
                    </div>
                    <ChevronRight
                      className={`w-5 h-5 transition-transform ${selectedLanguage?.id === lang.id ? "text-primary-600 translate-x-1" : "text-slate-300"}`}
                    />
                  </div>

                  <div className="absolute top-4 right-12 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingLang(lang);
                        setLangForm({ name: lang.name, code: lang.code || "" });
                        setShowLangModal(true);
                      }}
                      className="p-2 hover:bg-blue-50 text-blue-500 rounded-xl"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteLang(lang.id);
                      }}
                      className="p-2 hover:bg-red-50 text-red-500 rounded-xl"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
              {languages.length === 0 && (
                <div className="text-center py-12 bg-slate-50 rounded-3xl text-slate-400 font-medium">
                  No languages created yet
                </div>
              )}
            </div>
          )}
        </div>

        {/* Levels List */}
        <div className="lg:col-span-2 space-y-4">
          {selectedLanguage ? (
            <>
              <div className="flex justify-between items-center ml-2">
                <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Layers className="w-4 h-4" /> Levels for{" "}
                  {selectedLanguage.name}
                </h2>
                <button
                  onClick={() => {
                    setEditingLevel(null);
                    setLevelForm({
                      name: "",
                      description: "",
                      order: levels.length + 1,
                    });
                    setShowLevelModal(true);
                  }}
                  className="text-primary-600 text-sm font-bold flex items-center gap-1 hover:underline"
                >
                  <Plus className="w-4 h-4" /> Add Level
                </button>
              </div>

              {levelsLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {levels.map((level) => (
                    <div
                      key={level.id}
                      className="bg-white p-6 rounded-3xl border border-slate-100 group relative hover:border-primary-300 transition-all shadow-sm hover:shadow-xl hover:shadow-primary-50"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center font-black text-slate-400">
                          #{level.order}
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => {
                              setEditingLevel(level);
                              setLevelForm({
                                name: level.name,
                                description: level.description || "",
                                order: level.order,
                              });
                              setShowLevelModal(true);
                            }}
                            className="p-2 hover:bg-blue-50 text-blue-500 rounded-xl"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteLevel(level.id)}
                            className="p-2 hover:bg-red-50 text-red-500 rounded-xl"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <h3 className="font-bold text-slate-800 text-lg mb-1">
                        {level.name}
                      </h3>
                      <p className="text-sm text-slate-500 line-clamp-2">
                        {level.description || "No description provided."}
                      </p>
                    </div>
                  ))}
                  {levels.length === 0 && (
                    <div className="col-span-2 text-center py-24 bg-slate-50 rounded-3xl text-slate-400 font-medium border-2 border-dashed border-slate-200">
                      Select or add a level to begin
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center bg-slate-50 rounded-[40px] border-2 border-dashed border-slate-200 text-slate-400 p-8 text-center">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-4 shadow-sm">
                <BookOpen className="w-8 h-8 text-slate-300" />
              </div>
              <p className="font-bold text-lg text-slate-500">
                Select a language
              </p>
              <p className="max-w-xs mx-auto">
                Choose a language on the left to manage its curriculum levels
                and course progression.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Language Modal */}
      <AnimatePresence>
        {showLangModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-md rounded-[32px] shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-slate-50 flex justify-between items-center">
                <h3 className="text-2xl font-black text-slate-800">
                  {editingLang ? "Edit Language" : "New Language"}
                </h3>
                <button
                  onClick={() => setShowLangModal(false)}
                  className="p-2 hover:bg-slate-50 rounded-xl transition-colors"
                >
                  <X className="w-6 h-6 text-slate-400" />
                </button>
              </div>
              <form onSubmit={handleLangSubmit} className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-black text-slate-700 ml-1">
                    Language Name
                  </label>
                  <input
                    required
                    type="text"
                    value={langForm.name}
                    onChange={(e) =>
                      setLangForm({ ...langForm, name: e.target.value })
                    }
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all font-bold"
                    placeholder="e.g., Français"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-black text-slate-700 ml-1">
                    Code / Symbol
                  </label>
                  <input
                    required
                    type="text"
                    maxLength={3}
                    value={langForm.code}
                    onChange={(e) =>
                      setLangForm({
                        ...langForm,
                        code: e.target.value.toUpperCase(),
                      })
                    }
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all font-bold"
                    placeholder="e.g., FR"
                  />
                </div>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black shadow-xl hover:bg-slate-800 transition-all disabled:opacity-50"
                >
                  {formLoading ? (
                    <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                  ) : editingLang ? (
                    "Update Language"
                  ) : (
                    "Create Language"
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Level Modal */}
      <AnimatePresence>
        {showLevelModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-md rounded-[32px] shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-slate-50 flex justify-between items-center">
                <h3 className="text-2xl font-black text-slate-800">
                  {editingLevel ? "Edit Level" : "New Level"}
                </h3>
                <button
                  onClick={() => setShowLevelModal(false)}
                  className="p-2 hover:bg-slate-50 rounded-xl transition-colors"
                >
                  <X className="w-6 h-6 text-slate-400" />
                </button>
              </div>
              <form onSubmit={handleLevelSubmit} className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-black text-slate-700 ml-1">
                    Level Name
                  </label>
                  <input
                    required
                    type="text"
                    value={levelForm.name}
                    onChange={(e) =>
                      setLevelForm({ ...levelForm, name: e.target.value })
                    }
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all font-bold"
                    placeholder="e.g., Beginner A1"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-black text-slate-700 ml-1">
                    Order
                  </label>
                  <input
                    required
                    type="number"
                    value={levelForm.order}
                    onChange={(e) =>
                      setLevelForm({
                        ...levelForm,
                        order: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-black text-slate-700 ml-1">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={levelForm.description}
                    onChange={(e) =>
                      setLevelForm({
                        ...levelForm,
                        description: e.target.value,
                      })
                    }
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all font-medium"
                    placeholder="Describe the level objectives..."
                  />
                </div>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black shadow-xl hover:bg-slate-800 transition-all disabled:opacity-50"
                >
                  {formLoading ? (
                    <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                  ) : editingLevel ? (
                    "Update Level"
                  ) : (
                    "Create Level"
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminAcademic;
