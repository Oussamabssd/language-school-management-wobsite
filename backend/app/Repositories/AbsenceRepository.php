<?php

namespace App\Repositories;

use App\Models\Absence;

class AbsenceRepository extends BaseRepository
{
    public function __construct(Absence $model)
    {
        parent::__construct($model);
    }

    public function getByStudent(int $studentId, int $perPage = 15)
    {
        return $this->model->where('student_id', $studentId)
            ->with(['group', 'course', 'markedBy'])
            ->orderBy('date', 'desc')
            ->paginate($perPage);
    }

    public function getByGroup(int $groupId, ?string $date = null)
    {
        $query = $this->model->where('group_id', $groupId)->with('student');
        if ($date) {
            $query->where('date', $date);
        }
        return $query->orderBy('date', 'desc')->get();
    }
}
