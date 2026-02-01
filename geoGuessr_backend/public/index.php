<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

use App\Services\MapillaryService;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\Factory\AppFactory;
use Dotenv\Dotenv;

require __DIR__ . '/../vendor/autoload.php';

$dotenv = Dotenv::createImmutable(__DIR__ . '/..');
$dotenv->load();

$app = AppFactory::create(); # Creates Slim application
$app->setBasePath('/oe222ia/geoguessr_backend'); # Required because of manually configuredAlias pathing.

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

$app->run();
