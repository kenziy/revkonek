<?php

namespace App\Http\Middleware;

use App\Models\SystemSetting;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureFeatureEnabled
{
    public function handle(Request $request, Closure $next, string $feature): Response
    {
        $enabled = SystemSetting::get("features.{$feature}_enabled", true);

        if (! $enabled) {
            if ($request->expectsJson()) {
                return response()->json([
                    'message' => 'This feature is currently disabled.',
                ], 403);
            }

            return redirect()->route('dashboard')
                ->with('error', 'This feature is currently disabled.');
        }

        return $next($request);
    }
}
