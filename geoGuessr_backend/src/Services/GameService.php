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

        $stmt = $this->pdo->prepare(
            "INSERT INTO games (game_id, created_by)
             VALUES (:game_id, :user_id)"
        );

        $stmt->execute([
            "game_id" => $gameId,
            "user_id" => $userId
        ]);

        return [
            "gameId" => $gameId,
            "images" => $this->mapillary->getRandomImage()
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
