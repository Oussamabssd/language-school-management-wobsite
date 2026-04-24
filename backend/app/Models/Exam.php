<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Exam extends Model
{
    use HasFactory;

    protected $fillable = [
        'title', 'description', 'course_id', 'group_id',
        'exam_date', 'duration_minutes', 'max_score', 'type', 'status'
    ];

    protected function casts(): array
    {
        return [
            'exam_date' => 'datetime',
            'duration_minutes' => 'integer',
            'max_score' => 'decimal:2',
        ];
    }

    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }

    public function group(): BelongsTo
    {
        return $this->belongsTo(Group::class);
    }

    public function grades(): HasMany
    {
        return $this->hasMany(Grade::class);
    }
}
