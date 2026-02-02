<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class SystemSetting extends Model
{
    use HasFactory;

    protected $fillable = [
        'group',
        'key',
        'value',
        'type',
        'description',
    ];

    protected static function booted(): void
    {
        static::saved(fn () => Cache::forget('system_settings'));
        static::deleted(fn () => Cache::forget('system_settings'));
    }

    public static function get(string $key, mixed $default = null): mixed
    {
        $settings = Cache::rememberForever('system_settings', function () {
            return static::all()->keyBy(fn ($s) => "{$s->group}.{$s->key}");
        });

        $setting = $settings->get($key);

        if (! $setting) {
            return $default;
        }

        return static::castValue($setting->value, $setting->type);
    }

    public static function set(string $group, string $key, mixed $value, string $type = 'string', ?string $description = null): void
    {
        static::updateOrCreate(
            ['group' => $group, 'key' => $key],
            [
                'value' => is_array($value) ? json_encode($value) : (string) $value,
                'type' => $type,
                'description' => $description,
            ]
        );
    }

    public static function getGroup(string $group): array
    {
        $settings = Cache::rememberForever('system_settings', function () {
            return static::all()->keyBy(fn ($s) => "{$s->group}.{$s->key}");
        });

        return $settings
            ->filter(fn ($s) => $s->group === $group)
            ->mapWithKeys(fn ($s) => [$s->key => static::castValue($s->value, $s->type)])
            ->toArray();
    }

    protected static function castValue(?string $value, string $type): mixed
    {
        if ($value === null) {
            return null;
        }

        return match ($type) {
            'integer', 'int' => (int) $value,
            'boolean', 'bool' => filter_var($value, FILTER_VALIDATE_BOOLEAN),
            'json', 'array' => json_decode($value, true),
            'float', 'double' => (float) $value,
            default => $value,
        };
    }
}
