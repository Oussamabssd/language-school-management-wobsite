<?php

namespace App\Services;

use App\Repositories\GroupRepository;
use App\Models\Group;

class GroupService
{
    public function __construct(
        private GroupRepository $groupRepository
    ) {}

    public function getAll(int $perPage = 15)
    {
        return $this->groupRepository->getWithRelations($perPage);
    }

    public function getById(int $id)
    {
        return $this->groupRepository->query()
            ->with(['level.language', 'teacher', 'students', 'courses', 'timetables'])
            ->findOrFail($id);
    }

    public function create(array $data): Group
    {
        return $this->groupRepository->create($data);
    }

    public function update(int $id, array $data): Group
    {
        return $this->groupRepository->update($id, $data);
    }

    public function delete(int $id): bool
    {
        return $this->groupRepository->delete($id);
    }

    public function getByTeacher(int $teacherId)
    {
        return $this->groupRepository->getByTeacher($teacherId);
    }

    public function addStudent(int $groupId, int $studentId, array $pivotData = [])
    {
        return $this->groupRepository->addStudent($groupId, $studentId, $pivotData);
    }

    public function removeStudent(int $groupId, int $studentId)
    {
        return $this->groupRepository->removeStudent($groupId, $studentId);
    }
}
