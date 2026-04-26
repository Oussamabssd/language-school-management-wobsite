<?php

namespace App\Http\Controllers;

use App\Models\StudentPayment;
use App\Models\Receipt;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class StudentPaymentController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = StudentPayment::with('student')->orderBy('payment_date', 'desc');

        if ($request->has('period')) {
            $query->where('period', $request->period);
        }

        if ($request->has('student_id')) {
            $query->where('student_id', $request->student_id);
        }

        return response()->json([
            'success' => true,
            'data' => $query->get()
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'student_id' => 'required|exists:users,id',
            'amount' => 'required|numeric|min:0',
            'payment_date' => 'required|date',
            'period' => 'required|string', // e.g. "Q1-2026"
        ]);

        $payment = StudentPayment::create([
            'student_id' => $request->student_id,
            'amount' => $request->amount,
            'payment_date' => $request->payment_date,
            'period' => $request->period,
            'status' => 'paid',
        ]);

        // Generate receipt
        Receipt::create([
            'reference_number' => 'STU-' . strtoupper(Str::random(8)),
            'payment_type' => 'student',
            'payment_id' => $payment->id,
            'generated_at' => now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Payment recorded successfully.',
            'data' => $payment->load('student')
        ], 201);
    }

    public function show($id): JsonResponse
    {
        $payment = StudentPayment::with('student')->findOrFail($id);
        return response()->json([
            'success' => true,
            'data' => $payment
        ]);
    }
}
