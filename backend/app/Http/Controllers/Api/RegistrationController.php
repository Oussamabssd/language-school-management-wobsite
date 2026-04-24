<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\RegistrationRequest;
use App\Http\Resources\RegistrationResource;
use App\Services\RegistrationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class RegistrationController extends Controller
{
    public function __construct(private RegistrationService $registrationService) {}

    public function index(Request $request): JsonResponse
    {
        return $this->success(RegistrationResource::collection($this->registrationService->getAll($request->input('per_page', 15)))->response()->getData(true));
    }

    public function store(RegistrationRequest $request): JsonResponse
    {
        return $this->success(new RegistrationResource($this->registrationService->create($request->validated())), 'Registration submitted', 201);
    }

    public function show(int $id): JsonResponse
    {
        return $this->success(new RegistrationResource($this->registrationService->getById($id)));
    }

    public function pending(Request $request): JsonResponse
    {
        return $this->success(RegistrationResource::collection($this->registrationService->getPending($request->input('per_page', 15)))->response()->getData(true));
    }

    public function approve(Request $request, int $id): JsonResponse
    {
        $registration = $this->registrationService->approve($id, $request->user()->id, $request->input('group_id'));
        return $this->success(new RegistrationResource($registration), 'Registration approved');
    }

    public function reject(Request $request, int $id): JsonResponse
    {
        $request->validate(['reason' => 'required|string']);
        $registration = $this->registrationService->reject($id, $request->user()->id, $request->input('reason'));
        return $this->success(new RegistrationResource($registration), 'Registration rejected');
    }

    public function myRegistrations(Request $request): JsonResponse
    {
        $registrations = $this->registrationService->getByUser($request->user()->id);
        return $this->success(RegistrationResource::collection($registrations));
    }
}
