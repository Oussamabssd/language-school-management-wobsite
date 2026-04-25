<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TimetableRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'group_id' => ['required', 'exists:groups,id'],
            'course_id' => ['nullable', 'exists:courses,id'],
            'teacher_id' => ['nullable', 'exists:users,id'],
            'day_of_week' => ['required', 'in:monday,tuesday,wednesday,thursday,friday,saturday,sunday'],
            'start_time' => ['required', 'date_format:H:i'],
            'end_time' => ['required', 'date_format:H:i', 'after:start_time'],
            'room' => ['nullable', 'string', 'max:50'],
            'academic_year' => ['required', 'string', 'max:9'],
            'is_active' => ['nullable', 'boolean'],
        ];
    }
}
