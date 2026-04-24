<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PaymentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'type' => $this->type,
            'amount' => $this->amount,
            'currency' => $this->currency,
            'status' => $this->status,
            'payment_method' => $this->payment_method,
            'reference' => $this->reference,
            'description' => $this->description,
            'due_date' => $this->due_date?->format('Y-m-d'),
            'paid_at' => $this->paid_at?->format('Y-m-d'),
            'receipt_number' => $this->receipt_number,
            'user' => new UserResource($this->whenLoaded('user')),
            'processed_by' => new UserResource($this->whenLoaded('processedBy')),
            'created_at' => $this->created_at->toISOString(),
        ];
    }
}
