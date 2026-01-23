<?php

namespace App\Http\Controllers;

use Illuminate\Routing\Controller;
use App\Services\MapillaryService;

class MapillaryController
{
    public function random(MapillaryService $mapillaryService)
    {
        return response()->json(
            $mapillaryService->fetchImage()
        );
    }
}
