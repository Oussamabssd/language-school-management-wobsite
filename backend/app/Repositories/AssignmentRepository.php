<?php

namespace App\Repositories;

use App\Models\Assignment;

class AssignmentRepository extends BaseRepository
{
    public function __construct(Assignment $model)
    {
        parent::__construct($model);
    }

    public function getByCourse(int $courseId)
    {
        return $this->model->where('course_id', $courseId)
            ->with('teacher')
            ->orderBy('due_date')
            ->get();
    }

    public function getByTeacher(int $teacherId, int $perPage = 15)
    {
        return $this->model->where('teacher_id', $teacherId)
            ->with('course')
            ->paginate($perPage);
    }
}
