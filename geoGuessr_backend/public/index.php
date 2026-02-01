<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\Factory\AppFactory;

require __DIR__ . '/../vendor/autoload.php';

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

$app->run();
