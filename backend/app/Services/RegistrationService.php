<?php

namespace App\Services;

use App\Models\Registration;
use App\Models\User;
use App\Models\Role;
use App\Repositories\RegistrationRepository;
use App\Repositories\UserRepository;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class RegistrationService
{
    public function __construct(
        private RegistrationRepository $registrationRepository,
        private UserRepository $userRepository
    ) {}

    public function getAll(array $filters = [], int $perPage = 15)
    {
        $query = $this->registrationRepository->query()
            ->with(['language', 'level', 'reviewer']);

        if (isset($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (isset($filters['search'])) {
            $query->where('full_name', 'like', '%' . $filters['search'] . '%')
                  ->orWhere('email', 'like', '%' . $filters['search'] . '%');
        }

        return $query->latest()->paginate($perPage);
    }

    public function getById(int $id)
    {
        return $this->registrationRepository->query()
            ->with(['language', 'level', 'reviewer'])
            ->findOrFail($id);
    }

    public function submit(array $data): Registration
    {
        $data['status'] = 'pending';
        $data['password'] = Hash::make($data['password']);
        return $this->registrationRepository->create($data);
    }

    public function accept(int $id, int $reviewerId): Registration
    {
        return DB::transaction(function () use ($id, $reviewerId) {
            $registration = $this->registrationRepository->findOrFail($id);
            
            if ($registration->status !== 'pending') {
                throw new \Exception('Only pending registrations can be accepted.');
            }

            // Create User Account
            $user = $this->userRepository->create([
                'name' => $registration->full_name,
                'first_name' => explode(' ', $registration->full_name)[0] ?? $registration->full_name,
                'last_name' => explode(' ', $registration->full_name)[1] ?? '',
                'email' => $registration->email,
                'password' => $registration->password, // Use the password provided during registration
                'phone' => $registration->phone,
                'address' => $registration->address,
                'date_of_birth' => $registration->date_of_birth,
                'is_active' => true,
            ]);

            // Assign Student Role
            $studentRole = Role::where('name', 'student')->first();
            if ($studentRole) {
                $user->roles()->attach($studentRole->id);
            }

            // Update Registration Status
            $registration->update([
                'status' => 'accepted',
                'reviewed_by' => $reviewerId,
                'reviewed_at' => now(),
            ]);

            // Note: In a real app, you would send an email here with $randomPassword
            // Mail::to($user->email)->send(new WelcomeStudentMail($user, $randomPassword));

            return $registration->fresh(['language', 'level', 'reviewer']);
        });
    }

    public function reject(int $id, int $reviewerId, string $reason): Registration
    {
        $registration = $this->registrationRepository->findOrFail($id);
        
        if ($registration->status !== 'pending') {
            throw new \Exception('Only pending registrations can be rejected.');
        }

        $registration->update([
            'status' => 'rejected',
            'reviewed_by' => $reviewerId,
            'reviewed_at' => now(),
            'rejection_reason' => $reason,
        ]);

        return $registration->fresh(['language', 'level', 'reviewer']);
    }
}
