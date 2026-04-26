import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Printer, Download, CheckCircle } from 'lucide-react';
import type { Receipt } from '../services/financeService';

interface ReceiptModalProps {
  receipt: Receipt | null;
  onClose: () => void;
}

const ReceiptModal: React.FC<ReceiptModalProps> = ({ receipt, onClose }) => {
  if (!receipt) return null;

  const handlePrint = () => {
    window.print();
  };

  const payment = receipt.payment;
  const payer = receipt.payment_type === 'student' ? payment?.student : payment?.user;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm print:bg-white print:p-0">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden print:shadow-none print:rounded-none"
        >
          {/* Header */}
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 print:hidden">
            <h3 className="text-xl font-bold text-slate-800">Payment Receipt</h3>
            <div className="flex items-center gap-2">
              <button 
                onClick={handlePrint}
                className="p-2 hover:bg-white rounded-xl text-primary-600 transition-all flex items-center gap-2 font-bold text-sm"
              >
                <Printer className="w-4 h-4" />
                Print
              </button>
              <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-all">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Receipt Content */}
          <div className="p-10 space-y-8" id="receipt-content">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <div className="w-12 h-12 rounded-xl bg-primary-600 flex items-center justify-center text-white font-bold text-2xl mb-4">
                  E
                </div>
                <h1 className="text-2xl font-bold text-slate-800">Ecole Langues</h1>
                <p className="text-sm text-slate-500">123 Education Street, Casablanca, Morocco</p>
                <p className="text-sm text-slate-500">+212 522 00 00 00</p>
              </div>
              <div className="text-right space-y-2">
                <div className="inline-block px-4 py-1 bg-green-50 text-green-700 rounded-full text-xs font-bold uppercase tracking-widest border border-green-100">
                  Paid
                </div>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Receipt No</p>
                <p className="text-lg font-bold text-primary-600">{receipt.reference_number}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8 py-8 border-y border-slate-100">
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Billed To</p>
                  <p className="font-bold text-slate-800 text-lg">{payer?.first_name} {payer?.last_name}</p>
                  <p className="text-sm text-slate-500">{payer?.email}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Payment For</p>
                  <p className="text-sm font-medium text-slate-700">
                    {receipt.payment_type === 'student' ? `Tuition Fee (${payment?.period})` : `Salary Payment (${payment?.month})`}
                  </p>
                </div>
              </div>
              <div className="space-y-4 text-right">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Date Issued</p>
                  <p className="text-sm font-medium text-slate-700">{new Date(receipt.generated_at).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Payment Method</p>
                  <p className="text-sm font-medium text-slate-700">Bank Transfer / Cash</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-6 flex justify-between items-center">
              <div>
                <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Amount Paid</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-slate-800">{payment?.amount} MAD</p>
              </div>
            </div>

            <div className="pt-8 text-center space-y-4">
              <div className="flex justify-center text-green-500">
                <CheckCircle className="w-12 h-12" />
              </div>
              <p className="text-slate-500 text-sm italic">This is a computer-generated receipt and does not require a physical signature.</p>
              <p className="text-slate-400 text-xs">Generated on {new Date().toLocaleString()}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ReceiptModal;
