Vue.createApp({

    data() {

        return {

            // Initialisation de la carte et des couches
            map: null, // Initialisation de la carte
            landslide_susceptibility_layer: null, // Initialisation de la couche de susceptibilité des tremblements de terre
            rivers_layer: null, // Initialisation de la couche des rivières
            countries_layer: null, // Initialisation de la couche des pays
            extent_layer: null, // Initialisation de la couche du polygone du choix manuel de l'emprise
            draw_layer: null, // Initialisation de la couche de dessin
            events_hazminer_layer: null, // Initialisation de la couche des évènements hazminer
            events_co_layer: null, // Initialisation de la couche des évènements citizen observer
            selected_event_layer: null, // Initialisation de la couche contenant uniquement l'évènement sélectionné
            location_layer: null, // Initialisation de la couche de géolocalisation

            // Liste des pays
            countries_list: [],

            // Evènement sélectionné
            selected_event: null, // Permet de conserver l'évènement sélectionné
            selected_event_type: null, // Type de l'évènement sélectionné (hazminer ou citizen observer)

            // Affichage des propriétés des évènements (hazminer)
            // Propriétés principales des évènements
            event_main_properties_hazminer: ["hazard_type", "event_time", "start_time", "end_time", "median_death", "median_injured", "median_affected", 
                "n_paragraphs", "n_articles"],
            event_main_properties_hazminer_title: ["Hazard type", "Event time", "Start time", "End time", "Median death", "Median injured", "Median affected",
                "Number of paragraphs", "Number of articles"],
            // Autres propriétés des évènements
            event_other_properties_hazminer: ["country_found", "n_languages", "n_source_countries", "n_domains", "duration", "hazard_score"],
            event_other_properties_hazminer_title: ["Country", "Number of languages", "Number of source countries", "Number of domains", "Duration", "Hazard score"],
            // Propriétés de localisation des évènements
            event_location_properties_hazminer: ["latitude", "longitude", "min_lat", "max_lat", "min_lon", "max_lon"],
            event_location_properties_hazminer_title: ["Latitude", "Longitude", "Minimum latitude", "Maximum latitude", "Minimum longitude", "Maximum longitude"],
            // Propriétés statistiques des évènements (souvent null)
            event_number_properties_hazminer: ["mostfreq_death", "n_mostfreq_death", "time_mostfreq_death", "median_death", "mostfreq_homeless", "n_mostfreq_homeless", 
                "time_mostfreq_homeless", "median_homeless", "mostfreq_injured", "n_mostfreq_injured", "time_mostfreq_injured", "median_injured", "mostfreq_affected", 
                "n_mostfreq_affected", "time_mostfreq_affected", "median_affected", "mostfreq_missing", "n_mostfreq_missing", "time_mostfreq_missing", "median_missing", 
                "mostfreq_evacuated", "n_mostfreq_evacuated", "time_mostfreq_evacuated", "median_evacuated"],
            event_number_properties_hazminer_title: ["Most frequent death", "Number of most frequent death", "Time of most frequent death", "Median death", 
                "Most frequent homeless", "Number of most frequent homeless", "Time of most frequent homeless", "Median homeless", "Most frequent injured", 
                "Number of most frequent injured", "Time of most frequent injured", "Median injured", "Most frequent affected", "Number of most frequent affected", 
                "Time of most frequent affected", "Median affected", "Most frequent missing", "Number of most frequent missing",  "Time of most frequent missing", 
                "Median missing", "Most frequent evacuated", "Number of most frequent evacuated", "Time of most frequent evacuated", "Median evacuated"],
            // Propriétés des évènements à télécharger
            event_download_properties_hazminer: ["event_id", "n_paragraphs", "n_articles", "hazard_type", "hazard_score", "latitude", "longitude", "min_lat", "max_lat", 
                "min_lon", "max_lon", "event_time", "start_time", "end_time", "duration", "n_languages", "n_source_countries", "n_domains", "mostfreq_death", 
                "n_mostfreq_death", "time_mostfreq_death", "median_death", "mostfreq_homeless", "n_mostfreq_homeless", "time_mostfreq_homeless", "median_homeless",
                "mostfreq_injured", "n_mostfreq_injured", "time_mostfreq_injured", "median_injured", "mostfreq_affected", "n_mostfreq_affected", 
                "time_mostfreq_affected", "median_affected", "mostfreq_missing", "n_mostfreq_missing", "time_mostfreq_missing", "median_missing", "mostfreq_evacuated", 
                "n_mostfreq_evacuated", "time_mostfreq_evacuated", "median_evacuated", "country_found"],
            // Propriétés des paragraphes à télécharger
            paragraph_download_properties: ["article_id", "title", "extracted_text", "paragraph_time", "article_language", "source_country", "domain_url",
                "paragraph_id", "original_text", "disaster_label", "disaster_score", "hazard_type", "hazard_type_score", "nb_death", "score_death", "answer_death",
                "nb_homeless", "score_homeless", "answer_homeless", "nb_injured", "score_injured", "answer_injured", "nb_affected", "score_affected", 
                "answer_affected", "nb_missing", "score_missing", "answer_missing", "nb_evacuated", "score_evacuated", "answer_evacuated", "publication_time",
                "extracted_location", "ner_score", "latitude", "longitude", "std_dev", "min_lat", "max_lat", "min_lon", "max_lon", "n_locations", "nb_death_min",
                "nb_death_max", "nb_homeless_min", "nb_homeless_max", "nb_injured_min", "nb_injured_max", "nb_affected_min", "nb_affected_max", "nb_missing_min",
                "nb_missing_max", "nb_evacuated_min", "nb_evacuated_max", "country", "country_found", "continent", "population_density"],
            event_main_text_hazminer: '', // Texte sur les évènements (droite de l'écran)
            event_other_text_hazminer: '', // Texte sur les évènements, partie optionnelle autres (droite de l'écran)
            event_location_text_hazminer: '', // Texte sur les évènements, partie optionnelle localisations (droite de l'écran)
            event_number_text_hazminer: '', // Texte sur les évènements, partie optionnelle statistiques (droite de l'écran)        
            other_information_hazminer: false, // Affichage des informations supplémentaires des évènements ou non (inactif par défaut)
            location_information_hazminer: false, // Affichage des informations de localisation des évènements ou non (inactif par défaut)
            number_information_hazminer: false, // Affichage des informations statistiques des évènements ou non (inactif par défaut)

            // Affichage des propriétés des évènements (citizen observer)
            // Propriétés principales des évènements
            event_main_properties_co: ["type_event", "event_date", "pays", "province", "territoire", "nom_collectivite_commune", "nom_groupement_quartier", 
                "noms_villages", "nb_morts", "nb_blesses", "nb_sansabris", "surprise_population"],
            event_main_properties_co_title: ["Type d'évènement", "Date", "Pays", "Province", "Territoire", "Nom de la collectivité/commune", 
                "Nom du groupement/quartier", "Noms des villages affectés", "Nombre de morts", "Nombre de blessés", "Nombre de sans abris", 
                "Réaction de la population"],
            // Propriétés de l'impact des évènements
            event_impact_properties_co: ["impact_betail", "impact_logement", "impact_routes", "impact_ponts", "impact_autres", "impact_coupures_elec", 
                "impact_eau_consommation", "impact_cultures"],
            event_impact_properties_co_title: ["Impact bétail", "Impact logement", "Impact routes", "Impact ponts", "Impact autres", "Impact coupures électricité", 
                "Impact sources d'eau de consommation", "Impact cultures"],
            // Propriétés de localisation des évènements
            event_location_properties_co: ["latitude", "longitude", "donnees_georeferencees"],
            event_location_properties_co_title: ["Latitude", "Longitude", "Données géoréférencées"],
            // Propriétés spécifiques des évènements, liés à certain types d'évènements
            event_landslide_properties_co: ["landslide_new_or_old", "landslide_react_signes", "landslide_apres", "landslide_cause_habitants"],
            event_landslide_properties_co_title: ["Glissement de terrain", "Signes indiquant que la réactivitation pouvait se produire", 
                "Le récent glissement de terrain s'est produit pendant ou juste après", "Cause selon les habitants"],
            event_inondation_properties_co: ["inondation_duree_jours", "inondation_apres"],
            event_inondation_properties_co_title: ["Durée (en jours)", "L'inondation est survenue pendant ou juste après"],
            event_grele_properties_co: ["grele_duree_minutes"],
            event_grele_properties_co_title: ["Durée (en minutes)"],
            event_vents_violents_properties_co: ["vents_violents_duree_jours", "vents_violents_avec_autre_event"],
            event_vents_violents_properties_co_title: ["Durée (en jours)", "Les vents violents sont survenus pendant ou juste après un évènement"],
            event_tdt_properties_co: ["tdt_duree", "tdt_declenche_landslide"],
            event_tdt_properties_co_title: ["Durée", "Glissement de terrain déclenché par ce tremblement de terre"],
            // Propriétés à télécharger
            event_download_properties_co: ["type_event", "event_date", "pays", "province", "territoire", "nom_collectivite_commune", "nom_groupement_quartier", 
                "noms_villages", "latitude", "longitude", "donnees_georeferencees", "nb_morts", "nb_blesses", "nb_sansabris", "surprise_population", 
                "impact_betail", "impact_logement", "impact_routes", "impact_ponts", "impact_autres", "impact_coupures_elec", "impact_eau_consommation", 
                "impact_cultures", "landslide_new_or_old", "landslide_react_signes", "landslide_apres", "landslide_cause_habitants", "inondation_duree_jours", 
                "inondation_apres", "grele_duree_minutes", "vents_violents_duree_jours", "vents_violents_avec_autre_event", "tdt_duree", "tdt_declenche_landslide"],
            event_main_text_co: '', // Texte sur les évènements (droite de l'écran)
            event_impact_text_co: '', // Texte sur les évènements, partie optionnelle impacts (droite de l'écran)
            event_location_text_co: '', // Texte sur les évènements, partie optionnelle sur la localisation (droite de l'écran)
            event_specific_text_co: '', // Texte sur les évènements, partie optionnelle spécifique au type de catastrophe (droite de l'écran)
            text_checkbox: '', // Légende du texte de la partie specifique sur les évènements
            event_specific_co: false, // Apparition de la partie spécifique ou non
            impact_information_co: false, // Affichage des informations sur l'impact ou non (inactif par défaut)
            location_information_co: false, // Affichage des informations de localisation ou non (inactif par défaut)
            specific_information_co: false, // Affichage des informations spécifiques ou non (inactif par défaut)

            // Affichage de la fenêtre pour changer le style
            show_change_style_form: false,

            // Affichage menu général du changement de style hazminer / citizen observer
            show_general_menu_style_hazminer: true,
            show_general_menu_style_co: false,

            // Facteur permettant de changer la taille des évènements selon le niveau de zoom
            actual_zoom_factor: 0.5,
            zoom_table: [
                { min_zoom: 0, max_zoom: 5, factor: 0.25 },
                { min_zoom: 5, max_zoom: 8, factor: 0.5 },
                { min_zoom: 8, max_zoom: 10, factor: 0.75 },
                { min_zoom: 10, max_zoom: Infinity, factor: 1 },
            ],

            // Propriétés par défaut du changement de style hazminer
            color_style: 'Event_type',
            color_flood: '#3252a8',
            color_flashflood: '#7f14cc',
            color_landslide: '#4a2c03',
            color_year: [
                { label: 'Before 2017', min: -Infinity, max: Date.parse("2017-01-01"), color: '#ba68c8' },
                { label: '2017', min: Date.parse("2017-01-01"), max: Date.parse("2018-01-01"), color: '#7986cb' },
                { label: '2018', min: Date.parse("2018-01-01"), max: Date.parse("2019-01-01"), color: '#64b5f6' },
                { label: '2019', min: Date.parse("2019-01-01"), max: Date.parse("2020-01-01"), color: '#4dd0e1' },
                { label: '2020', min: Date.parse("2020-01-01"), max: Date.parse("2021-01-01"), color: '#4db6ac' },
                { label: '2021', min: Date.parse("2021-01-01"), max: Date.parse("2022-01-01"), color: '#81c784' },
                { label: '2022', min: Date.parse("2022-01-01"), max: Date.parse("2023-01-01"), color: '#dce775' },
                { label: '2023', min: Date.parse("2023-01-01"), max: Date.parse("2024-01-01"), color: '#fff176' },
                { label: '2024', min: Date.parse("2024-01-01"), max: Date.parse("2025-01-01"), color: '#ff8a65' },
                { label: '2025', min: Date.parse("2025-01-01"), max: Date.parse("2026-01-01"), color: '#e57373' },
                { label: 'After 2025', min: Date.parse("2026-01-01"), max: Infinity, color: '#f06292' },
            ],
            color_month: [
                { label: 'January', number: '01', color: '#ed008c' },
                { label: 'February', number: '02', color: '#d0191b' },
                { label: 'March', number: '03', color: '#f06730' },
                { label: 'April', number: '04', color: '#f08622' },
                { label: 'May', number: '05', color: '#e9eb28' },
                { label: 'June', number: '06', color: '#b4e742' },
                { label: 'July', number: '07', color: '#5fc650' },
                { label: 'August', number: '08', color: '#1fa5a6' },
                { label: 'September', number: '09', color: '#2689c7' },
                { label: 'October', number: '10', color: '#3242a8' },
                { label: 'November', number: '11', color: '#761ca2' },
                { label: 'December', number: '12', color: '#b23593' },
            ],
            size_style: 'Standard',
            size_standard: 10,
            size_duration: [
                { label: '0', min: 0, max: 0, size: 3 },
                { label: '1 - 5', min: 1, max: 5, size: 3 },
                { label: '6 - 10', min: 6, max: 10, size: 6 },
                { label: '11 - 20', min: 11, max: 20, size: 9 },
                { label: '21 - 50', min: 21, max: 50, size: 12 },
                { label: '≥ 50', min: 51, max: Infinity, size: 15 },
            ],
            size_casualties: 'median_death',
            size_death: [
                { label: 'No value', min: null, max: null, size: 3 },
                { label: '0 - 9', min: 0, max: 10, size: 5 },
                { label: '10 - 99', min: 10, max: 100, size: 7 },
                { label: '100 - 999', min: 100, max: 1000, size: 9 },
                { label: '1000 - 9999', min: 1000, max: 10000, size: 12 },
                { label: '≥ 10000', min: 10000, max: Infinity, size: 15 },
            ],
            size_injured: [
                { label: 'No value', min: null, max: null, size: 3 },
                { label: '0 - 9', min: 0, max: 10, size: 4 },
                { label: '10 - 99', min: 10, max: 100, size: 5 },
                { label: '100 - 999', min: 100, max: 1000, size: 6 },
                { label: '1000 - 9999', min: 1000, max: 10000, size: 7 },
                { label: '10000 - 99999', min: 10000, max: 100000, size: 8 },
                { label: '100000 - 999999', min: 100000, max: 1000000, size: 9 },
                { label: '1000000 - 9999999', min: 1000000, max: 10000000, size: 11 },
                { label: '10000000 - 99999999', min: 10000000, max: 100000000, size: 13 },
                { label: '≥ 100000000', min: 100000000, max: Infinity, size: 15 },
            ],
            size_affected: [
                { label: 'No value', min: null, max: null, size: 3 },
                { label: '0 - 9', min: 0, max: 10, size: 4 },
                { label: '10 - 99', min: 10, max: 100, size: 5 },
                { label: '100 - 999', min: 100, max: 1000, size: 6 },
                { label: '1000 - 9999', min: 1000, max: 10000, size: 7 },
                { label: '10000 - 99999', min: 10000, max: 100000, size: 8 },
                { label: '100000 - 999999', min: 100000, max: 1000000, size: 9 },
                { label: '1000000 - 9999999', min: 1000000, max: 10000000, size: 10 },
                { label: '10000000 - 99999999', min: 10000000, max: 100000000, size: 11 },
                { label: '100000000 - 999999999', min: 100000000, max: 1000000000, size: 13 },
                { label: '≥ 1000000000', min: 1000000000, max: Infinity, size: 15 },
            ],
            size_homeless: [
                { label: 'No value', min: null, max: null, size: 3 },
                { label: '0 - 9', min: 0, max: 10, size: 4 },
                { label: '10 - 99', min: 10, max: 100, size: 5 },
                { label: '100 - 999', min: 100, max: 1000, size: 6 },
                { label: '1000 - 9999', min: 1000, max: 10000, size: 7 },
                { label: '10000 - 99999', min: 10000, max: 100000, size: 9 },
                { label: '100000 - 999999', min: 100000, max: 1000000, size: 11 },
                { label: '1000000 - 9999999', min: 1000000, max: 10000000, size: 13 },
                { label: '≥ 10000000', min: 10000000, max: Infinity, size: 15 },
            ],
            size_missing: [
                { label: 'No value', min: null, max: null, size: 3 },
                { label: '0 - 9', min: 0, max: 10, size: 4 },
                { label: '10 - 99', min: 10, max: 100, size: 5 },
                { label: '100 - 999', min: 100, max: 1000, size: 6 },
                { label: '1000 - 9999', min: 1000, max: 10000, size: 7 },
                { label: '10000 - 99999', min: 10000, max: 100000, size: 8 },
                { label: '100000 - 999999', min: 100000, max: 1000000, size: 9 },
                { label: '1000000 - 9999999', min: 1000000, max: 10000000, size: 11 },
                { label: '10000000 - 99999999', min: 10000000, max: 100000000, size: 13 },
                { label: '≥ 100000000', min: 100000000, max: Infinity, size: 15 },
            ],
            size_evacuated: [
                { label: 'No value', min: null, max: null, size: 3 },
                { label: '0 - 9', min: 0, max: 10, size: 4 },
                { label: '10 - 99', min: 10, max: 100, size: 5 },
                { label: '100 - 999', min: 100, max: 1000, size: 6 },
                { label: '1000 - 9999', min: 1000, max: 10000, size: 7 },
                { label: '10000 - 99999', min: 10000, max: 100000, size: 8 },
                { label: '100000 - 999999', min: 100000, max: 1000000, size: 9 },
                { label: '1000000 - 9999999', min: 1000000, max: 10000000, size: 11 },
                { label: '10000000 - 99999999', min: 10000000, max: 100000000, size: 13 },
                { label: '≥ 100000000', min: 100000000, max: Infinity, size: 15 },
            ],
            size_popularity: 'n_articles',
            size_articles: [
                { label: '0 - 9', min: 0, max: 10, size: 3 },
                { label: '10 - 99', min: 10, max: 100, size: 6 },
                { label: '100 - 999', min: 100, max: 1000, size: 9 },
                { label: '1000 - 9999', min: 1000, max: 10000, size: 12 },
                { label: '≥ 10000', min: 10000, max: Infinity, size: 15 },
            ],
            size_paragraphs: [
                { label: '0 - 9', min: 0, max: 10, size: 3 },
                { label: '10 - 99', min: 10, max: 100, size: 6 },
                { label: '100 - 999', min: 100, max: 1000, size: 9 },
                { label: '1000 - 9999', min: 1000, max: 10000, size: 12 },
                { label: '≥ 10000', min: 10000, max: Infinity, size: 15 },
            ],
            size_languages: [
                { label: '1 - 5', min: 1, max: 5, size: 3 },
                { label: '6 - 10', min: 6, max: 10, size: 5 },
                { label: '11 - 15', min: 11, max: 15, size: 7 },
                { label: '16 - 20', min: 16, max: 20, size: 9 },
                { label: '21 - 25', min: 21, max: 25, size: 11 },
                { label: '26 - 30', min: 26, max: 30, size: 13 },
                { label: '> 30', min: 31, max: Infinity, size: 15 },
            ],
            size_source_countries: [
                { label: '0 - 20', min: 0, max: 20, size: 3 },
                { label: '21 - 40', min: 21, max: 40, size: 5 },
                { label: '41 - 60', min: 41, max: 60, size: 7 },
                { label: '61 - 80', min: 61, max: 80, size: 9 },
                { label: '81 - 100', min: 81, max: 100, size: 12 },
                { label: '> 100', min: 101, max: Infinity, size: 15 },
            ],
            size_domains: [
                { label: '1 - 50', min: 1, max: 50, size: 3 },
                { label: '51 - 100', min: 51, max: 100, size: 5 },
                { label: '101 - 150', min: 101, max: 150, size: 7 },
                { label: '151 - 200', min: 151, max: 200, size: 9 },
                { label: '201 - 300', min: 201, max: 300, size: 12 },
                { label: '> 300', min: 301, max: Infinity, size: 15 },
            ],

            // Propriétés par défaut du changement de style citizen observer
            style_couleur: 'Type_event',
            couleur_inondation: '#3252a8',
            couleur_landslide: '#4a2c03',
            couleur_tdt: '#b30000',
            couleur_vents_violents: '#339966',
            couleur_grele: '#00ccff',
            couleur_foudre: '#ffcc00',
            couleur_annee: [
                { label: '2020', min: Date.parse("2020-01-01"), max: Date.parse("2021-01-01"), color: '#4db6ac' },
                { label: '2021', min: Date.parse("2021-01-01"), max: Date.parse("2022-01-01"), color: '#81c784' },
                { label: '2022', min: Date.parse("2022-01-01"), max: Date.parse("2023-01-01"), color: '#dce775' },
                { label: '2023', min: Date.parse("2023-01-01"), max: Date.parse("2024-01-01"), color: '#fff176' },
                { label: '2024', min: Date.parse("2024-01-01"), max: Date.parse("2025-01-01"), color: '#ff8a65' },
                { label: '2025', min: Date.parse("2025-01-01"), max: Date.parse("2026-01-01"), color: '#e57373' },
            ],
            couleur_mois: [
                { label: 'Janvier', number: '01', color: '#ed008c' },
                { label: 'Février', number: '02', color: '#d0191b' },
                { label: 'Mars', number: '03', color: '#f06730' },
                { label: 'Avril', number: '04', color: '#f08622' },
                { label: 'Mai', number: '05', color: '#e9eb28' },
                { label: 'Juin', number: '06', color: '#b4e742' },
                { label: 'Juillet', number: '07', color: '#5fc650' },
                { label: 'Août', number: '08', color: '#1fa5a6' },
                { label: 'Septembre', number: '09', color: '#2689c7' },
                { label: 'Octobre', number: '10', color: '#3242a8' },
                { label: 'Novembre', number: '11', color: '#761ca2' },
                { label: 'Decembre', number: '12', color: '#b23593' },
            ],
            couleur_georef_true: '#00cc00',
            couleur_georef_false: '#ff6600',
            style_taille: 'Standard',
            taille_standard: 10,
            taille_impact_humain: 'nb_morts',
            taille_nb_morts: [
                { label: 'No value', min: null, max: null, size: 3 },
                { label: '0 - 9', min: 0, max: 10, size: 6 },
                { label: '10 - 99', min: 10, max: 100, size: 9 },
                { label: '≥ 100', min: 100, max: Infinity, size: 12 },
            ],
            taille_nb_blesses: [
                { label: 'No value', min: null, max: null, size: 3 },
                { label: '0 - 9', min: 0, max: 10, size: 6 },
                { label: '10 - 99', min: 10, max: 100, size: 9 },
                { label: '100 - 999', min: 100, max: 1000, size: 12 },
                { label: '≥ 1000', min: 1000, max: Infinity, size: 15 },
            ],
            taille_nb_sansabris: [
                { label: 'No value', min: null, max: null, size: 3 },
                { label: '0 - 9', min: 0, max: 10, size: 6 },
                { label: '10 - 99', min: 10, max: 100, size: 9 },
                { label: '100 - 999', min: 100, max: 1000, size: 12 },
                { label: '≥ 1000', min: 1000, max: Infinity, size: 15 },
            ],
            taille_autres_impacts: 'impact_betail',
            taille_oui: 10,
            taille_non: 3,

            // Affichage de la fenêtre du filtre
            show_filter_form: false,

            // Affichage menu général du filtre hazminer / citizen observer
            show_general_menu_filter_hazminer: true,
            show_general_menu_filter_co: false,

            // Affichage des différents menus de filtres hazminer         
            show_event_type_filter_hazminer: false, // Affichage du filtre selon le type de catastrophe          
            show_date_filter_hazminer: false, // Affichage du filtre selon la date
            show_location_filter_hazminer: false, // Affichage du filtre selon la localisation       
            show_casualties_filter_hazminer: false, // Affichage du filtre selon l'impact       
            show_popularity_filter_hazminer: false, // Affichage du filtre selon la popularité        
            
            // Affichage des différents menus de filtres citizen observer
            show_type_event_filter_co: false, // Affichage du filtre selon le type de catastrophe
            show_date_filter_co: false, // Affichage du filtre selon la date
            show_location_filter_co: false, // Affichage du filtre selon la localisation     
            show_impact_filter_co: false, // Affichage du filtre selon l'impact          
            
            // Filtres hazminer
            // Filtre selon le type de catastrophe 
            flood: true,
            flashflood: true,
            landslide: true,
            // Filtre selon la date
            min_date_hazminer: "01-01-1750",
            max_date_hazminer: "31-12-2100",
            start_date_hazminer: "01-01-1750",
            end_date_hazminer: "31-12-2100",
            flatpickr_start_hazminer: null,
            flatpickr_end_hazminer: null,
            duration_filter: [
                { id: 'duration', label: 'Duration:', min: 0, max: 200, min_depart: 0, max_depart: 200 },
            ],
            // Filtre selon la localisation
            chosen_country_hazminer: 'All',
            substring_country_hazminer: '',
            research_country_list_hazminer: [],
            draw: null,
            draw_actif: false,
            features_polygon: [],
            extent_filter: [
                { id: 'latitude', label: 'Latitude', min: -90, max: 90, min_depart: -90, max_depart: 90 },
                { id: 'longitude', label: 'Longitude', min: -180, max: 180, min_depart: -180, max_depart: 180 },
            ],
            // Filtre selon l'impact
            impact_filter_hazminer: [
                { id: 'median_death', label: 'Median death:', checkbox_null: true, min: 1, max: 35000, min_depart: 1, max_depart: 35000 },
                { id: 'median_injured', label: 'Median injured:', checkbox_null: true, min: 1, max: 900000000, min_depart: 1, max_depart: 900000000 },
                { id: 'median_affected', label: 'Median affected:', checkbox_null: true, min: 1, max: 1600000000, min_depart: 1, max_depart: 1600000000 },
                { id: 'median_homeless', label: 'Median homeless:', checkbox_null: true, min: 1, max: 23000000, min_depart: 1, max_depart: 23000000 },
                { id: 'median_missing', label: 'Median missing:', checkbox_null: true, min: 1, max: 140000000, min_depart: 1, max_depart: 140000000 },
                { id: 'median_evacuated', label: 'Median evacuated:', checkbox_null: true, min: 1, max: 185000000, min_depart: 1, max_depart: 185000000 },
            ],
            // Filtre selon la popularité
            popularity_filter: [
                { id: 'n_articles', label: 'Number of articles:', min: 1, max: 25000, min_depart: 1, max_depart: 25000 },
                { id: 'n_paragraphs', label: 'Number of paragraphs:', min: 1, max: 60000, min_depart: 1, max_depart: 60000 },
                { id: 'n_languages', label: 'Number of languages:', min: 1, max: 40, min_depart: 1, max_depart: 40 },
                { id: 'n_source_countries', label: 'Number of source countries:', min: 0, max: 120, min_depart: 0, max_depart: 120 },
                { id: 'n_domains', label: 'Number of domains:', min: 1, max: 3000, min_depart: 1, max_depart: 3000 },
            ],

            // Filtres citizen observer
            // Filtre selon le type de catastrophe 
            inondation: true,
            glissement_terrain: true,
            tdt: true,
            vents_violents: true,
            grele: true,
            foudre: true,
            // Filtre selon la date
            min_date_co: "01-01-2020",
            max_date_co: "31-12-2025",
            start_date_co: "01-01-2020",
            end_date_co: "31-12-2025",
            flatpickr_start_co: null,
            flatpickr_end_co: null,
            // Filtre selon la localisation
            chosen_province_co: 'All',
            chosen_territoire_co: 'All',
            province_list_co: ["Sud Kivu", "Nord Kivu"],
            territoire_list_co: ["Beni Territoire", "Beni Ville", "Bukavu", "Butembo", "Goma ", "Idjwi", "Kabare", "Kalehe", "Lubero", "Masisi", "Nyiragongo", 
                "Rutshuru", "Uvira", "Walikale", "Walungu"],
            // Filtre selon l'impact
            impact_chiffre_filter_co: [
                { id: 'nb_morts', label: 'Nombre de morts:', checkbox_null: true, min: 0, max: 300, min_depart: 0, max_depart: 300 },
                { id: 'nb_blesses', label: 'Nombre de blessés:', checkbox_null: true, min: 0, max: 3000, min_depart: 0, max_depart: 3000 },
                { id: 'nb_sansabris', label: 'Nombre de sans abris:', checkbox_null: true, min: 0, max: 5000, min_depart: 0, max_depart: 5000 },
            ],
            impact_bool_filter_co: [
                { id: 'impact_betail', label: 'Impact bétail:', checkbox_impact: false },
                { id: 'impact_logement', label: 'Impact logement:', checkbox_impact: false },
                { id: 'impact_routes', label: 'Impact routes:', checkbox_impact: false },
                { id: 'impact_ponts', label: 'Impact ponts:', checkbox_impact: false },
                { id: 'impact_autres', label: 'Impact autres:', checkbox_impact: false },
                { id: 'impact_coupures_elec', label: 'Impact coupures électricité:', checkbox_impact: false },
                { id: 'impact_eau_consommation', label: "Impact sources d'eau de consommation:", checkbox_impact: false },
                { id: 'impact_cultures', label: 'Impact cultures:', checkbox_impact: false },
            ],

            // Affichage de la fenêtre de téléchargement
            show_download_form: false,

            // Choix du mode de téléchargement
            download_filter_e_hazminer: true,
            download_filter_p_hazminer: false,
            download_filter_e_p_hazminer: false,
            download_all_e_hazminer: false,
            download_filter_co: false,
            download_all_co: false,

            // Barre de progression du téléchargement
            show_fetch_progression: false,
            show_download_progression: false,
            fetch_progression: 0,
            download_progression: 0,

        };

    },

    computed: {

        // Liste des impacts des évènements hazminer (pour changer le style)
        casualties_hazminer_list() {
            return [
                { id: 'median_death', label: 'Median death', table: this.size_death },
                { id: 'median_injured', label: 'Median injured', table: this.size_injured },
                { id: 'median_affected', label: 'Median affected', table: this.size_affected },
                { id: 'median_homeless', label: 'Median homeless', table: this.size_homeless },
                { id: 'median_missing', label: 'Median missing', table: this.size_missing },
                { id: 'median_evacuated', label: 'Median evacuated', table: this.size_evacuated },
            ];
        },

        // Liste de la popularité des évènements hazminer (pour changer le style)
        popularity_hazminer_list() {
            return [
                { id: 'n_articles', label: 'Number of articles', table: this.size_articles },
                { id: 'n_paragraphs', label: 'Number of paragraphs', table: this.size_paragraphs },
                { id: 'n_languages', label: 'Number of languages', table: this.size_languages },
                { id: 'n_source_countries', label: 'Number of source countries', table: this.size_source_countries },
                { id: 'n_domains', label: 'Number of domains', table: this.size_domains },
            ];
        },

        // Liste des impacts des évènements citizen observer (pour changer le style)
        human_casualties_co_list() {
            return [
                { id: 'nb_morts', label: 'Nombre de morts', table: this.taille_nb_morts },
                { id: 'nb_blesses', label: 'Nombre de blessés', table: this.taille_nb_blesses },
                { id: 'nb_sansabris', label: 'Nombre de sans abris', table: this.taille_nb_sansabris },
            ];
        },

        // Liste des impacts non humains des évènements citizen observer (pour changer le style)
        other_casualties_co_list() {
            return [
                { id: 'impact_betail', label: 'Impact bétail' },
                { id: 'impact_logement', label: 'Impact logement' },
                { id: 'impact_routes', label: 'Impact routes' },
                { id: 'impact_ponts', label: 'Impact ponts' },
                { id: 'impact_autres', label: 'Impact autres' },
                { id: 'impact_coupures_elec', label: 'Impact coupures électricité' },
                { id: 'impact_eau_consommation', label: "Impact sources d'eau de consommation" },
                { id: 'impact_cultures', label: 'Impact cultures' },
            ];
        },

    },

    methods: {

        // Calcul de l'emprise de l'écran
        // Pas utilisée
        screen_bbox() {

            // Récupération de l'emprise de l'écran
            let extent3857 = this.map.getView().calculateExtent(this.map.getSize());

            // Conversion des coordonnées du 3857 au 4326
            let coord_transfo = [
                ol.proj.transform([extent3857[0], extent3857[1]], 'EPSG:3857', 'EPSG:4326'),
                ol.proj.transform([extent3857[2], extent3857[3]], 'EPSG:3857', 'EPSG:4326'),
            ];
            let extent4326 = [].concat(...coord_transfo);
            let min_lon = extent4326[0];
            let min_lat = extent4326[1];
            let max_lon = extent4326[2];
            let max_lat = extent4326[3];

            return { min_lon, min_lat, max_lon, max_lat };

        },

        // Création de la variable visibilité de l'évènement hazminer, qui dépend des filtres actifs
        set_new_feature_hazminer_visibility(feature) {

            // Dates ne dépendent plus du fuseau horaire
            feature.set('event_time', dayjs(feature.get('event_time')).format("YYYY-MM-DD HH:mm:ss"));
            feature.set('start_time', dayjs(feature.get('start_time')).format("YYYY-MM-DD HH:mm:ss"));
            feature.set('end_time', dayjs(feature.get('end_time')).format("YYYY-MM-DD HH:mm:ss"));

            // Si l'évènement n'est pas déjà dans la couche :
            let exists = this.events_hazminer_layer.getSource().getFeatureById(feature.getId());
            if (!exists.get('visible')) {

                // Dates du filtre en format y-m-d
                let start_date_hazminer_ymd = this.start_date_hazminer.substring(6,10) + '-' + this.start_date_hazminer.substring(3,5) + '-' + this.start_date_hazminer.substring(0,2) + ' 00:00:00';
                let end_date_hazminer_ymd = this.end_date_hazminer.substring(6,10) + '-' + this.end_date_hazminer.substring(3,5) + '-' + this.end_date_hazminer.substring(0,2) + ' 00:00:00';

                // Propriété visibilité dépend des filtres
                this.set_feature_hazminer_visibility(exists, start_date_hazminer_ymd, end_date_hazminer_ymd);

            }

        },

        // Création de la variable visibilité de l'évènement citizen observer, qui dépend des filtres actifs
        set_new_feature_co_visibility(feature) {

            // Date ne dépend plus du fuseau horaire
            feature.set('event_date', dayjs(feature.get('event_date')).format("YYYY-MM-DD HH:mm:ss"));

            // Si l'évènement n'est pas déjà dans la couche :
            let exists = this.events_co_layer.getSource().getFeatureById(feature.getId());
            if (!exists.get('visible')) {

                // Dates du filtre en format y-m-d
                let start_date_co_ymd = this.start_date_co.substring(6,10) + '-' + this.start_date_co.substring(3,5) + '-' + this.start_date_co.substring(0,2) + ' 00:00:00';
                let end_date_co_ymd = this.end_date_co.substring(6,10) + '-' + this.end_date_co.substring(3,5) + '-' + this.end_date_co.substring(0,2) + ' 00:00:00';

                // Propriété visibilité dépend des filtres
                this.set_feature_co_visibility(exists, start_date_co_ymd, end_date_co_ymd);

            }

        },

        // Créer les listes de pays
        set_countries_list() {

            this.countries_list = [];
            this.research_country_list_hazminer = [];
            let countries = this.countries_layer.getSource().getFeatures();
            for (let country of countries) {
                this.countries_list.push(country.values_.admin);
                this.research_country_list_hazminer.push(country.values_.admin);
            }
            this.countries_list.sort();
            this.research_country_list_hazminer.sort();

        },

        // Permet de compter le nombre d'évènements par pays
        // Pas utilisée
        async count_nb_event_country() {

            let nb_events_country = [];
            for (country of this.countries_list) {
                let cql_filter = `country_found = '${country}'`;
                let url_n_events = `http://localhost:8080/geoserver/webGIS/ows?service=WFS&version=1.1.0&request=GetFeature&typeName=webGIS:events` 
                    + `&outputFormat=application/json` + `&resultType=hits` + `&CQL_FILTER=` + encodeURIComponent(cql_filter);
                let xml_string = await fetch(url_n_events).then(r => r.text());
                let xml_doc = new DOMParser().parseFromString(xml_string, "application/xml");
                let feature_collection = xml_doc.querySelector("wfs\\:FeatureCollection, FeatureCollection");
                let n_events = parseInt(feature_collection.getAttribute("numberOfFeatures"));
                nb_events_country.push([country,n_events]);
            }
            let nb_events_country_sort = nb_events_country.sort((a, b) => {
                return b[1] - a[1];
            });
            return nb_events_country_sort;

        },

        // Crée le texte en récupérant les infos sur l'évènement, change le style de l'évènement
        show_selected_event_data(feature) {

            // Evènement hazminer
            if (feature.get('hazard_type')) {

                this.selected_event_type = 'hazminer';

                // Chargement et affichage du texte sur l'évènement
                this.event_main_text_hazminer = '<ul>';
                this.event_other_text_hazminer = '<ul>';
                this.event_location_text_hazminer = '<ul>';
                this.event_number_text_hazminer = '<ul>';

                // Les propriétés principales s'affichent tout le temps
                for (let i = 0; i < this.event_main_properties_hazminer.length; i++) {
                    if (["event_time", "start_time", "end_time"].includes(this.event_main_properties_hazminer[i])) {
                        this.event_main_text_hazminer += '<li>' + this.event_main_properties_hazminer_title[i] + ': ' 
                        + feature.get(this.event_main_properties_hazminer[i]).substring(0,10) + '</li>';
                    }
                    else {
                        this.event_main_text_hazminer += '<li>' + this.event_main_properties_hazminer_title[i] + ': ' 
                        + feature.get(this.event_main_properties_hazminer[i]) + '</li>';
                    }     
                }
                // Les propriétés supplémentaires se chargent, mais elles ne s'affichent que si le bouton Show other information est coché
                // L'utilisateur peut choisir s'il veut afficher les informations supplémentaires ou non, son choix est conservé
                for (let i = 0; i < this.event_other_properties_hazminer.length; i++) {
                    this.event_other_text_hazminer += '<li>' + this.event_other_properties_hazminer_title[i] + ': ' 
                    + feature.get(this.event_other_properties_hazminer[i]) + '</li>';
                }
                // Les propriétés sur la localisation se chargent, mais elles ne s'affichent que si le bouton Show location information est coché
                // L'utilisateur peut choisir s'il veut afficher les informations sur la localisation ou non, son choix est conservé
                for (let i = 0; i < this.event_location_properties_hazminer.length; i++) {
                    this.event_location_text_hazminer += '<li>' + this.event_location_properties_hazminer_title[i] + ': ' 
                    + feature.get(this.event_location_properties_hazminer[i]) + '</li>';
                }
                // Les propriétés statistiques se chargent, mais elles ne s'affichent que si le bouton Show more statistics est coché
                // L'utilisateur peut choisir s'il veut afficher les informations statistiques ou non, son choix est conservé
                for (let i = 0; i < this.event_number_properties_hazminer.length; i++) {
                    this.event_number_text_hazminer += '<li>' + this.event_number_properties_hazminer_title[i] + ': ' 
                    + feature.get(this.event_number_properties_hazminer[i]) + '</li>';
                }

                this.event_main_text_hazminer += '</ul>';
                this.event_other_text_hazminer += '</ul>';
                this.event_location_text_hazminer += '</ul>';
                this.event_number_text_hazminer += '</ul>';

            }

            // Evènement citizen observer
            if (feature.get('type_event')) {

                this.selected_event_type = 'citizen oberver';

                // Chargement et affichage du texte sur l'évènement
                this.event_main_text_co = '<ul>';
                this.event_impact_text_co = '<ul>';
                this.event_location_text_co = '<ul>';
                this.event_specific_text_co = '<ul>';

                // Les propriétés principales s'affichent tout le temps
                for (let i = 0; i < this.event_main_properties_co.length; i++) {
                    if (this.event_main_properties_co[i] === 'event_date') {
                        this.event_main_text_co += '<li>' + this.event_main_properties_co_title[i] + ': ' 
                        + feature.get(this.event_main_properties_co[i]).substring(0,10) + '</li>';
                    }
                    else {
                        this.event_main_text_co += '<li>' + this.event_main_properties_co_title[i] + ': ' 
                        + feature.get(this.event_main_properties_co[i]) + '</li>';
                    }
                }
                // Les propriétés sur l'impact de l'event se chargent, mais elles ne s'affichent que si le bouton Afficher les informations sur l'impact est coché
                // L'utilisateur peut choisir s'il veut afficher les informations sur l'impact ou non, son choix est conservé
                for (let i = 0; i < this.event_impact_properties_co.length; i++) {
                    this.event_impact_text_co += '<li>' + this.event_impact_properties_co_title[i] + ': ' 
                    + feature.get(this.event_impact_properties_co[i]) + '</li>';
                }
                // Les propriétés sur la localisation se chargent, mais elles ne s'affichent que si le bouton Afficher les informations de localisation est coché
                // L'utilisateur peut choisir s'il veut afficher les informations sur la localisation ou non, son choix est conservé
                for (let i = 0; i < this.event_location_properties_co.length; i++) {
                    if (this.event_location_properties_co[i] === 'donnees_georeferencees') {
                        if (feature.get('donnees_georeferencees') === true) {
                            this.event_location_text_co += '<li>' + 'Position exacte (données géoréférencées)'+ '</li>';
                        }
                        else {
                            this.event_location_text_co += '<li>' + 'Point placé au centre du territoire (données non géoréférencées)'+ '</li>';
                        }
                    }
                    else {
                        this.event_location_text_co += '<li>' + this.event_location_properties_co_title[i] + ': ' 
                        + feature.get(this.event_location_properties_co[i]) + '</li>';
                    }
                }
                // Si l'évènement possède des informations supplémentaires selon son type, ces propriétés se chargent, mais elles ne s'affichent que si le bouton 
                // Afficher les informations spécifiques est coché
                // L'utilisateur peut choisir s'il veut afficher les informations spécifiques ou non, son choix est conservé
                let type_event = feature.get('type_event');
                if (['Glissement de terrain', 'Inondation', 'Tempête de grêle', 'Tempête de vents violents', 'Tremblement de terre'].includes(type_event)) {
                    this.event_specific_co = true;
                    let type_prop = '';
                    if (type_event === 'Glissement de terrain') {
                        type_prop = 'landslide';
                        this.text_checkbox = 'Afficher les informations spécifiques au glissement de terrain:';
                    }
                    if (type_event === 'Inondation') {
                        type_prop = 'inondation';
                        this.text_checkbox = "Afficher les informations spécifiques à l'inondation:";
                    }
                    if (type_event === 'Tempête de grêle') {
                        type_prop = 'grele';
                        this.text_checkbox = 'Afficher les informations spécifiques à la tempête de grêle:';
                    }
                    if (type_event === 'Tempête de vents violents') {
                        type_prop = 'vents_violents';
                        this.text_checkbox = 'Afficher les informations spécifiques à la tempête de vents violents:';
                    }
                    if (type_event === 'Tremblement de terre') {
                        type_prop = 'tdt';
                        this.text_checkbox = 'Afficher les informations spécifiques au tremblement de terre:';
                    }
                    let event_specific_properties_co = this['event_' + type_prop + '_properties_co'];
                    let event_specific_properties_co_title = this['event_' + type_prop + '_properties_co_title'];
                    for (let i = 0; i < event_specific_properties_co.length; i++) {
                        this.event_specific_text_co += '<li>' + event_specific_properties_co_title[i] + ': ' 
                        + feature.get(event_specific_properties_co[i]) + '</li>';
                    }
                }
                else {
                    this.event_specific_co = false;
                }
                
                this.event_main_text_co += '</ul>';
                this.event_impact_text_co += '</ul>';
                this.event_location_text_co += '</ul>';
                this.event_specific_text_co += '</ul>';

            }     

            // Affichage contours de la zone de texte
            document.getElementById('event_data_map_scroll_box').style.border = "1px solid #ccc";

            // Garder l'évènement actuel
            this.selected_event = feature;

            // Couche de l'évènement sélectionné vidée
            this.selected_event_layer.getSource().clear();

            // Evènement sélectionné ajouté à la couche de l'évènement sélectionné : permet de voir l'évènement
            this.selected_event_layer.getSource().addFeature(feature);

        },

        // Fonction appelée quand on appuie sur le bouton pour avoir plus d'informations
        // Ouvre un autre onglet qui affiche les paragraphes et l'emprise associée à l'évènement
        more_infos_page() {

            // Récupérer l'identifiant de l'évènement
            let event_id = this.selected_event.get('event_id');

            // Créer l'url
            let url = `/event?event_id=${encodeURIComponent(event_id)}`;

            // Ouvrir l'onglet avec les informetions liés à l'évènement
            window.open(url, '_blank').focus();

            // Ouvrir la page des informations de l'évènement dans le même onglet
            // window.location.href = url;

        },

        // Change la / les variable(s) passée(s) en paramètre (true/false)
        change_true_false(parameters) {

            for (let parameter of parameters) {
                this[parameter] = !this[parameter];
            }

        },

        // Affiche la fenêtre de changement de style, ferme les autres fenêtres ouvertes
        setup_change_style_form() {

            this.show_change_style_form = !this.show_change_style_form;
            this.show_filter_form = false;
            this.show_download_form = false;

        },

        // Création du style de chaque évènement hazminer selon ses propriétés et le style choisi
        creation_style_hazminer(color_fixed = null) {

            return (feature) => {

                // Evènement invisible si il ne respecte pas les critères de filtrage
                if (feature.get('visible') === false) {
                    return new ol.style.Style({});
                }

                else {

                    // Définition de la couleur
                    let color;
                    if (color_fixed) {
                        color = color_fixed;
                    }
                    else if (this.color_style === 'Event_type') {
                        let hazard_type = feature.get('hazard_type');
                        switch (hazard_type) {
                        case 'flood':
                            color = this.color_flood;
                            break;
                        case 'flash flood':
                            color = this.color_flashflood;
                            break;
                        case 'landslide':
                            color = this.color_landslide;
                            break;
                        }
                    }
                    else if (this.color_style === 'Year') {
                        let date = Date.parse(feature.get('event_time'));
                        let date_interval = this.color_year.find(interval => {
                            return date >= interval.min && date <= interval.max;
                        });
                        color = date_interval.color;
                    }
                    else if (this.color_style === 'Month') {
                        let month_str = feature.get('event_time').substring(5,7);
                        let month = this.color_month.find(interval => {
                            return month_str === interval.number;
                        });
                        color = month.color;
                    }
            
                    // Définition de la taille
                    let size;
                    if (this.size_style === 'Standard') {
                        size = this.size_standard;
                    } 
                    else if (this.size_style === 'Duration') {
                        let duration = parseFloat(feature.get('duration'));
                        let duration_interval = this.size_duration.find(interval => {
                            return duration >= interval.min && duration <= interval.max;
                        });
                        size = duration_interval.size;
                    }
                    else if (this.size_style === 'Casualties') {
                        for (let i = 0; i < this.casualties_hazminer_list.length; i++) {
                            if (this.size_casualties === this.casualties_hazminer_list[i].id) {
                                let property = feature.get(this.casualties_hazminer_list[i].id);
                                let property_interval = this.casualties_hazminer_list[i].table.find(interval => {
                                    if (interval.min === null && interval.max === null) {
                                        return property === null;
                                    }
                                    return property >= interval.min && property <= interval.max;
                                });          
                                size = property_interval.size;
                            }
                        }
                    } 
                    else if (this.size_style === 'Popularity') {
                        for (let i = 0; i < this.popularity_hazminer_list.length; i++) {
                            if (this.size_popularity === this.popularity_hazminer_list[i].id) {
                                let property = feature.get(this.popularity_hazminer_list[i].id);
                                let property_interval = this.popularity_hazminer_list[i].table.find(interval => {
                                    if (interval.min === null && interval.max === null) {
                                        return property === null;
                                    }
                                    return property >= interval.min && property <= interval.max;
                                });          
                                size = property_interval.size;
                            }
                        }
                    } 
            
                    return new ol.style.Style({
                        image: new ol.style.Circle({
                            radius: size * this.actual_zoom_factor,
                            fill: new ol.style.Fill({
                                color: color,
                            }),
                        })
                    });

                }
                
            };

        },

        // Création du style de chaque évènement citizen observer selon ses propriétés et le style choisi
        creation_style_co(color_fixed = null) {

            return (feature) => {

                // Evènement invisible si il ne respecte pas les critères de filtrage
                if (feature.get('visible') === false) {
                    return new ol.style.Style({});
                }

                else {

                    // Définition de la couleur
                    let color;
                    if (color_fixed) {
                        color = color_fixed;
                    }
                    else if (this.style_couleur === 'Type_event') {
                        let type_event = feature.get('type_event');
                        switch (type_event) {
                        case 'Inondation':
                            color = this.couleur_inondation;
                            break;
                        case 'Glissement de terrain':
                            color = this.couleur_landslide;
                            break;
                        case 'Tremblement de terre':
                            color = this.couleur_tdt;
                            break;
                        case 'Tempête de vents violents':
                            color = this.couleur_vents_violents;
                            break;
                        case 'Tempête de grêle':
                            color = this.couleur_grele;
                            break;
                        case 'Foudre':
                            color = this.couleur_foudre;
                            break;
                        }
                    }
                    else if (this.style_couleur === 'Annee') {
                        let date = Date.parse(feature.get('event_date'));
                        let date_interval = this.couleur_annee.find(interval => {
                            return date >= interval.min && date <= interval.max;
                        });
                        color = date_interval.color;
                    }
                    else if (this.style_couleur === 'Mois') {
                        let month_str = feature.get('event_date').substring(5,7);
                        let month = this.couleur_mois.find(interval => {
                            return month_str === interval.number;
                        });
                        color = month.color;
                    }
                    else if (this.style_couleur === 'Georeferencees') {
                        let georef = feature.get('donnees_georeferencees');
                        if (georef) { color = this.couleur_georef_true }
                        else { color = this.couleur_georef_false }
                    }
                    
                    // Définition de la taille
                    let size;
                    if (this.style_taille === 'Standard') {
                        size = this.taille_standard;
                    } 
                    else if (this.style_taille === 'Impact_humain') {
                        for (let i = 0; i < this.human_casualties_co_list.length; i++) {
                            if (this.taille_impact_humain === this.human_casualties_co_list[i].id) {
                                let property = feature.get(this.human_casualties_co_list[i].id);
                                let property_interval = this.human_casualties_co_list[i].table.find(interval => {
                                    if (interval.min === null && interval.max === null) {
                                        return property === null;
                                    }
                                    return property >= interval.min && property <= interval.max;
                                });          
                                size = property_interval.size;
                            }
                        }
                    } 
                    else if (this.style_taille === 'Autres_impacts') {
                        for (let i = 0; i < this.other_casualties_co_list.length; i++) {
                            if (this.taille_autres_impacts === this.other_casualties_co_list[i].id) {
                                let property = feature.get(this.other_casualties_co_list[i].id);
                                if (property === 'non') { size = this.taille_non }
                                else { size = this.taille_oui }
                            }
                        }
                    } 
                    
                    return new ol.style.Style({
                        image: new ol.style.Circle({
                            radius: size * this.actual_zoom_factor,
                            fill: new ol.style.Fill({
                                color: color,
                            }),
                        })
                    });

                }
                
            };

        },

        // Change tous les styles (couches évènements et évènement sélectionné)
        change_style_all() {

            this.change_style_events();
            this.change_style_selected_event();

        },

        // Change le style des couches évènements
        change_style_events() {

            this.events_hazminer_layer.setStyle(this.creation_style_hazminer());
            this.events_co_layer.setStyle(this.creation_style_co());

        },

        // Change le style de l'évènement sélectionné (couleur imposée)
        change_style_selected_event() {

            if (this.selected_event != null && this.selected_event.get('hazard_type')) {
                this.selected_event_layer.setStyle(this.creation_style_hazminer('rgba(0, 255, 0, 1)'));
            }
            if (this.selected_event != null && this.selected_event.get('type_event')) {
                this.selected_event_layer.setStyle(this.creation_style_co('rgba(0, 255, 0, 1)'));
            }

        },

        // Affiche la fenêtre du filtre, ferme les autres fenêtres ouvertes
        // Initialisation des calendriers
        setup_filter_form() {

            this.show_filter_form = !this.show_filter_form;
            this.show_change_style_form = false;
            this.show_download_form = false;

            this.set_flatpickr();

        },

        // Affiche le bon menu du filtre (hazminer / citizen observer)
        // Initialisation des calendriers
        setup_filter_change_menu() {

            this.show_general_menu_filter_hazminer = !this.show_general_menu_filter_hazminer;
            this.show_general_menu_filter_co = !this.show_general_menu_filter_co;

            this.set_flatpickr();

        },

        // Affiche le filtre dates hazminer
        // Initialisation des calendriers
        display_hazminer_date_filter() {

            this.show_date_filter_hazminer = !this.show_date_filter_hazminer;

            this.set_flatpickr();
        
        },

        // Affiche le filtre dates citizen observer
        // Initialisation des calendriers
        display_co_date_filter() {

            this.show_date_filter_co = !this.show_date_filter_co;

            this.set_flatpickr();
        
        },

        // Initialise les calendriers
        set_flatpickr() {

            // Calendriers hazminer
            if (this.show_date_filter_hazminer && this.show_general_menu_filter_hazminer) {

                this.$nextTick(() => {

                    // Calandrier pour sélectionner la date de départ
                    let start_date_hazminer_input = document.querySelector('input[data-id="start_date_hazminer"]');
                    this.flatpickr_start_hazminer = flatpickr(start_date_hazminer_input, {
                        dateFormat: "d-m-Y",
                        minDate: this.min_date_hazminer,
                        maxDate: this.max_date_hazminer,
                        defaultDate: this.start_date_hazminer,
                        onChange: (selected_dates, date_str) => {
                            this.start_date_hazminer = date_str;
                        }
                    });
        
                    // Calandrier pour sélectionner la date de fin
                    let end_date_hazminer_input = document.querySelector('input[data-id="end_date_hazminer"]');
                    this.flatpickr_end_hazminer = flatpickr(end_date_hazminer_input, {
                        dateFormat: "d-m-Y",
                        minDate: this.min_date_hazminer,
                        maxDate: this.max_date_hazminer,
                        defaultDate: this.end_date_hazminer,
                        onChange: (selected_dates, date_str) => {
                            this.end_date_hazminer = date_str;
                        }
                    });

                });

            }

            // Calendriers citizen observer
            if (this.show_date_filter_co && this.show_general_menu_filter_co) {

                this.$nextTick(() => {

                    // Calandrier pour sélectionner la date de départ
                    let start_date_co_input = document.querySelector('input[data-id="start_date_co"]');
                    this.flatpickr_start_co = flatpickr(start_date_co_input, {
                        dateFormat: "d-m-Y",
                        minDate: this.min_date_co,
                        maxDate: this.max_date_co,
                        defaultDate: this.start_date_co,
                        onChange: (selected_dates, date_str) => {
                            this.start_date_co = date_str;
                        }
                    });
        
                    // Calandrier pour sélectionner la date de fin
                    let end_date_co_input = document.querySelector('input[data-id="end_date_co"]');
                    this.flatpickr_end_co = flatpickr(end_date_co_input, {
                        dateFormat: "d-m-Y",
                        minDate: this.min_date_co,
                        maxDate: this.max_date_co,
                        defaultDate: this.end_date_co,
                        onChange: (selected_dates, date_str) => {
                            this.end_date_co = date_str;
                        }
                    });

                });

            }

        },

        // Vérifie si la valeur entrée est valide (nombre entre les valeurs min et max)
        validate_input(event, n_min_depart, n_max_depart) {

            // Calcule la prochaine valeur
            let input = event.target;
            let value = input.value;
            let selection_start = input.selectionStart;
            let selection_end = input.selectionEnd;
            let inserted_text = event.data || '';
            let next_value = value.slice(0, selection_start) + inserted_text + value.slice(selection_end);
    
            // Autorise les nombres négatifs et décimaux
            // La regex autorise : chiffres, un seul "-", un seul "." (dans une position correcte)
            if (!/^-?\d*\.?\d*$/.test(next_value)) {
                event.preventDefault();
                return;
            }

            // Convertit la valeur en nombre flottant
            let float_val = parseFloat(next_value);
            
            // Ignore si la valeur n'est pas encore un nombre valide (ex : "-")
            if (isNaN(float_val)) return;

            // Empêche la saisie si la valeur est hors des bornes
            if (float_val < n_min_depart || float_val > n_max_depart) {
                event.preventDefault();
            }

        },

        // Affiche les pays correspondant à la chaine de caractères tapée
        input_search_country() {

            this.research_country_list_hazminer = [];
            for (let country of this.countries_list) {
                if (country.toLowerCase().includes(this.substring_country_hazminer)) {
                    this.research_country_list_hazminer.push(country);
                }
            }
            if (this.substring_country_hazminer === '') {
                this.chosen_country_hazminer = 'All';
            }
            else if (this.research_country_list_hazminer.length === 0) {
                this.chosen_country_hazminer = 'All';
            }
            else {
                this.chosen_country_hazminer = this.research_country_list_hazminer[0];
            }

        },

        // Gestion de l'interaction de dessin
        add_draw() {

            // Si l'interaction de dessin est active
            if (this.draw_actif) {

                // Interaction de dessin désactivée
                this.draw_actif = false;
                this.map.removeInteraction(this.draw);

            }

            // Si l'interaction de dessin n'est pas active
            else {

                // Si un polygone existe déjà, on le supprime
                if (this.draw_layer.getSource().getFeatures().length === 1) {
                    this.draw_layer.getSource().clear();
                }

                // Interaction de dessin activée
                this.draw_actif = true;
                this.draw = new ol.interaction.Draw({
                    source: this.draw_layer.getSource(),
                    type: "Polygon",
                });
                this.map.addInteraction(this.draw);

                // Quand le polygone est dessiné
                this.draw.on("drawend", (event) => {

                    let polygon = event.feature.getGeometry();

                    // Récupération des évènements dans l'emprise du polygone
                    let features_polygon_extent = [];
                    this.events_hazminer_layer.getSource().forEachFeatureIntersectingExtent(polygon.getExtent(), (feature) => {
                        features_polygon_extent.push(feature);
                    });

                    // Récupération des évènements intersectant le polygone
                    this.features_polygon = [];
                    for (feature of features_polygon_extent) {
                        let point = feature.getGeometry().getCoordinates();
                        if (polygon.intersectsCoordinate(point)) {
                            this.features_polygon.push(feature);
                        }
                    }

                });

            }

        },

        // Réinitialiser la couche de dessin
        reset_draw() {

            this.draw_layer.getSource().clear();
            this.features_polygon = [];
            this.apply_filters();

        },

        // Crée le polynome du choix manuel de l'emprise
        extent_polygon() {

            // Couche du polygone du choix manuel de l'emprise vidée
            this.extent_layer.getSource().clear();

            // Projection en 3857
            let coord_transfo = [
                ol.proj.fromLonLat([this.extent_filter[1].min, this.extent_filter[0].min]),
                ol.proj.fromLonLat([this.extent_filter[1].max, this.extent_filter[0].max]),
            ];
            let extent3857 = [].concat(...coord_transfo);
            let min_lon = extent3857[0];
            let min_lat = extent3857[1];
            let max_lon = extent3857[2];
            let max_lat = extent3857[3];

            // Création du rectangle à l'aide de ses coordonnées
            let extent_polygon = new ol.Feature(
                ol.geom.Polygon.fromExtent([min_lon, min_lat, max_lon, max_lat])
            );

            // Ajout à la couche du polygone du choix manuel de l'emprise
            this.extent_layer.getSource().addFeature(extent_polygon);

        },

        // Réinitialise le choix manuel de l'emprise
        reset_extent() {

            this.extent_layer.getSource().clear();
            for(let i = 0; i < this.extent_filter.length; i++) {           
                this.extent_filter[i].min = this.extent_filter[i].min_depart;
                this.extent_filter[i].max = this.extent_filter[i].max_depart;
            }
            this.apply_filters();

        },

        // Réinitialise le formulaire des filtres
        reset_filter_form() {

            // Remet les propriétés à leur état initial
            // Propriétés hazminer
            this.flood = true;
            this.flashflood = true;
            this.landslide = true;
            this.start_date_hazminer = this.min_date_hazminer;
            this.end_date_hazminer = this.max_date_hazminer;
            this.duration_filter[0].min = this.duration_filter[0].min_depart;
            this.duration_filter[0].max = this.duration_filter[0].max_depart;
            this.chosen_country_hazminer = 'All';
            this.substring_country_hazminer = '';
            this.set_countries_list();
            this.draw_layer.getSource().clear();
            this.features_polygon = [];
            this.extent_layer.getSource().clear();
            for(let i = 0; i < this.extent_filter.length; i++) {           
                this.extent_filter[i].min = this.extent_filter[i].min_depart;
                this.extent_filter[i].max = this.extent_filter[i].max_depart;
            }
            for(let i = 0; i < this.impact_filter_hazminer.length; i++) {
                this.impact_filter_hazminer[i].checkbox_null = true;              
                this.impact_filter_hazminer[i].min = this.impact_filter_hazminer[i].min_depart;
                this.impact_filter_hazminer[i].max = this.impact_filter_hazminer[i].max_depart;
            }
            for(let i = 0; i < this.popularity_filter.length; i++) {           
                this.popularity_filter[i].min = this.popularity_filter[i].min_depart;
                this.popularity_filter[i].max = this.popularity_filter[i].max_depart;
            }            
            // Propriétés citizen observer
            this.inondation = true;
            this.glissement_terrain = true;
            this.tdt = true;
            this.vents_violents = true;
            this.grele = true;
            this.foudre = true;
            this.start_date_co = this.min_date_co;
            this.end_date_co = this.max_date_co;
            this.chosen_province_co = 'All';
            this.chosen_territoire_co = 'All';
            for(let i = 0; i < this.impact_chiffre_filter_co.length; i++) {
                this.impact_chiffre_filter_co[i].checkbox_null = true;              
                this.impact_chiffre_filter_co[i].min = this.impact_chiffre_filter_co[i].min_depart;
                this.impact_chiffre_filter_co[i].max = this.impact_chiffre_filter_co[i].max_depart;
            }
            for(let i = 0; i < this.impact_bool_filter_co.length; i++) {
                this.impact_bool_filter_co[i].checkbox_impact = false;              
            }

            // Chaque évènement devient visible
            for (let feature of this.events_hazminer_layer.getSource().getFeatures()) {
                feature.set('visible',true);
            }
            for (let feature of this.events_co_layer.getSource().getFeatures()) {
                feature.set('visible',true);
            }

            // Ferme les panneaux de filtre ouverts
            this.show_event_type_filter_hazminer = false;
            this.show_date_filter_hazminer = false;
            this.show_casualties_filter_hazminer = false;
            this.show_popularity_filter_hazminer = false;
            this.show_location_filter_hazminer = false;
            this.show_type_event_filter_co = false;
            this.show_date_filter_co = false;
            this.show_location_filter_co = false;     
            this.show_impact_filter_co = false;

        },

        // Met à jour la propriété visibilité de l'évènement (hazminer) selon le filtre
        set_feature_hazminer_visibility(feature, start_date_hazminer_ymd, end_date_hazminer_ymd) {
      
            // Evènement visible par défaut
            feature.set('visible',true);

            // Evènement ne doit pas être visible si il ne respecte pas les critères du filtre

            // Selon le type de catastrophe
            if (!this.flood && feature.get('hazard_type') === 'flood') {
                feature.set('visible',false);
                return;
            }
            if (!this.flashflood && feature.get('hazard_type') === 'flash flood') {
                feature.set('visible',false);
                return;
            }
            if (!this.landslide && feature.get('hazard_type') === 'landslide') {
                feature.set('visible',false);
                return;
            }

            // Selon la date
            if (Date.parse(feature.get('event_time')) < Date.parse(start_date_hazminer_ymd)) {
                feature.set('visible',false);
                return;
            }
            if (Date.parse(feature.get('event_time')) > Date.parse(end_date_hazminer_ymd)) {
                feature.set('visible',false);
                return;
            }
            if (feature.get(this.duration_filter[0].id) < parseFloat(this.duration_filter[0].min)) {
                feature.set('visible',false);
                return;
            }
            if (feature.get(this.duration_filter[0].id) > parseFloat(this.duration_filter[0].max)) {
                feature.set('visible',false);
                return;
            }

            // Selon la localisation
            if (this.chosen_country_hazminer != 'All' && feature.get('country_found') != this.chosen_country_hazminer) {
                feature.set('visible',false);
                return;
            }
            if (this.draw_layer.getSource().getFeatures().length === 1 && !this.features_polygon.includes(feature)) {
                feature.set('visible',false);
                return;
            }
            for(let i = 0; i < this.extent_filter.length; i++) {
                if (parseFloat(feature.get(this.extent_filter[i].id)) < parseFloat(this.extent_filter[i].min)) {
                    feature.set('visible',false);
                    return;
                }
                if (parseFloat(feature.get(this.extent_filter[i].id)) > parseFloat(this.extent_filter[i].max)) {
                    feature.set('visible',false);
                    return;
                }
            }

            // Selon l'impact
            for(let i = 0; i < this.impact_filter_hazminer.length; i++) {
                if (!this.impact_filter_hazminer[i].checkbox_null && feature.get(this.impact_filter_hazminer[i].id) === null) {
                    feature.set('visible',false);
                    return;
                }
                if (parseFloat(feature.get(this.impact_filter_hazminer[i].id)) < parseFloat(this.impact_filter_hazminer[i].min)) {
                    feature.set('visible',false);
                    return;
                }
                if (parseFloat(feature.get(this.impact_filter_hazminer[i].id)) > parseFloat(this.impact_filter_hazminer[i].max)) {
                    feature.set('visible',false);
                    return;
                }
            }

            // Selon la popularité
            for(let i = 0; i < this.popularity_filter.length; i++) {
                if (parseFloat(feature.get(this.popularity_filter[i].id)) < parseFloat(this.popularity_filter[i].min)) {
                    feature.set('visible',false);
                    return;
                }
                if (parseFloat(feature.get(this.popularity_filter[i].id)) > parseFloat(this.popularity_filter[i].max)) {
                    feature.set('visible',false);
                    return;
                }
            }
            
        },

        // Met à jour la propriété visibilité de la évènement (citizen observer) selon le filtre
        set_feature_co_visibility(feature, start_date_co_ymd, end_date_co_ymd) {
      
            // Evènement visible par défaut
            feature.set('visible',true);

            // Evènement ne doit pas être visible si il ne respecte pas les critères du filtre

            // Selon le type de catastrophe
            if (!this.inondation && feature.get('type_event') === 'Inondation') {
                feature.set('visible',false);
                return;
            }
            if (!this.glissement_terrain && feature.get('type_event') === 'Glissement de terrain') {
                feature.set('visible',false);
                return;
            }
            if (!this.tdt && feature.get('type_event') === 'Tremblement de terre') {
                feature.set('visible',false);
                return;
            }
            if (!this.vents_violents && feature.get('type_event') === 'Tempête de vents violents') {
                feature.set('visible',false);
                return;
            }
            if (!this.grele && feature.get('type_event') === 'Tempête de grêle') {
                feature.set('visible',false);
                return;
            }
            if (!this.foudre && feature.get('type_event') === 'Foudre') {
                feature.set('visible',false);
                return;
            }

            // Selon la date
            if (Date.parse(feature.get('event_date')) < Date.parse(start_date_co_ymd)) {
                feature.set('visible',false);
                return;
            }
            if (Date.parse(feature.get('event_date')) > Date.parse(end_date_co_ymd)) {
                feature.set('visible',false);
                return;
            }

            // Selon la localisation
            if (this.chosen_province_co != 'All' && feature.get('province') != this.chosen_province_co) {
                feature.set('visible',false);
                return;
            }
            if (this.chosen_territoire_co != 'All' && feature.get('territoire') != this.chosen_territoire_co) {
                feature.set('visible',false);
                return;
            }


            // Selon l'impact
            for(let i = 0; i < this.impact_chiffre_filter_co.length; i++) {
                if (!this.impact_chiffre_filter_co[i].checkbox_null && feature.get(this.impact_chiffre_filter_co[i].id) === null) {
                    feature.set('visible',false);
                    return;
                }
                if (parseFloat(feature.get(this.impact_chiffre_filter_co[i].id)) < parseFloat(this.impact_chiffre_filter_co[i].min)) {
                    feature.set('visible',false);
                    return;
                }
                if (parseFloat(feature.get(this.impact_chiffre_filter_co[i].id)) > parseFloat(this.impact_chiffre_filter_co[i].max)) {
                    feature.set('visible',false);
                    return;
                }
            }
            for(let i = 0; i < this.impact_bool_filter_co.length; i++) {
                if (this.impact_bool_filter_co[i].checkbox_impact && feature.get(this.impact_bool_filter_co[i].id) === 'non') {
                    feature.set('visible',false);
                    return;
                }
            }
            
        },

        // Application des filtres : seuls les évènements respectant les critères apparaissent
        apply_filters() {

            // Dates des filtres en format y-m-d
            let start_date_hazminer_ymd = this.start_date_hazminer.substring(6,10) + '-' + this.start_date_hazminer.substring(3,5) + '-' + this.start_date_hazminer.substring(0,2) + ' 00:00:00';
            let end_date_hazminer_ymd = this.end_date_hazminer.substring(6,10) + '-' + this.end_date_hazminer.substring(3,5) + '-' + this.end_date_hazminer.substring(0,2) + ' 00:00:00';
            let start_date_co_ymd = this.start_date_co.substring(6,10) + '-' + this.start_date_co.substring(3,5) + '-' + this.start_date_co.substring(0,2) + ' 00:00:00';
            let end_date_co_ymd = this.end_date_co.substring(6,10) + '-' + this.end_date_co.substring(3,5) + '-' + this.end_date_co.substring(0,2) + ' 00:00:00';

            // Pour chaque évènement, sa propriété visibilité est modifiée selon le filtre
            for (let feature of this.events_hazminer_layer.getSource().getFeatures()) {
                this.set_feature_hazminer_visibility(feature, start_date_hazminer_ymd, end_date_hazminer_ymd);
            }
            for (let feature of this.events_co_layer.getSource().getFeatures()) {
                this.set_feature_co_visibility(feature, start_date_co_ymd, end_date_co_ymd);
            }

            // Change le style des évènements : ceux dont la visibilité est fausse sont invisibles, les autres prennent le style actuel
            this.change_style_all();

        },

        // Affiche la fenêtre du téléchargement, ferme les autres fenêtres ouvertes
        setup_download_form() {

            this.show_download_form = !this.show_download_form;
            this.show_change_style_form = false;
            this.show_filter_form = false;

        },

        // Permet d'avoir un seul bouton sélectionné pour le choix du mode de téléchargement
        checkbox_download(checkbox_name) {

            let checkbox_list = ['download_filter_e_hazminer', 'download_filter_p_hazminer', 'download_filter_e_p_hazminer', 'download_all_e_hazminer',
                'download_filter_co', 'download_all_co'];
            for (let checkbox of checkbox_list) {
                if (checkbox_name != checkbox) {
                    this[checkbox] = false;
                }
            }

        },

        // Téléchargement des données (csv)
        async download_data() {

            // Définition des données à télécharger (hazminer ou citizen observer)
            let data = null;
            if (this.download_all_e_hazminer || this.download_filter_e_hazminer || this.download_filter_p_hazminer || this.download_filter_e_p_hazminer) {
                data = 'hazminer';
                this.download_hazminer();
            }
            if (this.download_all_co || this.download_filter_co) {
                data = 'co';
                this.download_co();
            }

            // Message d'erreur si aucun mode de téléchargement n'est choisi
            if (data === null) {
                alert("No download mode selected!");
                return;
            }

        },

        // Téléchargement des données hazminer
        async download_hazminer() {

            let type = null;
            if (this.download_all_e_hazminer) {
                type = 'all';
            }
            if (this.download_filter_e_hazminer || this.download_filter_p_hazminer || this.download_filter_e_p_hazminer) {
                type = 'filter';
            }
     
            // Création des tableaux pour la jointure finale, initialisation du texte (noms des colonnes)
            let event_content_lines = [this.event_download_properties_hazminer.join(',')];
            let paragraph_content_lines = [this.paragraph_download_properties.join(',')];

            // Liste permettent d'éviter les paragraphes en double
            let seen_paragraph_id = new Set();

            // Récupérer les paramètres de filtrage
            let { cql_filter, draw_filter } = this.set_cqlfilter_event_hazminer(type);

            // Message d'erreur si la liste des types de catastrophe est vide
            if (cql_filter === 'No event') {
                alert("No event matches the criteria!");
                return;
            }

            // Si on ne filtre pas selon un polygone :
            if (draw_filter == 0) {

                // Requête vers le Geoserver, on récupère seulement les évènements correspondant aux filtres
                let url;
                if (type == 'all') {
                    url = `http://localhost:8080/geoserver/webGIS/ows?service=WFS&version=1.1.0&request=GetFeature&typeName=webGIS:events`
                        + `&outputFormat=application/json`;
                }
                if (type == 'filter' && cql_filter !== 'No event') {
                    url = `http://localhost:8080/geoserver/webGIS/ows?service=WFS&version=1.1.0&request=GetFeature&typeName=webGIS:events`
                        + `&outputFormat=application/json` + `&CQL_FILTER=` + encodeURIComponent(cql_filter);
                }  
                let result = await fetch(url);
                let json = await result.json();
                this.fetch_progression = 'Fetch data completed!';

                // Récupération des évènements
                let features = json.features;
                let n_events = features.length;

                // Message d'erreur si aucun évènement ne correspond aux critères
                if (n_events === 0) {
                    alert("No event matches the criteria!");
                    return;
                }

                // Message d'erreur si on veut télécharger des paragraphes et que trop d'évènements correspondent aux critères (>10000)
                if (this.download_filter_p_hazminer || this.download_filter_e_p_hazminer) {
                    if (n_events > 10000) {
                        alert("To many events, use more filters!");
                        return;
                    }
                }

                // Affichage de la progression du téléchargement
                this.show_fetch_progression = true;
                this.show_download_progression = true;

                // Pour chaque évènement :
                let count_features = 0;
                for (let f of features) {

                    // Création d'une ligne de texte (events.csv)
                    // Toutes les valeurs sont entourées de guillemets
                    if(this.download_all_e_hazminer || this.download_filter_e_hazminer || this.download_filter_e_p_hazminer) {
                        let row = this.event_download_properties_hazminer.map(prop => {
                            let value = f.properties[prop];
                            if (value == null) return ''; // gérer les null
                            value = String(value).replace(/"/g, '""');
                            return `"${value}"`;
                        }).join(',');
                        event_content_lines.push(row);
                    }

                    // Mise à jour du texte concernant les paragraphes (paragraphs.csv)
                    if(this.download_filter_p_hazminer || this.download_filter_e_p_hazminer) {
                        ({ paragraph_content_lines, seen_paragraph_id } = await this.create_paragraph_download_text(f,paragraph_content_lines,seen_paragraph_id,'geoserver'));
                    }

                    // Calcul de la progression du téléchargement
                    count_features += 1;
                    this.download_progression = parseInt(count_features*100/features.length);

                    // Forcer une pause très courte pour mettre à jour le DOM
                    if (count_features % 100 === 0) {
                        await new Promise(resolve => setTimeout(resolve, 0));
                    }

                };

                // Désaffichage de la progression du téléchargement
                this.show_fetch_progression = false;
                this.show_download_progression = false;
                this.fetch_progression = 0;
                this.download_progression = 0;

            }
            
            // Si on filtre selon un polygone :
            if (draw_filter == 1) {

                // Récupérer le nombre d'évènements
                let event_features = this.events_hazminer_layer.getSource().getFeatures();
                let nb_visible_events = event_features.filter(f => f.get('visible') === true).length;
                let nb_total_events = event_features.length;

                // Message d'erreur si aucun évènement ne correspond aux critères
                if (nb_visible_events === 0) {
                    alert("No event matches the criteria!");
                    return;
                }

                // Message d'erreur si on veut télécharger des paragraphes et que trop d'évènements correspondent aux critères (>10000)
                if (this.download_filter_p_hazminer || this.download_filter_e_p_hazminer) {
                    if (nb_visible_events > 10000) {
                        alert("To many events, use more filters!");
                        return;
                    }
                }

                // Affichage de la progression du téléchargement
                this.show_download_progression = true;

                let count_events = 0;
                // On récupère les évènements de la couche 1 par 1
                for (let f of this.events_hazminer_layer.getSource().getFeatures()) {

                    // Pour chaque évènement correspondant aux critères :
                    if (f.get('visible')) {

                        // Création d'une ligne de texte (events.csv)
                        // Toutes les valeurs sont entourées de guillemets
                        if(this.download_all_e_hazminer || this.download_filter_e_hazminer || this.download_filter_e_p_hazminer) {
                            let row = this.event_download_properties_hazminer.map(prop => {
                                let value = f.get(prop);
                                if (value == null) return ''; // gérer les null
                                value = String(value).replace(/"/g, '""');
                                return `"${value}"`;
                            }).join(',');
                            event_content_lines.push(row);
                        }

                        // Mise à jour du texte concernant les paragraphes (paragraphs.csv)
                        if(this.download_filter_p_hazminer || this.download_filter_e_p_hazminer) {
                            ({ paragraph_content_lines, seen_paragraph_id } = await this.create_paragraph_download_text(f,paragraph_content_lines,seen_paragraph_id,'event layer'));
                        }

                    }

                    // Calcul de la progression du téléchargement
                    count_events += 1;
                    this.download_progression = parseInt(count_events*100/nb_total_events);

                    // Forcer une pause très courte pour mettre à jour le DOM
                    if (count_events % 100 === 0) {
                        await new Promise(resolve => setTimeout(resolve, 0));
                    }
                    
                }

                // Désaffichage de la progression du téléchargement
                this.show_download_progression = false;
                this.download_progression = 0;

            }

            // Téléchargement des évènements
            if(this.download_all_e_hazminer || this.download_filter_e_hazminer || this.download_filter_e_p_hazminer) {
                this.create_csv(event_content_lines, "hazminer_events.csv");
            }

            // Téléchargement des paragraphes
            if(this.download_filter_p_hazminer || this.download_filter_e_p_hazminer) {
                this.create_csv(paragraph_content_lines, "hazminer_paragraphs.csv");
            }

        },

        // Download des données citizen observer
        async download_co() {

            let type = null;
            if (this.download_all_co) {
                type = 'all';
            }
            if (this.download_filter_co) {
                type = 'filter';
            }

            // Création du tableau pour la jointure finale, initialisation du texte (noms des colonnes)
            let event_content_lines = [this.event_download_properties_co.join(',')];

            // Récupérer les paramètres de filtrage
            let cql_filter = this.set_cqlfilter_event_co(type);

            // Message d'erreur si la liste des types de catastrophe est vide
            if (cql_filter === 'No event') {
                alert("No event matches the criteria!");
                return;
            }

            // Requête vers le Geoserver, on récupère seulement les évènements correspondant aux filtres
            let url;
            if (type == 'all') {
                url = `http://localhost:8080/geoserver/webGIS/ows?service=WFS&version=1.1.0&request=GetFeature&typeName=webGIS:citizen_observer`
                    + `&outputFormat=application/json`;
            }
            if (type == 'filter' && cql_filter !== 'No event') {
                url = `http://localhost:8080/geoserver/webGIS/ows?service=WFS&version=1.1.0&request=GetFeature&typeName=webGIS:citizen_observer`
                    + `&outputFormat=application/json` + `&CQL_FILTER=` + encodeURIComponent(cql_filter);
            }  
            let result = await fetch(url);
            let json = await result.json();
            this.fetch_progression = 'Fetch data completed!';

            // Récupération des évènements
            let features = json.features;
            let n_events = features.length;

            // Message d'erreur si aucun évènement ne correspond aux critères
            if (n_events === 0) {
                alert("No event matches the criteria!");
                return;
            }

            // Affichage de la progression du téléchargement
            this.show_fetch_progression = true;
            this.show_download_progression = true;

            // Pour chaque évènement :
            let count_features = 0;
            for (let f of features) {

                // Création d'une ligne de texte (events.csv)
                // Toutes les valeurs sont entourées de guillemets
                let row = this.event_download_properties_co.map(prop => {
                    let value = f.properties[prop];
                    if (value == null) return ''; // gérer les null
                    value = String(value).replace(/"/g, '""');
                    return `"${value}"`;
                }).join(',');
                event_content_lines.push(row);

                // Calcul de la progression du téléchargement
                count_features += 1;
                this.download_progression = parseInt(count_features*100/features.length);

                // Forcer une pause très courte pour mettre à jour le DOM
                if (count_features % 100 === 0) {
                    await new Promise(resolve => setTimeout(resolve, 0));
                }

            };

            // Désaffichage de la progression du téléchargement
            this.show_fetch_progression = false;
            this.show_download_progression = false;
            this.fetch_progression = 0;
            this.download_progression = 0;        

            // Téléchargement des évènements
            this.create_csv(event_content_lines, "co_events.csv");

        },

        // Crée le filtre cql pour la requête des évènements vers le Geoserver (hazminer)
        set_cqlfilter_event_hazminer(type) {

            let cql_filter = '';
            let draw_filter = 0;

            // Cas où on télécharge tous les évènements
            if (type == 'all') {
                return { cql_filter, draw_filter }
            }

            // Cas où on filtre selon un polygone : utilisation de la visibilité des évènements
            if (type == 'filter' && this.draw_layer.getSource().getFeatures().length === 1) {
                draw_filter = 1;
                return { cql_filter, draw_filter }
            }

            // Cas où on filtre dans la requête Geoserver
            if (type == 'filter' && this.draw_layer.getSource().getFeatures().length === 0) {

                // Type de catastrophe
                let hazard_type_liste = [];
                if(this.flood) {
                    hazard_type_liste.push('flood');
                }
                if(this.flashflood) {
                    hazard_type_liste.push('flash flood');
                }
                if(this.landslide) {
                    hazard_type_liste.push('landslide');
                }
                if (hazard_type_liste.length === 0) {  
                    cql_filter = 'No event';                
                    return { cql_filter, draw_filter }
                }
                else {
                    cql_filter += "hazard_type IN (" + hazard_type_liste.map(id => `'${id}'`).join(",") + ")";
                }

                // Date
                let start_date_hazminer_ymd = this.start_date_hazminer.substring(6,10) + '-' + this.start_date_hazminer.substring(3,5) + '-' + this.start_date_hazminer.substring(0,2) + ' 00:00:00';
                let end_date_hazminer_ymd = this.end_date_hazminer.substring(6,10) + '-' + this.end_date_hazminer.substring(3,5) + '-' + this.end_date_hazminer.substring(0,2) + ' 00:00:00';
                cql_filter += " AND event_time >= '" + start_date_hazminer_ymd + "'";
                cql_filter += " AND event_time <= '" + end_date_hazminer_ymd + "'";
                cql_filter += " AND " + this.duration_filter[0].id + " BETWEEN " + this.duration_filter[0].min + " AND " + this.duration_filter[0].max;

                // Localisation
                if (this.chosen_country_hazminer != 'All') {
                    cql_filter += " AND country_found = '" + this.chosen_country_hazminer + "'";
                }
                for(let i = 0; i < this.extent_filter.length; i++) {
                    cql_filter += " AND " + this.extent_filter[i].id + " BETWEEN " + this.extent_filter[i].min + " AND " + this.extent_filter[i].max;
                }

                // Impact
                for(let i = 0; i < this.impact_filter_hazminer.length; i++) {
                    if (this.impact_filter_hazminer[i].checkbox_null) {
                        cql_filter += " AND (" + this.impact_filter_hazminer[i].id + " BETWEEN " + this.impact_filter_hazminer[i].min + " AND " + this.impact_filter_hazminer[i].max
                        + " OR " + this.impact_filter_hazminer[i].id + " IS NULL)";
                    }
                    else {
                        cql_filter += " AND " + this.impact_filter_hazminer[i].id + " BETWEEN " + this.impact_filter_hazminer[i].min + " AND " + this.impact_filter_hazminer[i].max;
                    }
                }

                // Popularité
                for(let i = 0; i < this.popularity_filter.length; i++) {
                    cql_filter += " AND " + this.popularity_filter[i].id + " BETWEEN " + this.popularity_filter[i].min + " AND " + this.popularity_filter[i].max;
                }

                return { cql_filter, draw_filter }

            }

        },

        // Crée le filtre cql pour la requête des évènements vers le Geoserver (citizen observer)
        set_cqlfilter_event_co(type) {

            let cql_filter = '';

            // Cas où on télécharge tous les évènements
            if (type == 'all') {
                return cql_filter;
            }

            // Cas où on filtre dans la requête Geoserver
            if (type == 'filter') {

                // Type de catastrophe
                let hazard_type_liste = [];
                if(this.inondation) {
                    hazard_type_liste.push('Inondation');
                }
                if(this.glissement_terrain) {
                    hazard_type_liste.push('Glissement de terrain');
                }
                if(this.tdt) {
                    hazard_type_liste.push('Tremblement de terre');
                }
                if(this.vents_violents) {
                    hazard_type_liste.push('Tempête de vents violents');
                }
                if(this.grele) {
                    hazard_type_liste.push('Tempête de grêle');
                }
                if(this.foudre) {
                    hazard_type_liste.push('Foudre');
                }
                if (hazard_type_liste.length === 0) {  
                    cql_filter = 'No event';
                    return cql_filter;
                }
                else {
                    cql_filter += "type_event IN (" + hazard_type_liste.map(id => `'${id}'`).join(",") + ")";
                }

                // Date
                let start_date_co_ymd = this.start_date_co.substring(6,10) + '-' + this.start_date_co.substring(3,5) + '-' + this.start_date_co.substring(0,2) + ' 00:00:00';
                let end_date_co_ymd = this.end_date_co.substring(6,10) + '-' + this.end_date_co.substring(3,5) + '-' + this.end_date_co.substring(0,2) + ' 00:00:00';
                cql_filter += " AND event_date >= '" + start_date_co_ymd + "'";
                cql_filter += " AND event_date <= '" + end_date_co_ymd + "'";

                // Localisation
                if (this.chosen_province_co != 'All') {
                    cql_filter += " AND province = '" + this.chosen_province_co + "'";
                }
                if (this.chosen_territoire_co != 'All') {
                    cql_filter += " AND territoire = '" + this.chosen_territoire_co + "'";
                }

                // Impact
                for(let i = 0; i < this.impact_chiffre_filter_co.length; i++) {
                    if (this.impact_chiffre_filter_co[i].checkbox_null) {
                        cql_filter += " AND (" + this.impact_chiffre_filter_co[i].id + " BETWEEN " + this.impact_chiffre_filter_co[i].min + " AND " + this.impact_chiffre_filter_co[i].max
                        + " OR " + this.impact_chiffre_filter_co[i].id + " IS NULL)";
                    }
                    else {
                        cql_filter += " AND " + this.impact_chiffre_filter_co[i].id + " BETWEEN " + this.impact_chiffre_filter_co[i].min + " AND " + this.impact_chiffre_filter_co[i].max;
                    }
                }
                for(let i = 0; i < this.impact_bool_filter_co.length; i++) {
                    if (this.impact_bool_filter_co[i].checkbox_impact) {
                        cql_filter += " AND " + this.impact_bool_filter_co[i].id + " <> 'non'";
                    }
                }

                return cql_filter;

            }

        },

        // Création du texte de téléchargement des paragraphes liés à un évènement (hazminer)
        async create_paragraph_download_text(feature, paragraph_content_lines, seen_paragraph_id, source) {

            // Récupérer l'identifiant de l'évènement
            let event_id;
            if (source === 'event layer') {
                event_id = feature.get('event_id');
            }
            if (source === 'geoserver') {
                event_id = feature.properties.event_id;
            }

            // Requête vers le Geoserver, on récupère seulement les paragraphes liés à l'évènement
            let cql_filter = `event_id = '${event_id}'`
            let url = `http://localhost:8080/geoserver/webGIS/ows?service=WFS&version=1.1.0&request=GetFeature&typeName=webGIS:vue_paragraphs_pg`
                + `&outputFormat=application/json` + `&CQL_FILTER=` + encodeURIComponent(cql_filter);
            let result = await fetch(url);
            let json = await result.json();
                
            // Récupération des paragraphes
            let features = json.features;

            // Pour chaque paragraphe :
            for (let f of features) {

                let paragraph_id = f.properties.paragraph_id;

                // Si ce paragraphe a déjà été ajouté, on passe
                if (seen_paragraph_id.has(paragraph_id)) {
                    continue;
                }
                // Marquer comme traité
                seen_paragraph_id.add(paragraph_id);

                // Création d'une ligne de texte (paragraphs.csv)
                // Toutes les valeurs sont entourées de guillemets
                let row = this.paragraph_download_properties.map(prop => {
                    let value = f.properties[prop];
                    if (value == null) return ''; // gérer les null
                    value = String(value).replace(/"/g, '""');
                    return `"${value}"`;
                }).join(',');
                paragraph_content_lines.push(row);

            };

            return { paragraph_content_lines, seen_paragraph_id };

        },

        // Crée le csv à partir du texte
        create_csv(content_lines, filename) {

            try {

                let content = content_lines.join('\n');

                // Essayer de créer le blob et de le télécharger
                let blob;
                try {
                    blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
                } catch (err) {
                    // Message d'erreur si le fichier est trop volumineux
                    alert(`Error: The file ${filename} is too large to generate.`);
                    return;
                }
                let urlBlob = URL.createObjectURL(blob);
                let link = document.createElement("a");
                link.href = urlBlob;
                link.download = filename;
                link.click();

                // Nettoyage
                setTimeout(() => URL.revokeObjectURL(urlBlob), 1000);

            } catch (err) {
                // Message d'erreur si le fichier est trop volumineux
                alert(`Error: The file ${filename} is too large to generate.`);
            }

        },

        // Download d'un screenshot de la map
        download_screenshot() {

            let map_canvas = document.createElement('canvas');
            let size = this.map.getSize();
            map_canvas.width = size[0];
            map_canvas.height = size[1];
            let map_context = map_canvas.getContext('2d');

            // Dessine tous les canvas de la carte
            Array.prototype.forEach.call(
                this.map.getViewport().querySelectorAll('.ol-layer canvas, canvas.ol-layer'),
                function (canvas) {
                    if (canvas.width > 0) {
                        let opacity = canvas.parentNode.style.opacity || canvas.style.opacity;
                        map_context.globalAlpha = opacity === '' ? 1 : Number(opacity);
                        let matrix;
                        let transform = canvas.style.transform;
                        if (transform) {
                            matrix = transform.match(/^matrix\(([^\(]*)\)$/)[1].split(',').map(Number);
                        } else {
                            matrix = [parseFloat(canvas.style.width) / canvas.width, 0, 0, parseFloat(canvas.style.height) / canvas.height, 0, 0];
                        }
                        CanvasRenderingContext2D.prototype.setTransform.apply(map_context, matrix);
                        let backgroundColor = canvas.parentNode.style.backgroundColor;
                        if (backgroundColor) {
                            map_context.fillStyle = backgroundColor;
                            map_context.fillRect(0, 0, canvas.width, canvas.height);
                        }
                        map_context.drawImage(canvas, 0, 0);
                    }
                },
            );

            map_context.globalAlpha = 1;
            map_context.setTransform(1, 0, 0, 1, 0, 0);

            // Flèche nord (en haut à droite)
            let arrow_width = 25;
            let arrow_height = 40;
            map_context.strokeStyle = 'black';
            map_context.lineWidth = 1;                
            // Triangle vers le haut
            // Partie gauche
            map_context.save();  
            map_context.translate(size[0] - arrow_width - 10, 25 + arrow_height);
            map_context.beginPath();
            map_context.moveTo(arrow_width / 2, -arrow_height);
            map_context.lineTo(0, 0);
            map_context.lineTo(arrow_width / 2 , -arrow_height / 3);
            map_context.closePath();
            map_context.fillStyle = 'rgba(255, 255, 255, 0.7)';          
            map_context.fill();
            map_context.stroke();
            map_context.restore();
            // Partie droite
            map_context.save();
            map_context.translate(size[0] - 10, 25 + arrow_height);
            map_context.beginPath();
            map_context.moveTo(-arrow_width / 2, -arrow_height);
            map_context.lineTo(0, 0);
            map_context.lineTo(-arrow_width / 2 , -arrow_height / 3);
            map_context.closePath();
            map_context.fillStyle = 'rgba(0, 0, 0, 1)';
            map_context.fill();
            map_context.stroke();
            map_context.restore();
            // "N"
            map_context.save();
            map_context.translate(size[0] - arrow_width / 2 - 15, 20);
            map_context.fillStyle = 'black';
            map_context.font = 'bold 16px sans-serif';
            map_context.fillText('N', 0, 0);
            map_context.restore();
            
            // Echelle (en bas à gauche)
            let scaleline = document.querySelector('.ol-scale-line-inner');
            map_context.save();
            let scaleText = scaleline.innerText;
            let scaleWidth = scaleline.offsetWidth;
            let barHeight = 8;
            let x = 10;
            let y = size[1] - barHeight - 30;
            // Barre
            map_context.fillStyle = 'white';
            map_context.strokeStyle = 'black';
            map_context.lineWidth = 1;
            map_context.fillRect(x, y, scaleWidth, barHeight);
            map_context.strokeRect(x, y, scaleWidth, barHeight);
            // Texte
            map_context.fillStyle = 'black';
            map_context.font = '12px sans-serif';
            map_context.fillText(scaleText, x, y + barHeight + 14);
            map_context.restore();

            // Téléchargement
            let link = document.createElement("a");
            link.href = map_canvas.toDataURL();
            link.download = `map.png`;
            link.click();

        },

        // Récupérer la localisation et l'afficher / la désafficher
        show_location() {

            if (this.location_layer.getVisible()) {
                this.location_layer.setVisible(false);
            }

            else {

                this.location_layer.setVisible(true);

                navigator.geolocation.getCurrentPosition((position) => {

                    // Récupérer les valeurs sur le position de l'appareil
                    let latitude_pos = position.coords.latitude;
                    let longitude_pos = position.coords.longitude;
                    let precision_pos = position.coords.accuracy;

                    // Vider la couche localisation
                    this.location_layer.getSource().clear();

                    // Transformer les coordonnées en EPSG:3857
                    let center = ol.proj.fromLonLat([longitude_pos, latitude_pos]);

                    // Point central
                    let point_feature = new ol.Feature(new ol.geom.Point(center));

                    // Cercle de précision (en mètres, donc dans la projection EPSG:3857)
                    let circle_feature = new ol.Feature(new ol.geom.Circle(center, precision_pos));

                    // Ajouter les deux objets à la couche
                    this.location_layer.getSource().addFeatures([circle_feature, point_feature]);

                    // Appliquer les styles
                    this.location_layer.setStyle((feature) => {
                        let geometry = feature.getGeometry();
                        if (geometry instanceof ol.geom.Point) {
                            return new ol.style.Style({
                                image: new ol.style.Circle({
                                    radius: 8,
                                    fill: new ol.style.Fill({ color: 'rgba(0, 100, 255, 1)' }),
                                    stroke: new ol.style.Stroke({ color: 'white', width: 2 }),
                                }),
                            });
                        } else if (geometry instanceof ol.geom.Circle) {
                            return new ol.style.Style({
                                fill: new ol.style.Fill({ color: 'rgba(0, 100, 255, 0.3)' }),
                                stroke: new ol.style.Stroke({ color: 'rgba(0, 100, 255, 0.8)', width: 1 }),
                            });
                        }
                    });

                    // Centrer la vue sur la position
                    this.map.getView().setCenter(center);

                });

            }

        },

    },

    mounted() {

        // Initialisation de la carte
        this.map = new ol.Map({
            target: 'map',
            view: new ol.View({
                center: ol.proj.fromLonLat([28.85, -0.1]),
                zoom: 7,
            }),
            layers: [
                new ol.layer.Group({
                    title: 'Base maps',
                    layers: [
                        // Couche OSM
                        new ol.layer.Tile({
                            source: new ol.source.XYZ({
                                url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
                                crossOrigin: 'anonymous',
                                maxZoom: 19,
                                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                            }),
                            title: 'OpenStreetMap',
                            type: 'base',
                            zIndex: 1,
                        }),
                    ],
                }),
                new ol.layer.Group({
                    title: 'Raster layers',
                    layers: [
                        // Couche de susceptibilité des tremblements de terre
                        this.landslide_susceptibility_layer = new ol.layer.Tile({
                            source: new ol.source.TileWMS({
                                url: 'http://localhost:8080/geoserver/webGIS/wms',
                                params: {
                                    'LAYERS': 'webGIS:landslide_susceptibility',
                                    'TILED': true,
                                    'VERSION': '1.1.1',
                                    'FORMAT': 'image/png',
                                    'CRS': 'EPSG:3857'
                                },
                                crossOrigin: 'anonymous',
                                serverType: 'geoserver',
                                transition: 0,
                            }),
                            title: 'Landslide susceptibility',
                            zIndex: 2,
                            visible: false,
                        }),
                        // Couche des rivières
                        this.rivers_layer = new ol.layer.Tile({
                            source: new ol.source.TileWMS({
                                url: 'http://localhost:8080/geoserver/webGIS/wms',
                                params: {
                                    'LAYERS': 'webGIS:HydroRIVERS_flow5max',
                                    'TILED': true,
                                    'VERSION': '1.1.1',
                                    'FORMAT': 'image/png',
                                    'CRS': 'EPSG:3857'
                                },
                                crossOrigin: 'anonymous',
                                serverType: 'geoserver',
                                transition: 0,
                            }),
                            title: 'Rivers',
                            zIndex: 3,
                            visible: false,
                        }),
                        // Couche des pays (source : Natural Earth)
                        this.countries_layer = new ol.layer.Vector({
                            source: new ol.source.Vector({
                                projection: 'EPSG:3857',
                                url: '../assets/layers/countries50m.json',
                                format: new ol.format.GeoJSON()
                            }),
                            style: new ol.style.Style({
                                stroke: new ol.style.Stroke({
                                    color: 'rgb(0, 0, 0, 0.5)',
                                    width: 1
                                })
                            }),
                            title: 'Countries',
                            zIndex: 4,
                        }),
                    ],
                }),
                new ol.layer.Group({
                    title: 'Location filters',
                    layers: [
                        // Couche du polygone du choix manuel de l'emprise
                        this.extent_layer = new ol.layer.Vector({
                            source: new ol.source.Vector({}),
                            style: new ol.style.Style({
                                stroke: new ol.style.Stroke({
                                    color: 'rgba(255, 0, 0, 1)',
                                    width: 1
                                }),
                                fill: new ol.style.Fill({
                                    color: 'rgba(255, 255, 255, 0.2)'
                                })
                            }),
                            title: 'Extent layer',
                            zIndex: 5,
                        }),
                        // Couche de dessin (pour récupérer l'emprise d'un polygone)
                        this.draw_layer = new ol.layer.Vector({
                            source: new ol.source.Vector({}),
                            title: 'Draw layer',
                            zIndex: 6,
                        }),
                    ],
                }),
                new ol.layer.Group({
                    title: 'Events',
                    layers: [
                        // Création de la couche évènements hazminer (Geoserver, se remplit selon la bbox)
                        this.events_hazminer_layer = new ol.layer.Vector({
                            source: new ol.source.Vector({
                                format: new ol.format.GeoJSON(),
                                url: function(extent) {
                                    return `http://localhost:8080/geoserver/webGIS/ows?service=WFS&version=1.1.0&request=GetFeature&typeName=webGIS:events`
                                        + `&outputFormat=application/json` + `&bbox=` + extent.join(',') + `,EPSG:3857`;
                                },
                                strategy: ol.loadingstrategy.bbox
                            }),
                            title: 'Hazminer events',
                            zIndex: 10,
                        }),
                        // Création de la couche évènements citizen observer (Geoserver, se remplit selon la bbox)
                        this.events_co_layer = new ol.layer.Vector({
                            source: new ol.source.Vector({
                                format: new ol.format.GeoJSON(),
                                url: function(extent) {
                                    return `http://localhost:8080/geoserver/webGIS/ows?service=WFS&version=1.1.0&request=GetFeature&typeName=webGIS:citizen_observer`
                                        + `&outputFormat=application/json` + `&bbox=` + extent.join(',') + `,EPSG:3857`;
                                },
                                strategy: ol.loadingstrategy.bbox
                            }),
                            title: 'Citizen observer events',
                            zIndex: 11,
                        }),
                        // Création de la couche contenant uniquement l'évènement sélectionné
                        this.selected_event_layer = new ol.layer.Vector({
                            source: new ol.source.Vector(),
                            title: 'Selected event',
                            zIndex: 12,
                        }),
                    ],
                }),
                // Création de la couche de géolocalisation
                this.location_layer = new ol.layer.Vector({
                    source: new ol.source.Vector(),
                    zIndex: 13,
                    visible: false,
                }),
            ],
        });

        // Créer la liste des pays une fois que les entités sont chargées
        this.countries_layer.getSource().on('featuresloadend', () => {
            this.set_countries_list();
        });

        // Fin de l'interaction de dessin dès qu'une figure est dessinée
        this.draw_layer.getSource().on('addfeature', event => {
            this.draw_actif = false;
            this.map.removeInteraction(this.draw);
        });

        // À chaque ajout de nouveaux évènements hazminer, création de la variable visibilité selon les filtres actifs
        this.events_hazminer_layer.getSource().on('featuresloadend', event => {
            let features = event.features;
            features.forEach((feature) => {
                this.set_new_feature_hazminer_visibility(feature);
            })
        });

        // À chaque ajout de nouveaux évènements citizen observer, création de la variable visibilité selon les filtres actifs
        this.events_co_layer.getSource().on('featuresloadend', event => {
            let features = event.features;
            features.forEach((feature) => {
                this.set_new_feature_co_visibility(feature);
            })
        });

        // Style au départ
        this.change_style_events();

        // Changer le style de la couche contenant uniquement l'évènement sélectionné à chaque évènement ajouté
        // (le style dépend de la couche d'origine de l'évènement et des filtres)
        this.selected_event_layer.getSource().on('addfeature', event => {
            this.change_style_selected_event();
        });

        // Création de la bulle vide qui affiche le nombre d'évènements / de paragraphes si plusieurs sont superposés
        let overlay_pointermove = new ol.Overlay({
            element: document.getElementById("popup_pointermove"),
            positioning: "bottom-center"
        });
        this.map.addOverlay(overlay_pointermove);

        // Création de la bulle vide qui permet de sélectionner un évènement / paragraphe quand plusieurs sont superposés
        let overlay_click = new ol.Overlay({
            element: document.getElementById("popup_click"),
            positioning: "bottom-center"
        });
        this.map.addOverlay(overlay_click);

        // Gestionnaire des couches
        let layer_switcher = new LayerSwitcher({
            activationMode: 'click',
            reverse: true,
            groupSelectStyle: 'children'
        });
        this.map.addControl(layer_switcher);

        // Bouton pour accéder à l'outil filtrage
        let filter_control = new ol.control.Control({
            element: document.getElementById("filter_div"),
        });
        this.map.addControl(filter_control);

        // Bouton pour changer le style
        let change_style_control = new ol.control.Control({
            element: document.getElementById("change_style_div"),
        });
        this.map.addControl(change_style_control);

        // Bouton de téléchargement
        let download_control = new ol.control.Control({
            element: document.getElementById("download_div"),
        });
        this.map.addControl(download_control);

        // Bouton des captures d'écran
        let screenshot_control = new ol.control.Control({
            element: document.getElementById("screenshot_div"),
        });
        this.map.addControl(screenshot_control);

        // Bouton pour activer / désactiver la localisation
        let location_control = new ol.control.Control({
            element: document.getElementById("location_div"),
        });
        this.map.addControl(location_control);

        // Echelle
        let scaleline = new ol.control.ScaleLine({
            element: document.getElementById("scaleline_div"),
        });
        this.map.addControl(scaleline);

        // A chaque déplacement/zoom :
        this.map.on('moveend', () => {

            // Suppression de la bulle qui permet de sélectionner un évènement / paragraphe quand plusieurs sont superposés
            document.getElementById("popup_click").style.display = "none";

            // Changement de la taille des évènements selon le niveau de zoom
            let zoom = this.map.getView().getZoom();
            let new_factor_zoom = this.zoom_table.find(interval => {
                return zoom >= interval.min_zoom && zoom <= interval.max_zoom;
            });
            if (new_factor_zoom.id != this.actual_zoom_factor) {
                this.actual_zoom_factor = new_factor_zoom.factor;
                this.change_style_all();
            }

        });

        // A chaque déplacement du pointeur, si plusieurs évènements sont superposées au niveau du pointeur, on affiche leur nombre
        this.map.on("pointermove", evt => {

            let event_features = [];
        
            // Récupérer les objets à partir des différentes couches
            this.map.forEachFeatureAtPixel(evt.pixel, (feature, layer) => {
                if (layer === this.events_hazminer_layer || layer === this.events_co_layer) {
                    event_features.push(feature);
                }
            });
    
            // Si il y a plusieurs évènements, la bulle affiche "n events"
            if (event_features.length > 1) {
                document.getElementById("popup_pointermove").innerHTML = event_features.length + " events";
                overlay_pointermove.setPosition(evt.coordinate);
                document.getElementById("popup_pointermove").style.display = "block";
            }
        
            else {
                document.getElementById("popup_pointermove").style.display = "none";
            }

        });

        // Quand on clique sur un ou plusieurs évènements :
        this.map.on('click', evt => {

            let event_features = [];
        
            // Récupérer les objets à partir des différentes couches
            this.map.forEachFeatureAtPixel(evt.pixel, (feature, layer) => {
                if (layer === this.events_hazminer_layer || layer === this.events_co_layer) {
                    event_features.push(feature);
                }
            });
    
            // Si l'objet est un seul évènement, le texte contenant les infos sur cet évènement s'affiche à droite de l'écran
            if (event_features.length == 1) {
                document.getElementById("popup_click").style.display = "none";
                this.show_selected_event_data(event_features[0]);
            }

            // Si plusieurs évènements sont sélectionnés, on affiche la liste sous forme de liens cliquables
            // Cliquer sur un lien affiche le texte contenant les infos sur l'évènement sélectionné à droite de l'écran
            else if (event_features.length > 1) {
                let html_popup = 'Choose the event:<ul>'
                event_features.forEach((event_feature, index) => {
                    let line;
                    if (event_feature.get('hazard_type')) {
                        line = event_feature.get('hazard_type') + ' - ' + event_feature.get('event_time').substring(0,10);
                    }
                    if (event_feature.get('type_event')) {
                        line = event_feature.get('type_event') + ' - ' + event_feature.get('event_date').substring(0,10);
                    }
                    html_popup += `<li><a href="#" id="event_link_${index}">${line}</a></li>`;
                });
                html_popup += '</ul>';
                document.getElementById("popup_click").innerHTML = html_popup;
                event_features.forEach((event_feature, index) => {
                    document.getElementById(`event_link_${index}`).addEventListener('click', (e) => {
                        e.preventDefault();
                        this.show_selected_event_data(event_feature);
                    });
                });
                overlay_click.setPosition(evt.coordinate);
                document.getElementById("popup_click").style.display = "block";
            }

            else {
                document.getElementById("popup_click").style.display = "none";
            }

        });

    },

}).mount('#vue_map');
