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
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/ol-layerswitcher@4.1.2/dist/ol-layerswitcher.css" />
</head>

<body>

    <div id="vue_map">

        <!-- Récupération de l'identifiant de l'évènement depuis la carte principale -->
        <div id="app" data-event_id="<?php echo htmlspecialchars($event_id, ENT_QUOTES, 'UTF-8'); ?>"></div>

        <div id="map" class="margin">

            <div id=loading_popup class="popup center_popup">Loading...</div>

            <div id="form_time_series" class="time_series_form popup scroll_box"  v-if="show_time_series_form">

                <div id="top_form" class="flexrow space_between padding">
                    <h5>Time series</h5>
                    <button class="vertical_center" @click="setup_time_series_form">&#215;</button>
                </div> 

                <div id=choix_time_series class="flexrow space_evenly padding">
                    <button class="btn btn-secondary" type="button" v-if=show_time_series_minute>By minute</button>
                    <button class="btn btn-outline-secondary" type="button" v-if=show_time_series_minute @click="setup_time_series_change_menu">By day</button>
                    <button class="btn btn-outline-secondary" type="button" v-if=show_time_series_jour @click="setup_time_series_change_menu">By minute</button>
                    <button class="btn btn-secondary" type="button" v-if=show_time_series_jour>By day</button>
                </div>

                <div id="time_series_minute_plot" v-if="show_time_series_minute"></div>

                <div id="time_series_jour_plot" v-if="show_time_series_jour"></div>

            </div>

            <div id="form_download" class="form popup scroll_box" v-if="show_download_form">

                <div id="top_form" class="flexrow space_between padding">
                    <h5>Download data</h5>
                    <button class="vertical_center" @click="setup_download_form">&#215;</button>
                </div> 

                <br>

                <div class="padding min_width">
                    <div id="event">
                        <label>Event: <input type="checkbox" v-model="download_e" @click=checkbox_download(download_e)></label>
                    </div> 
                    <div id="paragraphs">
                        <label>Paragraphs: <input type="checkbox" v-model="download_p" @click=checkbox_download(download_p)></label>
                    </div>  
                    <div id="event_paragraphs">
                        <label>Event and paragraphs: <input type="checkbox" v-model="download_e_p" @click=checkbox_download(download_e_p)></label>
                    </div>    
                </div>

                <hr style='margin:5px;' v-if="show_download_progression" />

                <div id="progress" class="padding min_width">
                    <div v-if="show_fetch_progression">{{fetch_progression}}</div>
                    <div v-if="show_download_progression">Prepare download: {{download_progression}}%</div>
                </div>
                
                <br>

                <div class="flexrow space_evenly padding">
                    <button id="download" @click="download">Download</button>
                    <button id="cancel" @click="setup_download_form">Close</button>
                </div>

            </div>

        </div>

        <div id=event_data_zoom_event_scroll_box class="scroll_box margin padding">

            <div id=event_title class=title>Event:</div>

            <div id=event_data v-html="event_main_text"></div>

            <div id="other_data_checkbox">
                <label>Show other information: <input type="checkbox" v-model="other_information"></label>
            </div>
            <div id=event_other_data v-html="event_other_text" v-if="other_information"></div>

            <div id="location_data_checkbox">
                <label>Show location information: <input type="checkbox" v-model="location_information"></label>
            </div>
            <div id=event_location_data v-html="event_location_text" v-if="location_information"></div>

            <div id="number_data_checkbox">
                <label>Show more statistics: <input type="checkbox" v-model="number_information"></label>
            </div>
            <div id=event_number_data v-html="event_number_text" v-if="number_information"></div>

        </div>

        <div id=paragraph_data_scroll_box class="scroll_box margin padding">

            <div id=paragraph_title  class=title v-if="selected_paragraph">Paragraph:</div>
            <div id=paragraph_data v-html="paragraph_text" v-if="selected_paragraph"></div>

        </div>

        <div id=popup_pointermove class="popup small_popup scroll_box"></div>

        <div id=popup_clic class="popup small_popup scroll_box"></div>

        <div id=time_series_div class='bouton_1 ol-unselectable ol-control'>
            <button class=open_form_button @click=setup_time_series_form>Time series</button>
        </div>

        <div id=download_div class='bouton_2 ol-unselectable ol-control'>
            <button class=open_form_button @click=setup_download_form>Download data</button>
        </div>

        <div id=screenshot_div class='bouton_3 ol-unselectable ol-control'>
            <button class=open_form_button @click=download_screenshot>Screenshot</button>
        </div>

        <!-- Bouton qui permet d'activer la localisation -->
        <div id="affichage_location_div" class='ol-unselectable ol-control'>
            <button @click=show_location>&#8857;</button>
        </div>

        <div id="scaleline_div"></div>

    </div>  

    <script src="https://cdn.jsdelivr.net/npm/vue"></script>
    <script src="https://cdn.jsdelivr.net/npm/ol-layerswitcher@4.1.2/dist/ol-layerswitcher.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/dayjs@1/dayjs.min.js"></script>
    <script src="https://cdn.plot.ly/plotly-3.0.1.min.js" charset="utf-8"></script>
    <script src="assets/zoom_event.js"></script> 
    
</body>
</html>