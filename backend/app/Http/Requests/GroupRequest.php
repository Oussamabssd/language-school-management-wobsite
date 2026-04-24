<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class GroupRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'level_id' => ['required', 'exists:levels,id'],
            'teacher_id' => ['nullable', 'exists:users,id'],
            'max_students' => ['nullable', 'integer', 'min:1', 'max:100'],
            'academic_year' => ['required', 'string', 'max:9', 'regex:/^\d{4}-\d{4}$/'],
            'status' => ['nullable', 'in:active,inactive,completed'],
        ];
    }
}
