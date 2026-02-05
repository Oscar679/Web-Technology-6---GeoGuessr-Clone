<?php

namespace App\Services;

class UserService
{
    public function getCurrentUser(): array
    {
        return [
            'id' => 'guest',
            'name' => 'Guest'
        ];
    }
}
