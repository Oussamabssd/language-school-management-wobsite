<?php

namespace App\Services;

use App\Repositories\RegistrationRepository;
use App\Models\Registration;

class RegistrationService
{
    public function __construct(
        private RegistrationRepository $registrationRepository
    ) {}

    public function getAll(int $perPage = 15)
    {
        return $this->registrationRepository->query()
            ->with(['user', 'language', 'level', 'group', 'reviewer'])
            ->paginate($perPage);
    }

    public function getById(int $id)
    {
        return $this->registrationRepository->query()
            ->with(['user', 'language', 'level', 'group', 'reviewer'])
            ->findOrFail($id);
    }

    public function create(array $data): Registration
    {
        return $this->registrationRepository->create($data);
    }

    public function getPending(int $perPage = 15)
    {
        return $this->registrationRepository->getPending($perPage);
    }

    public function getByUser(int $userId)
    {
        return $this->registrationRepository->getByUser($userId);
    }

    public function approve(int $id, int $reviewerId, ?int $groupId = null): Registration
    {
        $registration = $this->registrationRepository->findOrFail($id);
        $registration->update([
            'status' => 'approved',
            'reviewed_by' => $reviewerId,
            'reviewed_at' => now(),
            'group_id' => $groupId ?? $registration->group_id,
        ]);
        return $registration->fresh(['user', 'language', 'level', 'group', 'reviewer']);
    }

    public function reject(int $id, int $reviewerId, string $reason): Registration
    {
        $registration = $this->registrationRepository->findOrFail($id);
        $registration->update([
            'status' => 'rejected',
            'reviewed_by' => $reviewerId,
            'reviewed_at' => now(),
            'rejection_reason' => $reason,
        ]);
        return $registration->fresh(['user', 'language', 'level', 'reviewer']);
    }
}
