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
        'title', 'description', 'course_id', 'group_id', 'quarter',
        'exam_date', 'start_time', 'end_time', 'classroom', 'max_score', 'type', 'status', 'is_announced'
    ];

    protected function casts(): array
    {
        return [
            'exam_date' => 'date',
            'max_score' => 'decimal:2',
            'is_announced' => 'boolean',
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
