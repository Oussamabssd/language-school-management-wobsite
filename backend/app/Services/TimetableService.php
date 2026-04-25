<?php

namespace App\Services;

use App\Repositories\TimetableRepository;
use App\Models\Timetable;
use Illuminate\Validation\ValidationException;

class TimetableService
{
    public function __construct(
        private TimetableRepository $timetableRepository
    ) {}

    public function getAll(int $perPage = 15)
    {
        return $this->timetableRepository->query()
            ->with(['group.level.language', 'course', 'teacher'])
            ->paginate($perPage);
    }

    public function getById(int $id)
    {
        return $this->timetableRepository->query()
            ->with(['group.level.language', 'course', 'teacher'])
            ->findOrFail($id);
    }

    public function create(array $data): Timetable
    {
        if (empty($data['teacher_id'])) {
            $group = \App\Models\Group::findOrFail($data['group_id']);
            $data['teacher_id'] = $group->teacher_id;
        }

        $this->checkForConflicts($data);
        return $this->timetableRepository->create($data);
    }

    public function update(int $id, array $data): Timetable
    {
        if (empty($data['teacher_id']) && isset($data['group_id'])) {
            $group = \App\Models\Group::findOrFail($data['group_id']);
            $data['teacher_id'] = $group->teacher_id;
        }

        $this->checkForConflicts($data, $id);
        return $this->timetableRepository->update($id, $data);
    }

    public function delete(int $id): bool
    {
        return $this->timetableRepository->delete($id);
    }

    public function getByGroup(int $groupId)
    {
        return $this->timetableRepository->getByGroup($groupId);
    }

    public function getByTeacher(int $teacherId)
    {
        return $this->timetableRepository->getByTeacher($teacherId);
    }

    private function checkForConflicts(array $data, ?int $excludeId = null): void
    {
        if (isset($data['teacher_id'], $data['day_of_week'], $data['start_time'], $data['end_time'])) {
            $hasConflict = $this->timetableRepository->checkConflict(
                $data['teacher_id'],
                $data['day_of_week'],
                $data['start_time'],
                $data['end_time'],
                $excludeId
            );

            if ($hasConflict) {
                throw ValidationException::withMessages([
                    'schedule' => ['The teacher has a scheduling conflict at this time.'],
                ]);
            }
        }
    }
}
