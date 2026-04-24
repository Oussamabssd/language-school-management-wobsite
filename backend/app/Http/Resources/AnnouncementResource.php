<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AnnouncementResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'content' => $this->content,
            'target_audience' => $this->target_audience,
            'priority' => $this->priority,
            'is_published' => $this->is_published,
            'published_at' => $this->published_at?->toISOString(),
            'expires_at' => $this->expires_at?->toISOString(),
            'author' => new UserResource($this->whenLoaded('author')),
            'group' => new GroupResource($this->whenLoaded('group')),
            'created_at' => $this->created_at->toISOString(),
        ];
    }
}
