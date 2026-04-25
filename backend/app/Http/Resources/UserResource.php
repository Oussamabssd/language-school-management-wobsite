<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'full_name' => $this->full_name,
            'email' => $this->email,
            'phone' => $this->phone,
            'address' => $this->address,
            'city' => $this->city,
            'date_of_birth' => $this->date_of_birth?->format('Y-m-d'),
            'gender' => $this->gender,
            'avatar' => $this->avatar,
            'is_active' => $this->is_active,
            'last_login_at' => $this->last_login_at?->toISOString(),
            'roles' => RoleResource::collection($this->whenLoaded('roles')),
            'teacher_profile' => new TeacherProfileResource($this->whenLoaded('teacherProfile')),
            'groups' => GroupResource::collection($this->whenLoaded('groups')),
            'teaching_groups' => GroupResource::collection(
                collect([])
                    ->merge($this->whenLoaded('teachingGroups', $this->teachingGroups, collect([])))
                    ->merge($this->whenLoaded('sessionGroups', $this->sessionGroups, collect([])))
                    ->unique('id')
            ),
            'created_at' => $this->created_at->toISOString(),
            'updated_at' => $this->updated_at->toISOString(),
        ];
    }
}
