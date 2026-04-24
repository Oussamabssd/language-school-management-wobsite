<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\UserRequest;
use App\Http\Resources\UserResource;
use App\Services\UserService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use OpenApi\Annotations as OA;

class UserController extends Controller
{
    public function __construct(
        private UserService $userService
    ) {}

    /**
     * @OA\Get(
     *     path="/users",
     *     tags={"Users"},
     *     summary="List all users with pagination",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(name="per_page", in="query", @OA\Schema(type="integer", default=15)),
     *     @OA\Parameter(name="search", in="query", @OA\Schema(type="string")),
     *     @OA\Parameter(name="role", in="query", @OA\Schema(type="string")),
     *     @OA\Response(response=200, description="Users list")
     * )
     */
    public function index(Request $request): JsonResponse
    {
        $perPage = $request->input('per_page', 15);

        if ($request->has('search')) {
            $users = $this->userService->searchUsers(
                $request->input('search'),
                $request->input('role'),
                $perPage
            );
        } elseif ($request->has('role')) {
            $users = $this->userService->getUsersByRole($request->input('role'), $perPage);
        } else {
            $users = $this->userService->getAllUsers($perPage);
        }

        return $this->success(UserResource::collection($users)->response()->getData(true));
    }

    /**
     * @OA\Post(
     *     path="/users",
     *     tags={"Users"},
     *     summary="Create a new user",
     *     security={{"bearerAuth":{}}},
     *     @OA\RequestBody(required=true, @OA\JsonContent(ref="#/components/schemas/UserRequest")),
     *     @OA\Response(response=201, description="User created")
     * )
     */
    public function store(UserRequest $request): JsonResponse
    {
        $user = $this->userService->createUser($request->validated());
        return $this->success(new UserResource($user), 'User created successfully', 201);
    }

    /**
     * @OA\Get(
     *     path="/users/{id}",
     *     tags={"Users"},
     *     summary="Get user details",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="User details"),
     *     @OA\Response(response=404, description="User not found")
     * )
     */
    public function show(int $id): JsonResponse
    {
        $user = $this->userService->getUserById($id);
        return $this->success(new UserResource($user));
    }

    /**
     * @OA\Put(
     *     path="/users/{id}",
     *     tags={"Users"},
     *     summary="Update user",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\RequestBody(required=true, @OA\JsonContent(ref="#/components/schemas/UserRequest")),
     *     @OA\Response(response=200, description="User updated")
     * )
     */
    public function update(UserRequest $request, int $id): JsonResponse
    {
        $user = $this->userService->updateUser($id, $request->validated());
        return $this->success(new UserResource($user), 'User updated successfully');
    }

    /**
     * @OA\Delete(
     *     path="/users/{id}",
     *     tags={"Users"},
     *     summary="Delete user",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="User deleted")
     * )
     */
    public function destroy(int $id): JsonResponse
    {
        $this->userService->deleteUser($id);
        return $this->success(null, 'User deleted successfully');
    }

    /**
     * @OA\Get(
     *     path="/students",
     *     tags={"Users"},
     *     summary="List all students",
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(response=200, description="Students list")
     * )
     */
    public function students(Request $request): JsonResponse
    {
        $students = $this->userService->getStudents($request->input('per_page', 15));
        return $this->success(UserResource::collection($students)->response()->getData(true));
    }

    /**
     * @OA\Get(
     *     path="/teachers",
     *     tags={"Users"},
     *     summary="List all teachers",
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(response=200, description="Teachers list")
     * )
     */
    public function teachers(Request $request): JsonResponse
    {
        $teachers = $this->userService->getTeachers($request->input('per_page', 15));
        return $this->success(UserResource::collection($teachers)->response()->getData(true));
    }

    /**
     * @OA\Patch(
     *     path="/users/{id}/toggle-status",
     *     tags={"Users"},
     *     summary="Toggle user active status",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Status toggled")
     * )
     */
    public function toggleStatus(int $id): JsonResponse
    {
        $user = $this->userService->toggleActiveStatus($id);
        return $this->success(new UserResource($user), 'User status updated');
    }

    /**
     * @OA\Post(
     *     path="/users/{userId}/roles/{roleId}",
     *     tags={"Users"},
     *     summary="Assign role to user",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(name="userId", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Parameter(name="roleId", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Role assigned")
     * )
     */
    public function assignRole(int $userId, int $roleId): JsonResponse
    {
        $user = $this->userService->assignRole($userId, $roleId);
        return $this->success(new UserResource($user), 'Role assigned successfully');
    }

    /**
     * @OA\Delete(
     *     path="/users/{userId}/roles/{roleId}",
     *     tags={"Users"},
     *     summary="Remove role from user",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(name="userId", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Parameter(name="roleId", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Role removed")
     * )
     */
    public function removeRole(int $userId, int $roleId): JsonResponse
    {
        $user = $this->userService->removeRole($userId, $roleId);
        return $this->success(new UserResource($user), 'Role removed successfully');
    }
}
