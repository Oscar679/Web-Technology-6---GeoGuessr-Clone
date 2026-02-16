<?php

namespace App\Services;

use PDO;

/**
 * Owns core game lifecycle operations: creation, scoring persistence, history, and rankings.
 */
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

    /**
     * Generates a share-safe random game identifier.
     */
    private function generateId(): string
    {
        return bin2hex(random_bytes(16));
    }

    /**
     * Creates a new game and stores the generated location set.
     */
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

    /**
     * Loads an existing game by id. Throws when missing/corrupt.
     */
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

    /**
     * Returns top results for one game. Lower score is better.
     */
    public function getResults(string $gameId, int $limit = 10): array
    {
        $limit = max(1, min($limit, 50));
        $stmt = $this->pdo->prepare(
            "SELECT gr.user_id,
                    u.name AS player_name,
                    gr.score,
                    gr.completed_at,
                    ps.wins,
                    ps.games_played,
                    ps.win_pct
             FROM game_results gr
             INNER JOIN users u ON u.id = gr.user_id
             LEFT JOIN player_stats ps ON ps.user_id = gr.user_id
             WHERE gr.game_id = :game_id
             ORDER BY gr.score ASC, gr.completed_at ASC
             LIMIT {$limit}"
        );

        $stmt->execute([
            "game_id" => $gameId
        ]);

        return $stmt->fetchAll();
    }

    /**
     * Returns global leaderboard sorted by rating and tie-breakers.
     */
    public function getGlobalLeaderboard(int $limit = 50): array
    {
        $limit = max(1, min($limit, 200));
        $stmt = $this->pdo->prepare(
            "SELECT u.name AS player_name,
                    ps.wins,
                    ps.games_played,
                    ps.win_pct,
                    ps.rating
             FROM player_stats ps
             INNER JOIN users u ON u.id = ps.user_id
             ORDER BY ps.rating DESC, ps.wins DESC, ps.win_pct DESC, ps.games_played DESC
             LIMIT {$limit}"
        );

        $stmt->execute();
        return $stmt->fetchAll();
    }

    /**
     * Returns a user's recent games including opponent name/score when available.
     */
    public function getUserHistory(int $userId, int $limit = 50): array
    {
        $limit = max(1, min($limit, 200));
        $stmt = $this->pdo->prepare(
            "SELECT gr.game_id,
                    gr.score,
                    gr.completed_at,
                    (
                        SELECT u2.name
                        FROM game_results gr2
                        INNER JOIN users u2 ON u2.id = gr2.user_id
                        WHERE gr2.game_id = gr.game_id
                          AND gr2.user_id <> :user_id_opponent
                        LIMIT 1
                    ) AS opponent_name,
                    (
                        SELECT gr2.score
                        FROM game_results gr2
                        WHERE gr2.game_id = gr.game_id
                          AND gr2.user_id <> :user_id_opponent_score
                        LIMIT 1
                    ) AS opponent_score
             FROM game_results gr
             WHERE gr.user_id = :user_id_main
             ORDER BY gr.completed_at DESC
             LIMIT {$limit}"
        );

        $stmt->execute([
            "user_id_main" => $userId,
            "user_id_opponent" => $userId,
            "user_id_opponent_score" => $userId
        ]);

        return $stmt->fetchAll();
    }

    /**
     * Persists one player's result and enforces 1v1 constraints.
     * Returns: "saved", "already_played", or "game_full".
     */
    public function saveResult(string $gameId, int $userId, int $score): string
    {
        // Rule 1: a user may only submit once per game.
        $checkStmt = $this->pdo->prepare(
            "SELECT COUNT(*)
             FROM game_results
             WHERE game_id = :game_id
               AND user_id = :user_id"
        );
        $checkStmt->execute([
            "game_id" => $gameId,
            "user_id" => $userId
        ]);
        if ($checkStmt->fetchColumn() > 0) {
            return "already_played";
        }

        // Rule 2: each game accepts at most two unique players (1v1).
        $countPlayersStmt = $this->pdo->prepare(
            "SELECT COUNT(DISTINCT user_id)
             FROM game_results
             WHERE game_id = :game_id"
        );
        $countPlayersStmt->execute([
            "game_id" => $gameId
        ]);
        if ((int)$countPlayersStmt->fetchColumn() >= 2) {
            return "game_full";
        }

        $stmt = $this->pdo->prepare(
            "INSERT INTO game_results (game_id, user_id, score)
             VALUES (:game_id, :user_id, :score)"
        );

        $stmt->execute([
            "game_id" => $gameId,
            "user_id" => $userId,
            "score"   => $score
        ]);

        // Stats/rating are recomputed after each valid submission.
        $this->updateStatsForGame($gameId);
        $this->updateRatings();
        return "saved";
    }

    /**
     * Recomputes wins/games/win% for players who participated in this game.
     * Only finished games (2+ submissions) are counted.
     */
    private function updateStatsForGame(string $gameId): void
    {
        $stmt = $this->pdo->prepare(
            "SELECT DISTINCT user_id
             FROM game_results
             WHERE game_id = :game_id"
        );
        $stmt->execute(["game_id" => $gameId]);
        $userIds = $stmt->fetchAll(PDO::FETCH_COLUMN);

        foreach ($userIds as $uid) {
            $gamesPlayedStmt = $this->pdo->prepare(
                "SELECT COUNT(*)
                 FROM game_results gr
                 WHERE gr.user_id = :user_id
                   AND (SELECT COUNT(*) FROM game_results grc WHERE grc.game_id = gr.game_id) >= 2"
            );
            $gamesPlayedStmt->execute(["user_id" => $uid]);
            $gamesPlayed = (int)$gamesPlayedStmt->fetchColumn();

            $winsStmt = $this->pdo->prepare(
                "SELECT COUNT(*)
                 FROM game_results gr1
                 WHERE gr1.user_id = :user_id
                   AND (SELECT COUNT(*) FROM game_results grc WHERE grc.game_id = gr1.game_id) >= 2
                   AND gr1.score = (
                       SELECT MIN(gr2.score)
                       FROM game_results gr2
                       WHERE gr2.game_id = gr1.game_id
                   )"
            );
            $winsStmt->execute(["user_id" => $uid]);
            $wins = (int)$winsStmt->fetchColumn();

            $winPct = $gamesPlayed > 0 ? round(($wins / $gamesPlayed) * 100, 2) : 0.0;

            $upsert = $this->pdo->prepare(
                "INSERT INTO player_stats (user_id, games_played, wins, win_pct)
                 VALUES (:user_id, :games_played, :wins, :win_pct)
                 ON DUPLICATE KEY UPDATE
                    games_played = VALUES(games_played),
                    wins = VALUES(wins),
                    win_pct = VALUES(win_pct)"
            );
            $upsert->execute([
                "user_id" => $uid,
                "games_played" => $gamesPlayed,
                "wins" => $wins,
                "win_pct" => $winPct
            ]);
        }
    }

    /**
     * Rebuilds lightweight rating values from completed game outcomes in chronological order.
     */
    private function updateRatings(): void
    {
        $ratings = [];

        // Start everyone at rating 0, then apply game-by-game adjustments.
        $usersStmt = $this->pdo->query("SELECT id FROM users");
        $userIds = $usersStmt->fetchAll(PDO::FETCH_COLUMN);
        foreach ($userIds as $uid) {
            $ratings[(int)$uid] = 0;
        }

        $gamesStmt = $this->pdo->query(
            "SELECT game_id, MAX(completed_at) AS finished_at
             FROM game_results
             GROUP BY game_id
             HAVING COUNT(*) >= 2
             ORDER BY finished_at ASC"
        );
        $games = $gamesStmt->fetchAll();

        $scoresStmt = $this->pdo->prepare(
            "SELECT user_id, score
             FROM game_results
             WHERE game_id = :game_id
             ORDER BY score ASC"
        );

        foreach ($games as $game) {
            $scoresStmt->execute(["game_id" => $game['game_id']]);
            $rows = $scoresStmt->fetchAll();

            if (count($rows) < 2) {
                continue;
            }

            $first = $rows[0];
            $second = $rows[1];

            $firstUser = (int)$first['user_id'];
            $secondUser = (int)$second['user_id'];

            if ($first['score'] === $second['score']) {
                // Tie: both gain a small positive increment.
                $ratings[$firstUser] = max(0, ($ratings[$firstUser] ?? 0) + 10);
                $ratings[$secondUser] = max(0, ($ratings[$secondUser] ?? 0) + 10);
            } else {
                // Win/loss: winner gets a larger boost, loser loses points (floored at 0).
                $ratings[$firstUser] = max(0, ($ratings[$firstUser] ?? 0) + 20);
                $ratings[$secondUser] = max(0, ($ratings[$secondUser] ?? 0) - 15);
            }
        }

        $updateStmt = $this->pdo->prepare(
            "UPDATE player_stats
             SET rating = :rating
             WHERE user_id = :user_id"
        );

        foreach ($ratings as $uid => $rating) {
            $updateStmt->execute([
                "user_id" => $uid,
                "rating" => $rating
            ]);
        }
    }
}
