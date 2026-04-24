<?php

namespace App\Services;

use App\Repositories\CourseRepository;
use App\Models\Course;

class CourseService
{
    public function __construct(
        private CourseRepository $courseRepository
    ) {}

    public function getAll(int $perPage = 15)
    {
        return $this->courseRepository->getWithRelations($perPage);
    }

    public function getById(int $id)
    {
        return $this->courseRepository->query()
            ->with(['group.level.language', 'teacher', 'assignments', 'exams'])
            ->findOrFail($id);
    }

    public function create(array $data): Course
    {
        return $this->courseRepository->create($data);
    }

    public function update(int $id, array $data): Course
    {
        return $this->courseRepository->update($id, $data);
    }

    public function delete(int $id): bool
    {
        return $this->courseRepository->delete($id);
    }

    public function getByTeacher(int $teacherId, int $perPage = 15)
    {
        return $this->courseRepository->getByTeacher($teacherId, $perPage);
    }

    public function getByGroup(int $groupId)
    {
        return $this->courseRepository->getByGroup($groupId);
    }
}
