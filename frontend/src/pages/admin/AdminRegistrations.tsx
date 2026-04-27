import React, { useState, useEffect } from "react";
import api from "../../services/api";
import type { Registration, PaginatedResponse, ApiResponse } from "../../types";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  X,
  Eye,
  Filter,
  Search,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Mail,
  Phone,
  MapPin,
  BookOpen,
  User,
  Clock,
  AlertCircle,
  GraduationCap,
} from "lucide-react";

const AdminRegistrations: React.FC = () => {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("pending");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedReg, setSelectedReg] = useState<Registration | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(false);

  const fetchRegistrations = async () => {
    setLoading(true);
    try {
      const response = await api.get<
        ApiResponse<PaginatedResponse<Registration>>
      >("/registrations", {
        params: {
          status: statusFilter !== "all" ? statusFilter : undefined,
          search: search || undefined,
          page,
        },
      });
      setRegistrations(response.data.data.data);
      setTotalPages(response.data.data.meta.last_page);
    } catch (error) {
      toast.error("Failed to load registrations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, [statusFilter, page]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchRegistrations();
  };

  const handleAccept = async (id: number) => {
    if (
      !confirm(
        "Are you sure you want to accept this registration? An account will be created for the student.",
      )
    )
      return;

    try {
      await api.put(`/registrations/${id}/accept`);
      toast.success("Registration accepted and account created");
      fetchRegistrations();
      setSelectedReg(null);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to accept registration",
      );
    }
  };

  const handleReject = async () => {
    if (!rejectionReason) {
      toast.error("Please provide a reason for rejection");
      return;
    }

    try {
      await api.put(`/registrations/${selectedReg?.id}/reject`, {
        rejection_reason: rejectionReason,
      });
      toast.success("Registration rejected");
      setShowRejectModal(false);
      setRejectionReason("");
      setSelectedReg(null);
      fetchRegistrations();
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to reject registration",
      );
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "accepted":
        return "bg-green-100 text-green-700 border-green-200";
      case "rejected":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Registration Requests
          </h1>
          <p className="text-slate-500">
            Manage and review student applications
          </p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <form onSubmit={handleSearch}>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 outline-none transition-all"
            />
          </form>
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 outline-none bg-white font-medium text-slate-700"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Applicant
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Language / Level
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Date Applied
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4">
                      <div className="h-4 bg-slate-100 rounded w-32"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 bg-slate-100 rounded w-24"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 bg-slate-100 rounded w-20"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-6 bg-slate-100 rounded-full w-16"></div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="h-8 bg-slate-100 rounded w-16 ml-auto"></div>
                    </td>
                  </tr>
                ))
              ) : registrations.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-slate-500 font-medium"
                  >
                    No registration requests found.
                  </td>
                </tr>
              ) : (
                registrations.map((reg) => (
                  <tr
                    key={reg.id}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-800">
                          {reg.full_name}
                        </span>
                        <span className="text-xs text-slate-500">
                          {reg.email}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex flex-col">
                        <span className="font-medium text-slate-700">
                          {reg.language?.name}
                        </span>
                        <span className="text-xs text-slate-400">
                          {reg.level?.name || "Level TBD"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {new Date(reg.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(reg.status)}`}
                      >
                        {reg.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => setSelectedReg(reg)}
                        className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
                        title="View Details"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      {reg.status === "pending" && (
                        <>
                          <button
                            onClick={() => handleAccept(reg.id)}
                            className="p-2 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all"
                            title="Accept"
                          >
                            <Check className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedReg(reg);
                              setShowRejectModal(true);
                            }}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                            title="Reject"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
          <span className="text-sm text-slate-500">
            Page {page} of {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="p-2 border border-slate-200 rounded-lg hover:bg-white disabled:opacity-50 transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="p-2 border border-slate-200 rounded-lg hover:bg-white disabled:opacity-50 transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Details Modal */}
      <AnimatePresence>
        {selectedReg && !showRejectModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="text-xl font-bold text-slate-800">
                  Registration Details
                </h3>
                <button
                  onClick={() => setSelectedReg(null)}
                  className="p-2 hover:bg-slate-200 rounded-full transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <User className="w-5 h-5 text-primary-500 mr-3 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Full Name
                      </p>
                      <p className="font-semibold text-slate-800">
                        {selectedReg.full_name}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Mail className="w-5 h-5 text-primary-500 mr-3 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Email Address
                      </p>
                      <p className="font-semibold text-slate-800">
                        {selectedReg.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Phone className="w-5 h-5 text-primary-500 mr-3 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Phone Number
                      </p>
                      <p className="font-semibold text-slate-800">
                        {selectedReg.phone}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Calendar className="w-5 h-5 text-primary-500 mr-3 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Date of Birth
                      </p>
                      <p className="font-semibold text-slate-800">
                        {new Date(
                          selectedReg.date_of_birth,
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start">
                    <MapPin className="w-5 h-5 text-primary-500 mr-3 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Address
                      </p>
                      <p className="font-semibold text-slate-800">
                        {selectedReg.address}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <BookOpen className="w-5 h-5 text-primary-500 mr-3 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Language Interest
                      </p>
                      <p className="font-semibold text-slate-800">
                        {selectedReg.language?.name}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <GraduationCap className="w-5 h-5 text-primary-500 mr-3 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Preferred Level
                      </p>
                      <p className="font-semibold text-slate-800">
                        {selectedReg.level?.name || "TBD"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Clock className="w-5 h-5 text-primary-500 mr-3 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Submitted At
                      </p>
                      <p className="font-semibold text-slate-800">
                        {new Date(selectedReg.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {selectedReg.status === "rejected" && (
                <div className="px-8 pb-8">
                  <div className="bg-red-50 border border-red-100 p-4 rounded-2xl flex items-start">
                    <AlertCircle className="w-5 h-5 text-red-500 mr-3 mt-0.5" />
                    <div>
                      <p className="text-sm font-bold text-red-800">
                        Rejection Reason
                      </p>
                      <p className="text-sm text-red-600">
                        {selectedReg.rejection_reason}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {selectedReg.status === "pending" && (
                <div className="p-8 bg-slate-50 border-t border-slate-100 flex gap-4">
                  <button
                    onClick={() => handleAccept(selectedReg.id)}
                    className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-green-600/20"
                  >
                    Accept Registration
                  </button>
                  <button
                    onClick={() => setShowRejectModal(true)}
                    className="flex-1 py-3 bg-white border border-red-200 text-red-600 hover:bg-red-50 rounded-xl font-bold transition-all"
                  >
                    Reject
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Reject Modal */}
      <AnimatePresence>
        {showRejectModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-8"
            >
              <h3 className="text-xl font-bold text-slate-800 mb-2 text-center">
                Reject Registration
              </h3>
              <p className="text-slate-500 text-center mb-6 text-sm">
                Please provide a reason why this registration is being rejected.
              </p>

              <textarea
                rows={4}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Reason for rejection (e.g., incomplete data, incorrect age...)"
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-red-500 outline-none transition-all resize-none mb-6"
              />

              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setShowRejectModal(false);
                    setRejectionReason("");
                  }}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReject}
                  className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-red-600/20"
                >
                  Confirm Reject
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminRegistrations;
