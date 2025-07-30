<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Event</title>
    <link rel="stylesheet" href="https://unpkg.com/ol/ol.css">
    <link rel="stylesheet" href="assets/map.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap/dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/ol-layerswitcher@4.1.2/dist/ol-layerswitcher.css" />
</head>

<body>

    <div id="vue_map">

        <!-- Récupération de l'identifiant de l'évènement depuis la carte principale -->
        <div id="app" data-event_id="<?php echo htmlspecialchars($event_id, ENT_QUOTES, 'UTF-8'); ?>"></div>

        <!-- Carte -->
        <div id="map" class="margin">

            <!-- Fenêtre de chargement -->
            <div id=loading_popup class="popup center_popup">Loading...</div>

            <!-- Fenêtre des séries temporelles -->
            <div id="form_time_series" class="time_series_form popup scroll_box"  v-if="show_time_series_form">

                <div id="top_form" class="flexrow space_between padding">
                    <h5>Time series</h5>
                    <button class="vertical_center" @click="setup_time_series_form">&#215;</button>
                </div> 

                <div id=time_series_type_choice class="flexrow space_evenly padding">
                    <button class="btn btn-secondary" type="button" v-if=show_time_series_event_time>Event time</button>
                    <button class="btn btn-outline-secondary" type="button" v-if=show_time_series_event_time @click="setup_time_series_type_change_menu">Publication time</button>
                    <button class="btn btn-outline-secondary" type="button" v-if=show_time_series_publication_time @click="setup_time_series_type_change_menu">Event time</button>
                    <button class="btn btn-secondary" type="button" v-if=show_time_series_publication_time>Publication time</button>
                </div>

                <div id=time_series_event_time_choice class="flexrow space_evenly padding" v-if=show_time_series_event_time>
                    <button class="btn btn-secondary" type="button" v-if=show_time_series_event_time_minute>By time</button>
                    <button class="btn btn-outline-secondary" type="button" v-if=show_time_series_event_time_minute @click="setup_time_series_event_time_change_menu">By day</button>
                    <button class="btn btn-outline-secondary" type="button" v-if=show_time_series_event_time_day @click="setup_time_series_event_time_change_menu">By time</button>
                    <button class="btn btn-secondary" type="button" v-if=show_time_series_event_time_day>By day</button>
                </div>

                <div id=time_series_publication_time_choice class="flexrow space_evenly padding" v-if=show_time_series_publication_time>
                    <button class="btn btn-secondary" type="button" v-if=show_time_series_publication_time_minute>By time</button>
                    <button class="btn btn-outline-secondary" type="button" v-if=show_time_series_publication_time_minute @click="setup_time_series_publication_time_change_menu">By day</button>
                    <button class="btn btn-outline-secondary" type="button" v-if=show_time_series_publication_time_day @click="setup_time_series_publication_time_change_menu">By time</button>
                    <button class="btn btn-secondary" type="button" v-if=show_time_series_publication_time_day>By day</button>
                </div>

                <div id="time_series_event_time_minute_plot" v-if="show_time_series_event_time_minute"></div>

                <div id="time_series_event_time_day_plot" v-if="show_time_series_event_time_day"></div>

                <div id="time_series_publication_time_minute_plot" v-if="show_time_series_publication_time_minute"></div>

                <div id="time_series_publication_time_day_plot" v-if="show_time_series_publication_time_day"></div>

            </div>

            <!-- Fenêtre de téléchargement des données -->
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
                    <button id="download" @click="download_data">Download</button>
                    <button id="cancel" @click="setup_download_form">Close</button>
                </div>

            </div>

            <!-- Légende de la couche de susceptibilité des tremblements de terre -->
            <div id="landslide_susceptibility_legend" class="popup landslide_susceptibility_legend" v-if="landslide_susceptibility_legend">
                <p>Landslide susceptibility</p>
                <div class=flexrow>
                    <img id="legend" src="assets/legend_landslide_susceptibility.png" />
                    <div class="flexcolumn space_evenly margin_left">    
                        <div>Very high</div>
                        <div>High</div>
                        <div>Moderate</div>
                        <div>Low</div>
                        <div>Very low</div>
                        <div>Null</div>
                    </div>
                </div>            
            </div>

        </div>

        <!-- Logo hazviewer -->
        <div id=hazviewer_title class="logo flexrow space_evenly margin">
            <img id="hazviewer_logo" src="assets/logo_hazviewer.png">
        </div>

        <!-- Texte sur les évènements (en haut à droite) -->
        <div id=event_data_zoom_event_scroll_box class="scroll_box margin padding">

            <div id=event_title class=title>Event:</div>

            <div id=event_data v-html="event_main_text"></div>

            <div id="other_data_checkbox">
                <label>Show other information: <input type="checkbox" v-model="event_other_information"></label>
            </div>
            <div id=event_other_data v-html="event_other_text" v-if="event_other_information"></div>

            <div id="location_data_checkbox">
                <label>Show location information: <input type="checkbox" v-model="event_location_information"></label>
            </div>
            <div id=event_location_data v-html="event_location_text" v-if="event_location_information"></div>

        </div>

        <!-- Texte sur les paragraphes (en bas à droite) -->
        <div id=paragraph_data_scroll_box class="scroll_box margin padding">

            <div id=no_paragraph_selected class="text_center" v-if="!selected_paragraph">Select a paragraph to get more information!</div>

            <div id=paragraph v-if="selected_paragraph">

                <div id=paragraph_title  class=title>Paragraph:</div>

                <div id=paragraph_data v-html="paragraph_main_text"></div>

                <div id="location_data_checkbox">
                    <label>Show location information: <input type="checkbox" v-model="paragraphs_location_information"></label>
                </div>
                <div id=paragraph_location_data v-html="paragraph_location_text" v-if="paragraphs_location_information"></div>

            </div>

            

        </div>

        <!-- Lien vers la page infos hazviewer -->
        <div id=hazviewer_info class="vertical_center margin">
            <div class=font_size_small>
                <div class=underline>Important information:</div><br>
                HazViewer is a joint creation of the Royal Museum for Central Africa and the Vrije Universiteit Brussel (Belgium).<br>
                Before using HazViewer, please read carefully the information provided on <a href="/hazviewer_info" target="_blank">this page</a>. 
                It contains the key descriptions of the tool and the associated databases, including the legal aspects and the references needed for a proper citation.<br>
                The user guide of HazViewer is <a href="assets/user_guide.pdf" target="_blank">available here</a>.<br><br>
                © <a href="https://georiska.africamuseum.be/" target="_blank">Royal Museum for Central Africa</a> / 
                <a href="https://cgis.research.vub.be/" target="_blank">Vrije Universiteit Brussel</a>, 2025
            </div>
        </div>

        <!-- Bulle qui affiche le nombre de paragraphes si plusieurs sont superposés -->
        <div id=popup_pointermove class="popup small_popup scroll_box"></div>

        <!-- Bulle qui permet de sélectionner un paragraphe quand plusieurs sont superposés -->
        <div id=popup_click class="popup small_popup scroll_box"></div>

        <!-- Bouton séries temporelles -->
        <div id=time_series_div class='bouton_1 ol-unselectable ol-control'>
            <button class=open_form_button @click=setup_time_series_form>Time series</button>
        </div>

        <!-- Bouton téléchargement des données -->
        <div id=download_div class='bouton_2 ol-unselectable ol-control'>
            <button class=open_form_button @click=setup_download_form>Download data</button>
        </div>

        <!-- Bouton capture d'écran -->
        <div id=screenshot_div class='bouton_3 ol-unselectable ol-control'>
            <button class=open_form_button @click=download_screenshot>Screenshot</button>
        </div>

        <!-- Bouton de la localisation -->
        <div id="location_div" class='ol-unselectable ol-control'>
            <button @click=show_location>&#8857;</button>
        </div>

        <!-- Bouton pour afficher la légende de la couche de susceptibilité des tremblements de terre -->
        <div id="legend_div" class='ol-unselectable ol-control'>
            <button class=open_form_button @click="change_true_false(['landslide_susceptibility_legend'])">Legend</button>
        </div>

        <!-- Echelle -->
        <div id="scaleline_div"></div>

    </div>  

    <script src="https://cdn.jsdelivr.net/npm/vue"></script>
    <script src="https://unpkg.com/ol/dist/ol.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/ol-layerswitcher@4.1.2/dist/ol-layerswitcher.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/dayjs@1/dayjs.min.js"></script>
    <script src="https://cdn.plot.ly/plotly-3.0.1.min.js" charset="utf-8"></script>
    <script src="assets/zoom_event.js"></script> 
    
</body>
</html>