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
        longitude, rang, min_lat, max_lat, min_lon, max_lon, squared_distance
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

// Accès aux données events de Postgres
Flight::route('GET /postgres/events', function () {

    // Connection à la bdd webGIS (Postgres)
    $link = pg_connect("host=localhost port=5432 dbname=webGIS user=postgres password=password");

    // Renvoie les informations des events dans la bbox
    if (isset($_GET['min_lon']) and !empty($_GET['min_lon']) and isset($_GET['min_lat']) and !empty($_GET['min_lat']) 
    and isset($_GET['max_lon']) and !empty($_GET['max_lon']) and isset($_GET['max_lat']) and !empty($_GET['max_lat'])) {
        $min_lon = $_GET['min_lon'];
        $min_lat = $_GET['min_lat'];
        $max_lon = $_GET['max_lon'];
        $max_lat = $_GET['max_lat'];
        $reponse = pg_query($link, "SELECT event_id,hazard_type,disaster_score,hasard_type_score,latitude,longitude,event_time,
        bbox,n_languages,n_source_countries,paragraphs_list,articles_list,n_paragraphs,n_articles,start_time,end_time,duration,
        mostfreq_death,n_mostfreq_death,time_mostfreq_death,max_death,n_max_death,time_max_death,median_death,mostfreq_homeless,
        n_mostfreq_homeless,time_mostfreq_homeless,max_homeless,n_max_homeless,time_max_homeless,median_homeless,mostfreq_injured,
        n_mostfreq_injured,time_mostfreq_injured,max_injured,n_max_injured,time_max_injured,median_injured,mostfreq_affected,
        n_mostfreq_affected,time_mostfreq_affected,max_affected,n_max_affected,time_max_affected,median_affected,mostfreq_missing,
        n_mostfreq_missing,time_mostfreq_missing,max_missing,n_max_missing,time_max_missing,median_missing,mostfreq_evacuated,
        n_mostfreq_evacuated,time_mostfreq_evacuated,max_evacuated,n_max_evacuated,time_max_evacuated,median_evacuated,
        ipcc_region,ipcc_continent
        FROM events2021_22_23 WHERE $min_lon<longitude and longitude<$max_lon and $min_lat<latitude and latitude<$max_lat
        and event_time > '01/01/2023'");
        $resultats = pg_fetch_all($reponse, PGSQL_ASSOC);
        $events = [];
        if ($resultats !== false) {
            foreach($resultats as $r) {
                $events[] = $r;
            };
        }
    };

    Flight::json($events);
});

// Accès aux données paragraphs de Postgres
Flight::route('GET /postgres/paragraphs', function () {

    // Connection à la bdd webGIS (Postgres)
    $link = pg_connect("host=localhost port=5432 dbname=webGIS user=postgres password=password");

    // Renvoie les informations des paragraphs dans la bbox
    if (isset($_GET['paragraphs_list']) and !empty($_GET['paragraphs_list'])) {
        $paragraphs_list = $_GET['paragraphs_list'];
        $reponse = pg_query($link, "SELECT article_id, title, extracted_text, event_time, char_language, source_country, 
        site_domain, paragraph_id, disaster_label, disaster_score, hasard_type, hasard_type_score, nb_death, score_death, 
        answer_death, nb_homeless, score_homeless, answer_homeless, nb_injured, score_injured, answer_injured, nb_affected, 
        score_affected, answer_affected, nb_missing, score_missing, answer_missing, nb_evacuated, score_evacuated, answer_evacuated, 
        char_location, ner_score, latitude, longitude, std_dev, min_lat, max_lat, min_lon, max_lon, n_locations, publication_time, 
        original_text 
        FROM paragraphs2023 WHERE paragraph_id IN $paragraphs_list");
        $resultats = pg_fetch_all($reponse, PGSQL_ASSOC);
        $paragraphs = [];
        if ($resultats !== false) {
            foreach($resultats as $r) {
                $paragraphs[] = $r;
            };
        }
    };

    Flight::json($paragraphs);
});

Flight::start();
?>