<?php

namespace App\Services;

use App\Repositories\ExamRepository;
use App\Repositories\GradeRepository;
use App\Models\Exam;
use App\Models\Grade;

class ExamService
{
    public function __construct(
        private ExamRepository $examRepository,
        private GradeRepository $gradeRepository
    ) {}

    public function getAll(int $perPage = 15)
    {
        return $this->examRepository->query()
            ->with(['course', 'group'])
            ->paginate($perPage);
    }

    public function getById(int $id)
    {
        return $this->examRepository->getWithGrades($id);
    }

    public function create(array $data): Exam
    {
        return $this->examRepository->create($data);
    }

    public function update(int $id, array $data): Exam
    {
        return $this->examRepository->update($id, $data);
    }

    public function delete(int $id): bool
    {
        return $this->examRepository->delete($id);
    }

    public function getByGroup(int $groupId, int $perPage = 15)
    {
        return $this->examRepository->getByGroup($groupId, $perPage);
    }

    // Grade methods
    public function addGrade(array $data): Grade
    {
        return $this->gradeRepository->create($data);
    }

    public function updateGrade(int $id, array $data): Grade
    {
        return $this->gradeRepository->update($id, $data);
    }

    public function getGradesByStudent(int $studentId, int $perPage = 15)
    {
        return $this->gradeRepository->getByStudent($studentId, $perPage);
    }

    public function getGradesByExam(int $examId)
    {
        return $this->gradeRepository->getByExam($examId);
    }
}
