<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TimetableResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'day_of_week' => $this->day_of_week,
            'start_time' => $this->start_time,
            'end_time' => $this->end_time,
            'room' => $this->room,
            'academic_year' => $this->academic_year,
            'is_active' => $this->is_active,
            'group' => new GroupResource($this->whenLoaded('group')),
            'course' => new CourseResource($this->whenLoaded('course')),
            'teacher' => new UserResource($this->whenLoaded('teacher')),
            'created_at' => $this->created_at->toISOString(),
        ];
    }
}
