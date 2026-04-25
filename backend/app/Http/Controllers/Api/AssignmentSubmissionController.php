<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\AssignmentSubmissionResource;
use App\Models\Assignment;
use App\Models\AssignmentSubmission;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AssignmentSubmissionController extends Controller
{
    public function getByAssignment(int $assignmentId): JsonResponse
    {
        $assignment = Assignment::with('course.group.students')->findOrFail($assignmentId);
        $submissions = AssignmentSubmission::where('assignment_id', $assignmentId)->get()->keyBy('student_id');
        
        $students = $assignment->course->group->students;
        
        $data = $students->map(function ($student) use ($assignmentId, $submissions) {
            return [
                'student' => [
                    'id' => $student->id,
                    'first_name' => $student->first_name,
                    'last_name' => $student->last_name,
                ],
                'submission' => isset($submissions[$student->id]) 
                    ? new AssignmentSubmissionResource($submissions[$student->id])
                    : null
            ];
        });

        return $this->success($data);
    }

    public function storeGrade(Request $request, int $assignmentId, int $studentId): JsonResponse
    {
        $request->validate([
            'grade' => ['nullable', 'numeric', 'min:0', 'max:20'],
            'teacher_remark' => ['nullable', 'string'],
        ]);

        $submission = AssignmentSubmission::updateOrCreate(
            ['assignment_id' => $assignmentId, 'student_id' => $studentId],
            [
                'grade' => $request->grade,
                'teacher_remark' => $request->teacher_remark,
            ]
        );

        return $this->success(new AssignmentSubmissionResource($submission), 'Grade saved successfully');
    }

    public function getStudentGrades(int $studentId): JsonResponse
    {
        $submissions = AssignmentSubmission::with(['assignment.course', 'assignment.teacher'])
            ->where('student_id', $studentId)
            ->get();
            
        return $this->success(AssignmentSubmissionResource::collection($submissions));
    }
}
