<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RegistrationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        if ($this->isMethod('post')) {
            return [
                'full_name' => 'required|string|max:255',
                'email' => 'required|email|max:255',
                'phone' => 'required|string|max:20',
                'date_of_birth' => 'required|date',
                'address' => 'required|string',
                'password' => 'required|string|min:8',
                'language_id' => 'required|exists:languages,id',
                'level_id' => 'nullable|exists:levels,id',
            ];
        }

        if ($this->isMethod('put') || $this->isMethod('patch')) {
            return [
                'status' => 'required|in:accepted,rejected',
                'rejection_reason' => 'required_if:status,rejected|string|nullable',
            ];
        }

        return [];
    }
}
