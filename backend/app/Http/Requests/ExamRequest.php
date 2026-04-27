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
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'course_id' => 'sometimes|required|exists:courses,id',
            'group_id' => 'sometimes|required|exists:groups,id',
            'quarter' => 'sometimes|required|in:Q1,Q2,Q3,Q4',
            'exam_date' => 'sometimes|required|date',
            'start_time' => 'nullable|string',
            'end_time' => 'nullable|string',
            'classroom' => 'nullable|string',
            'max_score' => 'nullable|numeric|min:0',
            'is_announced' => 'nullable|boolean',
            'type' => 'nullable|in:quiz,midterm,final,oral,practical',
            'status' => 'nullable|in:scheduled,in_progress,completed,cancelled'
        ];
    }
}
