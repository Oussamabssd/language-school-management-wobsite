<?php

namespace App\Repositories;

use App\Models\Grade;

class GradeRepository extends BaseRepository
{
    public function __construct(Grade $model)
    {
        parent::__construct($model);
    }

    public function getByStudent(int $studentId, int $perPage = 15)
    {
        return $this->model->where('student_id', $studentId)
            ->with(['exam.course', 'exam.group'])
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);
    }

    public function getByExam(int $examId)
    {
        return $this->model->where('exam_id', $examId)
            ->with('student')
            ->get();
    }
}
