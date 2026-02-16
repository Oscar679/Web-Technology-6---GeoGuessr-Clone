<?php

namespace App\Services;

use PDO;

/**
 * Encapsulates user persistence and credential verification.
 */
class UserService
{
    public function __construct(private PDO $pdo)
    {
        // PDO is injected through the DI container.
    }

    /**
     * Stores a newly registered user with a one-way password hash.
     */
    public function addUser(string $name, string $password): bool
    {
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
        $stmt = $this->pdo->prepare("INSERT INTO users (name, password) VALUES (:name, :password)");

        return $stmt->execute([
            'name' => $name,
            'password' => $hashedPassword
        ]);
    }

    /**
     * Looks up user by name and verifies plaintext password against hash.
     */
    public function getUserByCredentials(string $name, string $password): ?array
    {
        $stmt = $this->pdo->prepare("SELECT * FROM users WHERE name = :name");
        $stmt->execute(['name' => $name]);
        $user = $stmt->fetch();

        if ($user && password_verify($password, $user['password'])) {
            return $user;
        }

        return null;
    }

    /**
     * Returns a user row by name, or null when not found.
     */
    public function getUserByName(string $name): ?array
    {
        $stmt = $this->pdo->prepare("SELECT * FROM users WHERE name = :name");
        $stmt->execute(['name' => $name]);
        $user = $stmt->fetch();
        return $user ?: null;
    }

}
