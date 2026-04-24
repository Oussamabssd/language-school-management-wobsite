<?php

namespace App\Repositories;

use App\Models\Registration;

class RegistrationRepository extends BaseRepository
{
    public function __construct(Registration $model)
    {
        parent::__construct($model);
    }

    public function getPending(int $perPage = 15)
    {
        return $this->model->where('status', 'pending')
            ->with(['user', 'language', 'level'])
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);
    }

    public function getByUser(int $userId)
    {
        return $this->model->where('user_id', $userId)
            ->with(['language', 'level', 'group', 'reviewer'])
            ->orderBy('created_at', 'desc')
            ->get();
    }

    public function getByStatus(string $status, int $perPage = 15)
    {
        return $this->model->where('status', $status)
            ->with(['user', 'language', 'level', 'reviewer'])
            ->paginate($perPage);
    }
}
