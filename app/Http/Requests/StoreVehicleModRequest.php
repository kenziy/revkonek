<?php

namespace App\Http\Requests;

use App\Enums\VehicleModCategory;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreVehicleModRequest extends FormRequest
{
    public function authorize(): bool
    {
        $vehicle = $this->route('vehicle');

        return $this->user()->isPremium() && $this->user()->id === $vehicle->user_id;
    }

    public function rules(): array
    {
        return [
            'category' => ['required', 'string', Rule::in(array_column(VehicleModCategory::cases(), 'value'))],
            'name' => ['required', 'string', 'max:255'],
            'brand' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:1000'],
            'price' => ['nullable', 'numeric', 'min:0', 'max:9999999.99'],
            'currency' => ['nullable', 'string', 'max:3'],
            'installed_at' => ['nullable', 'date'],
        ];
    }
}
