<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ExamResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'exam_date' => $this->exam_date?->toISOString(),
            'duration_minutes' => $this->duration_minutes,
            'max_score' => $this->max_score,
            'type' => $this->type,
            'status' => $this->status,
            'course' => new CourseResource($this->whenLoaded('course')),
            'group' => new GroupResource($this->whenLoaded('group')),
            'grades' => GradeResource::collection($this->whenLoaded('grades')),
            'created_at' => $this->created_at->toISOString(),
        ];
    }
}
