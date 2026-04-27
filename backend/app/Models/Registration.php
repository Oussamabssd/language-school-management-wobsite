<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Registration extends Model
{
    use HasFactory;

    protected $fillable = [
        'full_name', 'email', 'phone', 'date_of_birth',
        'address', 'password', 'language_id', 'level_id',
        'status', 'rejection_reason', 'reviewed_by', 'reviewed_at',
        'parent_name', 'parent_email', 'parent_phone',
        'is_teacher_application', 'specialization', 'cv_path'
    ];

    protected function casts(): array
    {
        return [
            'reviewed_at' => 'datetime',
            'date_of_birth' => 'date',
        ];
    }

    public function language(): BelongsTo
    {
        return $this->belongsTo(Language::class);
    }

    public function level(): BelongsTo
    {
        return $this->belongsTo(Level::class);
    }

    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }
}
