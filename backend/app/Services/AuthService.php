<?php

namespace App\Services;

use App\Models\User;
use App\Repositories\UserRepository;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthService
{
    public function __construct(
        private UserRepository $userRepository
    ) {}

    public function login(string $email, string $password): array
    {
        $user = $this->userRepository->findByEmail($email);

        if (!$user || !Hash::check($password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        if (!$user->is_active) {
            throw ValidationException::withMessages([
                'email' => ['Your account has been deactivated. Please contact support.'],
            ]);
        }

        $user->update(['last_login_at' => now()]);

        $token = $user->createToken('auth-token', $this->getAbilitiesForUser($user));

        return [
            'user' => $user->load(['roles', 'groups', 'groups.level']),
            'token' => $token->plainTextToken,
        ];
    }

    public function register(array $data): User
    {
        $data['password'] = $data['password']; // Will be hashed by cast
        $user = $this->userRepository->create($data);

        // Assign student role by default for self-registration
        $studentRole = \App\Models\Role::where('name', 'student')->first();
        if ($studentRole) {
            $user->roles()->attach($studentRole->id);
        }

        return $user->load('roles');
    }

    public function logout(User $user): void
    {
        $user->currentAccessToken()->delete();
    }

    private function getAbilitiesForUser(User $user): array
    {
        $abilities = [];
        foreach ($user->roles as $role) {
            foreach ($role->permissions as $permission) {
                $abilities[] = $permission->name;
            }
        }
        return array_unique($abilities) ?: ['*'];
    }
}
