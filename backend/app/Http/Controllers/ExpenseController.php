<?php

namespace App\Http\Controllers;

use App\Models\Expense;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ExpenseController extends Controller
{
    public function index(): JsonResponse
    {
        $expenses = Expense::orderBy('expense_date', 'desc')->get();
        return response()->json([
            'success' => true,
            'data' => $expenses
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'amount' => 'required|numeric|min:0',
            'category' => 'required|string|max:255',
            'expense_date' => 'required|date',
        ]);

        $expense = Expense::create($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Expense recorded successfully.',
            'data' => $expense
        ], 201);
    }

    public function update(Request $request, $id): JsonResponse
    {
        $expense = Expense::findOrFail($id);
        
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'amount' => 'required|numeric|min:0',
            'category' => 'required|string|max:255',
            'expense_date' => 'required|date',
        ]);

        $expense->update($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Expense updated successfully.',
            'data' => $expense
        ]);
    }

    public function destroy($id): JsonResponse
    {
        $expense = Expense::findOrFail($id);
        $expense->delete();

        return response()->json([
            'success' => true,
            'message' => 'Expense deleted successfully.'
        ]);
    }
}
