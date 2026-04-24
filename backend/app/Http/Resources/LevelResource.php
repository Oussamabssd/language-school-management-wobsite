<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LevelResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'order' => $this->order,
            'is_active' => $this->is_active,
            'language' => new LanguageResource($this->whenLoaded('language')),
            'groups_count' => $this->whenCounted('groups'),
        ];
    }
}
