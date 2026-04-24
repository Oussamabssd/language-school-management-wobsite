<?php

namespace App\Repositories;

use App\Models\Language;

class LanguageRepository extends BaseRepository
{
    public function __construct(Language $model)
    {
        parent::__construct($model);
    }

    public function getActiveLanguages()
    {
        return $this->model->where('is_active', true)->with('levels')->get();
    }

    public function getWithLevels(int $id)
    {
        return $this->model->with('levels')->findOrFail($id);
    }
}
