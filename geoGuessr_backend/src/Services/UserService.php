<?php

namespace App\Services;

use PDO;

class UserService
{
    public function __construct(private PDO $pdo)
    {
        //empty constructor
    }

    public function addUser(string $name, string $password): bool
    {
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
        $stmt = $this->pdo->prepare("INSERT INTO users (name, password) VALUES (:name, :password)");

        return $stmt->execute([
            'name' => $name,
            'password' => $hashedPassword
        ]);
    }

    public function getAll(): array
    {
        return $this->pdo->query('SELECT * FROM users')->fetchAll();
    }

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

    public function getCurrentUser(): array
    {
        return [
            'id' => 'guest',
            'name' => 'Guest'
        ];
    }
}
