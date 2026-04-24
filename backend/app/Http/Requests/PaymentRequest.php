<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PaymentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'user_id' => ['required', 'exists:users,id'],
            'type' => ['required', 'in:registration_fee,tuition,salary,expense,other'],
            'amount' => ['required', 'numeric', 'min:0'],
            'currency' => ['nullable', 'string', 'size:3'],
            'status' => ['nullable', 'in:pending,paid,overdue,cancelled,refunded'],
            'payment_method' => ['nullable', 'in:cash,bank_transfer,check,card,other'],
            'reference' => ['nullable', 'string'],
            'description' => ['nullable', 'string'],
            'due_date' => ['nullable', 'date'],
        ];
    }
}
