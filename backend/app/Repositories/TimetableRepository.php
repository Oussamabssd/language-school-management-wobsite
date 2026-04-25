<?php

namespace App\Repositories;

use App\Models\Timetable;

class TimetableRepository extends BaseRepository
{
    public function __construct(Timetable $model)
    {
        parent::__construct($model);
    }

    public function getByGroup(int $groupId)
    {
        return $this->model->where('group_id', $groupId)
            ->where('is_active', true)
            ->with(['course', 'teacher'])
            ->orderByRaw("FIELD(day_of_week, 'monday','tuesday','wednesday','thursday','friday','saturday','sunday')")
            ->orderBy('start_time')
            ->get();
    }

    public function getByTeacher(int $teacherId)
    {
        return $this->model->where('teacher_id', $teacherId)
            ->where('is_active', true)
            ->with(['group.level.language', 'group.students', 'course'])
            ->orderByRaw("FIELD(day_of_week, 'monday','tuesday','wednesday','thursday','friday','saturday','sunday')")
            ->orderBy('start_time')
            ->get();
    }

    public function getByStudent(int $studentId)
    {
        return $this->model->whereHas('group.students', function($query) use ($studentId) {
            $query->where('users.id', $studentId);
        })
        ->where('is_active', true)
        ->with(['group.level.language', 'course', 'teacher'])
        ->orderByRaw("FIELD(day_of_week, 'monday','tuesday','wednesday','thursday','friday','saturday','sunday')")
        ->orderBy('start_time')
        ->get();
    }

    public function checkConflict(int $teacherId, string $day, string $start, string $end, ?int $excludeId = null)
    {
        $query = $this->model->where('teacher_id', $teacherId)
            ->where('day_of_week', $day)
            ->where('is_active', true)
            ->where(function ($q) use ($start, $end) {
                $q->where(function ($q2) use ($start, $end) {
                    $q2->where('start_time', '<', $end)
                        ->where('end_time', '>', $start);
                });
            });

        if ($excludeId) {
            $query->where('id', '!=', $excludeId);
        }

        return $query->exists();
    }
}
