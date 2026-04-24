<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class LanguageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $languageId = $this->route('language');

        return [
            'name' => ['required', 'string', 'max:255', 'unique:languages,name,' . $languageId],
            'code' => ['required', 'string', 'max:10', 'unique:languages,code,' . $languageId],
            'description' => ['nullable', 'string'],
            'is_active' => ['nullable', 'boolean'],
        ];
    }
}
