<?php

use App\Services\UserService;
use DI\ContainerBuilder;
use Psr\Container\ContainerInterface;
use App\Services\AuthService;
use App\Services\GameService;
use App\Services\MapillaryService;

// establish database connection
return function (ContainerBuilder $builder) {
    $builder->addDefinitions([
        'settings' => function () {
            return require __DIR__ . '/settings.php';
        },

        PDO::class => function (ContainerInterface $c) {
            $db = $c->get('settings')['db'];
            $dsn = "{$db['driver']}:host={$db['host']};dbname={$db['database']};charset={$db['charset']}";
            return new PDO($dsn, $db['username'], $db['password'], $db['options']);
        },

        UserService::class => function (ContainerInterface $container) {
            return new UserService($container->get(PDO::class));
        },

        AuthService::class => function () {
            return new AuthService();
        },

        GameService::class => function (ContainerInterface $c) {
            return new GameService(
                $c->get(MapillaryService::class),
                $c->get(PDO::class)
            );
        },

        MapillaryService::class => function () {
            return new MapillaryService($_ENV['MAPILLARY_TOKEN']);
        }
    ]);
};
