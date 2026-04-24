<?php

namespace App\Repositories;

use App\Models\Level;

class LevelRepository extends BaseRepository
{
    public function __construct(Level $model)
    {
        parent::__construct($model);
    }

    public function getByLanguage(int $languageId)
    {
        return $this->model->where('language_id', $languageId)
            ->orderBy('order')
            ->get();
    }
}
