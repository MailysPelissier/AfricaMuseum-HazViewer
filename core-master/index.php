<?php

declare(strict_types=1);
require 'flight/Flight.php';

session_start();

// Page d'accueil / de connection
Flight::route('GET /', function () {
    // Vider la session
    $_SESSION = [];
    Flight::render('accueil');
});

Flight::route('GET /postgres/locations', function () {

    // Connection à la bdd webGIS (Postgres)
    $link = pg_connect("host=localhost port=5432 dbname=webGIS user=postgres password=password");
    
    $reponse = pg_query($link, "SELECT location_id, article_id, paragraph_id, char_location, latitude, 
    longitude, rang, min_lat, max_lat, min_lon, max_lon, squared_distance, ST_AsGeoJson(geom) AS geom
    FROM locations2023 WHERE location_id=3");
    $resultats = pg_fetch_all($reponse, PGSQL_ASSOC);
    $objets = [];
    foreach($resultats as $r) {
        $objets[] = $r;
    };

    Flight::json($objets);
});

Flight::start();
?>