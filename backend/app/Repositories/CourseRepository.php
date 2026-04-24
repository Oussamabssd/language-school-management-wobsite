<?php

namespace App\Repositories;

use App\Models\Course;

class CourseRepository extends BaseRepository
{
    public function __construct(Course $model)
    {
        parent::__construct($model);
    }

    public function getWithRelations(int $perPage = 15)
    {
        return $this->model->with(['group.level.language', 'teacher', 'assignments'])
            ->paginate($perPage);
    }

    public function getByTeacher(int $teacherId, int $perPage = 15)
    {
        return $this->model->where('teacher_id', $teacherId)
            ->with(['group.level.language', 'assignments'])
            ->paginate($perPage);
    }

    public function getByGroup(int $groupId)
    {
        return $this->model->where('group_id', $groupId)
            ->with(['teacher', 'assignments'])
            ->get();
    }
}
