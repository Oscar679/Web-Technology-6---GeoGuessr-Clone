<?php

use App\Services\GameService;
use App\Services\UserService;
use App\Services\AuthService;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\Factory\AppFactory;
use Dotenv\Dotenv;
use DI\ContainerBuilder;

require __DIR__ . '/../vendor/autoload.php';

/*
|--------------------------------------------------------------------------
| ENV
|--------------------------------------------------------------------------
*/
$dotenv = Dotenv::createImmutable(__DIR__ . '/..');
$dotenv->load();

// Keep verbose errors local-only; production should not expose internals.
$debug = isset($_ENV['APP_DEBUG']) && filter_var($_ENV['APP_DEBUG'], FILTER_VALIDATE_BOOL);
ini_set('display_errors', $debug ? '1' : '0');
error_reporting($debug ? E_ALL : 0);

/*
|--------------------------------------------------------------------------
| Container
|--------------------------------------------------------------------------
*/
$containerBuilder = new ContainerBuilder();
(require __DIR__ . '/../config/dependencies.php')($containerBuilder);
$container = $containerBuilder->build();

AppFactory::setContainer($container);

/*
|--------------------------------------------------------------------------
| App
|--------------------------------------------------------------------------
*/
$app = AppFactory::create();
// Small helper to keep JSON responses consistent across endpoints.
$json = static function (Response $response, array $payload, int $status = 200): Response {
    $response->getBody()->write(json_encode($payload));
    return $response->withStatus($status)->withHeader('Content-Type', 'application/json');
};
$appBasePath = isset($_ENV['APP_BASE_PATH']) ? trim((string)$_ENV['APP_BASE_PATH']) : '';
if ($appBasePath !== '') {
    $app->setBasePath($appBasePath);
}

/*
|--------------------------------------------------------------------------
| ROUTING + ERROR MIDDLEWARE
|--------------------------------------------------------------------------
*/
$app->addRoutingMiddleware();
$app->addErrorMiddleware($debug, $debug, $debug);


/*
|--------------------------------------------------------------------------
| AUTH MIDDLEWARE
|--------------------------------------------------------------------------
*/
$authMiddleware = function (Request $request, $handler) use ($container) {

    $authHeader = $request->getHeaderLine('Authorization');

    if (!str_starts_with($authHeader, 'Bearer ')) {
        // We return 401 without body; frontend maps this to login flow.
        return (new \Slim\Psr7\Response())->withStatus(401);
    }

    $token = substr($authHeader, 7);

    /** @var AuthService $authService */
    $authService = $container->get(AuthService::class);
    $user = $authService->verifyToken($token);

    if (!$user) {
        // Invalid or expired token.
        return (new \Slim\Psr7\Response())->withStatus(401);
    }

    return $handler->handle(
        $request->withAttribute('user', $user)
    );
};

/*
|--------------------------------------------------------------------------
| PROTECTED API ROUTES
|--------------------------------------------------------------------------
*/
$app->group('/api', function ($group) use ($json) {

    // Start game
    $group->put('/startgame', function (Request $request, Response $response) use ($json) {
        $user = $request->getAttribute('user');

        /** @var GameService $gameService */
        $gameService = $this->get(GameService::class);
        $data = $gameService->start($user->user_id);

        return $json($response, $data);
    });

    // Load existing game (requires auth)
    $group->get('/games/{gameId}', function (Request $request, Response $response, array $args) use ($json) {
        /** @var GameService $gameService */
        $gameService = $this->get(GameService::class);

        try {
            $data = $gameService->getGame($args['gameId']);
        } catch (\RuntimeException $e) {
            return $json($response, ['error' => $e->getMessage()], 404);
        }

        return $json($response, $data);
    });

    // Save result
    $group->post('/games/{gameId}/result', function (
        Request $request,
        Response $response,
        array $args
    ) use ($json) {
        $user = $request->getAttribute('user');
        $data = json_decode($request->getBody()->getContents(), true);

        if (!is_array($data) || !isset($data['score']) || !is_numeric($data['score'])) {
            return $json($response, ['error' => 'Invalid score payload'], 400);
        }

        /** @var GameService $gameService */
        $gameService = $this->get(GameService::class);
        $status = $gameService->saveResult($args['gameId'], $user->user_id, (int)$data['score']);
        if ($status === 'already_played') {
            return $json($response, ['error' => 'You already played this game'], 409);
        }
        if ($status === 'game_full') {
            return $json($response, ['error' => 'This 1v1 game already has two players'], 409);
        }

        return $json($response, ['status' => 'saved']);
    });

    // Get leaderboard results
    $group->get('/games/{gameId}/results', function (Request $request, Response $response, array $args) use ($json) {
        /** @var GameService $gameService */
        $gameService = $this->get(GameService::class);
        $results = $gameService->getResults($args['gameId']);

        return $json($response, ['results' => $results]);
    });

    // Get current user's match history
    $group->get('/users/me/games', function (Request $request, Response $response) use ($json) {
        $user = $request->getAttribute('user');

        /** @var GameService $gameService */
        $gameService = $this->get(GameService::class);
        $history = $gameService->getUserHistory($user->user_id);

        return $json($response, ['games' => $history]);
    });
})->add($authMiddleware);

/*
|--------------------------------------------------------------------------
| PUBLIC ROUTES
|--------------------------------------------------------------------------
*/
$app->get('/', function (Request $request, Response $response) {
    $response->getBody()->write('Hello world');
    return $response;
});

$app->get('/api/health', function (Request $request, Response $response) {
    $response->getBody()->write('API HEALTHY');
    return $response;
});

$app->post('/api/login', function (Request $request, Response $response) use ($json) {
    $data = json_decode($request->getBody()->getContents(), true);
    $name = is_array($data) && isset($data['name']) ? trim((string)$data['name']) : '';
    $password = is_array($data) && isset($data['password']) ? (string)$data['password'] : '';

    // Validate payload before querying storage.
    if ($name === '' || $password === '') {
        return $json($response, ['error' => 'Name and password are required'], 400);
    }

    /** @var UserService $userService */
    $userService = $this->get(UserService::class);
    /** @var AuthService $authService */
    $authService = $this->get(AuthService::class);

    $user = $userService->getUserByCredentials($name, $password);

    if (!$user) {
        return $json($response, ['error' => 'Invalid credentials'], 401);
    }

    $token = $authService->createToken($user['id'], $user['name']);

    return $json($response, ['token' => $token]);
});

$app->get('/api/leaderboard', function (Request $request, Response $response) use ($json) {
    /** @var GameService $gameService */
    $gameService = $this->get(GameService::class);
    $results = $gameService->getGlobalLeaderboard();

    return $json($response, ['results' => $results]);
});

$app->post('/api/register', function (Request $request, Response $response) use ($json) {
    $data = json_decode($request->getBody()->getContents(), true);

    $name = isset($data['name']) ? trim((string)$data['name']) : '';
    $password = isset($data['password']) ? (string)$data['password'] : '';

    if ($name === '' || $password === '') {
        return $json($response, ['error' => 'Name and password are required'], 400);
    }

    /** @var UserService $userService */
    $userService = $this->get(UserService::class);

    if ($userService->getUserByName($name)) {
        return $json($response, ['error' => 'Username already taken'], 409);
    }

    try {
        $userService->addUser($name, $password);
    } catch (\Throwable $e) {
        return $json($response, ['error' => 'Unable to create user'], 400);
    }

    return $json($response, ['status' => 'created'], 201);
});

/*
|--------------------------------------------------------------------------
| RUN
|--------------------------------------------------------------------------
*/
$app->run();

