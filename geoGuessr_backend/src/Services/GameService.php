<?php

namespace App\Services;

use App\Services\MapillaryService;
use PDO;

class GameService
{
    private MapillaryService $mapillary;
    private PDO $pdo;

    public function __construct(
        MapillaryService $mapillary,
        PDO $pdo
    ) {
        $this->mapillary = $mapillary;
        $this->pdo = $pdo;
    }

    private function generateId(): string
    {
        return bin2hex(random_bytes(16));
    }

    public function start(int $userId): array
    {
        $gameId = $this->generateId();
        $images = $this->mapillary->getRandomImage();

        $stmt = $this->pdo->prepare(
            "INSERT INTO games (game_id, created_by, locations)
             VALUES (:game_id, :user_id, :locations)"
        );

        $stmt->execute([
            "game_id" => $gameId,
            "user_id" => $userId,
            "locations" => json_encode($images)
        ]);

        return [
            "gameId" => $gameId,
            "images" => $images
        ];
    }

    public function getGame(string $gameId): array
    {
        $stmt = $this->pdo->prepare(
            "SELECT game_id, locations
             FROM games
             WHERE game_id = :game_id
             LIMIT 1"
        );

        $stmt->execute([
            "game_id" => $gameId
        ]);

        $row = $stmt->fetch();
        if (!$row) {
            throw new \RuntimeException("Game not found");
        }

        $images = json_decode($row['locations'], true);
        if (!is_array($images)) {
            throw new \RuntimeException("Game data invalid");
        }

        return [
            "gameId" => $row['game_id'],
            "images" => $images
        ];
    }

    public function saveResult(string $gameId, int $userId, int $score): void
    {
        $stmt = $this->pdo->prepare(
            "INSERT INTO game_results (game_id, user_id, score)
             VALUES (:game_id, :user_id, :score)"
        );

        $stmt->execute([
            "game_id" => $gameId,
            "user_id" => $userId,
            "score"   => $score
        ]);
    }
}
