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
        $user = $request->user();
        $query = \App\Models\Assignment::query();

        if ($user->hasRole('student')) {
            $groupIds = $user->groups->pluck('id');
            $query->whereHas('course', fn($q) => $q->whereIn('group_id', $groupIds));
        } elseif ($user->hasRole('parent')) {
            $groupIds = $user->children()->with('groups')->get()->pluck('groups')->flatten()->pluck('id')->unique();
            $query->whereHas('course', fn($q) => $q->whereIn('group_id', $groupIds));
        } elseif ($user->hasRole('teacher')) {
            $query->whereHas('course', fn($q) => $q->where('teacher_id', $user->id));
        }

        $assignments = $query->with(['course.teacher', 'course.group'])->latest()->paginate($request->input('per_page', 15));
        return $this->success(AssignmentResource::collection($assignments)->response()->getData(true));
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

    public function byStudent(int $studentId): JsonResponse
    {
        return $this->success(AssignmentResource::collection($this->assignmentService->getByStudent($studentId)));
    }
}
