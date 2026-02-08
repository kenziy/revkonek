<?php

namespace App\Http\Requests;

use App\Enums\SocialPlatform;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreVehicleSocialLinkRequest extends FormRequest
{
    public function authorize(): bool
    {
        $vehicle = $this->route('vehicle');

        return $this->user()->isPremium() && $this->user()->id === $vehicle->user_id;
    }

    public function rules(): array
    {
        return [
            'platform' => ['required', 'string', Rule::in(array_column(SocialPlatform::cases(), 'value'))],
            'url' => ['required', 'url', 'max:500'],
            'label' => ['nullable', 'string', 'max:100'],
        ];
    }
}
