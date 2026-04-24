<?php

namespace App\Services;

use App\Repositories\AnnouncementRepository;
use App\Models\Announcement;

class AnnouncementService
{
    public function __construct(
        private AnnouncementRepository $announcementRepository
    ) {}

    public function getAll(int $perPage = 15)
    {
        return $this->announcementRepository->query()
            ->with(['author', 'group'])
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);
    }

    public function getPublished(int $perPage = 15)
    {
        return $this->announcementRepository->getPublished($perPage);
    }

    public function getByAudience(string $audience, int $perPage = 15)
    {
        return $this->announcementRepository->getByAudience($audience, $perPage);
    }

    public function getById(int $id)
    {
        return $this->announcementRepository->query()
            ->with(['author', 'group'])
            ->findOrFail($id);
    }

    public function create(array $data): Announcement
    {
        if (!empty($data['is_published']) && $data['is_published']) {
            $data['published_at'] = now();
        }
        return $this->announcementRepository->create($data);
    }

    public function update(int $id, array $data): Announcement
    {
        if (!empty($data['is_published']) && $data['is_published']) {
            $existing = $this->announcementRepository->findOrFail($id);
            if (!$existing->is_published) {
                $data['published_at'] = now();
            }
        }
        return $this->announcementRepository->update($id, $data);
    }

    public function delete(int $id): bool
    {
        return $this->announcementRepository->delete($id);
    }
}
