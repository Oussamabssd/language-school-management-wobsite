<?php

namespace App\Services;

use App\Repositories\AbsenceRepository;
use App\Models\Absence;

class AbsenceService
{
    public function __construct(
        private AbsenceRepository $absenceRepository
    ) {}

    public function getAll(int $perPage = 15)
    {
        return $this->absenceRepository->query()
            ->with(['student', 'group', 'course', 'markedBy'])
            ->paginate($perPage);
    }

    public function getById(int $id)
    {
        return $this->absenceRepository->query()
            ->with(['student', 'group', 'course', 'markedBy'])
            ->findOrFail($id);
    }

    public function create(array $data): Absence
    {
        return $this->absenceRepository->create($data);
    }

    public function update(int $id, array $data): Absence
    {
        return $this->absenceRepository->update($id, $data);
    }

    public function delete(int $id): bool
    {
        return $this->absenceRepository->delete($id);
    }

    public function getByStudent(int $studentId, int $perPage = 15)
    {
        return $this->absenceRepository->getByStudent($studentId, $perPage);
    }

    public function getByGroup(int $groupId, ?string $date = null)
    {
        return $this->absenceRepository->getByGroup($groupId, $date);
    }
}
