<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CourseResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'start_date' => $this->start_date?->format('Y-m-d'),
            'end_date' => $this->end_date?->format('Y-m-d'),
            'status' => $this->status,
            'group' => new GroupResource($this->whenLoaded('group')),
            'teacher' => new UserResource($this->whenLoaded('teacher')),
            'assignments' => AssignmentResource::collection($this->whenLoaded('assignments')),
            'exams' => ExamResource::collection($this->whenLoaded('exams')),
            'created_at' => $this->created_at->toISOString(),
        ];
    }
}
