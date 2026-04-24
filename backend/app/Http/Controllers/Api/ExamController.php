<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ExamRequest;
use App\Http\Requests\GradeRequest;
use App\Http\Resources\ExamResource;
use App\Http\Resources\GradeResource;
use App\Services\ExamService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ExamController extends Controller
{
    public function __construct(private ExamService $examService) {}

    public function index(Request $request): JsonResponse
    {
        return $this->success(ExamResource::collection($this->examService->getAll($request->input('per_page', 15)))->response()->getData(true));
    }

    public function store(ExamRequest $request): JsonResponse
    {
        return $this->success(new ExamResource($this->examService->create($request->validated())), 'Exam created', 201);
    }

    public function show(int $id): JsonResponse
    {
        return $this->success(new ExamResource($this->examService->getById($id)));
    }

    public function update(ExamRequest $request, int $id): JsonResponse
    {
        return $this->success(new ExamResource($this->examService->update($id, $request->validated())), 'Exam updated');
    }

    public function destroy(int $id): JsonResponse
    {
        $this->examService->delete($id);
        return $this->success(null, 'Exam deleted');
    }

    // Grade endpoints
    public function storeGrade(GradeRequest $request): JsonResponse
    {
        return $this->success(new GradeResource($this->examService->addGrade($request->validated())), 'Grade recorded', 201);
    }

    public function updateGrade(GradeRequest $request, int $id): JsonResponse
    {
        return $this->success(new GradeResource($this->examService->updateGrade($id, $request->validated())), 'Grade updated');
    }

    public function gradesByStudent(int $studentId, Request $request): JsonResponse
    {
        return $this->success(GradeResource::collection($this->examService->getGradesByStudent($studentId, $request->input('per_page', 15)))->response()->getData(true));
    }

    public function gradesByExam(int $examId): JsonResponse
    {
        return $this->success(GradeResource::collection($this->examService->getGradesByExam($examId)));
    }
}
