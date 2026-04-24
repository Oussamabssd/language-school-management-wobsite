<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\TimetableRequest;
use App\Http\Resources\TimetableResource;
use App\Services\TimetableService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TimetableController extends Controller
{
    public function __construct(private TimetableService $timetableService) {}

    public function index(Request $request): JsonResponse
    {
        return $this->success(TimetableResource::collection($this->timetableService->getAll($request->input('per_page', 15)))->response()->getData(true));
    }

    public function store(TimetableRequest $request): JsonResponse
    {
        return $this->success(new TimetableResource($this->timetableService->create($request->validated())), 'Timetable entry created', 201);
    }

    public function show(int $id): JsonResponse
    {
        return $this->success(new TimetableResource($this->timetableService->getById($id)));
    }

    public function update(TimetableRequest $request, int $id): JsonResponse
    {
        return $this->success(new TimetableResource($this->timetableService->update($id, $request->validated())), 'Timetable entry updated');
    }

    public function destroy(int $id): JsonResponse
    {
        $this->timetableService->delete($id);
        return $this->success(null, 'Timetable entry deleted');
    }

    public function byGroup(int $groupId): JsonResponse
    {
        return $this->success(TimetableResource::collection($this->timetableService->getByGroup($groupId)));
    }

    public function byTeacher(int $teacherId): JsonResponse
    {
        return $this->success(TimetableResource::collection($this->timetableService->getByTeacher($teacherId)));
    }
}
