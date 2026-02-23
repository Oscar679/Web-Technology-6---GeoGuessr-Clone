-- GeoGuessr 1ME326 — database schema

CREATE TABLE IF NOT EXISTS users (
    id         INT          PRIMARY KEY AUTO_INCREMENT,
    name       VARCHAR(50)  UNIQUE NOT NULL,
    password   VARCHAR(255) NOT NULL,
    created_at TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS games (
    game_id    VARCHAR(64) PRIMARY KEY,
    created_by INT         NOT NULL,
    locations  JSON        NOT NULL,
    created_at TIMESTAMP   DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS game_results (
    id           INT         PRIMARY KEY AUTO_INCREMENT,
    game_id      VARCHAR(64) NOT NULL,
    user_id      INT         NOT NULL,
    score        INT         NOT NULL,
    completed_at TIMESTAMP   DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (game_id) REFERENCES games(game_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    UNIQUE KEY unique_user_game (game_id, user_id)
);

CREATE TABLE IF NOT EXISTS player_stats (
    user_id      INT   PRIMARY KEY,
    games_played INT   DEFAULT 0,
    wins         INT   DEFAULT 0,
    win_pct      FLOAT DEFAULT 0,
    rating       INT   DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
