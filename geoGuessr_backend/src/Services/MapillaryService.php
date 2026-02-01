<?php

namespace App\Services;

use GuzzleHttp\Client;

class MapillaryService
{
    private string $token;
    private string $baseUrl = 'https://graph.mapillary.com';
    private Client $http;
    private array $locations;

    public function __construct(string $token)
    {
        $this->token = $token;
        $this->http = new Client();

        // Major European cities with excellent Mapillary coverage
        $this->locations = [
            ['lat' => 52.5200, 'lng' => 13.4050], // Berlin
            ['lat' => 48.8566, 'lng' => 2.3522],  // Paris
            ['lat' => 52.3676, 'lng' => 4.9041],  // Amsterdam
            ['lat' => 50.8503, 'lng' => 4.3517],  // Brussels
            ['lat' => 48.2082, 'lng' => 16.3738], // Vienna
            ['lat' => 50.1109, 'lng' => 8.6821],  // Frankfurt
            ['lat' => 51.2277, 'lng' => 6.7735],  // Düsseldorf
            ['lat' => 53.5511, 'lng' => 9.9937],  // Hamburg
            ['lat' => 48.1351, 'lng' => 11.5820], // Munich
            ['lat' => 45.4642, 'lng' => 9.1900],  // Milan
            ['lat' => 41.9028, 'lng' => 12.4964], // Rome
            ['lat' => 55.6761, 'lng' => 12.5683], // Copenhagen
            ['lat' => 59.9139, 'lng' => 10.7522], // Oslo
            ['lat' => 60.1699, 'lng' => 24.9384], // Helsinki
            ['lat' => 51.5074, 'lng' => -0.1278], // London
            ['lat' => 40.4168, 'lng' => -3.7038], // Madrid
            ['lat' => 41.3851, 'lng' => 2.1734],  // Barcelona
            ['lat' => 47.3769, 'lng' => 8.5417],  // Zurich
            ['lat' => 50.0755, 'lng' => 14.4378], // Prague
            ['lat' => 52.2297, 'lng' => 21.0122], // Warsaw
        ];
    }

    public function getRandomImage(int $count = 5): array
    {
        $results = [];
        for ($i = 0; $i < $count; $i++) {
            $location = $this->locations[array_rand($this->locations)];
            $delta = 0.005; // Smaller delta in order to avoid 'image not found exception'

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

            $duplicate = false;
            for ($j = 0; $j < count($results); $j++) {
                if (($results[$j]['lat'] - $image['geometry']['coordinates'][1]) < 0.0001 && ($results[$j]['lng'] - $image['geometry']['coordinates'][0]) < 0.0001) {
                    $duplicate = true;
                }
            }

            if ($duplicate) {
                $i--;
                continue;
            }

            $results[] = [
                'imageUrl' => $image['thumb_1024_url'],
                'lat' => $image['geometry']['coordinates'][1],
                'lng' => $image['geometry']['coordinates'][0],
            ];
        }
        return $results;
    }
}
