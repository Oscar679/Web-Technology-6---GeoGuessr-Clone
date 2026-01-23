<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MapillaryController;

Route::get('/mapillary/random', [MapillaryController::class, 'random']);
