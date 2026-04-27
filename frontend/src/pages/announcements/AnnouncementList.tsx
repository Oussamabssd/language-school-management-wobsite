import React, { useState, useEffect } from "react";
import { announcementService } from "../../services/announcementService";
import type { Announcement, PaginatedResponse } from "../../types";
import {
  Bell,
  Calendar,
  User as UserIcon,
  Tag,
  AlertTriangle,
  Info,
  CheckCircle,
  Search,
  Filter,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const AnnouncementList: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState<
    "all" | "students" | "teachers" | "staff"
  >("all");

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const response = await announcementService.getFeed({
        page,
        audience: filter === "all" ? undefined : filter,
      });
      setAnnouncements(response.data.data);
      setTotalPages(response.data.meta.last_page);
    } catch (error) {
      console.error("Failed to fetch announcements", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, [page, filter]);

  const getPriorityStyles = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-50 text-red-600 border-red-100";
      case "high":
        return "bg-amber-50 text-amber-600 border-amber-100";
      case "medium":
        return "bg-blue-50 text-blue-600 border-blue-100";
      default:
        return "bg-slate-50 text-slate-600 border-slate-100";
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "urgent":
        return <AlertTriangle className="w-4 h-4" />;
      case "high":
        return <Info className="w-4 h-4" />;
      case "medium":
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Tag className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            School Announcements
          </h1>
          <p className="text-slate-500 mt-2">
            Stay updated with the latest news and information.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm">
          {(["all", "students", "teachers", "staff"] as const).map((f) => (
            <button
              key={f}
              onClick={() => {
                setFilter(f);
                setPage(1);
              }}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                filter === f
                  ? "bg-primary-600 text-white shadow-md"
                  : "text-slate-500 hover:bg-slate-50"
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-primary-600" />
        </div>
      ) : announcements.length === 0 ? (
        <div className="bg-white rounded-3xl border-2 border-dashed border-slate-200 p-20 text-center">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Bell className="w-10 h-10 text-slate-300" />
          </div>
          <h3 className="text-xl font-bold text-slate-800">
            No announcements found
          </h3>
          <p className="text-slate-500 mt-2">
            Check back later for new updates.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          <AnimatePresence mode="popLayout">
            {announcements.map((announcement, index) => (
              <motion.div
                key={announcement.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all overflow-hidden"
              >
                <div className="p-6 md:p-8">
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <span
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${getPriorityStyles(announcement.priority)}`}
                    >
                      {getPriorityIcon(announcement.priority)}
                      {announcement.priority.toUpperCase()}
                    </span>
                    <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold flex items-center gap-1.5">
                      <Tag className="w-3 h-3" />
                      {announcement.target_audience.toUpperCase()}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs text-slate-400 font-medium ml-auto">
                      <Calendar className="w-3.5 h-3.5" />
                      {announcement.published_at
                        ? new Date(
                            announcement.published_at,
                          ).toLocaleDateString(undefined, { dateStyle: "long" })
                        : "Draft"}
                    </span>
                  </div>

                  <h2 className="text-2xl font-bold text-slate-800 mb-4">
                    {announcement.title}
                  </h2>
                  <div className="prose prose-slate max-w-none text-slate-600 whitespace-pre-wrap">
                    {announcement.content}
                  </div>

                  <div className="mt-8 pt-6 border-t border-slate-50 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold">
                      {announcement.author?.first_name?.[0]}
                      {announcement.author?.last_name?.[0]}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">
                        {announcement.author?.first_name}{" "}
                        {announcement.author?.last_name}
                      </p>
                      <p className="text-xs text-slate-500 font-medium">
                        Published by{" "}
                        {announcement.author?.roles?.[0]?.display_name ||
                          "Staff"}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 pt-8">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-2 rounded-xl border border-slate-200 disabled:opacity-50 hover:bg-slate-50 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-sm font-bold text-slate-600">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="p-2 rounded-xl border border-slate-200 disabled:opacity-50 hover:bg-slate-50 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default AnnouncementList;
