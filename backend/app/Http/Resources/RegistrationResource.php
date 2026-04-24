<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RegistrationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'status' => $this->status,
            'motivation' => $this->motivation,
            'previous_experience' => $this->previous_experience,
            'rejection_reason' => $this->rejection_reason,
            'reviewed_at' => $this->reviewed_at?->toISOString(),
            'user' => new UserResource($this->whenLoaded('user')),
            'language' => new LanguageResource($this->whenLoaded('language')),
            'level' => new LevelResource($this->whenLoaded('level')),
            'group' => new GroupResource($this->whenLoaded('group')),
            'reviewer' => new UserResource($this->whenLoaded('reviewer')),
            'created_at' => $this->created_at->toISOString(),
        ];
    }
}
