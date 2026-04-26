<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Receipt extends Model
{
    use HasFactory;

    protected $fillable = [
        'reference_number',
        'payment_type',
        'payment_id',
        'generated_at',
    ];

    public function payment()
    {
        if ($this->payment_type === 'student') {
            return $this->belongsTo(StudentPayment::class, 'payment_id');
        }
        return $this->belongsTo(EmployeePayment::class, 'payment_id');
    }
}
