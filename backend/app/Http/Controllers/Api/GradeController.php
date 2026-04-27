<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\GradeRequest;
use App\Http\Resources\GradeResource;
use App\Services\ExamService;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GradeController extends Controller
{
    public function __construct(private ExamService $examService) {}

    public function index(Request $request): JsonResponse
    {
        if ($request->has('exam_id')) {
            return $this->success(GradeResource::collection($this->examService->getGradesByExam($request->exam_id)));
        }
        
        if ($request->has('student_id')) {
            return $this->success(GradeResource::collection($this->examService->getGradesByStudent($request->student_id)));
        }

        return $this->error('Missing parameters');
    }

    public function store(GradeRequest $request): JsonResponse
    {
        // One grade per student per exam
        $existing = \App\Models\Grade::where('exam_id', $request->exam_id)
            ->where('student_id', $request->student_id)
            ->first();

        if ($existing) {
            return $this->error('Grade already exists for this student in this exam', 422);
        }

        return $this->success(new GradeResource($this->examService->addGrade($request->validated())), 'Grade assigned', 201);
    }

    public function update(GradeRequest $request, int $id): JsonResponse
    {
        return $this->success(new GradeResource($this->examService->updateGrade($id, $request->validated())), 'Grade updated');
    }

    public function studentGrades(Request $request, int $studentId = null): JsonResponse
    {
        $user = $request->user();
        
        // If parent, check if studentId is provided and is their child
        if ($user->hasRole('parent')) {
            if (!$studentId) return $this->error('Student ID required', 400);
            $student = $user->children()->findOrFail($studentId);
        } else {
            // If student, use their own ID
            $studentId = $user->id;
        }

        $grades = \App\Models\Grade::where('student_id', $studentId)
            ->whereHas('exam', function($query) {
                $query->where('is_announced', true);
            })
            ->with(['exam.course', 'exam.group'])
            ->get();

        // Organize by Quarter
        $organized = [
            'Q1' => $grades->filter(fn($g) => $g->exam->quarter === 'Q1'),
            'Q2' => $grades->filter(fn($g) => $g->exam->quarter === 'Q2'),
            'Q3' => $grades->filter(fn($g) => $g->exam->quarter === 'Q3'),
            'Q4' => $grades->filter(fn($g) => $g->exam->quarter === 'Q4'),
        ];

        return $this->success($organized);
    }

    public function groupRanking(Request $request, int $groupId): JsonResponse
    {
        $quarter = $request->query('quarter', 'Q1');
        
        $rankings = \App\Models\Grade::whereHas('exam', function($query) use ($groupId, $quarter) {
                $query->where('group_id', $groupId)->where('quarter', $quarter);
            })
            ->with('student')
            ->get()
            ->groupBy('student_id')
            ->map(function($studentGrades) {
                $student = $studentGrades->first()->student;
                $avg = $studentGrades->avg('grade');
                return [
                    'student_id' => $student->id,
                    'name' => $student->first_name . ' ' . $student->last_name,
                    'average' => round($avg, 2),
                    'exams_count' => $studentGrades->count()
                ];
            })
            ->sortByDesc('average')
            ->values();

        return $this->success($rankings);
    }
}
