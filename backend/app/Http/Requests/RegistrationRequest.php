<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RegistrationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'user_id' => ['required', 'exists:users,id'],
            'language_id' => ['required', 'exists:languages,id'],
            'level_id' => ['nullable', 'exists:levels,id'],
            'motivation' => ['nullable', 'string'],
            'previous_experience' => ['nullable', 'string'],
        ];
    }
}
