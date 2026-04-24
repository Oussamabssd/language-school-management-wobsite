<?php

namespace App\Repositories;

use App\Models\Announcement;

class AnnouncementRepository extends BaseRepository
{
    public function __construct(Announcement $model)
    {
        parent::__construct($model);
    }

    public function getPublished(int $perPage = 15)
    {
        return $this->model->published()
            ->with('author')
            ->orderBy('published_at', 'desc')
            ->paginate($perPage);
    }

    public function getByAudience(string $audience, int $perPage = 15)
    {
        return $this->model->published()
            ->where(function ($q) use ($audience) {
                $q->where('target_audience', $audience)
                    ->orWhere('target_audience', 'all');
            })
            ->with('author')
            ->orderBy('published_at', 'desc')
            ->paginate($perPage);
    }
}
