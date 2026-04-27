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
            'quarter' => $this->quarter,
            'exam_date' => $this->exam_date, // Format depends on model cast, usually Y-m-d
            'start_time' => $this->start_time,
            'end_time' => $this->end_time,
            'classroom' => $this->classroom,
            'max_score' => $this->max_score,
            'type' => $this->type,
            'status' => $this->status,
            'is_announced' => (bool)$this->is_announced,
            'course' => new CourseResource($this->whenLoaded('course')),
            'group' => new GroupResource($this->whenLoaded('group')),
            'grades' => GradeResource::collection($this->whenLoaded('grades')),
            'created_at' => $this->created_at->toISOString(),
        ];
    }
}
