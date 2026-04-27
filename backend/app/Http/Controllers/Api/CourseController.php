<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\CourseRequest;
use App\Http\Resources\CourseResource;
use App\Services\CourseService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CourseController extends Controller
{
    public function __construct(private CourseService $courseService) {}

    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        $query = \App\Models\Course::query();

        if ($user->hasRole('student')) {
            $groupIds = $user->groups->pluck('id');
            $query->whereIn('group_id', $groupIds);
        } elseif ($user->hasRole('parent')) {
            $groupIds = $user->children()->with('groups')->get()->pluck('groups')->flatten()->pluck('id')->unique();
            $query->whereIn('group_id', $groupIds);
        } elseif ($user->hasRole('teacher')) {
            $query->where('teacher_id', $user->id);
        }

        $courses = $query->with(['teacher', 'group'])->latest()->paginate($request->input('per_page', 15));
        return $this->success(CourseResource::collection($courses)->response()->getData(true));
    }

    public function store(CourseRequest $request): JsonResponse
    {
        $data = $request->validated();
        if (!isset($data['teacher_id'])) {
            $data['teacher_id'] = auth()->id();
        }
        $course = $this->courseService->create($data);
        return $this->success(new CourseResource($course), 'Course created', 201);
    }

    public function show(int $id): JsonResponse
    {
        return $this->success(new CourseResource($this->courseService->getById($id)));
    }

    public function update(CourseRequest $request, int $id): JsonResponse
    {
        return $this->success(new CourseResource($this->courseService->update($id, $request->validated())), 'Course updated');
    }

    public function destroy(int $id): JsonResponse
    {
        $this->courseService->delete($id);
        return $this->success(null, 'Course deleted');
    }

    public function byTeacher(Request $request, int $teacherId): JsonResponse
    {
        $courses = $this->courseService->getByTeacher($teacherId, $request->input('per_page', 15));
        return $this->success(CourseResource::collection($courses)->response()->getData(true));
    }

    public function byGroup(int $groupId): JsonResponse
    {
        return $this->success(CourseResource::collection($this->courseService->getByGroup($groupId)));
    }
}
