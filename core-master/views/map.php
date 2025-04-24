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
            <button id=more_info_button v-if="more_info_button" @click="more_infos_page">More information</button>
            <div id="zoom_auto_checkbox" v-if="more_info_button">
                <label>Zoom sur l'emprise<input  @input="change_zoom_auto" type="checkbox" v-model="zoom_auto"></label>
            </div>
            <button id=back_to_map_button v-if="back_to_map_button" @click="back_to_map">Back to map</button>
            <div id=event_data v-html="event_text"></div>
        </div>
    </div>  

    <script src="https://cdn.jsdelivr.net/npm/vue"></script>
    <script src="assets/map.js"></script> 
    
</body>
</html>