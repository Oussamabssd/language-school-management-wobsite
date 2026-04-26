<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TeacherProfileResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'cv_path' => $this->cv_path ? asset('storage/' . $this->cv_path) : null,
            'specialization' => $this->specialization,
            'bio' => $this->bio,
            'hire_date' => $this->hire_date?->format('Y-m-d'),
            'hourly_rate' => $this->hourly_rate,
            'contract_type' => $this->contract_type,
        ];
    }
}
