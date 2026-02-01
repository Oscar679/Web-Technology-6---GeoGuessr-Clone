<?php

namespace App\Services;

use GuzzleHttp\Client;

class MapillaryService
{
    private string $token;
    private string $baseUrl = 'https://graph.mapillary.com';
    private Client $http;

    public function __construct(string $token)
    {
        $this->token = $token;
        $this->http = new Client();
    }

    public function getRandomImage(): array
    {
        // Swedish cities/towns with good Mapillary coverage
        $locations = [
            ['lat' => 59.3293, 'lng' => 18.0686], // Stockholm
            ['lat' => 57.7089, 'lng' => 11.9746], // Göteborg
            ['lat' => 55.6050, 'lng' => 13.0038], // Malmö
            ['lat' => 59.8586, 'lng' => 17.6389], // Uppsala
            ['lat' => 58.4108, 'lng' => 15.6214], // Linköping
            ['lat' => 57.7826, 'lng' => 14.1618], // Jönköping
            ['lat' => 59.2753, 'lng' => 15.2134], // Örebro
            ['lat' => 56.0465, 'lng' => 12.6945], // Helsingborg
            ['lat' => 58.5877, 'lng' => 16.1924], // Norrköping
            ['lat' => 55.5600, 'lng' => 12.9982], // Lund
            ['lat' => 63.8258, 'lng' => 20.2630], // Umeå
            ['lat' => 60.6749, 'lng' => 17.1413], // Gävle
            ['lat' => 56.6640, 'lng' => 16.3568], // Kalmar
            ['lat' => 58.3806, 'lng' => 12.3252], // Trollhättan
            ['lat' => 65.5848, 'lng' => 22.1547], // Luleå
            ['lat' => 57.6348, 'lng' => 18.2948], // Visby
            ['lat' => 62.3908, 'lng' => 17.3069], // Sundsvall
            ['lat' => 56.8791, 'lng' => 14.8059], // Växjö
            ['lat' => 59.6099, 'lng' => 16.5448], // Västerås
            ['lat' => 67.8558, 'lng' => 20.2253], // Kiruna
        ];

        $location = $locations[array_rand($locations)];
        $delta = 0.003; // Small bbox to stay under Mapillary's 0.01 sq deg limit

        $bbox = implode(',', [
            $location['lng'] - $delta,
            $location['lat'] - $delta,
            $location['lng'] + $delta,
            $location['lat'] + $delta,
        ]);

        // Fetch image IDs in bounding box
        $response = $this->http->get("{$this->baseUrl}/images", [
            'query' => [
                'access_token' => $this->token,
                'fields' => 'id',
                'bbox' => $bbox,
                'limit' => 50,
            ]
        ]);

        $data = json_decode($response->getBody(), true);

        if (empty($data['data'])) {
            throw new \Exception('No images found in this area');
        }

        $ids = array_column($data['data'], 'id');
        $randomId = $ids[array_rand($ids)];

        // Fetch image details
        $response = $this->http->get("{$this->baseUrl}/{$randomId}", [
            'query' => [
                'access_token' => $this->token,
                'fields' => 'thumb_1024_url,geometry',
            ]
        ]);

        $image = json_decode($response->getBody(), true);

        return [
            'imageUrl' => $image['thumb_1024_url'],
            'lat' => $image['geometry']['coordinates'][1],
            'lng' => $image['geometry']['coordinates'][0],
        ];
    }
}
