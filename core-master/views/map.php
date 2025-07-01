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
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/ol-layerswitcher@4.1.2/dist/ol-layerswitcher.css" />
</head>

<body>

    <div id="vue_map">

        <div id="map" class="margin">

            <div id="form_changer_style" class="form popup scroll_box" v-if="show_changer_style_form">

                <div id="top_form" class="flexrow space_between padding">
                    <h5>Change style</h5>
                    <button class="vertical_center" @click="change_true_false(['show_changer_style_form'])">&#215;</button>
                </div>

                <div id=choix_style_data class="flexrow space_between padding">
                    <button class="btn btn-secondary" type="button" v-if=show_general_menu_style_hazminer>Hazminer</button>
                    <button class="btn btn-outline-secondary" type="button" v-if=show_general_menu_style_hazminer @click="change_true_false(['show_general_menu_style_hazminer','show_general_menu_style_co'])">Citizen observer</button>
                    <button class="btn btn-outline-secondary" type="button" v-if=show_general_menu_style_co @click="change_true_false(['show_general_menu_style_hazminer','show_general_menu_style_co'])">Hazminer</button>
                    <button class="btn btn-secondary" type="button" v-if=show_general_menu_style_co>Citizen observer</button>
                </div>

                <br>

                <div id=hazminer_style v-if=show_general_menu_style_hazminer>

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
                                <span class="margin_left">{{step.size}}</span>
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
                                <span class="margin_left">{{step.size}}</span>
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
                                <span class="margin_left">{{step.size}}</span>
                            </div>
                        </div>
                    </div>

                </div>

                <div id=co_style v-if=show_general_menu_style_co>

                    <div id="choix_couleur" class="padding">
                        <label>Couleur:
                            <select class="margin_left" v-model="style_couleur">
                                <option value="Type_event">Type d'évènement</option>
                                <option value="Annee">Année</option>
                                <option value="Mois">Mois</option>
                                <option value="Georeferencees">Données géoréférencées ou non</option>
                            </select>
                        </label>
                    </div>

                    <div id="couleur_typeevent" class="padding" v-if="style_couleur ==='Type_event'">
                        <div class="flexrow">
                            <div class="vertical_center">Inondation:</div>
                            <input type="color" class="color_input margin_left" v-model="couleur_inondation">
                        </div>
                        <div class="flexrow">
                            <div class="vertical_center">Glissement de terrain:</div>
                            <input type="color" class="color_input margin_left" v-model="couleur_landslide">
                        </div>
                        <div class="flexrow">
                            <div class="vertical_center">Tremblement de terre:</div>
                            <input type="color" class="color_input margin_left" v-model="couleur_tdt">
                        </div>
                        <div class="flexrow">
                            <div class="vertical_center">Vents violents:</div>
                            <input type="color" class="color_input margin_left" v-model="couleur_vents_violents">
                        </div>
                        <div class="flexrow">
                            <div class="vertical_center">Grêle:</div>
                            <input type="color" class="color_input margin_left" v-model="couleur_grele">
                        </div>
                        <div class="flexrow">
                            <div class="vertical_center">Foudre:</div>
                            <input type="color" class="color_input margin_left" v-model="couleur_foudre">
                        </div>
                    </div>

                    <div id="couleur_annee" class="flexrow padding" v-if="style_couleur ==='Annee'">
                        <div>
                            <div class="flexrow" v-for="step in couleur_annee">
                                <div class="vertical_center">{{step.label}}:</div>
                                <input type="color" class="color_input margin_left" v-model="step.color">
                            </div>
                        </div>
                    </div> 

                    <div id="couleur_mois" class="flexrow padding" v-if="style_couleur ==='Mois'">
                        <div>
                            <div class="flexrow" v-for="step in couleur_mois">
                                <div class="vertical_center">{{step.label}}:</div>
                                <input type="color" class="color_input margin_left" v-model="step.color">
                            </div>
                        </div>
                    </div> 

                    <div id="couleur_georef" class="padding" v-if="style_couleur ==='Georeferencees'">
                        <div class="flexrow">
                            <div class="vertical_center">Données géoréférencées:</div>
                            <input type="color" class="color_input margin_left" v-model="couleur_georef_true">
                        </div>
                        <div class="flexrow">
                            <div class="vertical_center">Données non géoréférencées:</div>
                            <input type="color" class="color_input margin_left" v-model="couleur_georef_false">
                        </div>
                    </div>

                    <hr />

                    <div id="choix_taille" class="padding">
                        <label>Taille:
                            <select class="margin_left" v-model="style_taille">
                                <option value="Standard">Standard</option>
                                <option value="Impact_humain">Impact humain</option>
                                <option value="Autres_impacts">Autres impacts</option>                       
                            </select>
                        </label>
                    </div>

                    <div id="taille_standard" class="flexrow padding" v-if="style_taille ==='Standard'">
                        <div class="vertical_center">Tous les évènements:</div>
                        <input type="range" min="0" max="15" class="slider margin_left" v-model="taille_standard">
                        <span class="margin_left">{{taille_standard}}</span>
                    </div>

                    <div id="taille_impact_humain" class="flexrow padding" v-if="style_taille ==='Impact_humain'">
                        <label>Taille selon :
                            <select class="margin_left" v-model="taille_impact_humain">
                                <option v-for="impact in liste_impact_humain" :value="impact.id">{{impact.label}}</option>  
                            </select>
                        </label>
                    </div>

                    <div v-for="impact in liste_impact_humain" v-if="style_taille ==='Impact_humain'">
                        <div v-if="taille_impact_humain === impact.id">
                            <div class="flexrow margin" v-for="step in impact.table">
                                <div class="vertical_center">{{step.label}}:</div>
                                <input type="range" min="0" max="15" class="slider margin_left" v-model="step.size">
                                <span class="margin_left">{{step.size}}</span>
                            </div>
                        </div>
                    </div>

                    <div id="taille_autres_impacts" class="flexrow padding" v-if="style_taille ==='Autres_impacts'">
                        <label>Taille selon :
                            <select class="margin_left" v-model="taille_autres_impacts">
                                <option v-for="impact in liste_autres_impacts" :value="impact.id">{{impact.label}}</option>  
                            </select>
                        </label>
                    </div>

                    <div v-for="impact in liste_autres_impacts" v-if="style_taille ==='Autres_impacts'">
                        <div v-if="taille_autres_impacts === impact.id">
                            <div class="flexrow margin">
                                <div class="vertical_center">Oui:</div>
                                <input type="range" min="0" max="15" class="slider margin_left" v-model="taille_oui">
                                <span class="margin_left">{{taille_oui}}</span>
                            </div>
                            <div class="flexrow margin">
                                <div class="vertical_center">Non:</div>
                                <input type="range" min="0" max="15" class="slider margin_left" v-model="taille_non">
                                <span class="margin_left">{{taille_non}}</span>
                            </div>
                        </div>
                    </div>

                </div>

                <br>

                <div class="flexrow space_evenly padding">
                    <button id="change_style" @click="change_style_all">Apply</button>
                    <button id="cancel" @click="change_true_false(['show_changer_style_form'])">Close</button>
                </div>

            </div>

            <div id="form_filter" class="form popup scroll_box" v-if="show_filter_form">

                <div id="top_form" class="flexrow space_between padding">
                    <h5>Filter</h5>
                    <button class="vertical_center" @click="change_true_false(['show_filter_form'])">&#215;</button>
                </div> 

                <div id=choix_filtre_data class="flexrow space_between padding">
                    <button class="btn btn-secondary" type="button" v-if=show_general_menu_filter_hazminer>Hazminer</button>
                    <button class="btn btn-outline-secondary" type="button" v-if=show_general_menu_filter_hazminer @click="change_true_false(['show_general_menu_filter_hazminer','show_general_menu_filter_co'])">Citizen observer</button>
                    <button class="btn btn-outline-secondary" type="button" v-if=show_general_menu_filter_co @click="change_true_false(['show_general_menu_filter_hazminer','show_general_menu_filter_co'])">Hazminer</button>
                    <button class="btn btn-secondary" type="button" v-if=show_general_menu_filter_co>Citizen observer</button>
                </div>

                <br>

                <div id=hazminer_filter v-if=show_general_menu_filter_hazminer>

                    <button id="event_type_button" class="flexrow space_between padding largeur_min largeur_auto" @click="change_true_false(['show_event_type_filter_hazminer'])">
                        <h6>Hazard type</h6>
                        <div class="vertical_center" v-if="!show_event_type_filter_hazminer">&#62;</div>
                        <div class="vertical_center" v-if="show_event_type_filter_hazminer">&#60;</div>
                    </button>

                    <div id="event_type_filter" class="flexrow space_between padding largeur_min" v-if="show_event_type_filter_hazminer">
                        <div class="vertical_center">
                            <button class='back_button' @click="change_true_false(['show_event_type_filter_hazminer'])">&#60;</button>
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

                    <button id="date_button" class="flexrow space_between padding largeur_min largeur_auto" @click="display_hazminer_date_filter">
                        <h6>Date</h6>
                        <div class="vertical_center" v-if="!show_date_filter_hazminer">&#62;</div>
                        <div class="vertical_center" v-if="show_date_filter_hazminer">&#60;</div>
                    </button>

                    <div id="date_filter" class="flexrow space_between padding largeur_min" v-if="show_date_filter_hazminer">
                        <div class="vertical_center">
                            <button class='back_button' @click="display_hazminer_date_filter">&#60;</button>
                        </div>
                        <div id="date_field" class="margin">
                            <div class="title">Date filter:</div>
                            <ul>
                                <li id="start_date_hazminer">
                                    <label>Start date: <input class="flatpickr flatpickr-input" type="text" placeholder="Select Date.." data-id="start_date_hazminer"></label>
                                </li>
                                <li id="end_date_hazminer">
                                    <label>End date: <input class="flatpickr flatpickr-input" type="text" placeholder="Select Date.." data-id="end_date_hazminer"></label>
                                </li>
                                <li id="duration">{{duration_filter[0].label}}</li>
                                <div>
                                    <label>Min: <input class="input_number" type="text" :min="duration_filter[0].min_depart" :max="duration_filter[0].max_depart" v-model="duration_filter[0].min" @beforeinput="(event) => validate_input(event, duration_filter[0].min_depart, duration_filter[0].max_depart)"/></label>
                                    <label class="margin_left">Max: <input class="input_number" type="text" :min="duration_filter[0].min_depart" :max="duration_filter[0].max_depart" v-model="duration_filter[0].max" @beforeinput="(event) => validate_input(event, duration_filter[0].min_depart, duration_filter[0].max_depart)"/></label>
                                </div>
                            </ul>
                        </div>  
                        <div class='back_button'></div>
                    </div>

                    <hr style='margin:5px' />

                    <button id="location_button" class="flexrow space_between padding largeur_min largeur_auto" @click="change_true_false(['show_location_filter_hazminer'])">
                        <h6>Location</h6>
                        <div class="vertical_center" v-if="!show_location_filter_hazminer">&#62;</div>
                        <div class="vertical_center" v-if="show_location_filter_hazminer">&#60;</div>
                    </button>
                    
                    <div id="location_filter" class="flexrow space_between padding largeur_min" v-if="show_location_filter_hazminer">
                        <div class="vertical_center">
                            <button class='back_button' @click="change_true_false(['show_location_filter_hazminer'])">&#60;</button>
                        </div>
                        <div id="location_field" class="margin">
                            <div class="title">Location filter:</div>
                            <ul>
                                <div class="flexrow margin">
                                    <li id="countries">Country:</li>
                                    <div class=flexcolumn>
                                        <input class="margin_left" type="text" v-model="substring_country_hazminer" @input="input_search_country"/>
                                        <select class="margin_left" v-model="chosen_country_hazminer">
                                            <option value="All">---All---</option>
                                            <option v-for="country in research_country_list_hazminer" :value="country">{{country}}</option> 
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
                                                    <label>Min: <input class="input_number" type="text" :min="coord.min_depart" :max="coord.max_depart" v-model="coord.min" @beforeinput="(event) => validate_input(event, coord.min_depart, coord.max_depart)"/></label>
                                                    <label class="margin_left">Max: <input class="input_number" type="text" :min="coord.min_depart" :max="coord.max_depart" v-model="coord.max" @beforeinput="(event) => validate_input(event, coord.min_depart, coord.max_depart)"/></label>
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

                    <button id="casualties_button" class="flexrow space_between padding largeur_min largeur_auto" @click="change_true_false(['show_casualties_filter_hazminer'])">
                        <h6>Casualties</h6>
                        <div class="vertical_center" v-if="!show_casualties_filter_hazminer">&#62;</div>
                        <div class="vertical_center" v-if="show_casualties_filter_hazminer">&#60;</div>
                    </button>

                    <div id="casualties_filter" class="flexrow space_between padding largeur_min" v-if="show_casualties_filter_hazminer">
                        <div class="vertical_center">
                            <button class='back_button' @click="change_true_false(['show_casualties_filter_hazminer'])">&#60;</button>
                        </div>
                        <div id="casualties_field" class="margin">
                            <div class="title">Casualties filter:</div>
                            <ul> 
                                <div class="margin" v-for="impact in impact_filter_hazminer">
                                    <li>{{impact.label}}</li>
                                    <div>
                                        <label>Show null values: <input type="checkbox" v-model="impact.checkbox_null"></label>
                                    </div>
                                    <div>
                                        <label>Min: <input class="input_number" type="text" :min="impact.min_depart" :max="impact.max_depart" v-model="impact.min" @beforeinput="(event) => validate_input(event, impact.min_depart, impact.max_depart)"/></label>
                                        <label class="margin_left">Max: <input class="input_number" type="text" :min="impact.min_depart" :max="impact.max_depart" v-model="impact.max" @beforeinput="(event) => validate_input(event, impact.min_depart, impact.max_depart)"/></label>
                                    </div>
                                </div>
                            </ul>
                        </div>  
                        <div class='back_button'></div>
                    </div>

                    <hr style='margin:5px' />

                    <button id="popularity_button" class="flexrow space_between padding largeur_min largeur_auto" @click="change_true_false(['show_popularity_filter_hazminer'])">
                        <h6>Popularity</h6>
                        <div class="vertical_center" v-if="!show_popularity_filter_hazminer">&#62;</div>
                        <div class="vertical_center" v-if="show_popularity_filter_hazminer">&#60;</div>
                    </button>
                    
                    <div id="popularity_filter" class="flexrow space_between padding largeur_min" v-if="show_popularity_filter_hazminer">
                        <div class="vertical_center">
                            <button class='back_button' @click="change_true_false(['show_popularity_filter_hazminer'])">&#60;</button>
                        </div>
                        <div id="popularity_field" class="margin">
                            <div class="title">Popularity filter:</div>
                            <ul>
                                <div class="margin" v-for="popularity in popularity_filter">
                                    <li>{{popularity.label}}</li>
                                    <div>
                                        <label>Min: <input class="input_number" type="text" :min="popularity.min_depart" :max="popularity.max_depart" v-model="popularity.min" @beforeinput="(event) => validate_input(event, popularity.min_depart, popularity.max_depart)"/></label>
                                        <label class="margin_left">Max: <input class="input_number" type="text" :min="popularity.min_depart" :max="popularity.max_depart" v-model="popularity.max" @beforeinput="(event) => validate_input(event, popularity.min_depart, popularity.max_depart)"/></label>
                                    </div>
                                </div>
                            </ul>
                        </div>  
                        <div class='back_button'></div>
                    </div>

                </div>

                <div id=co_filter v-if=show_general_menu_filter_co>

                    <button id="type_event_button" class="flexrow space_between padding largeur_min largeur_auto" @click="change_true_false(['show_type_event_filter_co'])">
                        <h6>Type d'évènement</h6>
                        <div class="vertical_center" v-if="!show_type_event_filter_co">&#62;</div>
                        <div class="vertical_center" v-if="show_type_event_filter_co">&#60;</div>
                    </button>

                    <div id="type_event_filter" class="flexrow space_between padding largeur_min" v-if="show_type_event_filter_co">
                        <div class="vertical_center">
                            <button class='back_button' @click="change_true_false(['show_type_event_filter_co'])">&#60;</button>
                        </div>
                        <div id="type_event_field" class="margin">
                            <div class="title">Filtre selon le type d'évènement:</div>
                            <div id="inondation">
                                <label>Inondation: <input type="checkbox" v-model="inondation"></label>
                            </div>  
                            <div id="glissement_terrain">
                                <label>Glissement de terrain: <input type="checkbox" v-model="glissement_terrain"></label>
                            </div>
                            <div id="tdt">
                                <label>Tremblement de terre: <input type="checkbox" v-model="tdt"></label>
                            </div> 
                            <div id="vents_violents">
                                <label>Vents violents: <input type="checkbox" v-model="vents_violents"></label>
                            </div>  
                            <div id="grele">
                                <label>Grêle: <input type="checkbox" v-model="grele"></label>
                            </div>  
                            <div id="foudre">
                                <label>Foudre: <input type="checkbox" v-model="foudre"></label>
                            </div>          
                        </div>  
                        <div class='back_button'></div>
                    </div>

                    <hr style='margin:5px;' />

                    <button id="date_button" class="flexrow space_between padding largeur_min largeur_auto" @click="display_co_date_filter">
                        <h6>Date</h6>
                        <div class="vertical_center" v-if="!show_date_filter_co">&#62;</div>
                        <div class="vertical_center" v-if="show_date_filter_co">&#60;</div>
                    </button>

                    <div id="date_filter" class="flexrow space_between padding largeur_min" v-if="show_date_filter_co">
                        <div class="vertical_center">
                            <button class='back_button' @click="display_co_date_filter">&#60;</button>
                        </div>
                        <div id="date_field" class="margin">
                            <div class="title">Filtre selon la date:</div>
                            <ul>
                                <li id="start_date_co">
                                    <label>Date de départ: <input class="flatpickr flatpickr-input" type="text" placeholder="Select Date.." data-id="start_date_co"></label>
                                </li>
                                <li id="end_date_co">
                                    <label>Date de fin: <input class="flatpickr flatpickr-input" type="text" placeholder="Select Date.." data-id="end_date_co"></label>
                                </li>
                            </ul>
                        </div>  
                        <div class='back_button'></div>
                    </div>

                    <hr style='margin:5px' />

                    <button id="location_button" class="flexrow space_between padding largeur_min largeur_auto" @click="change_true_false(['show_location_filter_co'])">
                        <h6>Localisation</h6>
                        <div class="vertical_center" v-if="!show_location_filter_co">&#62;</div>
                        <div class="vertical_center" v-if="show_location_filter_co">&#60;</div>
                    </button>
                    
                    <div id="location_filter" class="flexrow space_between padding largeur_min" v-if="show_location_filter_co">
                        <div class="vertical_center">
                            <button class='back_button' @click="change_true_false(['show_location_filter_co'])">&#60;</button>
                        </div>
                        <div id="location_field" class="margin">
                            <div class="title">Filtre selon la localisation:</div>
                            <ul>
                                <div class="flexrow margin">
                                    <li id="province">Province:</li>
                                    <div class=flexcolumn>
                                        <select class="margin_left" v-model="chosen_province_co">
                                            <option value="All">---Toutes---</option>
                                            <option v-for="province in province_list_co" :value="province">{{province}}</option> 
                                        </select>
                                    </div>
                                </div>
                                <div class="flexrow margin">
                                    <li id="territoire">Territoire:</li>
                                    <div class=flexcolumn>
                                        <select class="margin_left" v-model="chosen_territoire_co">
                                            <option value="All">---Tous---</option>
                                            <option v-for="territoire in territoire_list_co" :value="territoire">{{territoire}}</option> 
                                        </select>
                                    </div>
                                </div>
                            </ul>
                        </div>  
                        <div class='back_button'></div>
                    </div>

                    <hr style='margin:5px' />

                    <button id="impact_button" class="flexrow space_between padding largeur_min largeur_auto" @click="change_true_false(['show_impact_filter_co'])">
                        <h6>Impact</h6>
                        <div class="vertical_center" v-if="!show_impact_filter_co">&#62;</div>
                        <div class="vertical_center" v-if="show_impact_filter_co">&#60;</div>
                    </button>

                    <div id="impact_filter" class="flexrow space_between padding largeur_min" v-if="show_impact_filter_co">
                        <div class="vertical_center">
                            <button class='back_button' @click="change_true_false(['show_impact_filter_co'])">&#60;</button>
                        </div>
                        <div id="impact_field" class="margin">
                            <div class="title">Filtre selon l'impact:</div>
                            <ul> 
                                <div class="margin" v-for="impact in impact_chiffre_filter_co">
                                    <li>{{impact.label}}</li>
                                    <div>
                                        <label>Montrer les valeurs nulles: <input type="checkbox" v-model="impact.checkbox_null"></label>
                                    </div>
                                    <div>
                                        <label>Min: <input class="input_number" type="text" :min="impact.min_depart" :max="impact.max_depart" v-model="impact.min" @beforeinput="(event) => validate_input(event, impact.min_depart, impact.max_depart)"/></label>
                                        <label class="margin_left">Max: <input class="input_number" type="text" :min="impact.min_depart" :max="impact.max_depart" v-model="impact.max" @beforeinput="(event) => validate_input(event, impact.min_depart, impact.max_depart)"/></label>
                                    </div>
                                </div>
                                <div class="margin" v-for="impact in impact_bool_filter_co">
                                    <li><label>{{impact.label}} <input type="checkbox" v-model="impact.checkbox_impact"></label></li>
                                </div>
                            </ul>
                        </div>
                        <div class='back_button'></div>
                    </div>

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

                <div id="hazminer_download">

                    <div class="flexrow space_evenly padding">
                        <div class="title">Hazminer</div>
                    </div>

                    <div id="download_filter" class="padding largeur_min">
                        <div class="title">Download filter:</div>
                        <div id="events">
                            <label>Events: <input type="checkbox" v-model="download_filter_e_hazminer" @click=checkbox_download(download_filter_e_hazminer)></label>
                        </div> 
                        <div id="paragraphs">
                            <label>Paragraphs: <input type="checkbox" v-model="download_filter_p_hazminer" @click=checkbox_download(download_filter_p_hazminer)></label>
                        </div>  
                        <div id="events_paragraphs">
                            <label>Events and paragraphs: <input type="checkbox" v-model="download_filter_e_p_hazminer" @click=checkbox_download(download_filter_e_p_hazminer)></label>
                        </div>    
                    </div>

                    <div id="download_all" class="padding largeur_min">
                        <div class="title">Download all:</div>
                        <div id="events">
                            <label>Events: <input type="checkbox" v-model="download_all_e_hazminer" @click=checkbox_download(download_all_e_hazminer)></label>
                        </div>     
                    </div>

                </div>

                <hr style='margin:10px;' />

                <div id="co_download">

                    <div class="flexrow space_evenly padding">
                        <div class="title">Citizen observer</div>
                    </div>

                    <div id="download_filter" class="padding largeur_min">
                        <div id ="filter" class="title">
                            <label>Download filter: <input type="checkbox" v-model="download_filter_co" @click=checkbox_download(download_filter_co)></label>
                        </div>   
                    </div>

                    <div id="download_all" class="padding largeur_min">
                        <div id ="all" class="title">
                            <label>Download all: <input type="checkbox" v-model="download_all_co" @click=checkbox_download(download_all_co)></label>
                        </div>   
                    </div>

                </div>

                <hr style='margin:10px;' v-if="show_download_progression" />

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
    <script src="https://cdn.jsdelivr.net/npm/ol-layerswitcher@4.1.2/dist/ol-layerswitcher.js"></script>
    <script src="assets/map.js"></script> 
    
</body>
</html>