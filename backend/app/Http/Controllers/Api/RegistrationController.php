<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\RegistrationRequest;
use App\Http\Resources\RegistrationResource;
use App\Services\RegistrationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use OpenApi\Attributes as OA;

class RegistrationController extends Controller
{
    public function __construct(private RegistrationService $registrationService) {}

    #[OA\Get(
        path: '/registrations',
        summary: 'List all registrations (Admin)',
        security: [['bearerAuth' => []]],
        tags: ['Registrations'],
        parameters: [
            new OA\Parameter(name: 'status', in: 'query', schema: new OA\Schema(type: 'string')),
            new OA\Parameter(name: 'search', in: 'query', schema: new OA\Schema(type: 'string')),
        ],
        responses: [
            new OA\Response(response: 200, description: 'Registrations list'),
        ]
    )]
    public function index(Request $request): JsonResponse
    {
        $filters = $request->only(['status', 'search']);
        $registrations = $this->registrationService->getAll($filters, $request->input('per_page', 15));
        return $this->success(RegistrationResource::collection($registrations)->response()->getData(true));
    }

    #[OA\Post(
        path: '/registrations',
        summary: 'Submit a registration request (Public)',
        tags: ['Registrations'],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ['full_name', 'email', 'phone', 'date_of_birth', 'address', 'language_id'],
                properties: [
                    new OA\Property(property: 'full_name', type: 'string'),
                    new OA\Property(property: 'email', type: 'string'),
                    new OA\Property(property: 'phone', type: 'string'),
                    new OA\Property(property: 'date_of_birth', type: 'string', format: 'date'),
                    new OA\Property(property: 'address', type: 'string'),
                    new OA\Property(property: 'language_id', type: 'integer'),
                    new OA\Property(property: 'level_id', type: 'integer', nullable: true),
                ]
            )
        ),
        responses: [
            new OA\Response(response: 201, description: 'Registration submitted'),
        ]
    )]
    public function store(RegistrationRequest $request): JsonResponse
    {
        $registration = $this->registrationService->submit($request->validated());
        return $this->success(new RegistrationResource($registration), 'Registration submitted successfully', 201);
    }

    #[OA\Get(
        path: '/registrations/{id}',
        summary: 'Get registration details',
        security: [['bearerAuth' => []]],
        tags: ['Registrations'],
        parameters: [
            new OA\Parameter(name: 'id', in: 'path', required: true, schema: new OA\Schema(type: 'integer')),
        ],
        responses: [
            new OA\Response(response: 200, description: 'Registration details'),
        ]
    )]
    public function show(int $id): JsonResponse
    {
        return $this->success(new RegistrationResource($this->registrationService->getById($id)));
    }

    #[OA\Put(
        path: '/registrations/{id}/accept',
        summary: 'Accept a registration request',
        security: [['bearerAuth' => []]],
        tags: ['Registrations'],
        parameters: [
            new OA\Parameter(name: 'id', in: 'path', required: true, schema: new OA\Schema(type: 'integer')),
        ],
        responses: [
            new OA\Response(response: 200, description: 'Registration accepted and student account created'),
        ]
    )]
    public function accept(Request $request, int $id): JsonResponse
    {
        try {
            $registration = $this->registrationService->accept($id, $request->user()->id);
            return $this->success(new RegistrationResource($registration), 'Registration accepted and student account created.');
        } catch (\Exception $e) {
            return $this->error($e->getMessage());
        }
    }

    #[OA\Put(
        path: '/registrations/{id}/reject',
        summary: 'Reject a registration request',
        security: [['bearerAuth' => []]],
        tags: ['Registrations'],
        parameters: [
            new OA\Parameter(name: 'id', in: 'path', required: true, schema: new OA\Schema(type: 'integer')),
        ],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ['rejection_reason'],
                properties: [
                    new OA\Property(property: 'rejection_reason', type: 'string'),
                ]
            )
        ),
        responses: [
            new OA\Response(response: 200, description: 'Registration rejected'),
        ]
    )]
    public function reject(Request $request, int $id): JsonResponse
    {
        $request->validate(['rejection_reason' => 'required|string']);
        try {
            $registration = $this->registrationService->reject($id, $request->user()->id, $request->input('rejection_reason'));
            return $this->success(new RegistrationResource($registration), 'Registration rejected.');
        } catch (\Exception $e) {
            return $this->error($e->getMessage());
        }
    }
}
