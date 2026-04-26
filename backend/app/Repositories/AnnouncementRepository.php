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

    public function getForUser($user, int $perPage = 15)
    {
        $query = $this->model->published();

        if ($user->hasRole('student')) {
            $groupIds = $user->groups->pluck('id')->toArray();
            $query->where(function ($q) use ($groupIds) {
                $q->where('target_audience', 'all')
                    ->orWhere(function ($sq) use ($groupIds) {
                        $sq->where('target_audience', 'students')
                           ->where(function ($ssq) use ($groupIds) {
                               $ssq->whereNull('group_id')
                                   ->orWhereIn('group_id', $groupIds);
                           });
                    });
            });
        } elseif ($user->hasRole('teacher')) {
            $query->whereIn('target_audience', ['all', 'teachers']);
        }

        return $query->with(['author', 'group'])
            ->orderBy('priority', 'desc')
            ->orderBy('published_at', 'desc')
            ->paginate($perPage);
    }
}
