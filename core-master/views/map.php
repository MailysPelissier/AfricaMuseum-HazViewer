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
        <div id="map">
            <div id="form_changer_style">
                <h3>Change style</h3>
                <label>Color style: </label>
                <select v-model="color_style">
                    <option value="Standard">Standard</option>
                    <option value="Event_type">Event type</option>
                </select>
                <br><br>
                <div id="color_standard" v-if="color_style ==='Standard'">
                    <label>All events: </label>
                    <input type="color" class="color_input" v-model="color_standard">
                </div>
                <div id="color_eventtype" v-if="color_style ==='Event_type'">
                    <label>Flood: </label>
                    <input type="color" class="color_input" v-model="color_flood">
                    <label>Flash flood: </label>
                    <input type="color" class="color_input" v-model="color_flashflood">
                    <label>Landslide: </label>
                    <input type="color" class="color_input" v-model="color_landslide">
                </div>
                <br><br>
                <label>Size style: </label>
                <select v-model="size_style">
                    <option value="Standard">Standard</option>
                    <option value="Max_death">Max death</option>
                </select>
                <br><br>
                <div id="size_standard" v-if="size_style ==='Standard'">
                    <label>All events: </label>
                    <input type="range" min="0" max="15" class="slider" v-model="size_standard">
                    <span>{{size_standard}}</span>
                </div>
                <div id="size_maxdeath" v-if="size_style === 'Max_death'">
                    <div v-for="step in size_death">
                        <label>{{step.label}} :</label>
                        <input type="range" min="0" max="15" class="slider" v-model="step.size">
                        <span>{{step.size}}</span>
                    </div>
                </div>
                <br><br>
                <div class="buttons">
                    <button id="change_style" @click="change_style">Apply</button>
                    <button id="cancel" @click="fermer_form_changer_style">OK</button>
                </div>
            </div>
        </div>
        <div id=event_data_scroll_box class="scroll_box">
            <div id=event_title class=title v-if="selected_event">Event:</div>
            <div id=event_data v-html="event_text"></div>
            <div id="location_data_checkbox" v-if="selected_event">
                <label>Show location information<input @input="change_locations_information" type="checkbox" v-model="location_information"></label>
            </div>
            <div id=event_location_data v-html="event_location_text" v-if="location_information"></div>
            <div class="buttons">
                <button id=more_info_button v-if="more_info_button" @click="more_infos_page">More information</button>
                <div id="zoom_auto_checkbox" v-if="more_info_button">
                    <label>Automatic zoom<input @input="change_zoom_auto" type="checkbox" v-model="zoom_auto"></label>
                </div>
                <button id=back_to_map_button v-if="back_to_map_button" @click="back_to_map">Back to map</button>
            </div>
        </div>
        <div id=paragraph_data_scroll_box class="scroll_box">
            <div id=paragraph_title  class=title v-if="selected_paragraph">Paragraph:</div>
            <div id=paragraph_data v-html="paragraph_text" v-if="selected_paragraph"></div>
        </div>
        <div id=popup_pointermove class=popup></div>
        <div id=popup_clic class=popup></div>
        <div id=changer_style_div class='ol-unselectable ol-control'>
            <button id=changer_style_button @click="afficher_form_changer_style">Change style</button>
        </div>
    </div>  

    <script src="https://cdn.jsdelivr.net/npm/vue"></script>
    <script src="assets/map.js"></script> 
    
</body>
</html>