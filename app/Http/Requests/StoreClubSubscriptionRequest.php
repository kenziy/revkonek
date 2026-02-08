<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreClubSubscriptionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'receipt' => ['required', 'image', 'max:5120'],
            'coupon_code' => ['nullable', 'string', 'max:50'],
        ];
    }

    public function messages(): array
    {
        return [
            'receipt.required' => 'Please upload your payment receipt.',
            'receipt.image' => 'The receipt must be an image file.',
            'receipt.max' => 'The receipt must not exceed 5MB.',
        ];
    }
}
