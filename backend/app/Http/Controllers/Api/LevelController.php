<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\LevelRequest;
use App\Http\Resources\LevelResource;
use App\Services\LevelService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LevelController extends Controller
{
    public function __construct(private LevelService $levelService) {}

    public function index(Request $request): JsonResponse
    {
        $levels = $this->levelService->getAll($request->input('per_page', 15));
        return $this->success(LevelResource::collection($levels)->response()->getData(true));
    }

    public function store(LevelRequest $request): JsonResponse
    {
        $level = $this->levelService->create($request->validated());
        return $this->success(new LevelResource($level), 'Level created', 201);
    }

    public function show(int $id): JsonResponse
    {
        return $this->success(new LevelResource($this->levelService->getById($id)));
    }

    public function update(LevelRequest $request, int $id): JsonResponse
    {
        $level = $this->levelService->update($id, $request->validated());
        return $this->success(new LevelResource($level), 'Level updated');
    }

    public function destroy(int $id): JsonResponse
    {
        $this->levelService->delete($id);
        return $this->success(null, 'Level deleted');
    }

    public function byLanguage(int $languageId): JsonResponse
    {
        $levels = $this->levelService->getByLanguage($languageId);
        return $this->success(LevelResource::collection($levels));
    }
}
