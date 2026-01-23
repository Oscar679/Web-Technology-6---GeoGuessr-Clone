<?php

namespace App\Http\Controllers;

use Illuminate\Routing\Controller;
use App\Services\MapillaryService;

class MapillaryController extends Controller
{
    public function random(MapillaryService $mapillary)
    {
        return response()->json(
            $mapillary->fetchImage()
        );
    }
}
