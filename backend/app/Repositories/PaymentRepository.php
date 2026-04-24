<?php

namespace App\Repositories;

use App\Models\Payment;

class PaymentRepository extends BaseRepository
{
    public function __construct(Payment $model)
    {
        parent::__construct($model);
    }

    public function getByUser(int $userId, int $perPage = 15)
    {
        return $this->model->where('user_id', $userId)
            ->with('processedBy')
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);
    }

    public function getByType(string $type, int $perPage = 15)
    {
        return $this->model->where('type', $type)
            ->with(['user', 'processedBy'])
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);
    }

    public function getByStatus(string $status, int $perPage = 15)
    {
        return $this->model->where('status', $status)
            ->with(['user', 'processedBy'])
            ->paginate($perPage);
    }

    public function generateReceiptNumber(): string
    {
        $latest = $this->model->whereNotNull('receipt_number')
            ->orderBy('id', 'desc')
            ->first();

        if (!$latest || !$latest->receipt_number) {
            return 'REC-' . date('Y') . '-0001';
        }

        $parts = explode('-', $latest->receipt_number);
        $number = (int) end($parts) + 1;
        return 'REC-' . date('Y') . '-' . str_pad($number, 4, '0', STR_PAD_LEFT);
    }
}
