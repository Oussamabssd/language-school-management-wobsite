import api from './api';
import type { ApiResponse } from '../types';

export interface EmployeePayment {
  id: number;
  user_id: number;
  amount: number;
  payment_date: string;
  month: string;
  status: 'paid' | 'pending';
  user?: {
    id: number;
    name: string;
    first_name: string;
    last_name: string;
    email?: string;
  };
}

export interface StudentPayment {
  id: number;
  student_id: number;
  amount: number;
  payment_date: string;
  period: string;
  status: 'paid' | 'unpaid';
  student?: {
    id: number;
    name: string;
    first_name: string;
    last_name: string;
    email?: string;
  };
}

export interface Expense {
  id: number;
  title: string;
  description?: string;
  amount: number;
  category: string;
  expense_date: string;
}

export interface Receipt {
  id: number;
  reference_number: string;
  payment_type: 'student' | 'employee';
  payment_id: number;
  generated_at: string;
  payment?: any;
}

const financeService = {
  // Employee Payments
  getEmployeePayments: (month?: string) => 
    api.get<ApiResponse<EmployeePayment[]>>('/employee-payments', { params: { month } }),
  
  createEmployeePayment: (data: { user_id: number; amount: number; payment_date: string; month: string }) =>
    api.post<ApiResponse<EmployeePayment>>('/employee-payments', data),

  // Student Payments
  getStudentPayments: (params?: { period?: string; student_id?: number }) =>
    api.get<ApiResponse<StudentPayment[]>>('/student-payments', { params }),

  createStudentPayment: (data: { student_id: number; amount: number; payment_date: string; period: string }) =>
    api.post<ApiResponse<StudentPayment>>('/student-payments', data),

  // Expenses
  getExpenses: () =>
    api.get<ApiResponse<Expense[]>>('/expenses'),

  createExpense: (data: Omit<Expense, 'id'>) =>
    api.post<ApiResponse<Expense>>('/expenses', data),

  updateExpense: (id: number, data: Omit<Expense, 'id'>) =>
    api.put<ApiResponse<Expense>>(`/expenses/${id}`, data),

  deleteExpense: (id: number) =>
    api.delete<ApiResponse<any>>(`/expenses/${id}`),

  // Receipts
  getReceipts: () =>
    api.get<ApiResponse<Receipt[]>>('/receipts'),

  getReceipt: (id: number) =>
    api.get<ApiResponse<Receipt>>(`/receipts/${id}`),
};

export default financeService;
