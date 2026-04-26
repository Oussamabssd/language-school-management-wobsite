<?php

namespace App\Repositories;

use App\Models\User;

class UserRepository extends BaseRepository
{
    public function __construct(User $model)
    {
        parent::__construct($model);
    }

    public function findByEmail(string $email): ?User
    {
        return $this->model->where('email', $email)->first();
    }

    public function getUsersByRole(string $role, int $perPage = 15)
    {
        $roles = explode(',', $role);
        return $this->model->whereHas('roles', fn($q) => $q->whereIn('name', $roles))
            ->with(['roles', 'teacherProfile']) // Include profile for accountant view
            ->paginate($perPage);
    }

    public function searchUsers(string $search, ?string $role = null, int $perPage = 15)
    {
        $query = $this->model->newQuery();

        $query->where(function ($q) use ($search) {
            $q->where('name', 'like', "%{$search}%")
                ->orWhere('first_name', 'like', "%{$search}%")
                ->orWhere('last_name', 'like', "%{$search}%")
                ->orWhere('email', 'like', "%{$search}%")
                ->orWhere('phone', 'like', "%{$search}%");
        });

        if ($role) {
            $roles = explode(',', $role);
            $query->whereHas('roles', fn($q) => $q->whereIn('name', $roles));
        }

        return $query->with(['roles', 'teacherProfile'])->paginate($perPage);
    }

    public function getStudentsWithDetails(int $perPage = 15)
    {
        return $this->model
            ->whereHas('roles', fn($q) => $q->where('name', 'student'))
            ->with(['groups', 'parents'])
            ->paginate($perPage);
    }

    public function getTeachersWithDetails(int $perPage = 15)
    {
        return $this->model
            ->whereHas('roles', fn($q) => $q->where('name', 'teacher'))
            ->with(['teacherProfile', 'teachingGroups', 'courses'])
            ->paginate($perPage);
    }
}
