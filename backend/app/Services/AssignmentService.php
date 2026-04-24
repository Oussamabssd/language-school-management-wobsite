<?php

namespace App\Services;

use App\Repositories\AssignmentRepository;
use App\Models\Assignment;

class AssignmentService
{
    public function __construct(
        private AssignmentRepository $assignmentRepository
    ) {}

    public function getAll(int $perPage = 15)
    {
        return $this->assignmentRepository->query()
            ->with(['course', 'teacher'])
            ->paginate($perPage);
    }

    public function getById(int $id)
    {
        return $this->assignmentRepository->query()
            ->with(['course.group', 'teacher'])
            ->findOrFail($id);
    }

    public function create(array $data): Assignment
    {
        return $this->assignmentRepository->create($data);
    }

    public function update(int $id, array $data): Assignment
    {
        return $this->assignmentRepository->update($id, $data);
    }

    public function delete(int $id): bool
    {
        return $this->assignmentRepository->delete($id);
    }

    public function getByCourse(int $courseId)
    {
        return $this->assignmentRepository->getByCourse($courseId);
    }

    public function getByTeacher(int $teacherId, int $perPage = 15)
    {
        return $this->assignmentRepository->getByTeacher($teacherId, $perPage);
    }
}
