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
            <!-- Boîte de dialogue pour entrer les infos du signalement -->
        <div id="entrerInfosSignalement" style="display:none; position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); background:white; padding:15px; border-radius:8px; box-shadow:0px 0px 10px rgba(0,0,0,0.3); z-index: 1000;;">
            <h3>Créer un signalement</h3>
            <label for="theme">Thème :</label>
            <select id="theme">
                <option value="Erreur itinéraire bois ronds">Erreur Itinéraire Bois Rond</option>
                <option value="Erreur desserte forestière">Erreur Desserte Forestière</option>
                <option value="Autres">Autres</option>
            </select>
            <br><br>
            <label for="comment">Commentaire :</label>
            <textarea id="comment" rows="3" cols="30"></textarea>
            <br><br>
            <button id="envoyerSignalement">Envoyer</button>
            <button id="annulerSignalement">Annuler</button>
        </div>
        </div>
        <div id=event_data_scroll_box>
            <div id=event_title class=title v-if="selected_event">Event:</div>
            <div id=event_data v-html="event_text"></div>
            <div id="location_data_checkbox" v-if="selected_event">
                <label>Show location information<input @input="change_locations_information" type="checkbox" v-model="location_information"></label>
            </div>
            <div id=event_location_data v-html="event_location_text" v-if="location_information"></div>
            <div id=top_buttons>
                <button id=more_info_button v-if="more_info_button" @click="more_infos_page">More information</button>
                <div id="zoom_auto_checkbox" v-if="more_info_button">
                    <label>Automatic zoom<input @input="change_zoom_auto" type="checkbox" v-model="zoom_auto"></label>
                </div>
                <button id=back_to_map_button v-if="back_to_map_button" @click="back_to_map">Back to map</button>
            </div>
        </div>
        <div id=paragraph_data_scroll_box>
            <div id=paragraph_title  class=title v-if="selected_paragraph">Paragraph:</div>
            <div id=paragraph_data v-html="paragraph_text" v-if="selected_paragraph"></div>
        </div>
        <div id=popup_pointermove class=popup></div>
        <div id=popup_clic class=popup></div>
        <div id=changer_style_div class='changer_style_div ol-unselectable ol-control'>
            <button id=changer_style_button class='changer_style_button' @click="form_changer_style">Change style</button>
        </div>
    </div>  

    <script src="https://cdn.jsdelivr.net/npm/vue"></script>
    <script src="assets/map.js"></script> 
    
</body>
</html>