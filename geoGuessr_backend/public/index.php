<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

use App\Services\MapillaryService;
use App\Services\GameService;
use App\Services\UserService;
use App\Services\AuthService;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\Factory\AppFactory;
use Dotenv\Dotenv;

use DI\ContainerBuilder;

require __DIR__ . '/../vendor/autoload.php';

$dotenv = Dotenv::createImmutable(__DIR__ . '/..');
$dotenv->load();

$containerBuilder = new ContainerBuilder();
(require __DIR__ . '/../config/dependencies.php')($containerBuilder);
$container = $containerBuilder->build();

AppFactory::setContainer($container);

$app = AppFactory::create();
$app->setBasePath('/oe222ia/geoguessr_backend');

// CORS middleware - must be added before routes
$app->options('/{routes:.+}', function (Request $request, Response $response) {
    return $response;
});

$app->add(function ($request, $handler) {
    $response = $handler->handle($request);
    return $response
        ->withHeader('Access-Control-Allow-Origin', 'http://localhost:5173')
        ->withHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS')
        ->withHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
});

$app->get('/', function (Request $request, Response $response, $args) {
    $response->getBody()->write("Hello world!");
    return $response;
});

$app->get('/api/health', function (Request $request, Response $response, $args) {
    $response->getBody()->write("API HEALTHY");
    return $response;
});

$app->get('/api/random-location', function (Request $request, Response $response, $args) {
    $mapillary = new MapillaryService($_ENV['MAPILLARY_TOKEN']);
    $data = $mapillary->getRandomImage();

    $response->getBody()->write(json_encode($data));
    return $response->withHeader('Content-Type', 'application/json');
});

$app->put('/api/startgame', function ($request, $response, array $args) {
    $mapillary = new MapillaryService($_ENV['MAPILLARY_TOKEN']);
    $userService = $this->get(UserService::class);
    $game = new GameService($mapillary, $userService);

    $gameData = $game->start();

    $response->getBody()->write(json_encode($gameData));
    return $response->withHeader('Content-Type', 'application/json');
});

$app->get('/api/users', function (Request $request, Response $response, $args) {
    $userService = $this->get(UserService::class);
    $users = $userService->getAll();

    $response->getBody()->write(json_encode($users));
    return $response->withHeader('Content-Type', 'application/json');
});

$app->post('/api/users', function (Request $request, Response $response, $args) {
    $userService = $this->get(UserService::class);

    $data = json_decode(
        $request->getBody()->getContents(),
        true
    );

    $name = $data['name'];
    $password = $data['password'];

    $success = $userService->addUser($name, $password);

    if ($success) {

        $response->getBody()->write(json_encode(['message' => 'User Successfully Created']));
    }

    return $response->withHeader('Content-Type', 'application/json');
});

$app->post('/api/login', function (Request $request, Response $response) {
    $data = json_decode($request->getBody()->getContents(), true);

    $userService = $this->get(UserService::class);
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

$app->run();
