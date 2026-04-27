<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Http\Resources\AbsenceResource;
use App\Http\Resources\TimetableResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ParentController extends Controller
{
    public function students(Request $request): JsonResponse
    {
        $parent = $request->user();
        $students = $parent->children()->with(['groups', 'roles'])->get();
        return $this->success(UserResource::collection($students));
    }

    public function studentAbsences(Request $request, int $studentId): JsonResponse
    {
        $parent = $request->user();
        $student = $parent->children()->findOrFail($studentId);
        
        $absences = $student->absences()->with(['course', 'group'])->latest()->get();
        return $this->success(AbsenceResource::collection($absences));
    }

    public function studentTimetable(Request $request, int $studentId): JsonResponse
    {
        $parent = $request->user();
        $student = $parent->children()->with('groups')->findOrFail($studentId);
        
        $groupIds = $student->groups->pluck('id');
        $timetable = \App\Models\Timetable::whereIn('group_id', $groupIds)
            ->with(['course', 'group', 'teacher'])
            ->get();
            
        return $this->success(TimetableResource::collection($timetable));
    }

    public function studentRemarks(Request $request, int $studentId): JsonResponse
    {
        $parent = $request->user();
        $student = $parent->children()->findOrFail($studentId);
        
        $homeworkRemarks = \App\Models\AssignmentSubmission::where('student_id', $studentId)
            ->whereNotNull('teacher_remark')
            ->with('assignment.course')
            ->latest()
            ->get()
            ->map(fn($s) => [
                'id' => $s->id,
                'type' => 'Homework',
                'title' => $s->assignment->title,
                'course' => $s->assignment->course->title ?? 'N/A',
                'remark' => $s->teacher_remark,
                'date' => $s->updated_at->toISOString(),
            ]);

        $examRemarks = \App\Models\Grade::where('student_id', $studentId)
            ->whereNotNull('remark')
            ->with('exam.course')
            ->latest()
            ->get()
            ->map(fn($g) => [
                'id' => $g->id,
                'type' => 'Exam',
                'title' => $g->exam->title ?? 'Exam',
                'course' => $g->exam->course->title ?? 'N/A',
                'remark' => $g->remark,
                'date' => $g->updated_at->toISOString(),
            ]);

        $allRemarks = $homeworkRemarks->concat($examRemarks)->sortByDesc('date')->values();

        return $this->success($allRemarks);
    }
}
