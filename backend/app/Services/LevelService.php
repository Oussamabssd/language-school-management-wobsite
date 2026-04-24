<?php

namespace App\Services;

use App\Repositories\LevelRepository;
use App\Models\Level;

class LevelService
{
    public function __construct(
        private LevelRepository $levelRepository
    ) {}

    public function getAll(int $perPage = 15)
    {
        return $this->levelRepository->query()->with('language')->paginate($perPage);
    }

    public function getByLanguage(int $languageId)
    {
        return $this->levelRepository->getByLanguage($languageId);
    }

    public function getById(int $id)
    {
        return $this->levelRepository->query()->with('language')->findOrFail($id);
    }

    public function create(array $data): Level
    {
        return $this->levelRepository->create($data);
    }

    public function update(int $id, array $data): Level
    {
        return $this->levelRepository->update($id, $data);
    }

    public function delete(int $id): bool
    {
        return $this->levelRepository->delete($id);
    }
}
