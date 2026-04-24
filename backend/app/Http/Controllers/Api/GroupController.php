<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\GroupRequest;
use App\Http\Resources\GroupResource;
use App\Services\GroupService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GroupController extends Controller
{
    public function __construct(private GroupService $groupService) {}

    public function index(Request $request): JsonResponse
    {
        $groups = $this->groupService->getAll($request->input('per_page', 15));
        return $this->success(GroupResource::collection($groups)->response()->getData(true));
    }

    public function store(GroupRequest $request): JsonResponse
    {
        $group = $this->groupService->create($request->validated());
        return $this->success(new GroupResource($group), 'Group created', 201);
    }

    public function show(int $id): JsonResponse
    {
        return $this->success(new GroupResource($this->groupService->getById($id)));
    }

    public function update(GroupRequest $request, int $id): JsonResponse
    {
        $group = $this->groupService->update($id, $request->validated());
        return $this->success(new GroupResource($group), 'Group updated');
    }

    public function destroy(int $id): JsonResponse
    {
        $this->groupService->delete($id);
        return $this->success(null, 'Group deleted');
    }

    /**
     * @OA\Post(path="/groups/{groupId}/students/{studentId}", tags={"Groups"}, summary="Add student to group",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(name="groupId", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Parameter(name="studentId", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Student added"))
     */
    public function addStudent(int $groupId, int $studentId): JsonResponse
    {
        $group = $this->groupService->addStudent($groupId, $studentId);
        return $this->success(new GroupResource($group), 'Student added to group');
    }

    /**
     * @OA\Delete(path="/groups/{groupId}/students/{studentId}", tags={"Groups"}, summary="Remove student from group",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(name="groupId", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Parameter(name="studentId", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Student removed"))
     */
    public function removeStudent(int $groupId, int $studentId): JsonResponse
    {
        $group = $this->groupService->removeStudent($groupId, $studentId);
        return $this->success(new GroupResource($group), 'Student removed from group');
    }
}
