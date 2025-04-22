<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Map</title>
    <link rel="stylesheet" href="https://unpkg.com/ol/ol.css">
    <link rel="stylesheet" href="assets/map.css">
    <script src="https://unpkg.com/ol/dist/ol.js"></script>
</head>

<body>

    <div id="vue_map">
        <div id="map"></div>
        <div id=event_data_scroll_box class="scroll-box">
            <div id=event_data v-html="event_text"></div>
            <button id=more_info_button v-if="info_button">More information</button>
        </div>
    </div>  

    <script src="https://cdn.jsdelivr.net/npm/vue"></script>
    <script src="assets/map.js"></script> 
    
</body>
</html>