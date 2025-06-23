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

            <div id="form_changer_style" class="form popup scroll_box" v-if="show_changer_style_form">

                <div id="top_form" class="flexrow space_between padding">
                    <h5>Change style</h5>
                    <button class="vertical_center" @click="change_true_false(['show_changer_style_form'])">&#215;</button>
                </div>

                <br>

                <div id="choix_couleur" class="padding">
                    <label>Color style:
                        <select class="margin_left" v-model="color_style">
                            <option value="Event_type">Hazard type</option>
                            <option value="Year">Year</option>
                            <option value="Month">Month</option>
                        </select>
                    </label>
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

                <div id="color_year" class="flexrow padding" v-if="color_style ==='Year'">
                    <div>
                        <div class="flexrow" v-for="step in color_year">
                            <div class="vertical_center">{{step.label}}:</div>
                            <input type="color" class="color_input margin_left" v-model="step.color">
                        </div>
                    </div>
                </div> 

                <div id="color_month" class="flexrow padding" v-if="color_style ==='Month'">
                    <div>
                        <div class="flexrow" v-for="step in color_month">
                            <div class="vertical_center">{{step.label}}:</div>
                            <input type="color" class="color_input margin_left" v-model="step.color">
                        </div>
                    </div>
                </div> 

                <hr />

                <div id="choix_taille" class="padding">
                    <label>Size style:
                        <select class="margin_left" v-model="size_style">
                            <option value="Standard">Standard</option>
                            <option value="Duration">Duration</option>
                            <option value="Casualties">Casualties</option> 
                            <option value="Popularity">Popularity</option>                         
                        </select>
                    </label>
                </div>

                <div id="size_standard" class="flexrow padding" v-if="size_style ==='Standard'">
                    <div class="vertical_center">All events:</div>
                    <input type="range" min="0" max="15" class="slider margin_left" v-model="size_standard">
                    <span class="margin_left">{{size_standard}}</span>
                </div>

                <div id="size_duration" class="flexrow padding" v-if="size_style ==='Duration'">
                    <div>
                        <div class="flexrow margin" v-for="step in size_duration">
                            <div class="vertical_center">{{step.label}}:</div>
                            <input type="range" min="0" max="15" class="slider margin_left" v-model="step.size">
                            <span class="margin_left">{{step.size}}</span></label>
                        </div>
                    </div>
                </div>        

                <div id="size_casualties" class="flexrow padding" v-if="size_style ==='Casualties'">
                    <label>Size style (casualties):
                        <select class="margin_left" v-model="size_casualties">
                            <option v-for="casualty in casualties_list" :value="casualty.id">{{casualty.label}}</option>  
                        </select>
                    </label>
                </div>

                <div v-for="casualty in casualties_list" v-if="size_style ==='Casualties'">
                    <div v-if="size_casualties === casualty.id">
                        <div class="flexrow margin" v-for="step in casualty.table">
                            <div class="vertical_center">{{step.label}}:</div>
                            <input type="range" min="0" max="15" class="slider margin_left" v-model="step.size">
                            <span class="margin_left">{{step.size}}</span></label>
                        </div>
                    </div>
                </div>

                <div id="size_popularity" class="flexrow padding" v-if="size_style ==='Popularity'">
                    <label>Size style (popularity):
                        <select class="margin_left" v-model="size_popularity">
                            <option v-for="pop in popularity_list" :value="pop.id">{{pop.label}}</option>  
                        </select>
                    </label>
                </div>

                <div v-for="pop in popularity_list" v-if="size_style ==='Popularity'">
                    <div v-if="size_popularity === pop.id">
                        <div class="flexrow margin" v-for="step in pop.table">
                            <div class="vertical_center">{{step.label}}:</div>
                            <input type="range" min="0" max="15" class="slider margin_left" v-model="step.size">
                            <span class="margin_left">{{step.size}}</span></label>
                        </div>
                    </div>
                </div>

                <br>

                <div class="flexrow space_evenly padding">
                    <button id="change_style" @click="change_style">Apply</button>
                    <button id="cancel" @click="change_true_false(['show_changer_style_form'])">Close</button>
                </div>

            </div>

            <div id="form_filter" class="form popup scroll_box" v-if="show_filter_form">

                <div id="top_form" class="flexrow space_between padding">
                    <h5>Filter</h5>
                    <button class="vertical_center" @click="change_true_false(['show_filter_form'])">&#215;</button>
                </div> 

                <br>

                <button id="event_type_button" class="flexrow space_between padding largeur_min largeur_auto" @click="change_true_false(['show_event_type_filter'])">
                    <h6>Hazard type</h6>
                    <div class="vertical_center" v-if="!show_event_type_filter">&#62;</div>
                    <div class="vertical_center" v-if="show_event_type_filter">&#60;</div>
                </button>

                <div id="event_type_filter" class="flexrow space_between padding largeur_min" v-if="show_event_type_filter">
                    <div class="vertical_center">
                        <button class='back_button' @click="change_true_false(['show_event_type_filter'])">&#60;</button>
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

                <hr style='margin:5px;' />

                <button id="date_button" class="flexrow space_between padding largeur_min largeur_auto" @click="display_date_filter">
                    <h6>Date</h6>
                    <div class="vertical_center" v-if="!show_date_filter">&#62;</div>
                    <div class="vertical_center" v-if="show_date_filter">&#60;</div>
                </button>

                <div id="date_filter" class="flexrow space_between padding largeur_min" v-if="show_date_filter">
                    <div class="vertical_center">
                        <button class='back_button' @click="display_date_filter">&#60;</button>
                    </div>
                    <div id="date_field" class="margin">
                        <div class="title">Date filter:</div>
                        <ul>
                            <li id="start_date">
                                <label>Start date: <input class="flatpickr flatpickr-input" type="text" placeholder="Select Date.." data-id="start_date"></label>
                            </li>
                            <li id="end_date">
                                <label>End date: <input class="flatpickr flatpickr-input" type="text" placeholder="Select Date.." data-id="end_date"></label>
                            </li>
                            <li id="duration">{{duration_filter[0].label}}</li>
                            <div>
                                <label>Min: <input class="input_number" type="text" :min="duration_filter[0].min_depart" :max="duration_filter[0].max_depart" v-model="duration_filter[0].min" @beforeinput="(event) => validateInput(event, duration_filter[0].min_depart, duration_filter[0].max_depart)"/></label>
                                <label class="margin_left">Max: <input class="input_number" type="text" :min="duration_filter[0].min_depart" :max="duration_filter[0].max_depart" v-model="duration_filter[0].max" @beforeinput="(event) => validateInput(event, duration_filter[0].min_depart, duration_filter[0].max_depart)"/></label>
                            </div>
                        </ul>
                    </div>  
                    <div class='back_button'></div>
                </div>

                <hr style='margin:5px' />

                <button id="location_button" class="flexrow space_between padding largeur_min largeur_auto" @click="change_true_false(['show_location_filter'])">
                    <h6>Location</h6>
                    <div class="vertical_center" v-if="!show_location_filter">&#62;</div>
                    <div class="vertical_center" v-if="show_location_filter">&#60;</div>
                </button>
                
                <div id="location_filter" class="flexrow space_between padding largeur_min" v-if="show_location_filter">
                    <div class="vertical_center">
                        <button class='back_button' @click="change_true_false(['show_location_filter'])">&#60;</button>
                    </div>
                    <div id="location_field" class="margin">
                        <div class="title">Location filter:</div>
                        <ul>
                            <div class="flexrow margin">
                                <li id="countries">Country:</li>
                                <div class=flexcolumn>
                                    <input class="margin_left" type="text" v-model="substring_country" @input="input_search_country"/>
                                    <select class="margin_left" v-model="chosen_country">
                                        <option value="All">---All---</option>
                                        <option v-for="country in research_country_list" :value="country">{{country}}</option> 
                                    </select>
                                </div>
                            </div>
                            <div class="flexrow space_between margin">
                                <li id="draw">Choose area (draw):</li>
                                <button @click="add_draw" v-if=draw_actif>Stop drawing</button>
                                <button @click="add_draw" v-if=!draw_actif>Draw</button>
                                <button @click="reset_draw">Reset draw</button>
                            </div>
                            <div class="flexrow space_between margin">
                                <li id="bbox">Choose extent:</li>
                                <button @click="extent_polygon">Show extent</button>
                                <button @click="reset_extent">Reset extent</button>
                            </div>
                            <div>
                                <li style="list-style-type:none">
                                    <ul>
                                        <div class="margin" v-for="coord in extent_filter">
                                            <li>{{coord.label}}</li>
                                            <div>
                                                <label>Min: <input class="input_number" type="text" :min="coord.min_depart" :max="coord.max_depart" v-model="coord.min" @beforeinput="(event) => validateInput(event, coord.min_depart, coord.max_depart)"/></label>
                                                <label class="margin_left">Max: <input class="input_number" type="text" :min="coord.min_depart" :max="coord.max_depart" v-model="coord.max" @beforeinput="(event) => validateInput(event, coord.min_depart, coord.max_depart)"/></label>
                                            </div>
                                        </div>
                                    </ul>
                                </li>
                            </div>
                        </ul>
                    </div>  
                    <div class='back_button'></div>
                </div>

                <hr style='margin:5px' />

                <button id="casualties_button" class="flexrow space_between padding largeur_min largeur_auto" @click="change_true_false(['show_casualties_filter'])">
                    <h6>Casualties</h6>
                    <div class="vertical_center" v-if="!show_casualties_filter">&#62;</div>
                    <div class="vertical_center" v-if="show_casualties_filter">&#60;</div>
                </button>

                <div id="casualties_filter" class="flexrow space_between padding largeur_min" v-if="show_casualties_filter">
                    <div class="vertical_center">
                        <button class='back_button' @click="change_true_false(['show_casualties_filter'])">&#60;</button>
                    </div>
                    <div id="casualties_field" class="margin">
                        <div class="title">Casualties filter:</div>
                        <ul> 
                            <div class="margin" v-for="impact in impact_filter">
                                <li>{{impact.label}}</li>
                                <div>
                                    <label>Show null values: <input type="checkbox" v-model="impact.checkbox_null"></label>
                                </div>
                                <div>
                                    <label>Min: <input class="input_number" type="text" :min="impact.min_depart" :max="impact.max_depart" v-model="impact.min" @beforeinput="(event) => validateInput(event, impact.min_depart, impact.max_depart)"/></label>
                                    <label class="margin_left">Max: <input class="input_number" type="text" :min="impact.min_depart" :max="impact.max_depart" v-model="impact.max" @beforeinput="(event) => validateInput(event, impact.min_depart, impact.max_depart)"/></label>
                                </div>
                            </div>
                        </ul>
                    </div>  
                    <div class='back_button'></div>
                </div>

                <hr style='margin:5px' />

                <button id="popularity_button" class="flexrow space_between padding largeur_min largeur_auto" @click="change_true_false(['show_popularity_filter'])">
                    <h6>Popularity</h6>
                    <div class="vertical_center" v-if="!show_popularity_filter">&#62;</div>
                    <div class="vertical_center" v-if="show_popularity_filter">&#60;</div>
                </button>
                
                <div id="popularity_filter" class="flexrow space_between padding largeur_min" v-if="show_popularity_filter">
                    <div class="vertical_center">
                        <button class='back_button' @click="change_true_false(['show_popularity_filter'])">&#60;</button>
                    </div>
                    <div id="popularity_field" class="margin">
                        <div class="title">Popularity filter:</div>
                        <ul>
                            <div class="margin" v-for="popularity in popularity_filter">
                                <li>{{popularity.label}}</li>
                                <div>
                                    <label>Min: <input class="input_number" type="text" :min="popularity.min_depart" :max="popularity.max_depart" v-model="popularity.min" @beforeinput="(event) => validateInput(event, popularity.min_depart, popularity.max_depart)"/></label>
                                    <label class="margin_left">Max: <input class="input_number" type="text" :min="popularity.min_depart" :max="popularity.max_depart" v-model="popularity.max" @beforeinput="(event) => validateInput(event, popularity.min_depart, popularity.max_depart)"/></label>
                                </div>
                            </div>
                        </ul>
                    </div>  
                    <div class='back_button'></div>
                </div>

                <br>

                <div class="flexrow space_evenly padding">
                    <button id="reset" @click="reset_filter_form">Reset</button>
                    <button id="apply" @click="appliquer_filtres">Apply</button>
                    <button id="cancel" @click="change_true_false(['show_filter_form'])">Close</button>
                </div>

            </div>

            <div id="form_download" class="form popup scroll_box" v-if="show_download_form">

                <div id="top_form" class="flexrow space_between padding">
                    <h5>Download data</h5>
                    <button class="vertical_center" @click="change_true_false(['show_download_form'])">&#215;</button>
                </div> 

                <br>

                <div id="download_filter" class="padding largeur_min">
                    <div class="title">Download filter:</div>
                    <div id="events">
                        <label>Events: <input type="checkbox" v-model="download_filter_e" @click=checkbox_download(download_filter_e)></label>
                    </div> 
                    <div id="paragraphs">
                        <label>Paragraphs: <input type="checkbox" v-model="download_filter_p" @click=checkbox_download(download_filter_p)></label>
                    </div>  
                    <div id="events_paragraphs">
                        <label>Events and paragraphs: <input type="checkbox" v-model="download_filter_e_p" @click=checkbox_download(download_filter_e_p)></label>
                    </div>    
                </div>

                <hr style='margin:5px;' />

                <div id="download_all" class="padding largeur_min">
                    <div class="title">Download all:</div>
                    <div id="events">
                        <label>Events: <input type="checkbox" v-model="download_all_e" @click=checkbox_download(download_all_e)></label>
                    </div>     
                </div>

                <hr style='margin:5px;' v-if="show_download_progression" />

                <div id="progress" class="padding largeur_min">
                    <div v-if="show_fetch_progression">{{fetch_progression}}</div>
                    <div v-if="show_download_progression">Prepare download: {{download_progression}}%</div>
                </div>
                
                <br>

                <div class="flexrow space_evenly padding">
                    <button id="download" @click="download">Download</button>
                    <button id="cancel" @click="change_true_false(['show_download_form'])">Close</button>
                </div>

            </div>

        </div>

        <div id=event_data_map_scroll_box class="scroll_box margin padding">

            <div id=no_event_selected v-if="!selected_event">Select an event to get more information!</div>

            <div id=event_hazminer v-if="selected_event && selected_event_type === 'hazminer'">

                <div id=event_title class=title>Event:</div>

                <div id=event_data_main_text v-html="event_main_text_hazminer"></div>

                <div id="other_data_checkbox">
                    <label>Show other information: <input type="checkbox" v-model="other_information_hazminer"></label>
                </div>
                <div id=event_other_data v-html="event_other_text_hazminer" v-if="other_information_hazminer"></div>

                <div id="location_data_checkbox">
                    <label>Show location information: <input type="checkbox" v-model="location_information_hazminer"></label>
                </div>
                <div id=event_location_data v-html="event_location_text_hazminer" v-if="location_information_hazminer"></div>

                <div id="number_data_checkbox">
                    <label>Show more statistics: <input type="checkbox" v-model="number_information_hazminer"></label>
                </div>
                <div id=event_number_data v-html="event_number_text_hazminer" v-if="number_information_hazminer"></div>

                <div class="flexrow space_evenly padding">
                    <button id=more_info_button @click="more_infos_page">More information</button>
                </div>

            </div>

            <div id=event_co v-if="selected_event && selected_event_type === 'citizen oberver'">

                <div id=event_title class=title>Event:</div>

                <div id=event_data_main_text v-html="event_main_text_co"></div>

                <div id="specific_data_checkbox" v-if=event_specific_co>
                    <label>{{ text_checkbox }} <input type="checkbox" v-model="specific_information_co"></label>
                </div>
                <div id=event_specific_data v-html="event_specific_text_co" v-if="specific_information_co"></div>

                <div id="impact_data_checkbox">
                    <label>Afficher les informations sur l'impact: <input type="checkbox" v-model="impact_information_co"></label>
                </div>
                <div id=event_impact_data v-html="event_impact_text_co" v-if="impact_information_co"></div>

                <div id="location_data_checkbox">
                    <label>Afficher les informations de localisation: <input type="checkbox" v-model="location_information_co"></label>
                </div>
                <div id=event_location_data v-html="event_location_text_co" v-if="location_information_co"></div>

            </div>

        </div>

        <div id=popup_pointermove class="popup petit_popup scroll_box"></div>

        <div id=popup_clic class="popup petit_popup scroll_box"></div>

        <div id=outil_filtrage_div class='bouton_1 ol-unselectable ol-control'>
            <button class=open_form_button @click="setup_filter_form">Filter</button>
        </div>

        <div id=changer_style_div class='bouton_2 ol-unselectable ol-control'>
            <button class=open_form_button @click=setup_changer_style_form>Change style</button>
        </div>

        <div id=download_div class='bouton_3 ol-unselectable ol-control'>
            <button class=open_form_button @click=setup_download_form>Download data</button>
        </div>
 
        <!-- Bouton qui permet d'activer la localisation -->
        <div id="affichage_localisation_div" class='ol-unselectable ol-control'>
            <button @click=affichage_localisation>&#8857;</button>
        </div>

        <div id="scaleline_div"></div>

    </div>  

    <script src="https://cdn.jsdelivr.net/npm/vue"></script>
    <script src="https://cdn.jsdelivr.net/npm/flatpickr"></script>
    <script src="assets/map.js"></script> 
    
</body>
</html>