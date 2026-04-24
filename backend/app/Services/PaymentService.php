<?php

namespace App\Services;

use App\Repositories\PaymentRepository;
use App\Models\Payment;

class PaymentService
{
    public function __construct(
        private PaymentRepository $paymentRepository
    ) {}

    public function getAll(int $perPage = 15)
    {
        return $this->paymentRepository->query()
            ->with(['user', 'processedBy'])
            ->paginate($perPage);
    }

    public function getById(int $id)
    {
        return $this->paymentRepository->query()
            ->with(['user', 'processedBy'])
            ->findOrFail($id);
    }

    public function create(array $data): Payment
    {
        return $this->paymentRepository->create($data);
    }

    public function update(int $id, array $data): Payment
    {
        return $this->paymentRepository->update($id, $data);
    }

    public function delete(int $id): bool
    {
        return $this->paymentRepository->delete($id);
    }

    public function getByUser(int $userId, int $perPage = 15)
    {
        return $this->paymentRepository->getByUser($userId, $perPage);
    }

    public function getByType(string $type, int $perPage = 15)
    {
        return $this->paymentRepository->getByType($type, $perPage);
    }

    public function getByStatus(string $status, int $perPage = 15)
    {
        return $this->paymentRepository->getByStatus($status, $perPage);
    }

    public function markAsPaid(int $id, int $processedById, string $method = 'cash'): Payment
    {
        $payment = $this->paymentRepository->findOrFail($id);
        $payment->update([
            'status' => 'paid',
            'paid_at' => now()->toDateString(),
            'processed_by' => $processedById,
            'payment_method' => $method,
            'receipt_number' => $this->paymentRepository->generateReceiptNumber(),
        ]);
        return $payment->fresh(['user', 'processedBy']);
    }

    public function generateReceipt(int $id): Payment
    {
        $payment = $this->paymentRepository->findOrFail($id);
        if (!$payment->receipt_number) {
            $payment->update([
                'receipt_number' => $this->paymentRepository->generateReceiptNumber(),
            ]);
        }
        return $payment->fresh(['user', 'processedBy']);
    }
}
