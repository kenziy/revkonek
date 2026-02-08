<?php

namespace App\Http\Requests;

use App\Enums\VehicleLayoutTemplate;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateVehicleCustomizationRequest extends FormRequest
{
    public function authorize(): bool
    {
        $vehicle = $this->route('vehicle');

        return $this->user()->isPremium() && $this->user()->id === $vehicle->user_id;
    }

    public function rules(): array
    {
        return [
            'layout_template' => ['nullable', 'string', Rule::in(array_column(VehicleLayoutTemplate::cases(), 'value'))],
            'accent_color' => ['nullable', 'string', 'regex:/^#[0-9A-Fa-f]{6}$/'],
            'background_style' => ['nullable', 'string', Rule::in(['default', 'gradient', 'dark', 'light'])],
            'story' => ['nullable', 'string', 'max:5000'],
            'cover_image' => ['nullable', 'image', 'max:10240'],
            'youtube_url' => ['nullable', 'string', 'max:255'],
            'youtube_autoplay' => ['boolean'],
        ];
    }
}
