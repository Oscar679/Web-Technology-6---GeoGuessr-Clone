<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class MapillaryService
{
    private string $token;
    private string $url = 'https://graph.mapillary.com/images';

    public function __construct()
    {
        $this->token = config('services.mapillary.token');
    }

    public function fetchImage()
    {
        // Göteborg (bra täckning)
        $lat = 54.7089;
        $lng = 11.9746;
        $delta = 0.0015;


        $bbox = implode(',', [
            $lng - $delta,
            $lat - $delta,
            $lng + $delta,
            $lat + $delta,
        ]);

        $response = Http::get($this->url, [
            'access_token' => $this->token,
            'fields' => 'id',
            'bbox'   => $bbox,
            'limit'  => 10,
        ]);

        $ids = collect($response->json('data'))
            ->pluck('id')
            ->all();

        $id = $ids[array_rand($ids)];


        $image = Http::get("https://graph.mapillary.com/$id", [
            'access_token' => $this->token,
            'fields' => 'thumb_1024_url,geometry',
        ])->json();


        return [
            'imageUrl' => $image['thumb_1024_url'],
            'lat' => $image['geometry']['coordinates'][1],
            'lng' => $image['geometry']['coordinates'][0],
        ];
    }
}
