<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AbsenceResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'date' => $this->date->format('Y-m-d'),
            'status' => $this->status,
            'reason' => $this->reason,
            'student' => new UserResource($this->whenLoaded('student')),
            'group' => new GroupResource($this->whenLoaded('group')),
            'course' => new CourseResource($this->whenLoaded('course')),
            'marked_by' => new UserResource($this->whenLoaded('markedBy')),
            'created_at' => $this->created_at->toISOString(),
        ];
    }
}
