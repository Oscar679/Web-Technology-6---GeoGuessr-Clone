<?php

use Illuminate\Support\Facades\Route;

// Tom web-fil, men giltig route
Route::get('/', function () {
    return response()->json(['status' => 'web ok']);
});
