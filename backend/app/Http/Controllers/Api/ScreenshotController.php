<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Analysis;
use App\Models\Screenshot;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ScreenshotController extends Controller
{
    public function store(Request $request, Analysis $analysis)
    {
        abort_unless($analysis->user_id === $request->user()->id, 403);

        $data = $request->validate([
            'image' => ['required', 'image', 'max:5120'], // 5 Mo
            'type' => ['required', 'string', 'in:before_entry,at_entry,after_close,position'],
            'description' => ['nullable', 'string', 'max:500'],
        ]);

        // Stockage local (dev). En prod, remplacer par Cloudinary/S3.
        $path = $request->file('image')->store('screenshots', 'public');

        $screenshot = $analysis->screenshots()->create([
            'trade_id' => $analysis->trade?->id,
            'image_url' => Storage::url($path),
            'type' => $data['type'],
            'description' => $data['description'] ?? null,
        ]);

        return response()->json($screenshot, 201);
    }

    public function destroy(Request $request, Screenshot $screenshot)
    {
        abort_unless($screenshot->analysis->user_id === $request->user()->id, 403);

        Storage::disk('public')->delete(
            str_replace('/storage/', '', $screenshot->image_url)
        );

        $screenshot->delete();

        return response()->json(null, 204);
    }
}