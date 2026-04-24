<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AbsenceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'student_id' => ['required', 'exists:users,id'],
            'group_id' => ['required', 'exists:groups,id'],
            'course_id' => ['nullable', 'exists:courses,id'],
            'date' => ['required', 'date'],
            'status' => ['required', 'in:absent,late,excused,present'],
            'reason' => ['nullable', 'string'],
            'marked_by' => ['required', 'exists:users,id'],
        ];
    }
}
