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
        $user = $request->user();
        $query = \App\Models\Exam::query();

        // If student, only show announced exams for their groups
        if ($user->hasRole('student')) {
            $groupIds = $user->groups->pluck('id');
            $query->whereIn('group_id', $groupIds)->where('is_announced', true);
        }
        // If parent, only show announced exams for their children's groups
        elseif ($user->hasRole('parent')) {
            $groupIds = $user->children()->with('groups')->get()->pluck('groups')->flatten()->pluck('id')->unique();
            $query->whereIn('group_id', $groupIds)->where('is_announced', true);
        }
        // Teachers see all exams related to their groups? Or just all? 
        // For now, let's keep all for staff, but maybe filter by teacher later.

        $exams = $query->with(['course', 'group'])->latest()->paginate($request->input('per_page', 15));
        
        return $this->success(ExamResource::collection($exams)->response()->getData(true));
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
