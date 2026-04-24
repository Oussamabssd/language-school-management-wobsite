<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Level extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'language_id', 'description', 'order', 'is_active'];

    protected function casts(): array
    {
        return ['is_active' => 'boolean', 'order' => 'integer'];
    }

    public function language(): BelongsTo
    {
        return $this->belongsTo(Language::class);
    }

    public function groups(): HasMany
    {
        return $this->hasMany(Group::class);
    }
}
