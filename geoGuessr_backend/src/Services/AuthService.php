<?php

namespace App\Services;

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

/**
 * Handles JWT creation and verification for stateless API auth.
 */
class AuthService
{
    private string $secret;

    public function __construct()
    {
        // Shared signing key loaded from .env.
        $this->secret = $_ENV['JWT_SECRET'];
    }

    /**
     * Creates a short-lived token containing minimal user identity data.
     */
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

    /**
     * Decodes and validates a JWT. Returns null when invalid/expired.
     */
    public function verifyToken(string $token): ?object
    {
        try {
            return JWT::decode($token, new Key($this->secret, 'HS256'));
        } catch (\Exception $e) {
            return null;
        }
    }
}
