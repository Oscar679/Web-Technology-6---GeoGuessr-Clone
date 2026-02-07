<?php

namespace App\Services;

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

// authorizes database connection
class AuthService
{
    private string $secret;

    public function __construct()
    {
        $this->secret = $_ENV['JWT_SECRET'];
    }

    public function createToken(int $userId, string $name): string
    {
        $payload = [
            'user_id' => $userId,
            'name' => $name,
            'iat' => time(),
            'exp' => time() + (60 * 60 * 24) // 24 hours
        ];

        return JWT::encode($payload, $this->secret, 'HS256');
    }

    public function verifyToken(string $token): ?object
    {
        try {
            return JWT::decode($token, new Key($this->secret, 'HS256'));
        } catch (\Exception $e) {
            return null;
        }
    }
}
