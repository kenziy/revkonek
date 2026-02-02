<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateVehicleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->id === $this->route('vehicle')->user_id;
    }

    public function rules(): array
    {
        $vehicle = $this->route('vehicle');

        $rules = [
            'vehicle_category_id' => ['nullable', 'exists:vehicle_categories,id'],
            'make' => ['required', 'string', 'max:100'],
            'model' => ['required', 'string', 'max:100'],
            'year' => ['required', 'integer', 'min:1900', 'max:'.(date('Y') + 1)],
            'modification_level' => ['required', 'string', Rule::in(['stock', 'mild', 'built'])],
            'color' => ['nullable', 'string', 'max:50'],
            'plate_number' => ['nullable', 'string', 'max:20'],
            'notes' => ['nullable', 'string', 'max:1000'],
            'is_active' => ['boolean'],
            'is_available_for_match' => ['boolean'],
            'photo' => ['nullable', 'image', 'max:5120'],
        ];

        // Bike-specific validation
        if ($vehicle->vehicleType?->isBike()) {
            $rules['cc'] = ['required', 'integer', 'min:50', 'max:3000'];
        }

        // Car-specific validation
        if ($vehicle->vehicleType?->isCar()) {
            $rules['engine_liters'] = ['nullable', 'numeric', 'min:0.5', 'max:10'];
            $rules['horsepower'] = ['nullable', 'integer', 'min:50', 'max:2000'];
            $rules['transmission'] = ['nullable', 'string', Rule::in(['manual', 'automatic', 'cvt', 'dct'])];
            $rules['drivetrain'] = ['nullable', 'string', Rule::in(['fwd', 'rwd', 'awd', '4wd'])];
            $rules['doors'] = ['nullable', 'integer', 'min:2', 'max:5'];
        }

        return $rules;
    }

    public function messages(): array
    {
        return [
            'cc.required' => 'Engine displacement (cc) is required for bikes.',
        ];
    }
}
