<?php

namespace App\Services;

use App\Repositories\LanguageRepository;
use App\Models\Language;

class LanguageService
{
    public function __construct(
        private LanguageRepository $languageRepository
    ) {}

    public function getAll(int $perPage = 15)
    {
        return $this->languageRepository->paginate($perPage);
    }

    public function getActive()
    {
        return $this->languageRepository->getActiveLanguages();
    }

    public function getById(int $id)
    {
        return $this->languageRepository->getWithLevels($id);
    }

    public function create(array $data): Language
    {
        return $this->languageRepository->create($data);
    }

    public function update(int $id, array $data): Language
    {
        return $this->languageRepository->update($id, $data);
    }

    public function delete(int $id): bool
    {
        return $this->languageRepository->delete($id);
    }
}
