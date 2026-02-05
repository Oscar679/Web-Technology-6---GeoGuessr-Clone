<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

use App\Services\MapillaryService;
use App\Services\GameService;
use App\Services\UserService;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\Factory\AppFactory;
use Dotenv\Dotenv;

require __DIR__ . '/../vendor/autoload.php';

$dotenv = Dotenv::createImmutable(__DIR__ . '/..');
$dotenv->load();

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
        ->withHeader('Access-Control-Allow-Headers', 'Content-Type');
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
    $user = new UserService();
    $game = new GameService($mapillary, $user);

    $gameData = $game->start();

    $response->getBody()->write(json_encode($gameData));
    return $response->withHeader('Content-Type', 'application/json');
});

$app->run();
