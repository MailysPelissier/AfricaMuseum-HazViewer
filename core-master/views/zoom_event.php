<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Event</title>
    <link rel="stylesheet" href="https://unpkg.com/ol/ol.css">
    <link rel="stylesheet" href="assets/map.css">
    <script src="https://unpkg.com/ol/dist/ol.js"></script>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap/dist/css/bootstrap.min.css">
</head>

<body>

    <div id="vue_map">

        <!-- Récupération de l'identifiant de l'évènement depuis la carte principale -->
        <div id="app" data-event_id="<?php echo htmlspecialchars($event_id, ENT_QUOTES, 'UTF-8'); ?>"></div>

        <div id="map" class="margin">
        </div>

        <div id=event_data_scroll_box class="scroll_box margin padding">

            <div id=event_title class=title v-if="selected_event">Event:</div>

            <div id=event_data v-html="event_main_text"></div>

            <div id="other_data_checkbox" v-if="selected_event">
                <label>Show other information: <input type="checkbox" v-model="other_information"></label>
            </div>
            <div id=event_other_data v-html="event_other_text" v-if="other_information"></div>

            <div id="location_data_checkbox" v-if="selected_event">
                <label>Show location information: <input type="checkbox" v-model="location_information"></label>
            </div>
            <div id=event_location_data v-html="event_location_text" v-if="location_information"></div>

            <div id="number_data_checkbox" v-if="selected_event">
                <label>Show more statistics: <input type="checkbox" v-model="number_information"></label>
            </div>
            <div id=event_number_data v-html="event_number_text" v-if="number_information"></div>

            <div class="flexrow space_evenly padding">
                <button id=more_info_button v-if="more_info_button" @click="more_infos_page">More information</button>
                <div id="zoom_auto_checkbox" v-if="more_info_button">
                    <label>Automatic zoom: <input type="checkbox" v-model="zoom_auto"></label>
                </div>
                <button id=back_to_map_button v-if="back_to_map_button" @click="back_to_map">Back to map</button>
            </div>

        </div>

        <div id=paragraph_data_scroll_box class="scroll_box margin padding">

            <div id=paragraph_title  class=title v-if="selected_paragraph">Paragraph:</div>
            <div id=paragraph_data v-html="paragraph_text" v-if="selected_paragraph"></div>

        </div>

        <div id=popup_pointermove class="popup petit_popup scroll_box"></div>

        <div id=popup_clic class="popup petit_popup scroll_box"></div>

    </div>  

    <script src="https://cdn.jsdelivr.net/npm/vue"></script>
    <script src="assets/zoom_event.js"></script> 
    
</body>
</html>