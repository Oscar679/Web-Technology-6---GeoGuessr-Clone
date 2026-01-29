<?php

namespace App\Http\Controllers;

use App\Services\MapillaryService;

class MapillaryController extends Controller
{
    public function random(MapillaryService $mapillaryService)
    {
        return response()->json(
            $mapillaryService->fetchImage()
        );
    }
}
