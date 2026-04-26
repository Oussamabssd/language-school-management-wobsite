<?php

namespace App\Http\Controllers;

use App\Models\Receipt;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReceiptController extends Controller
{
    public function index(): JsonResponse
    {
        $receipts = Receipt::orderBy('generated_at', 'desc')->get();
        return response()->json([
            'success' => true,
            'data' => $receipts
        ]);
    }

    public function show($id): JsonResponse
    {
        $receipt = Receipt::findOrFail($id);
        
        // Load the related payment
        if ($receipt->payment_type === 'student') {
            $receipt->load('payment.student');
        } else {
            $receipt->load('payment.user');
        }

        return response()->json([
            'success' => true,
            'data' => $receipt
        ]);
    }
}
