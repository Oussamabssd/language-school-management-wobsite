<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class GradeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'exam_id' => 'required|exists:exams,id',
            'student_id' => 'required|exists:users,id',
            'grade' => 'required|numeric|min:0',
            'remark' => 'nullable|string',
            'teacher_id' => 'required|exists:users,id'
        ];
    }
}
