<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreVehicleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $rules = [
            'vehicle_type_id' => ['required', 'exists:vehicle_types,id'],
            'vehicle_category_id' => ['nullable', 'exists:vehicle_categories,id'],
            'make' => ['required', 'string', 'max:100'],
            'model' => ['required', 'string', 'max:100'],
            'year' => ['required', 'integer', 'min:1900', 'max:'.(date('Y') + 1)],
            'modification_level' => ['required', 'string', Rule::in(['stock', 'mild', 'built'])],
            'color' => ['nullable', 'string', 'max:50'],
            'plate_number' => ['nullable', 'string', 'max:20'],
            'notes' => ['nullable', 'string', 'max:1000'],
            'is_active' => ['boolean'],
            'photo' => ['nullable', 'image', 'max:5120'],
            'photos' => ['nullable', 'array', 'max:'.$this->user()->getSubscriptionTier()->maxVehiclePhotos()],
            'photos.*' => ['image', 'max:5120'],
        ];

        // Bike-specific validation
        if ($this->input('vehicle_type') === 'bike' || $this->hasBikeType()) {
            $rules['cc'] = ['required', 'integer', 'min:50', 'max:3000'];
        }

        // Car-specific validation
        if ($this->input('vehicle_type') === 'car' || $this->hasCarType()) {
            $rules['engine_liters'] = ['nullable', 'numeric', 'min:0.5', 'max:10'];
            $rules['horsepower'] = ['nullable', 'integer', 'min:50', 'max:2000'];
            $rules['transmission'] = ['nullable', 'string', Rule::in(['manual', 'automatic', 'cvt', 'dct'])];
            $rules['drivetrain'] = ['nullable', 'string', Rule::in(['fwd', 'rwd', 'awd', '4wd'])];
            $rules['doors'] = ['nullable', 'integer', 'min:2', 'max:5'];
        }

        return $rules;
    }

    protected function hasBikeType(): bool
    {
        if (! $this->input('vehicle_type_id')) {
            return false;
        }

        return \App\Models\VehicleType::where('id', $this->input('vehicle_type_id'))
            ->where('slug', 'bike')
            ->exists();
    }

    protected function hasCarType(): bool
    {
        if (! $this->input('vehicle_type_id')) {
            return false;
        }

        return \App\Models\VehicleType::where('id', $this->input('vehicle_type_id'))
            ->where('slug', 'car')
            ->exists();
    }

    public function messages(): array
    {
        return [
            'cc.required' => 'Engine displacement (cc) is required for bikes.',
            'vehicle_type_id.required' => 'Please select a vehicle type.',
        ];
    }
}
