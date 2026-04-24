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
        return $this->model->whereHas('roles', fn($q) => $q->where('name', $role))
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
            $query->whereHas('roles', fn($q) => $q->where('name', $role));
        }

        return $query->with('roles')->paginate($perPage);
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
