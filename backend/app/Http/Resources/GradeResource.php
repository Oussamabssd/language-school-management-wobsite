<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class GradeResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'grade' => $this->grade,
            'remark' => $this->remark,
            'exam' => new ExamResource($this->whenLoaded('exam')),
            'student' => new UserResource($this->whenLoaded('student')),
            'teacher' => new UserResource($this->whenLoaded('teacher')),
            'created_at' => $this->created_at->toISOString(),
        ];
    }
}
