<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

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
$app->setBasePath('/oe222ia/geoguessr_backend');

/*
|--------------------------------------------------------------------------
| ROUTING + ERROR MIDDLEWARE
|--------------------------------------------------------------------------
*/
$app->addRoutingMiddleware();
$app->addErrorMiddleware(true, true, true);


/*
|--------------------------------------------------------------------------
| AUTH MIDDLEWARE
|--------------------------------------------------------------------------
*/
$authMiddleware = function (Request $request, $handler) use ($container) {

    $authHeader = $request->getHeaderLine('Authorization');

    if (!str_starts_with($authHeader, 'Bearer ')) {
        return (new \Slim\Psr7\Response())->withStatus(401);
    }

    $token = substr($authHeader, 7);

    /** @var AuthService $authService */
    $authService = $container->get(AuthService::class);
    $user = $authService->verifyToken($token);

    if (!$user) {
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
$app->group('/api', function ($group) {

    // Start game
    $group->put('/startgame', function (Request $request, Response $response) {
        $user = $request->getAttribute('user');

        /** @var GameService $gameService */
        $gameService = $this->get(GameService::class);
        $data = $gameService->start($user->user_id);

        $response->getBody()->write(json_encode($data));
        return $response->withHeader('Content-Type', 'application/json');
    });

    // Load existing game (requires auth)
    $group->get('/games/{gameId}', function (Request $request, Response $response, array $args) {
        /** @var GameService $gameService */
        $gameService = $this->get(GameService::class);

        try {
            $data = $gameService->getGame($args['gameId']);
        } catch (\RuntimeException $e) {
            $response->getBody()->write(json_encode(['error' => $e->getMessage()]));
            return $response->withStatus(404)->withHeader('Content-Type', 'application/json');
        }

        $response->getBody()->write(json_encode($data));
        return $response->withHeader('Content-Type', 'application/json');
    });

    // Save result
    $group->post('/games/{gameId}/result', function (
        Request $request,
        Response $response,
        array $args
    ) {
        $user = $request->getAttribute('user');
        $data = json_decode($request->getBody()->getContents(), true);

        if (!is_array($data) || !isset($data['score']) || !is_numeric($data['score'])) {
            $response->getBody()->write(json_encode(['error' => 'Invalid score payload']));
            return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
        }

        /** @var GameService $gameService */
        $gameService = $this->get(GameService::class);
        $status = $gameService->saveResult($args['gameId'], $user->user_id, (int)$data['score']);
        if ($status === 'already_played') {
            $response->getBody()->write(json_encode(['error' => 'You already played this game']));
            return $response->withStatus(409)->withHeader('Content-Type', 'application/json');
        }
        if ($status === 'game_full') {
            $response->getBody()->write(json_encode(['error' => 'This 1v1 game already has two players']));
            return $response->withStatus(409)->withHeader('Content-Type', 'application/json');
        }

        $response->getBody()->write(json_encode(['status' => 'saved']));
        return $response->withHeader('Content-Type', 'application/json');
    });

    // Get leaderboard results
    $group->get('/games/{gameId}/results', function (Request $request, Response $response, array $args) {
        /** @var GameService $gameService */
        $gameService = $this->get(GameService::class);
        $results = $gameService->getResults($args['gameId']);

        $response->getBody()->write(json_encode(['results' => $results]));
        return $response->withHeader('Content-Type', 'application/json');
    });

    // Get current user's match history
    $group->get('/users/me/games', function (Request $request, Response $response) {
        $user = $request->getAttribute('user');

        /** @var GameService $gameService */
        $gameService = $this->get(GameService::class);
        $history = $gameService->getUserHistory($user->user_id);

        $response->getBody()->write(json_encode(['games' => $history]));
        return $response->withHeader('Content-Type', 'application/json');
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

$app->post('/api/login', function (Request $request, Response $response) {
    $data = json_decode($request->getBody()->getContents(), true);

    /** @var UserService $userService */
    $userService = $this->get(UserService::class);
    /** @var AuthService $authService */
    $authService = $this->get(AuthService::class);

    $user = $userService->getUserByCredentials($data['name'], $data['password']);

    if (!$user) {
        $response->getBody()->write(json_encode(['error' => 'Invalid credentials']));
        return $response->withStatus(401)->withHeader('Content-Type', 'application/json');
    }

    $token = $authService->createToken($user['id'], $user['name']);

    $response->getBody()->write(json_encode(['token' => $token]));
    return $response->withHeader('Content-Type', 'application/json');
});

$app->get('/api/leaderboard', function (Request $request, Response $response) {
    /** @var GameService $gameService */
    $gameService = $this->get(GameService::class);
    $results = $gameService->getGlobalLeaderboard();

    $response->getBody()->write(json_encode(['results' => $results]));
    return $response->withHeader('Content-Type', 'application/json');
});

$app->post('/api/register', function (Request $request, Response $response) {
    $data = json_decode($request->getBody()->getContents(), true);

    $name = isset($data['name']) ? trim((string)$data['name']) : '';
    $password = isset($data['password']) ? (string)$data['password'] : '';

    if ($name === '' || $password === '') {
        $response->getBody()->write(json_encode(['error' => 'Name and password are required']));
        return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
    }

    /** @var UserService $userService */
    $userService = $this->get(UserService::class);

    if ($userService->getUserByName($name)) {
        $response->getBody()->write(json_encode(['error' => 'Username already taken']));
        return $response->withStatus(409)->withHeader('Content-Type', 'application/json');
    }

    try {
        $userService->addUser($name, $password);
    } catch (\Throwable $e) {
        $response->getBody()->write(json_encode(['error' => 'Unable to create user']));
        return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
    }

    $response->getBody()->write(json_encode(['status' => 'created']));
    return $response->withStatus(201)->withHeader('Content-Type', 'application/json');
});

/*
|--------------------------------------------------------------------------
| RUN
|--------------------------------------------------------------------------
*/
$app->run();

