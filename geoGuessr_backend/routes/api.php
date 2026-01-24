<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MapillaryController;
use App\Http\Controllers\UserController;

Route::get('/mapillary/random', [MapillaryController::class, 'random']);

use Illuminate\Support\Facades\DB;

Route::get('/db-test', fn() => DB::select('SHOW TABLES'));

Route::post('/register', [UserController::class, 'register']);

