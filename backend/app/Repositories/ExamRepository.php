<?php

namespace App\Repositories;

use App\Models\Exam;

class ExamRepository extends BaseRepository
{
    public function __construct(Exam $model)
    {
        parent::__construct($model);
    }

    public function getWithGrades(int $id)
    {
        return $this->model->with(['grades.student', 'course', 'group'])->findOrFail($id);
    }

    public function getByGroup(int $groupId, int $perPage = 15)
    {
        return $this->model->where('group_id', $groupId)
            ->with(['course', 'grades'])
            ->orderBy('exam_date', 'desc')
            ->paginate($perPage);
    }

    public function getByCourse(int $courseId)
    {
        return $this->model->where('course_id', $courseId)
            ->with('grades')
            ->orderBy('exam_date', 'desc')
            ->get();
    }
}
