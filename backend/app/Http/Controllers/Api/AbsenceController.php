<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\AbsenceRequest;
use App\Http\Resources\AbsenceResource;
use App\Services\AbsenceService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AbsenceController extends Controller
{
    public function __construct(private AbsenceService $absenceService) {}

    public function index(Request $request): JsonResponse
    {
        return $this->success(AbsenceResource::collection($this->absenceService->getAll($request->input('per_page', 15)))->response()->getData(true));
    }

    public function store(AbsenceRequest $request): JsonResponse
    {
        return $this->success(new AbsenceResource($this->absenceService->create($request->validated())), 'Absence recorded', 201);
    }

    public function show(int $id): JsonResponse
    {
        return $this->success(new AbsenceResource($this->absenceService->getById($id)));
    }

    public function update(AbsenceRequest $request, int $id): JsonResponse
    {
        return $this->success(new AbsenceResource($this->absenceService->update($id, $request->validated())), 'Absence updated');
    }

    public function destroy(int $id): JsonResponse
    {
        $this->absenceService->delete($id);
        return $this->success(null, 'Absence deleted');
    }

    public function byStudent(int $studentId, Request $request): JsonResponse
    {
        return $this->success(AbsenceResource::collection($this->absenceService->getByStudent($studentId, $request->input('per_page', 15)))->response()->getData(true));
    }

    public function byGroup(int $groupId, Request $request): JsonResponse
    {
        return $this->success(AbsenceResource::collection($this->absenceService->getByGroup($groupId, $request->input('date'))));
    }
}
