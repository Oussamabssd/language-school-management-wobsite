<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AssignmentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'due_date' => $this->due_date?->toISOString(),
            'file_path' => $this->file_path,
            'status' => $this->status,
            'course' => new CourseResource($this->whenLoaded('course')),
            'teacher' => new UserResource($this->whenLoaded('teacher')),
            'created_at' => $this->created_at->toISOString(),
        ];
    }
}
