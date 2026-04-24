<?php

namespace App\Repositories;

use App\Models\TeacherProfile;

class TeacherProfileRepository extends BaseRepository
{
    public function __construct(TeacherProfile $model)
    {
        parent::__construct($model);
    }

    public function getByUser(int $userId): ?TeacherProfile
    {
        return $this->model->where('user_id', $userId)->first();
    }
}
