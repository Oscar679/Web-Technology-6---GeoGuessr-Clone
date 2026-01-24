<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Routing\Controller;


use App\Models\User;
use Illuminate\Support\Facades\Hash;


class UserController extends Controller
{
    public function register(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email|unique:users,email',
            'name' => 'required|string|min:3|unique:users,name',
            'password' => 'required|min:6',
        ]);

        $user = User::create([
            'email' => $validated['email'],
            'name' => $validated['name'],
            'password' => Hash::make($validated['password']),
        ]);

        return response()->json([
            'message' => 'User created',
            'user' => $user,
        ], 201);
    }
}
