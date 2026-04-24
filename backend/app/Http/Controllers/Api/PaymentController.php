<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\PaymentRequest;
use App\Http\Resources\PaymentResource;
use App\Services\PaymentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    public function __construct(private PaymentService $paymentService) {}

    public function index(Request $request): JsonResponse
    {
        if ($request->has('type')) {
            $payments = $this->paymentService->getByType($request->input('type'), $request->input('per_page', 15));
        } elseif ($request->has('status')) {
            $payments = $this->paymentService->getByStatus($request->input('status'), $request->input('per_page', 15));
        } else {
            $payments = $this->paymentService->getAll($request->input('per_page', 15));
        }
        return $this->success(PaymentResource::collection($payments)->response()->getData(true));
    }

    public function store(PaymentRequest $request): JsonResponse
    {
        return $this->success(new PaymentResource($this->paymentService->create($request->validated())), 'Payment created', 201);
    }

    public function show(int $id): JsonResponse
    {
        return $this->success(new PaymentResource($this->paymentService->getById($id)));
    }

    public function update(PaymentRequest $request, int $id): JsonResponse
    {
        return $this->success(new PaymentResource($this->paymentService->update($id, $request->validated())), 'Payment updated');
    }

    public function destroy(int $id): JsonResponse
    {
        $this->paymentService->delete($id);
        return $this->success(null, 'Payment deleted');
    }

    public function markAsPaid(Request $request, int $id): JsonResponse
    {
        $payment = $this->paymentService->markAsPaid($id, $request->user()->id, $request->input('payment_method', 'cash'));
        return $this->success(new PaymentResource($payment), 'Payment marked as paid');
    }

    public function generateReceipt(int $id): JsonResponse
    {
        $payment = $this->paymentService->generateReceipt($id);
        return $this->success(new PaymentResource($payment), 'Receipt generated');
    }

    public function byUser(int $userId, Request $request): JsonResponse
    {
        return $this->success(PaymentResource::collection($this->paymentService->getByUser($userId, $request->input('per_page', 15)))->response()->getData(true));
    }
}
