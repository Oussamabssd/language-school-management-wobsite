import React, { useState, useEffect } from "react";
import {
  Users,
  DollarSign,
  Calendar,
  Search,
  Filter,
  Plus,
  Loader2,
  FileText,
  CheckCircle,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import financeService, {
  type EmployeePayment,
} from "../../services/financeService";
import api from "../../services/api";
import toast from "react-hot-toast";
import ReceiptModal from "../../components/finance/ReceiptModal";

const EmployeePayments: React.FC = () => {
  const [payments, setPayments] = useState<EmployeePayment[]>([]);
  const [staff, setStaff] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPayModal, setShowPayModal] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    user_id: "",
    amount: "",
    payment_date: new Date().toISOString().split("T")[0],
    month: new Date().toISOString().slice(0, 7), // YYYY-MM
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [payRes, staffRes] = await Promise.all([
        financeService.getEmployeePayments(),
        api.get("/users?role=teacher,accountant,director"), // Get all staff
      ]);
      setPayments(payRes.data.data);
      setStaff(staffRes.data.data.data || staffRes.data.data);
    } catch (error) {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await financeService.createEmployeePayment({
        user_id: parseInt(formData.user_id),
        amount: parseFloat(formData.amount),
        payment_date: formData.payment_date,
        month: formData.month,
      });
      toast.success("Salary payment recorded successfully");
      setShowPayModal(false);
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to record payment");
    } finally {
      setSubmitting(false);
    }
  };

  const viewReceipt = async (paymentId: number) => {
    try {
      // Find receipt for this payment
      const receiptsRes = await financeService.getReceipts();
      const receipt = receiptsRes.data.data.find(
        (r) => r.payment_type === "employee" && r.payment_id === paymentId,
      );
      if (receipt) {
        const fullReceipt = await financeService.getReceipt(receipt.id);
        setSelectedReceipt(fullReceipt.data.data);
      } else {
        toast.error("Receipt not found");
      }
    } catch (error) {
      toast.error("Failed to load receipt");
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Employee Salaries
          </h1>
          <p className="text-slate-500 mt-1">
            Manage monthly salary payments for teachers and staff.
          </p>
        </div>
        <button
          onClick={() => setShowPayModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-2xl font-bold hover:bg-primary-700 transition-all shadow-lg shadow-primary-200"
        >
          <Plus className="w-5 h-5" />
          Pay Salary
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Total Paid (Month)
            </p>
            <p className="text-2xl font-bold text-slate-800">
              {payments
                .filter((p) => p.month === new Date().toISOString().slice(0, 7))
                .reduce((sum, p) => sum + Number(p.amount), 0)}{" "}
              MAD
            </p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Staff Count
            </p>
            <p className="text-2xl font-bold text-slate-800">{staff.length}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
          <h3 className="font-bold text-slate-800">Payment History</h3>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search employee..."
                className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none"
              />
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">
                <th className="px-8 py-4">Employee</th>
                <th className="px-8 py-4">Month</th>
                <th className="px-8 py-4">Amount</th>
                <th className="px-8 py-4">Date</th>
                <th className="px-8 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={5} className="px-8 py-4">
                        <div className="h-10 bg-slate-100 rounded-xl w-full"></div>
                      </td>
                    </tr>
                  ))
                : payments.map((payment) => (
                    <tr
                      key={payment.id}
                      className="hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="px-8 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-bold text-sm">
                            {payment.user?.first_name?.[0]}
                            {payment.user?.last_name?.[0]}
                          </div>
                          <div>
                            <p className="font-bold text-slate-800">
                              {payment.user?.first_name}{" "}
                              {payment.user?.last_name}
                            </p>
                            <p className="text-xs text-slate-500 capitalize">
                              Staff
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-4 text-sm text-slate-600 font-medium">
                        {payment.month}
                      </td>
                      <td className="px-8 py-4 text-sm font-bold text-slate-800">
                        {payment.amount} MAD
                      </td>
                      <td className="px-8 py-4 text-sm text-slate-500">
                        {new Date(payment.payment_date).toLocaleDateString()}
                      </td>
                      <td className="px-8 py-4 text-right">
                        <button
                          onClick={() => viewReceipt(payment.id)}
                          className="p-2 text-primary-600 hover:bg-primary-50 rounded-xl transition-all"
                          title="View Receipt"
                        >
                          <FileText className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {showPayModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="text-xl font-bold text-slate-800">
                  Record Salary Payment
                </h3>
                <button
                  onClick={() => setShowPayModal(false)}
                  className="p-2 hover:bg-white rounded-full transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handlePay} className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">
                    Select Employee
                  </label>
                  <select
                    required
                    value={formData.user_id}
                    onChange={(e) =>
                      setFormData({ ...formData, user_id: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-primary-500 outline-none bg-white"
                  >
                    <option value="">Select staff member</option>
                    {staff.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.first_name} {s.last_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">
                    Amount (MAD)
                  </label>
                  <input
                    required
                    type="number"
                    value={formData.amount}
                    onChange={(e) =>
                      setFormData({ ...formData, amount: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-primary-500 outline-none"
                    placeholder="e.g. 5000"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">
                      Payment Date
                    </label>
                    <input
                      required
                      type="date"
                      value={formData.payment_date}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          payment_date: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-primary-500 outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">
                      For Month
                    </label>
                    <input
                      required
                      type="month"
                      value={formData.month}
                      onChange={(e) =>
                        setFormData({ ...formData, month: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-primary-500 outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 bg-primary-600 text-white rounded-2xl font-bold shadow-xl shadow-primary-100 hover:bg-primary-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {submitting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    "Confirm Payment"
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ReceiptModal
        receipt={selectedReceipt}
        onClose={() => setSelectedReceipt(null)}
      />
    </div>
  );
};

export default EmployeePayments;
