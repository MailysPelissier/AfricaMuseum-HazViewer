<?php

declare(strict_types=1);
require 'flight/Flight.php';

session_start();

// Page de la carte
Flight::route('GET /', function () {
    Flight::render('map');
});

// Page zoom sur un event
Flight::route('GET /event', function () {
    // Récupération de l'identifiant de l'évènement
    $event_id = Flight::request()->query['event_id'];
    Flight::render('zoom_event', ['event_id' => $event_id]);
});

Flight::start();

?>