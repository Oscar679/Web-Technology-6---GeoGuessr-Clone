<?php

namespace App\Services;

use App\Services\MapillaryService;
use App\Services\UserService;

class GameService
{
    private string $id;
    private MapillaryService $mapillary;
    private UserService $user;

    public function __construct(MapillaryService $mapillary, UserService $user)
    {
        $this->id = $this->generateId();
        $this->mapillary = $mapillary;
        $this->user = $user;
    }

    private function generateId(): string
    {
        return bin2hex(random_bytes(16));
    }

    public function start(): array
    {
        $images = $this->mapillary->getRandomImage();

        return [
            'id' => $this->id,
            'images' => $images,
            'user' => $this->user->getCurrentUser()
        ];
    }
}
