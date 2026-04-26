<?php

namespace App\Http\Controllers;

use App\Models\EmployeePayment;
use App\Models\Receipt;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class EmployeePaymentController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = EmployeePayment::with('user')->orderBy('payment_date', 'desc');

        if ($request->has('month')) {
            $query->where('month', $request->month);
        }

        return response()->json([
            'success' => true,
            'data' => $query->get()
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'amount' => 'required|numeric|min:0',
            'payment_date' => 'required|date',
            'month' => 'required|string', // e.g. "2026-04"
        ]);

        // Prevent duplicate payments for the same month
        $exists = EmployeePayment::where('user_id', $request->user_id)
            ->where('month', $request->month)
            ->exists();

        if ($exists) {
            return response()->json([
                'success' => false,
                'message' => 'A payment for this employee for the selected month already exists.'
            ], 422);
        }

        $payment = EmployeePayment::create([
            'user_id' => $request->user_id,
            'amount' => $request->amount,
            'payment_date' => $request->payment_date,
            'month' => $request->month,
            'status' => 'paid',
        ]);

        // Generate receipt
        Receipt::create([
            'reference_number' => 'EMP-' . strtoupper(Str::random(8)),
            'payment_type' => 'employee',
            'payment_id' => $payment->id,
            'generated_at' => now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Payment recorded successfully.',
            'data' => $payment->load('user')
        ], 201);
    }

    public function show($id): JsonResponse
    {
        $payment = EmployeePayment::with('user')->findOrFail($id);
        return response()->json([
            'success' => true,
            'data' => $payment
        ]);
    }
}
