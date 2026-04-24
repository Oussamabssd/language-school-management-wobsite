<?php

namespace App\Services;

use App\Repositories\UserRepository;
use App\Models\User;

class UserService
{
    public function __construct(
        private UserRepository $userRepository
    ) {}

    public function getAllUsers(int $perPage = 15)
    {
        return $this->userRepository->query()
            ->with('roles')
            ->paginate($perPage);
    }

    public function getUserById(int $id)
    {
        return $this->userRepository->query()
            ->with('roles')
            ->findOrFail($id);
    }

    public function createUser(array $data): User
    {
        $user = $this->userRepository->create($data);

        if (isset($data['roles'])) {
            $user->roles()->sync($data['roles']);
        }

        return $user->load('roles');
    }

    public function updateUser(int $id, array $data): User
    {
        $user = $this->userRepository->update($id, $data);

        if (isset($data['roles'])) {
            $user->roles()->sync($data['roles']);
        }

        return $user->load('roles');
    }

    public function deleteUser(int $id): bool
    {
        return $this->userRepository->delete($id);
    }

    public function searchUsers(string $search, ?string $role = null, int $perPage = 15)
    {
        return $this->userRepository->searchUsers($search, $role, $perPage);
    }

    public function getStudents(int $perPage = 15)
    {
        return $this->userRepository->getStudentsWithDetails($perPage);
    }

    public function getTeachers(int $perPage = 15)
    {
        return $this->userRepository->getTeachersWithDetails($perPage);
    }

    public function getUsersByRole(string $role, int $perPage = 15)
    {
        return $this->userRepository->getUsersByRole($role, $perPage);
    }

    public function toggleActiveStatus(int $id): User
    {
        $user = $this->userRepository->findOrFail($id);
        $user->update(['is_active' => !$user->is_active]);
        return $user->fresh('roles');
    }

    public function assignRole(int $userId, int $roleId): User
    {
        $user = $this->userRepository->findOrFail($userId);
        $user->roles()->syncWithoutDetaching([$roleId]);
        return $user->load('roles');
    }

    public function removeRole(int $userId, int $roleId): User
    {
        $user = $this->userRepository->findOrFail($userId);
        $user->roles()->detach($roleId);
        return $user->load('roles');
    }
}
