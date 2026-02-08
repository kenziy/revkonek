<?php

namespace App\Http\Requests;

use App\Enums\PostVisibility;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreClubPostRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'content' => ['required', 'string', 'max:5000'],
            'is_announcement' => ['boolean'],
            'visibility' => ['sometimes', Rule::enum(PostVisibility::class)],
        ];
    }
}
