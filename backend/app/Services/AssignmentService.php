<?php

namespace App\Services;

use App\Repositories\AssignmentRepository;
use App\Models\Assignment;

use Illuminate\Support\Facades\Storage;

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
        if (isset($data['file'])) {
            $data['file_path'] = $data['file']->store('assignments', 'public');
            unset($data['file']);
        }
        return $this->assignmentRepository->create($data);
    }

    public function update(int $id, array $data): Assignment
    {
        if (isset($data['file'])) {
            $assignment = $this->getById($id);
            if ($assignment->file_path) {
                Storage::disk('public')->delete($assignment->file_path);
            }
            $data['file_path'] = $data['file']->store('assignments', 'public');
            unset($data['file']);
        }
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
