<?php

declare(strict_types=1);
require 'flight/Flight.php';

session_start();

// Page de la carte
Flight::route('GET /', function () {
    Flight::render('map');
});

// Accès aux données locations de Postgres
Flight::route('GET /postgres/locations', function () {

    // Connection à la bdd webGIS (Postgres)
    $link = pg_connect("host=localhost port=5432 dbname=webGIS user=postgres password=password");

    // Renvoie les informations des locations dans la bbox
    if (isset($_GET['min_lon']) and !empty($_GET['min_lon']) and isset($_GET['min_lat']) and !empty($_GET['min_lat']) 
    and isset($_GET['max_lon']) and !empty($_GET['max_lon']) and isset($_GET['max_lat']) and !empty($_GET['max_lat'])) {
        $min_lon = $_GET['min_lon'];
        $min_lat = $_GET['min_lat'];
        $max_lon = $_GET['max_lon'];
        $max_lat = $_GET['max_lat'];
        $reponse = pg_query($link, "SELECT location_id, article_id, paragraph_id, char_location, latitude, 
        longitude, rang, min_lat, max_lat, min_lon, max_lon, squared_distance, ST_AsGeoJson(geom) AS geom
        FROM locations2023 WHERE $min_lon<longitude and longitude<$max_lon and $min_lat<latitude and latitude<$max_lat");
        $resultats = pg_fetch_all($reponse, PGSQL_ASSOC);
        $locations = [];
        if ($resultats !== false) {
            foreach($resultats as $r) {
                $locations[] = $r;
            };
        }
    };

    Flight::json($locations);
});

Flight::start();
?>