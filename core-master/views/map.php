<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Map</title>
    <link rel="stylesheet" href="https://unpkg.com/ol/ol.css">
    <link rel="stylesheet" href="assets/map.css">
    <script src="https://unpkg.com/ol/dist/ol.js"></script>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap/dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css">
</head>

<body>

    <div id="vue_map">

        <div id="map" class="margin">

            <div id="form_changer_style" class="popup grand_popup hauteur_max scroll_box" v-if="show_changer_style_form">

                <div id="top_form" class="flexrow space_between padding">
                    <h5>Change style</h5>
                    <button class="vertical_center" @click="change_true_false(['show_changer_style_form'])">&#215;</button>
                </div>

                <br>

                <div id="choix_couleur" class="padding">
                    <label>Color style:
                        <select class="margin_left" v-model="color_style">
                            <option value="Standard">Standard</option>
                            <option value="Event_type">Hazard type</option>
                        </select>
                    </label>
                </div>

                <div id="color_standard" class="flexrow padding" v-if="color_style ==='Standard'">
                    <div class="vertical_center">All events:</div>
                    <input type="color" class="color_input margin_left" v-model="color_standard">
                </div>

                <div id="color_eventtype" class="padding" v-if="color_style ==='Event_type'">
                    <div class="flexrow">
                        <div class="vertical_center">Flood:</div>
                        <input type="color" class="color_input margin_left" v-model="color_flood">
                    </div>
                    <div class="flexrow">
                        <div class="vertical_center">Flash flood:</div>
                        <input type="color" class="color_input margin_left" v-model="color_flashflood">
                    </div>
                    <div class="flexrow">
                        <div class="vertical_center">Landslide:</div>
                        <input type="color" class="color_input margin_left" v-model="color_landslide">
                    </div>
                </div>

                <hr />

                <div id="choix_taille" class="padding">
                    <label>Size style:
                        <select class="margin_left" v-model="size_style">
                            <option value="Standard">Standard</option>
                            <option value="Median_death">Median death</option>
                        </select>
                    </label>
                </div>

                <div id="size_standard" class="flexrow padding" v-if="size_style ==='Standard'">
                    <div class="vertical_center">All events:</div>
                    <input type="range" min="0" max="15" class="slider margin_left" v-model="size_standard">
                    <span class="margin_left">{{size_standard}}</span>
                </div>

                <div id="size_mediandeath" class="padding" v-if="size_style === 'Median_death'">
                    <div class="flexrow margin" v-for="step in size_death">
                        <div class="vertical_center">{{step.label}}:</div>
                        <input type="range" min="0" max="15" class="slider margin_left" v-model="step.size">
                        <span class="margin_left">{{step.size}}</span></label>
                    </div>
                </div>

                <br>

                <div class="flexrow space_evenly padding">
                    <button id="change_style" @click="change_style">Apply</button>
                    <button id="cancel" @click="change_true_false(['show_changer_style_form'])">Close</button>
                </div>

            </div>

            <div id="form_filter" class="popup grand_popup hauteur_max scroll_box" v-if="show_filter_form">

                <div id="top_form" class="flexrow space_between padding">
                    <h5>Filter</h5>
                    <button class="vertical_center" @click="change_true_false(['show_filter_form'])">&#215;</button>
                </div> 

                <br>

                <button id="event_type_button" class="flexrow space_between padding largeur_min" @click="change_true_false(['show_general_menu','show_event_type_filter'])" v-if="show_general_menu">
                    <h6>Hazard type</h6>
                    <div class="vertical_center">&#62;</div>
                </button>

                <hr style='margin:0' v-if="show_general_menu" />

                <button id="date_button" class="flexrow space_between padding largeur_min" @click="display_date_filter" v-if="show_general_menu">
                    <h6>Date</h6>
                    <div class="vertical_center">&#62;</div>
                </button>

                <hr style='margin:0' v-if="show_general_menu" />

                <button id="casualties_button" class="flexrow space_between padding largeur_min" @click="change_true_false(['show_general_menu','show_casualties_filter'])" v-if="show_general_menu">
                    <h6>Casualties</h6>
                    <div class="vertical_center">&#62;</div>
                </button>

                <hr style='margin:0' v-if="show_general_menu" />

                <button id="popularity_button" class="flexrow space_between padding largeur_min" @click="change_true_false(['show_general_menu','show_popularity_filter'])" v-if="show_general_menu">
                    <h6>Popularity</h6>
                    <div class="vertical_center">&#62;</div>
                </button>
                
                <div id="event_type_filter" class="flexrow space_between padding largeur_min" v-if="show_event_type_filter">
                    <div class="vertical_center">
                        <button class='back_button' @click="change_true_false(['show_general_menu','show_event_type_filter'])">&#60;</button>
                    </div>
                    <div id="event_type_field">
                        <div class="title">Hazard type filter:</div>
                        <div id="flood">
                            <label>Flood: <input type="checkbox" v-model="flood"></label>
                        </div>  
                        <div id="flashflood">
                            <label>Flash flood: <input type="checkbox" v-model="flashflood"></label>
                        </div>
                        <div id="landslide">
                            <label>Landslide: <input type="checkbox" v-model="landslide"></label>
                        </div>         
                    </div>  
                    <div class='back_button'></div>
                </div>

                <div id="date_filter" class="flexrow space_between padding largeur_min" v-if="show_date_filter">
                    <div class="vertical_center">
                        <button class='back_button' @click="display_date_filter">&#60;</button>
                    </div>
                    <div id="date_field">
                        <div class="title">Date filter:</div>
                        <div id="start_date">
                            <label>Start date: <input class="flatpickr flatpickr-input" type="text" placeholder="Select Date.." data-id="start_date"></label>
                        </div>
                        <div id="end_date">
                            <label>End date: <input class="flatpickr flatpickr-input" type="text" placeholder="Select Date.." data-id="end_date"></label>
                        </div>
                    </div>  
                    <div class='back_button'></div>
                </div>

                <div id="casualties_filter" class="flexrow space_between padding largeur_min" v-if="show_casualties_filter">
                    <div class="vertical_center">
                        <button class='back_button' @click="change_true_false(['show_general_menu','show_casualties_filter'])">&#60;</button>
                    </div>
                    <div id="casualties_field" class="margin">
                        <div class="title">Casualties filter:</div>
                        <div id="median_death">Median death:</div>
                        <div>
                            <label>Show null values: <input type="checkbox" v-model="median_death_null"></label>
                        </div>
                        <div>
                            <label>Min: <input class="input_number" type="text" :min="median_death_min_depart" :max="median_death_max_depart" v-model="median_death_min" @beforeinput="(event) => validateInput(event, median_death_min_depart, median_death_max_depart)"/></label>
                            <label class="margin_left">Max: <input class="input_number" type="text" :min="median_death_min_depart" :max="median_death_max_depart" v-model="median_death_max" @beforeinput="(event) => validateInput(event, median_death_min_depart, median_death_max_depart)"/></label>
                        </div>
                        <div id="median_injured">Median injured:</div>
                        <div>
                            <label>Show null values: <input type="checkbox" v-model="median_injured_null"></label>
                        </div>
                        <div>
                            <label>Min: <input class="input_number" type="text" :min="median_injured_min_depart" :max="median_injured_max_depart" v-model="median_injured_min" @beforeinput="(event) => validateInput(event, median_injured_min_depart, median_injured_max_depart)"/></label>
                            <label class="margin_left">Max: <input class="input_number" type="text" :min="median_injured_min_depart" :max="median_injured_max_depart" v-model="median_injured_max" @beforeinput="(event) => validateInput(event, median_injured_min_depart, median_injured_max_depart)"/></label>
                        </div>
                    </div>  
                    <div class='back_button'></div>
                </div>

                <div id="popularity_filter" class="flexrow space_between padding largeur_min" v-if="show_popularity_filter">
                    <div class="vertical_center">
                        <button class='back_button' @click="change_true_false(['show_general_menu','show_popularity_filter'])">&#60;</button>
                    </div>
                    <div id="popularity_field" class="margin">
                        <div class="title">Popularity filter:</div>
                        <div id="n_articles">Number of articles:</div>
                        <div>
                            <label>Min: <input class="input_number" type="text" :min="n_articles_min_depart" :max="n_articles_max_depart" v-model="n_articles_min" @beforeinput="(event) => validateInput(event, n_articles_min_depart, n_articles_max_depart)"/></label>
                            <label class="margin_left">Max: <input class="input_number" type="text" :min="n_articles_min_depart" :max="n_articles_max_depart" v-model="n_articles_max" @beforeinput="(event) => validateInput(event, n_articles_min_depart, n_articles_max_depart)"/></label>
                        </div>
                        <div id="n_paragraphs">Number of paragraphs:</div>
                        <div>
                            <label>Min: <input class="input_number" type="text" :min="n_paragraphs_min_depart" :max="n_paragraphs_max_depart" v-model="n_paragraphs_min" @beforeinput="(event) => validateInput(event, n_paragraphs_min_depart, n_paragraphs_max_depart)"/></label>
                            <label class="margin_left">Max: <input class="input_number" type="text" :min="n_paragraphs_min_depart" :max="n_paragraphs_max_depart" v-model="n_paragraphs_max" @beforeinput="(event) => validateInput(event, n_paragraphs_min_depart, n_paragraphs_max_depart)"/></label>
                        </div>
                    </div>  
                    <div class='back_button'></div>
                </div>

                <br>

                <div class="flexrow space_evenly padding">
                    <button id="apply" @click="appliquer_filtres">Apply</button>
                    <button id="cancel" @click="change_true_false(['show_filter_form'])">Close</button>
                </div>

            </div>

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

        <div id=outil_filtrage_div class='ol-unselectable ol-control'>
            <button id=outil_filtrage_button @click="setup_filter_form">Filter</button>
        </div>

        <div id=changer_style_div class='ol-unselectable ol-control'>
            <button id=changer_style_button @click="change_true_false(['show_changer_style_form'])">Change style</button>
        </div>

    </div>  

    <script src="https://cdn.jsdelivr.net/npm/vue"></script>
    <script src="https://cdn.jsdelivr.net/npm/flatpickr"></script>
    <script src="assets/map.js"></script> 
    
</body>
</html>