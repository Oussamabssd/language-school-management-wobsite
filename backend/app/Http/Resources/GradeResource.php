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
            'score' => $this->score,
            'remarks' => $this->remarks,
            'exam' => new ExamResource($this->whenLoaded('exam')),
            'student' => new UserResource($this->whenLoaded('student')),
            'graded_by' => new UserResource($this->whenLoaded('gradedBy')),
            'created_at' => $this->created_at->toISOString(),
        ];
    }
}
