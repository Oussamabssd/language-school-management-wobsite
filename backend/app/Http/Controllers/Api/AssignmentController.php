<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\AssignmentRequest;
use App\Http\Resources\AssignmentResource;
use App\Services\AssignmentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AssignmentController extends Controller
{
    public function __construct(private AssignmentService $assignmentService) {}

    public function index(Request $request): JsonResponse
    {
        return $this->success(AssignmentResource::collection($this->assignmentService->getAll($request->input('per_page', 15)))->response()->getData(true));
    }

    public function store(AssignmentRequest $request): JsonResponse
    {
        return $this->success(new AssignmentResource($this->assignmentService->create($request->validated())), 'Assignment created', 201);
    }

    public function show(int $id): JsonResponse
    {
        return $this->success(new AssignmentResource($this->assignmentService->getById($id)));
    }

    public function update(AssignmentRequest $request, int $id): JsonResponse
    {
        return $this->success(new AssignmentResource($this->assignmentService->update($id, $request->validated())), 'Assignment updated');
    }

    public function destroy(int $id): JsonResponse
    {
        $this->assignmentService->delete($id);
        return $this->success(null, 'Assignment deleted');
    }

    public function byCourse(int $courseId): JsonResponse
    {
        return $this->success(AssignmentResource::collection($this->assignmentService->getByCourse($courseId)));
    }
}
