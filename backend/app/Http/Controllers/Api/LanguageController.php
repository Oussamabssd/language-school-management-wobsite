<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\LanguageRequest;
use App\Http\Resources\LanguageResource;
use App\Services\LanguageService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use OpenApi\Annotations as OA;

class LanguageController extends Controller
{
    public function __construct(private LanguageService $languageService) {}

    /**
     * @OA\Get(path="/languages", tags={"Languages"}, summary="List languages", security={{"bearerAuth":{}}},
     *     @OA\Response(response=200, description="Languages list"))
     */
    public function index(Request $request): JsonResponse
    {
        $languages = $this->languageService->getAll($request->input('per_page', 15));
        return $this->success(LanguageResource::collection($languages)->response()->getData(true));
    }

    /**
     * @OA\Post(path="/languages", tags={"Languages"}, summary="Create language", security={{"bearerAuth":{}}},
     *     @OA\RequestBody(required=true, @OA\JsonContent(
     *         @OA\Property(property="name", type="string"), @OA\Property(property="code", type="string"),
     *         @OA\Property(property="description", type="string", nullable=true)
     *     )),
     *     @OA\Response(response=201, description="Language created"))
     */
    public function store(LanguageRequest $request): JsonResponse
    {
        $language = $this->languageService->create($request->validated());
        return $this->success(new LanguageResource($language), 'Language created', 201);
    }

    /**
     * @OA\Get(path="/languages/{id}", tags={"Languages"}, summary="Get language", security={{"bearerAuth":{}}},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Language details"))
     */
    public function show(int $id): JsonResponse
    {
        return $this->success(new LanguageResource($this->languageService->getById($id)));
    }

    /**
     * @OA\Put(path="/languages/{id}", tags={"Languages"}, summary="Update language", security={{"bearerAuth":{}}},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Language updated"))
     */
    public function update(LanguageRequest $request, int $id): JsonResponse
    {
        $language = $this->languageService->update($id, $request->validated());
        return $this->success(new LanguageResource($language), 'Language updated');
    }

    /**
     * @OA\Delete(path="/languages/{id}", tags={"Languages"}, summary="Delete language", security={{"bearerAuth":{}}},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Language deleted"))
     */
    public function destroy(int $id): JsonResponse
    {
        $this->languageService->delete($id);
        return $this->success(null, 'Language deleted');
    }
}
