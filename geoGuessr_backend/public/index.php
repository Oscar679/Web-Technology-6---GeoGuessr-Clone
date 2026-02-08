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
| OPTIONS (PRE-FLIGHT) – OBLIGATORISK
|--------------------------------------------------------------------------
*/
$app->options('/{routes:.+}', function (Request $request, Response $response) {
    return $response;
});

/*
|--------------------------------------------------------------------------
| CORS MIDDLEWARE (SKA LIGGA FÖRE AUTH)
|--------------------------------------------------------------------------
*/
$corsMiddleware = function (Request $request, $handler) {
    if ($request->getMethod() === 'OPTIONS') {
        $response = new \Slim\Psr7\Response();
    } else {
        $response = $handler->handle($request);
    }

    return $response
        ->withHeader('Access-Control-Allow-Origin', 'http://localhost:5173')
        ->withHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        ->withHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        ->withHeader('Access-Control-Allow-Credentials', 'true');
};

$app->add($corsMiddleware);

/*
|--------------------------------------------------------------------------
| AUTH MIDDLEWARE
|--------------------------------------------------------------------------
*/
$authMiddleware = function (Request $request, $handler) use ($container) {

    if ($request->getMethod() === 'OPTIONS') {
        return $handler->handle($request);
    }

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

    // Save result
    $group->post('/games/{gameId}/result', function (
        Request $request,
        Response $response,
        array $args
    ) {
        $user = $request->getAttribute('user');
        $data = json_decode($request->getBody()->getContents(), true);

        /** @var GameService $gameService */
        $gameService = $this->get(GameService::class);
        $gameService->saveResult(
            $args['gameId'],
            $user->user_id,
            $data['score']
        );

        $response->getBody()->write(json_encode(['status' => 'saved']));
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

/*
|--------------------------------------------------------------------------
| RUN
|--------------------------------------------------------------------------
*/
$app->run();
