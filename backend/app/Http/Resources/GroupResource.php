<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class GroupResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'max_students' => $this->max_students,
            'academic_year' => $this->academic_year,
            'status' => $this->status,
            'level' => new LevelResource($this->whenLoaded('level')),
            'teacher' => new UserResource($this->whenLoaded('teacher')),
            'students' => UserResource::collection($this->whenLoaded('students')),
            'students_count' => $this->whenCounted('students'),
            'created_at' => $this->created_at->toISOString(),
        ];
    }
}
