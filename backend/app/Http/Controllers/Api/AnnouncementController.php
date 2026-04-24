<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\AnnouncementRequest;
use App\Http\Resources\AnnouncementResource;
use App\Services\AnnouncementService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AnnouncementController extends Controller
{
    public function __construct(private AnnouncementService $announcementService) {}

    public function index(Request $request): JsonResponse
    {
        if ($request->has('audience')) {
            $announcements = $this->announcementService->getByAudience($request->input('audience'), $request->input('per_page', 15));
        } elseif ($request->boolean('published_only', false)) {
            $announcements = $this->announcementService->getPublished($request->input('per_page', 15));
        } else {
            $announcements = $this->announcementService->getAll($request->input('per_page', 15));
        }
        return $this->success(AnnouncementResource::collection($announcements)->response()->getData(true));
    }

    public function store(AnnouncementRequest $request): JsonResponse
    {
        return $this->success(new AnnouncementResource($this->announcementService->create($request->validated())), 'Announcement created', 201);
    }

    public function show(int $id): JsonResponse
    {
        return $this->success(new AnnouncementResource($this->announcementService->getById($id)));
    }

    public function update(AnnouncementRequest $request, int $id): JsonResponse
    {
        return $this->success(new AnnouncementResource($this->announcementService->update($id, $request->validated())), 'Announcement updated');
    }

    public function destroy(int $id): JsonResponse
    {
        $this->announcementService->delete($id);
        return $this->success(null, 'Announcement deleted');
    }
}
