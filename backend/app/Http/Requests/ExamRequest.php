<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ExamRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'course_id' => ['required', 'exists:courses,id'],
            'group_id' => ['required', 'exists:groups,id'],
            'exam_date' => ['required', 'date'],
            'duration_minutes' => ['nullable', 'integer', 'min:1'],
            'max_score' => ['nullable', 'numeric', 'min:0'],
            'type' => ['nullable', 'in:quiz,midterm,final,oral,practical'],
            'status' => ['nullable', 'in:scheduled,in_progress,completed,cancelled'],
        ];
    }
}
