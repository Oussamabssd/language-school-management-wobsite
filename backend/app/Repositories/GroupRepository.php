<?php

namespace App\Repositories;

use App\Models\Group;

class GroupRepository extends BaseRepository
{
    public function __construct(Group $model)
    {
        parent::__construct($model);
    }

    public function getWithRelations(int $perPage = 15)
    {
        return $this->model->with(['level.language', 'teacher', 'students'])
            ->paginate($perPage);
    }

    public function getByTeacher(int $teacherId)
    {
        return $this->model->where('teacher_id', $teacherId)
            ->with(['level.language', 'students'])
            ->get();
    }

    public function addStudent(int $groupId, int $studentId, array $pivotData = [])
    {
        $group = $this->findOrFail($groupId);
        $group->students()->syncWithoutDetaching([
            $studentId => array_merge([
                'enrolled_at' => now()->toDateString(),
                'status' => 'active',
            ], $pivotData)
        ]);
        return $group->fresh('students');
    }

    public function removeStudent(int $groupId, int $studentId)
    {
        $group = $this->findOrFail($groupId);
        $group->students()->updateExistingPivot($studentId, [
            'left_at' => now()->toDateString(),
            'status' => 'inactive',
        ]);
        return $group->fresh('students');
    }
}
