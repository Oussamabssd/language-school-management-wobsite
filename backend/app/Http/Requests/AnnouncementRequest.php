<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AnnouncementRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'content' => ['required', 'string'],
            'author_id' => ['required', 'exists:users,id'],
            'target_audience' => ['nullable', 'in:all,students,teachers,parents,staff'],
            'group_id' => ['nullable', 'exists:groups,id'],
            'priority' => ['nullable', 'in:low,medium,high,urgent'],
            'is_published' => ['nullable', 'boolean'],
            'expires_at' => ['nullable', 'date', 'after:now'],
        ];
    }
}
