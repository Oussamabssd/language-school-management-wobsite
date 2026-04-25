<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AssignmentSubmissionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'assignment_id' => $this->assignment_id,
            'student_id' => $this->student_id,
            'file_path' => $this->file_path ? asset('storage/' . $this->file_path) : null,
            'grade' => $this->grade,
            'teacher_remark' => $this->teacher_remark,
            'submitted_at' => $this->submitted_at?->toISOString(),
            'assignment' => new AssignmentResource($this->whenLoaded('assignment')),
            'student' => new UserResource($this->whenLoaded('student')),
            'created_at' => $this->created_at->toISOString(),
        ];
    }
}
