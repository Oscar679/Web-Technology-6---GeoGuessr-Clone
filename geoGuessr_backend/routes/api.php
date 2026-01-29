<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MapillaryController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use App\Http\Controllers\OpenStreetMapController;

Route::get('/mapillary/random', [MapillaryController::class, 'random']);

use Illuminate\Support\Facades\DB;

Route::get('/db-test', fn() => DB::select('SHOW TABLES'));

Route::post('/register', [UserController::class, 'register']);

Route::post('/login', [UserController::class, 'login']);

Route::middleware('auth:sanctum')->get('/me', function (Request $request) {
    return $request->user();
});

Route::middleware('auth:sanctum')->post('/logout', [UserController::class, 'logout']);
