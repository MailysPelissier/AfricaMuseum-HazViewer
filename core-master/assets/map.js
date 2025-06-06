Vue.createApp({

    data() {
        return {
            map: null, // Initialisation de la map
            countries_layer: null, // Initialisation de la couche countries
            extent_layer: null, // Initialisation de la couche du polygone de l'extent
            draw_layer: null, // Initialisation de la couche de dessin
            events_layer: null, // Initialisation de la couche events
            selected_event_layer: null, // Initialisation de la couche selected event
            localisation_layer: null, // Initialisation de la couche de géolocalisation
            // Propriétés principales des events
            event_main_property: ["hazard_type", "event_time", "start_time", "end_time", "median_death", "median_injured", "median_affected",
                "n_paragraphs", "n_articles"],
            event_main_property_title: ["Hazard type", "Event time", "Start time", "End time", "Median death", "Median injured", "Median affected",
                "Number of paragraphs", "Number of articles"],
            // Autres propriétés des events
            event_other_property: ["country", "country_found", "n_languages", "n_source_countries", "duration", "disaster_score", "hasard_type_score"],
            event_other_property_title: ["Country code", "Country", "Number of languages", "Number of source countries", "Duration", "Disaster score", "Hasard type score"],
            // Propriétés locations des events
            event_location_property: ["latitude", "longitude", "bbox_event"],
            event_location_property_title: ["Latitude", "Longitude", "Bbox event"],
            // Propriétés chiffrées des events (souvent null)
            event_number_property: ["mostfreq_death", "n_mostfreq_death", "time_mostfreq_death", "max_death", "n_max_death", "time_max_death", 
                "median_death", "mostfreq_homeless", "n_mostfreq_homeless", "time_mostfreq_homeless", "max_homeless", "n_max_homeless", 
                "time_max_homeless", "median_homeless", "mostfreq_injured", "n_mostfreq_injured", "time_mostfreq_injured", "max_injured", 
                "n_max_injured", "time_max_injured", "median_injured", "mostfreq_affected", "n_mostfreq_affected", "time_mostfreq_affected", 
                "max_affected", "n_max_affected", "time_max_affected", "median_affected", "mostfreq_missing", "n_mostfreq_missing", 
                "time_mostfreq_missing", "max_missing", "n_max_missing", "time_max_missing", "median_missing", "mostfreq_evacuated", 
                "n_mostfreq_evacuated", "time_mostfreq_evacuated", "max_evacuated", "n_max_evacuated", "time_max_evacuated", "median_evacuated"],
            event_number_property_title: ["Most frequent death", "Number of most frequent death", "Time of most frequent death", "Max death", 
                "Number of max death", "Time of max death", "Median death", "Most frequent homeless", "Number of most frequent homeless", 
                "Time of most frequent homeless", "Max homeless", "Number of max homeless", "Time of max homeless", "Median homeless", "Most frequent injured", 
                "Number of most frequent injured", "Time of most frequent injured", "Max injured", "Number of max injured", "Time of max injured", 
                "Median injured", "Most frequent affected", "Number of most frequent affected", "Time of most frequent affected", "Max affected", 
                "Number of max affected", "Time of max affected", "Median affected", "Most frequent missing", "Number of most frequent missing", 
                "Time of most frequent missing", "Max missing", "Number of max missing", "Time of max missing", "Median missing", "Most frequent evacuated", 
                "Number of most frequent evacuated", "Time of most frequent evacuated", "Max evacuated", "Number of max evacuated", "Time of max evacuated", 
                "Median evacuated"],
            event_main_text: 'Select an event to get more information!', // Texte sur les events (haut droite de l'écran)
            event_other_text: '', // Texte sur les events, partie optionnelle others (haut droite de l'écran)
            event_location_text: '', // Texte sur les events, partie optionnelle locations (haut droite de l'écran)
            event_number_text: '', // Texte sur les events, partie optionnelle numbers (haut droite de l'écran)
            selected_event: null, // Permet de conserver l'event sélectionné
            other_information: false, // Affichage des informations de other ou non (inactif par défaut)
            location_information: false, // Affichage des informations de location ou non (inactif par défaut)
            number_information: false, // Affichage des informations de number ou non (inactif par défaut)
            // Affichage popup changer style
            show_changer_style_form: false,
            // Propriétés par défaut du changement de style
            color_style: 'Event_type',
            color_flood: '#3252a8',
            color_flashflood: '#7f14cc',
            color_landslide: '#4a2c03',
            color_year: [
                { label: 'Before 2020', min: -Infinity, max: Date.parse("2020-01-01"), color: '#6d458b' },
                { label: '2020', min: Date.parse("2020-01-01"), max: Date.parse("2021-01-01"), color: '#0491d0' },
                { label: '2021', min: Date.parse("2021-01-01"), max: Date.parse("2022-01-01"), color: '#88bb64' },
                { label: '2022', min: Date.parse("2022-01-01"), max: Date.parse("2023-01-01"), color: '#f2ce3f' },
                { label: '2023', min: Date.parse("2023-01-01"), max: Date.parse("2024-01-01"), color: '#fc9548' },
                { label: 'After 2023', min: Date.parse("2024-01-01"), max: Infinity, color: '#fb5b44' },
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
                { label: '11 - 15', min: 11, max: 15, size: 9 },
                { label: '16 - 20', min: 16, max: 20, size: 12 },
                { label: '21 - 25', min: 21, max: 25, size: 15 },
            ],
            size_casualties: 'median_death',
            size_death: [
                { label: 'No value', min: null, max: null, size: 3 },
                { label: '0 - 9', min: 0, max: 9, size: 5 },
                { label: '10 - 99', min: 10, max: 99, size: 7 },
                { label: '100 - 999', min: 100, max: 999, size: 9 },
                { label: '1000 - 9999', min: 1000, max: 9999, size: 12 },
                { label: '≥ 10000', min: 10000, max: Infinity, size: 15 },
            ],
            size_injured: [
                { label: 'No value', min: null, max: null, size: 3 },
                { label: '0 - 9', min: 0, max: 9, size: 4 },
                { label: '10 - 99', min: 10, max: 99, size: 5 },
                { label: '100 - 999', min: 100, max: 999, size: 6 },
                { label: '1000 - 9999', min: 1000, max: 9999, size: 7 },
                { label: '10000 - 99999', min: 10000, max: 99999, size: 8 },
                { label: '100000 - 999999', min: 100000, max: 999999, size: 9 },
                { label: '1000000 - 9999999', min: 1000000, max: 9999999, size: 11 },
                { label: '10000000 - 99999999', min: 10000000, max: 99999999, size: 13 },
                { label: '≥ 100000000', min: 100000000, max: Infinity, size: 15 },
            ],
            size_affected: [
                { label: 'No value', min: null, max: null, size: 3 },
                { label: '0 - 9', min: 0, max: 9, size: 4 },
                { label: '10 - 99', min: 10, max: 99, size: 5 },
                { label: '100 - 999', min: 100, max: 999, size: 6 },
                { label: '1000 - 9999', min: 1000, max: 9999, size: 7 },
                { label: '10000 - 99999', min: 10000, max: 99999, size: 8 },
                { label: '100000 - 999999', min: 100000, max: 999999, size: 9 },
                { label: '1000000 - 9999999', min: 1000000, max: 9999999, size: 10 },
                { label: '10000000 - 99999999', min: 10000000, max: 99999999, size: 11 },
                { label: '100000000 - 999999999', min: 100000000, max: 999999999, size: 13 },
                { label: '≥ 1000000000', min: 1000000000, max: Infinity, size: 15 },
            ],
            size_homeless: [
                { label: 'No value', min: null, max: null, size: 3 },
                { label: '0 - 9', min: 0, max: 9, size: 4 },
                { label: '10 - 99', min: 10, max: 99, size: 5 },
                { label: '100 - 999', min: 100, max: 999, size: 6 },
                { label: '1000 - 9999', min: 1000, max: 9999, size: 7 },
                { label: '10000 - 99999', min: 10000, max: 99999, size: 9 },
                { label: '100000 - 999999', min: 100000, max: 999999, size: 11 },
                { label: '1000000 - 9999999', min: 1000000, max: 9999999, size: 13 },
                { label: '≥ 10000000', min: 10000000, max: Infinity, size: 15 },
            ],
            size_missing: [
                { label: 'No value', min: null, max: null, size: 3 },
                { label: '0 - 9', min: 0, max: 9, size: 4 },
                { label: '10 - 99', min: 10, max: 99, size: 5 },
                { label: '100 - 999', min: 100, max: 999, size: 6 },
                { label: '1000 - 9999', min: 1000, max: 9999, size: 7 },
                { label: '10000 - 99999', min: 10000, max: 99999, size: 8 },
                { label: '100000 - 999999', min: 100000, max: 999999, size: 9 },
                { label: '1000000 - 9999999', min: 1000000, max: 9999999, size: 11 },
                { label: '10000000 - 99999999', min: 10000000, max: 99999999, size: 13 },
                { label: '≥ 100000000', min: 100000000, max: Infinity, size: 15 },
            ],
            size_evacuated: [
                { label: 'No value', min: null, max: null, size: 3 },
                { label: '0 - 9', min: 0, max: 9, size: 4 },
                { label: '10 - 99', min: 10, max: 99, size: 5 },
                { label: '100 - 999', min: 100, max: 999, size: 6 },
                { label: '1000 - 9999', min: 1000, max: 9999, size: 7 },
                { label: '10000 - 99999', min: 10000, max: 99999, size: 8 },
                { label: '100000 - 999999', min: 100000, max: 999999, size: 9 },
                { label: '1000000 - 9999999', min: 1000000, max: 9999999, size: 11 },
                { label: '10000000 - 99999999', min: 10000000, max: 99999999, size: 13 },
                { label: '≥ 100000000', min: 100000000, max: Infinity, size: 15 },
            ],
            size_popularity: 'n_articles',
            size_articles: [
                { label: 'No value', min: null, max: null, size: 3 },
                { label: '0 - 9', min: 0, max: 9, size: 5 },
                { label: '10 - 99', min: 10, max: 99, size: 7 },
                { label: '100 - 999', min: 100, max: 999, size: 9 },
                { label: '1000 - 9999', min: 1000, max: 9999, size: 12 },
                { label: '≥ 10000', min: 10000, max: Infinity, size: 15 },
            ],
            size_paragraphs: [
                { label: 'No value', min: null, max: null, size: 3 },
                { label: '0 - 9', min: 0, max: 9, size: 5 },
                { label: '10 - 99', min: 10, max: 99, size: 7 },
                { label: '100 - 999', min: 100, max: 999, size: 9 },
                { label: '1000 - 9999', min: 1000, max: 9999, size: 12 },
                { label: '≥ 10000', min: 10000, max: Infinity, size: 15 },
            ],
            size_languages: [
                { label: '1 - 5', min: 1, max: 5, size: 3 },
                { label: '6 - 10', min: 6, max: 10, size: 5 },
                { label: '11 - 15', min: 11, max: 15, size: 7 },
                { label: '16 - 20', min: 16, max: 20, size: 9 },
                { label: '21 - 25', min: 21, max: 25, size: 11 },
                { label: '26 - 30', min: 26, max: 30, size: 13 },
                { label: '31 - 35', min: 31, max: 35, size: 15 },
            ],
            size_source_countries: [
                { label: '1 - 20', min: 1, max: 20, size: 3 },
                { label: '21 - 40', min: 21, max: 40, size: 5 },
                { label: '41 - 60', min: 41, max: 60, size: 7 },
                { label: '61 - 80', min: 61, max: 80, size: 9 },
                { label: '81 - 100', min: 81, max: 100, size: 12 },
                { label: '101 - 120', min: 101, max: 120, size: 15 },
            ],
            // Affichage popup filtres
            show_filter_form: false,
            // Affichage menu général
            show_general_menu: true,
            // Affichage choix event type
            show_event_type_filter: false,
            // Affichage choix dates
            show_date_filter: false,
            // Affichage choix impact
            show_casualties_filter: false,
            // Affichage choix popularité
            show_popularity_filter: false,
            // Affichage choix location
            show_location_filter: false,
            // Filtre event type
            flood: true,
            flashflood: true,
            landslide: true,
            // Filtre dates
            min_date: "01-01-1953",
            max_date: "31-12-2028",
            start_date: "01-01-1953",
            end_date: "31-12-2028",
            flatpickr_start: null,
            flatpickr_end: null,
            duration_filter: [
                { id: 'duration', label: 'Duration:', min: 0, max: 25, min_depart: 0, max_depart: 25 },
            ],
            // Filtre impact
            impact_filter: [
                { id: 'median_death', label: 'Median death:', checkbox_null: true, min: 1, max: 35000, min_depart: 1, max_depart: 35000 },
                { id: 'median_injured', label: 'Median injured:', checkbox_null: true, min: 1, max: 900000000, min_depart: 1, max_depart: 900000000 },
                { id: 'median_affected', label: 'Median affected:', checkbox_null: true, min: 1, max: 1600000000, min_depart: 1, max_depart: 1600000000 },
                { id: 'median_homeless', label: 'Median homeless:', checkbox_null: true, min: 1, max: 23000000, min_depart: 1, max_depart: 23000000 },
                { id: 'median_missing', label: 'Median missing:', checkbox_null: true, min: 1, max: 140000000, min_depart: 1, max_depart: 140000000 },
                { id: 'median_evacuated', label: 'Median evacuated:', checkbox_null: true, min: 1, max: 185000000, min_depart: 1, max_depart: 185000000 },
            ],
            // Filtre popularité
            popularity_filter: [
                { id: 'n_articles', label: 'Number of articles:', min: 1, max: 15000, min_depart: 1, max_depart: 15000 },
                { id: 'n_paragraphs', label: 'Number of paragraphs:', min: 1, max: 60000, min_depart: 1, max_depart: 60000 },
                { id: 'n_languages', label: 'Number of languages:', min: 1, max: 34, min_depart: 1, max_depart: 34 },
                { id: 'n_source_countries', label: 'Number of source countries:', min: 1, max: 113, min_depart: 1, max_depart: 113 },
            ],
            // Filtre location
            countries_list: [], // Liste des pays
            chosen_country: 'All',
            substring_country: '',
            research_country_list: [],
            draw: null,
            draw_actif: false,
            features_polygon: [],
            extent_filter: [
                { id: 'latitude', label: 'Latitude', min: -90, max: 90, min_depart: -90, max_depart: 90 },
                { id: 'longitude', label: 'Longitude', min: -180, max: 180, min_depart: -180, max_depart: 180 },
            ],
            // Affichage popup download
            show_download_form: false,
            download_filter_e: true,
            download_filter_p: false,
            download_filter_e_p: false,
            download_all_e: false,
            show_fetch_progression: false,
            show_download_progression: false,
            fetch_progression: 0,
            download_progression: 0,
        };
    },

    computed: {

        casualties_list() {
            return [
                { id: 'median_death', label: 'Median death', table: this.size_death },
                { id: 'median_injured', label: 'Median injured', table: this.size_injured },
                { id: 'median_affected', label: 'Median affected', table: this.size_affected },
                { id: 'median_homeless', label: 'Median homeless', table: this.size_homeless },
                { id: 'median_missing', label: 'Median missing', table: this.size_missing },
                { id: 'median_evacuated', label: 'Median evacuated', table: this.size_evacuated },
            ];
        },

        popularity_list() {
            return [
                { id: 'n_articles', label: 'Number of articles', table: this.size_articles },
                { id: 'n_paragraphs', label: 'Number of paragraphs', table: this.size_paragraphs },
                { id: 'n_languages', label: 'Number of languages', table: this.size_languages },
                { id: 'n_source_countries', label: 'Number of source countries', table: this.size_source_countries },
            ];
        },

    },

    methods: {

        // Calcul de l'emprise de l'écran
        // Pas utilisée pour l'instant
        emprise_ecran () {

            // Récupération de l'emprise de l'écran
            let extent3857 = this.map.getView().calculateExtent(this.map.getSize());
            // Conversion des coordonnées du 3857 au 4326 car les données sont en 4326
            let coord_transfo = [
                ol.proj.transform([extent3857[0], extent3857[1]], 'EPSG:3857', 'EPSG:4326'),
                ol.proj.transform([extent3857[2], extent3857[3]], 'EPSG:3857', 'EPSG:4326'),
            ];
            // Emprise dans laquelle on charge les données
            let extent4326 = [].concat(...coord_transfo);
            let min_lon = extent4326[0];
            let min_lat = extent4326[1];
            let max_lon = extent4326[2];
            let max_lat = extent4326[3];

            return { min_lon, min_lat, max_lon, max_lat };

        },

        // Ajout des events à la couche events par pg_connect, selon la bbox
        // Pas utilisée pour l'instant
        ajout_events_postgres () {

            let { min_lon, min_lat, max_lon, max_lat } = this.emprise_ecran();

            // Requête vers la bdd, on récupère seulement les events dans la bbox
            url = "/postgres/events?min_lon=" + min_lon + '&min_lat=' + min_lat + '&max_lon=' + max_lon + '&max_lat=' + max_lat;
            fetch(url)
            .then( (result) => {
                return result.json();
            })
            .then( (json) => {

                // Pour chaque event récupéré :
                for (let i = 0; i < json.length; i++) {

                    // Récupération de l'identifiant
                    let event_id = json[i].event_id;

                    // Si l'event n'est pas déjà dans la couche :
                    let exists = this.events_layer.getSource().getFeatureById(event_id);
                    if (!exists) {  

                        // Création de la feature à l'aide de ses coordonnées (projection en 3857)
                        let new_event = new ol.Feature(new ol.geom.Point(ol.proj.fromLonLat([json[i].longitude,json[i].latitude])));

                        // Stockage de l'identifiant
                        new_event.setId(event_id);

                        // Récupération et stockage des propriétés
                        for (let key in json[i]) {
                            if (json[i].hasOwnProperty(key)) {
                                new_event.set(key, json[i][key]);
                            }
                        }

                        // Création de la propriété country_found
                        let country = this.get_country(new_event);
                        new_event.set('country_found',country);

                        // Dates du filtre en format y-m-d
                        let start_date_ymd = this.start_date.substring(6,10) + '-' + this.start_date.substring(3,5) + '-' + this.start_date.substring(0,2);
                        let end_date_ymd = this.end_date.substring(6,10) + '-' + this.end_date.substring(3,5) + '-' + this.end_date.substring(0,2);

                        // Propriété visibilité dépend des filtres
                        this.set_feature_visibility(new_event, start_date_ymd, end_date_ymd);

                        // Ajout à la couche events
                        this.events_layer.getSource().addFeature(new_event); 

                    }      

                };
            
            });
        
        },

        // Ajout des events à la couche events par geoservices, selon la bbox
        visibilite_features_ajoutees(feature) {

            // Si l'event n'est pas déjà dans la couche :
            let exists = this.events_layer.getSource().getFeatureById(feature.getId());
            if (!exists.get('visible')) {

                // Dates du filtre en format y-m-d
                let start_date_ymd = this.start_date.substring(6,10) + '-' + this.start_date.substring(3,5) + '-' + this.start_date.substring(0,2);
                let end_date_ymd = this.end_date.substring(6,10) + '-' + this.end_date.substring(3,5) + '-' + this.end_date.substring(0,2);

                // Propriété visibilité dépend des filtres
                this.set_feature_visibility(exists, start_date_ymd, end_date_ymd);

            }

        },

        // Créer les listes de pays
        set_countries_list() {

            this.countries_list = [];
            this.research_country_list = [];
            let countries = this.countries_layer.getSource().getFeatures();
            for (let country of countries) {
                this.countries_list.push(country.values_.admin);
                this.research_country_list.push(country.values_.admin);
            }
            this.countries_list.sort()
            this.research_country_list.sort();

        },

        // Permet de compter le nombre d'event par pays
        // Pas utilisée
        async count_n_event_country() {

            let n_events_country = [];
            for (c of this.countries_list) {
                let cqlFilter = "country_found = '" + c + "'";
                let url_n_events = "http://localhost:8080/geoserver/webGIS/ows?service=WFS&version=1.1.0&request=GetFeature&typeName=webGIS:events2020_23" 
                    + "&outputFormat=application/json&resultType=hits" + "&CQL_FILTER=" + encodeURIComponent(cqlFilter);
                let xmlString = await fetch(url_n_events).then(r => r.text());
                let xmlDoc = new DOMParser().parseFromString(xmlString, "application/xml");
                let featureCollection = xmlDoc.querySelector("wfs\\:FeatureCollection, FeatureCollection");
                let n_events = parseInt(featureCollection.getAttribute("numberOfFeatures"));
                n_events_country.push([c,n_events])
            }
            let n_events_country_sort = n_events_country.sort((a, b) => {
                return b[1] - a[1];
            });
            return n_events_country_sort;

        },

        // Crée le texte en récupérant les infos sur l'event, change le style de l'event
        affichage_selection_event (feature) {

            // Chargement et affichage du texte sur l'event
            this.event_main_text = '<ul>';
            this.event_other_text = '<ul>';
            this.event_location_text = '<ul>';
            this.event_number_text = '<ul>';
            // Les propriétés principales s'affichent tout le temps
            for (let i = 0; i < this.event_main_property.length; i++) {
                this.event_main_text += '<li>' + this.event_main_property_title[i] + ': ' + feature.get(this.event_main_property[i]) + '</li>';
            }
            // Les propriétés supplémentaires se chargent, mais elles ne s'affichent que si la checkbox Show other information est cochée
            // L'utilisateur peut choisir s'il veut afficher les informations supplémentaires ou non, son choix est conservé
            for (let i = 0; i < this.event_other_property.length; i++) {
                this.event_other_text += '<li>' + this.event_other_property_title[i] + ': ' + feature.get(this.event_other_property[i]) + '</li>';
            }
            // Les propriétés sur la localisation se chargent, mais elles ne s'affichent que si la checkbox Show location information est cochée
            // L'utilisateur peut choisir s'il veut afficher les informations sur la localisation ou non, son choix est conservé
            for (let i = 0; i < this.event_location_property.length; i++) {
                this.event_location_text += '<li>' + this.event_location_property_title[i] + ': ' + feature.get(this.event_location_property[i]) + '</li>';
            }
            // Les propriétés statistiques se chargent, mais elles ne s'affichent que si la checkbox Show more statistics est cochée
            // L'utilisateur peut choisir s'il veut afficher les informations statistiques ou non, son choix est conservé
            for (let i = 0; i < this.event_number_property.length; i++) {
                this.event_number_text += '<li>' + this.event_number_property_title[i] + ': ' + feature.get(this.event_number_property[i]) + '</li>';
            }
            this.event_main_text += '</ul>';
            this.event_other_text += '</ul>';
            this.event_location_text += '</ul>';
            this.event_number_text += '</ul>';

            // Affichage contours scrollbox
            document.getElementById('event_data_map_scroll_box').style.border = "1px solid #ccc";

            // Garder l'event actuel
            this.selected_event = feature;

            // Couche selected_event vidée
            this.selected_event_layer.getSource().clear();

            // Couche selected_event contient l'event sélectionné : permet de voir l'event
            this.selected_event_layer.getSource().addFeature(feature);

        },

        // Fonction appelée quand on appuie sur le bouton pour avoir plus d'infos
        // Ouvre un autre onglet qui affiche les paragraphs et la bbox associés
        more_infos_page () {

            // Récupérer event_id
            let eventId = this.selected_event.get('event_id');

            // Créer l'url
            let url = `/event?event_id=${encodeURIComponent(eventId)}`;

            // Ouvrir l'onglet avec les informetions liés à l'event
            window.open(url, '_blank').focus();

            // Ouvrir la page des informations de l'event dans le même onglet
            // window.location.href = url;

        },

        // Change la variable passée en paramètre (utilisée avec boutons)
        change_true_false (parameters) {
            for (let parameter of parameters) {
                this[parameter] = !this[parameter];
            }
        },

        // Affiche le changement de style, ferme les autres forms ouverts
        setup_changer_style_form() {

            this.show_changer_style_form = !this.show_changer_style_form;
            this.show_filter_form = false;
            this.show_download_form = false;

        },

        // Création du style de chaque feature selon ses propriétés et le style choisi
        creation_style(couleur_fixee = null) {

            return (feature) => {

                // Feature invisible si elle ne respecte pas les critères de filtrage
                if (feature.get('visible') === false) {
                    return new ol.style.Style({});
                }

                else {

                    // Définition de la couleur
                    let color;
                    if (couleur_fixee) {
                        color = couleur_fixee;
                    }
                    else if (this.color_style === 'Standard') {
                        color = this.color_standard;
                    }
                    else if (this.color_style === 'Event_type') {
                        let hazardType = feature.get('hazard_type');
                        switch (hazardType) {
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
                        let intervalle_date = this.color_year.find(interval => {
                            return date >= interval.min && date <= interval.max;
                        });
                        color = intervalle_date.color;
                    }
                    else if (this.color_style === 'Month') {
                        let str_mois = feature.get('event_time').substring(5,7);
                        let mois = this.color_month.find(interval => {
                            return str_mois === interval.number
                        });
                        color = mois.color;
                    }
            
                    // Définition de la taille
                    let size;
                    if (this.size_style === 'Standard') {
                        size = this.size_standard;
                    } 
                    else if (this.size_style === 'Duration') {
                        let duration = parseFloat(feature.get('duration'));
                        let intervalle_duration = this.size_duration.find(interval => {
                            return duration >= interval.min && duration <= interval.max;
                        });
                        size = intervalle_duration.size;
                    }
                    else if (this.size_style === 'Casualties') {
                        for (let i = 0; i < this.casualties_list.length; i++) {
                            if (this.size_casualties === this.casualties_list[i].id) {
                                let property = feature.get(this.casualties_list[i].id);
                                let intervalle_property = this.casualties_list[i].table.find(interval => {
                                    if (interval.min === null && interval.max === null) {
                                        return property === null;
                                    }
                                    return property >= interval.min && property <= interval.max;
                                });          
                                size = intervalle_property.size;
                            }
                        }
                    } 
                    else if (this.size_style === 'Popularity') {
                        for (let i = 0; i < this.popularity_list.length; i++) {
                            if (this.size_popularity === this.popularity_list[i].id) {
                                let property = feature.get(this.popularity_list[i].id);
                                let intervalle_property = this.popularity_list[i].table.find(interval => {
                                    if (interval.min === null && interval.max === null) {
                                        return property === null;
                                    }
                                    return property >= interval.min && property <= interval.max;
                                });          
                                size = intervalle_property.size;
                            }
                        }
                    } 
            
                    return new ol.style.Style({
                        image: new ol.style.Circle({
                            radius: size,
                            fill: new ol.style.Fill({
                                color: color,
                            }),
                        })
                    });

                }
                
            };

        },

        // Change le style des évènements
        change_style() {

            // Appliquer le style à la couche events
            this.events_layer.setStyle(this.creation_style());

            // Appliquer le style à la couche selected event (couleur imposée)
            this.selected_event_layer.setStyle(this.creation_style('rgba(0, 255, 0, 1)'));
        
        },

        // Affiche le filtre, ferme les autres forms ouverts
        // Initialisation des calendriers
        setup_filter_form() {

            this.show_filter_form = !this.show_filter_form;
            this.show_changer_style_form = false;
            this.show_download_form = false;

            this.set_flatpickr();

        },

        // Affiche le filtre dates
        // Initialisation des calendriers
        display_date_filter() {

            this.show_date_filter = !this.show_date_filter;

            this.set_flatpickr();
        
        },

        // Initialise les calendriers
        set_flatpickr() {

            if (this.show_date_filter) {

                this.$nextTick(() => {

                    // Calandrier pour sélectionner la date de départ
                    let start_date_input = document.querySelector('input[data-id="start_date"]');
                    this.flatpickr_start = flatpickr(start_date_input, {
                        dateFormat: "d-m-Y",
                        minDate: this.min_date,
                        maxDate: this.max_date,
                        defaultDate: this.start_date,
                        onChange: (selectedDates, dateStr) => {
                            this.start_date = dateStr;
                        }
                    });
        
                    // Calandrier pour sélectionner la date de fin
                    let end_date_input = document.querySelector('input[data-id="end_date"]');
                    this.flatpickr_end = flatpickr(end_date_input, {
                        dateFormat: "d-m-Y",
                        minDate: this.min_date,
                        maxDate: this.max_date,
                        defaultDate: this.end_date,
                        onChange: (selectedDates, dateStr) => {
                            this.end_date = dateStr;
                        }
                    });

                });

            }

        },

        // Vérifie si la valeur entrée est valide (nombre entre les valeurs min et max)
        validateInput(event,n_min_depart,n_max_depart) {

            // Calcule la prochaine valeur
            let input = event.target;
            let value = input.value;
            let selectionStart = input.selectionStart;
            let selectionEnd = input.selectionEnd;
            let insertedText = event.data || '';
            let nextValue = value.slice(0, selectionStart) + insertedText + value.slice(selectionEnd);
    
            // Autoriser les nombres négatifs et décimaux
            // La regex autorise : chiffres, un seul "-", un seul "." (dans une position correcte)
            if (!/^-?\d*\.?\d*$/.test(nextValue)) {
                event.preventDefault();
                return;
            }

            // Convertit la valeur en nombre flottant
            let floatVal = parseFloat(nextValue);
            
            // Ignore si la valeur n'est pas encore un nombre valide (ex : "-")
            if (isNaN(floatVal)) return;

            // Empêche la saisie si la valeur est hors des bornes
            if (floatVal < n_min_depart || floatVal > n_max_depart) {
                event.preventDefault();
            }

        },

        // Affiche les pays répondant aux critères
        input_search_country() {
            this.research_country_list = [];
            for (let country of this.countries_list) {
                if (country.toLowerCase().includes(this.substring_country)) {
                    this.research_country_list.push(country);
                }
            }
            if (this.substring_country === '') {
                this.chosen_country = 'All';
            }
            else if (this.research_country_list.length === 0) {
                this.chosen_country = 'All';
            }
            else {
                this.chosen_country = this.research_country_list[0]
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

                    // Récupération des events dans l'emprise (bbox) du polygone
                    let features_polygon_extent = [];
                    this.events_layer.getSource().forEachFeatureIntersectingExtent(polygon.getExtent(), (feature) => {
                        features_polygon_extent.push(feature);
                    });

                    // Récupération des events intersectant le polygone
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
            this.appliquer_filtres();
        },

        // Crée le polynome extent
        extent_polygon() {

            // Couche extent layer vidée
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

            // Création de la feature à l'aide de ses coordonnées
            let extent_polygon = new ol.Feature(
                ol.geom.Polygon.fromExtent([min_lon, min_lat, max_lon, max_lat])
            );

            // Ajout à la couche extent layer 
            this.extent_layer.getSource().addFeature(extent_polygon);

        },

        // Réinitialiser le choix manuel de la bbox
        reset_extent() {
            this.extent_layer.getSource().clear();
            for(let i = 0; i < this.extent_filter.length; i++) {           
                this.extent_filter[i].min = this.extent_filter[i].min_depart;
                this.extent_filter[i].max = this.extent_filter[i].max_depart;
            }
            this.appliquer_filtres();
        },

        // Reset le formulaire des filtres
        reset_filter_form() {

            // Remet les propriétés à leur état initial
            this.flood = true;
            this.flashflood = true;
            this.landslide = true;
            this.start_date = this.min_date;
            this.end_date = this.max_date;
            this.duration_filter[0].min = this.duration_filter[0].min_depart;
            this.duration_filter[0].max = this.duration_filter[0].max_depart;
            for(let i = 0; i < this.impact_filter.length; i++) {
                this.impact_filter[i].checkbox_null = true;              
                this.impact_filter[i].min = this.impact_filter[i].min_depart;
                this.impact_filter[i].max = this.impact_filter[i].max_depart;
            }
            for(let i = 0; i < this.popularity_filter.length; i++) {           
                this.popularity_filter[i].min = this.popularity_filter[i].min_depart;
                this.popularity_filter[i].max = this.popularity_filter[i].max_depart;
            }
            this.chosen_country = 'All';
            this.substring_country = '';
            this.set_countries_list();
            this.draw_layer.getSource().clear();
            this.features_polygon = [];
            this.extent_layer.getSource().clear();
            for(let i = 0; i < this.extent_filter.length; i++) {           
                this.extent_filter[i].min = this.extent_filter[i].min_depart;
                this.extent_filter[i].max = this.extent_filter[i].max_depart;
            }

            // Chaque event devient visible
            for (let feature of this.events_layer.getSource().getFeatures()) {
                feature.set('visible',true);
            }

            // Ferme les panneaux ouverts
            this.show_event_type_filter = false;
            this.show_date_filter = false;
            this.show_casualties_filter = false;
            this.show_popularity_filter = false;
            this.show_location_filter = false;

        },

        // Met à jour la propriété visibilité de la feature selon le filtre
        set_feature_visibility(feature, start_date_ymd, end_date_ymd) {
      
            // Feature visible par défaut
            feature.set('visible',true);

            // Feature ne doit pas être visible si elle ne respecte pas les critères du filtre

            // Hazard type
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

            // Date
            if (Date.parse(feature.get('event_time')) < Date.parse(start_date_ymd)) {
                feature.set('visible',false);
                return;
            }
            if (Date.parse(feature.get('event_time')) > Date.parse(end_date_ymd)) {
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

            // Impact
            for(let i = 0; i < this.impact_filter.length; i++) {
                if (!this.impact_filter[i].checkbox_null && feature.get(this.impact_filter[i].id) === null) {
                    feature.set('visible',false);
                    return;
                }
                if (parseFloat(feature.get(this.impact_filter[i].id)) < parseFloat(this.impact_filter[i].min)) {
                    feature.set('visible',false);
                    return;
                }
                if (parseFloat(feature.get(this.impact_filter[i].id)) > parseFloat(this.impact_filter[i].max)) {
                    feature.set('visible',false);
                    return;
                }
            }

            // Popularity
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

            // Location
            if (this.chosen_country != 'All' && feature.get('country_found') != this.chosen_country) {
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
            
        },

        // Application des filtres : seuls les évènements respectant les critères apparaissent
        appliquer_filtres() {

            // Dates du filtre en format y-m-d
            let start_date_ymd = this.start_date.substring(6,10) + '-' + this.start_date.substring(3,5) + '-' + this.start_date.substring(0,2);
            let end_date_ymd = this.end_date.substring(6,10) + '-' + this.end_date.substring(3,5) + '-' + this.end_date.substring(0,2);

            // Pour chaque feature, sa propriété visibilité est modifiée selon le filtre
            for (let feature of this.events_layer.getSource().getFeatures()) {
                this.set_feature_visibility(feature, start_date_ymd, end_date_ymd);
            }

            // Change le style des features : celles dont la visibilité est fausse sont invisibles, les autres gardent leur style actuel
            this.change_style();

        },

        // Affiche le form de download, ferme les autres forms ouverts
        setup_download_form() {

            this.show_download_form = !this.show_download_form;
            this.show_changer_style_form = false;
            this.show_filter_form = false;

        },

        // Permet d'avoir une seule checkbox sélectionnée pour le choix du mode de download
        checkbox_download(checkbox_name) {
            let checkbox_list = ['download_filter_e', 'download_filter_p', 'download_filter_e_p', 'download_all_e']
            for (let checkbox of checkbox_list) {
                if (checkbox_name != checkbox) {
                    this[checkbox] = false;
                }
            }
        },

        // Crée le filtre cql pour la requête des events vers le Geoserver
        set_cqlfilter_event(type) {

            let cqlFilter = '';
            let draw_filter = 0;

            // Cas où on télécharge tous les events
            if (type == 'all') {
                return { cqlFilter, draw_filter }
            }

            // Cas où on filtre selon un polygone: utilisation de la visibilité des features de la couche events
            if (type == 'filter' && this.draw_layer.getSource().getFeatures().length === 1) {
                draw_filter = 1;
                return { cqlFilter, draw_filter }
            }

            // Cas où on filtre dans la requête Geoserver
            if (type == 'filter' && this.draw_layer.getSource().getFeatures().length === 0) {

                // Hazard type
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
                    cqlFilter = 'No event'                 
                    return { cqlFilter, draw_filter }
                }
                else {
                    cqlFilter += "hazard_type IN (" + hazard_type_liste.map(id => `'${id}'`).join(",") + ")";
                }

                // Date
                let start_date_ymd = this.start_date.substring(6,10) + '-' + this.start_date.substring(3,5) + '-' + this.start_date.substring(0,2);
                let end_date_ymd = this.end_date.substring(6,10) + '-' + this.end_date.substring(3,5) + '-' + this.end_date.substring(0,2);
                cqlFilter += " AND event_time >= '" + start_date_ymd + "'";
                cqlFilter += " AND event_time <= '" + end_date_ymd + "'";
                cqlFilter += " AND " + this.duration_filter[0].id + " BETWEEN " + this.duration_filter[0].min + " AND " + this.duration_filter[0].max;

                // Impact
                for(let i = 0; i < this.impact_filter.length; i++) {
                    if (this.impact_filter[i].checkbox_null) {
                        cqlFilter += " AND (" + this.impact_filter[i].id + " BETWEEN " + this.impact_filter[i].min + " AND " + this.impact_filter[i].max
                        + " OR " + this.impact_filter[i].id + " IS NULL)";
                    }
                    else {
                        cqlFilter += " AND " + this.impact_filter[i].id + " BETWEEN " + this.impact_filter[i].min + " AND " + this.impact_filter[i].max;
                    }
                }

                // Popularity
                for(let i = 0; i < this.popularity_filter.length; i++) {
                    cqlFilter += " AND " + this.popularity_filter[i].id + " BETWEEN " + this.popularity_filter[i].min + " AND " + this.popularity_filter[i].max;
                }

                // Location
                if (this.chosen_country != 'All') {
                    cqlFilter += " AND country_found = '" + this.chosen_country + "'";
                }
                for(let i = 0; i < this.extent_filter.length; i++) {
                    cqlFilter += " AND " + this.extent_filter[i].id + " BETWEEN " + this.extent_filter[i].min + " AND " + this.extent_filter[i].max;
                }

                return { cqlFilter, draw_filter }

            }

        },

        // Création du texte de download des paragraphs liés à un event
        async paragraph_download_text_filter(feature,paragraph_content_lines,source) {

            // Liste des propriétés des paragraphs
            let paragraph_download_properties = ["article_id", "title", "extracted_text", "paragraph_time", "article_language", "source_country", "domain_url",
                "paragraph_id", "original_text", "disaster_label", "disaster_score", "hasard_type", "hasard_type_score", "nb_death", "score_death", "answer_death",
                "nb_homeless", "score_homeless", "answer_homeless", "nb_injured", "score_injured", "answer_injured", "nb_affected", "score_affected", 
                "answer_affected", "nb_missing", "score_missing", "answer_missing", "nb_evacuated", "score_evacuated", "answer_evacuated", "publication_time",
                "extracted_location", "ner_score", "latitude", "longitude", "std_dev", "min_lat", "max_lat", "min_lon", "max_lon", "n_locations", "nb_death_min",
                "nb_death_max", "nb_homeless_min", "nb_homeless_max", "nb_injured_min", "nb_injured_max", "nb_affected_min", "nb_affected_max", "nb_missing_min",
                "nb_missing_max", "nb_evacuated_min", "nb_evacuated_max", "unnamed_column", "country", "wkt", "country_found"];
            let paragraph_property_str = ["title", "extracted_text", "original_text", "extracted_location", "ner_score"];

            // Récupérer les valeurs des paragraphs_id
            let paragraphs_list;
            if (source === 'event layer') {
                paragraphs_list = feature.get('paragraphs_list')
            }
            if (source === 'geoserver') {
                paragraphs_list = feature.properties.paragraphs_list;
            }
            // Nettoyage de la chaîne pour enlever les parenthèses extérieures
            paragraphs_list = paragraphs_list.replace(/^\(|\)$/g, '');
            // Transformation en tableau
            paragraphs_list = paragraphs_list.split(',').map(e => e.trim().replace(/^'|'$/g, ''));
            // Récupération du nombre de paragraphs
            let n_paragraphs = paragraphs_list.length;

            // Lancer tous les fetch en parallèle, pour récupérer les paragraphs 50 par 50
            let batchSize = 50;
            let nb_boucles = Math.ceil(n_paragraphs / batchSize);
            let fetchPromises = Array.from({length: nb_boucles}, (_, i) => {
                // Tableaux de 50 paragraph_id
                let paragraphs_list_50 = paragraphs_list.slice(50*i, 50*(i+1));
                // Partie filtre cql de la requête
                let cqlFilter = "paragraph_id IN (" + paragraphs_list_50.map(id => `'${id}'`).join(",") + ")";
                // Requête vers le geoserver, on récupère seulement les paragraphs de l'event, par groupe de 50
                let url = "http://localhost:8080/geoserver/webGIS/ows?service=WFS&version=1.1.0&request=GetFeature&typeName=webGIS:paragraphs2020_23"
                + "&outputFormat=application/json&CQL_FILTER=" + encodeURIComponent(cqlFilter);
                return fetch(url).then(res => res.json());
            });

            // Attendre d'avoir récupéré toutes les promesses
            let results = await Promise.all(fetchPromises);

            results.forEach((data, i) => {
                let features = data.features || [];

                // Pour chaque paragraph
                features.forEach(f => {

                    // Création d'une ligne de texte (paragraphs.csv)
                    // Si la valeur contient une virgule ou si la propriété nécessite des guillemets, on l'entoure de guillemets
                    let props = f.properties;
                    let row = paragraph_download_properties.map(prop => {
                        let value = props[prop];
                        if (value == null) return ''; // gérer les null
                        if (paragraph_property_str.includes(prop)) {
                            value = String(value).replace(/"/g, '""');
                            return `"${value}"`;
                        }
                        return String(value);
                    }).join(',');
                    paragraph_content_lines.push(row);

                });

            });

            return paragraph_content_lines;

        },

        // Création du texte de download de tous les paragraphs
        // Pas utilisée
        async paragraph_download_text_all() {

            // Liste des propriétés des paragraphs
            let paragraph_download_properties = ["article_id", "title", "extracted_text", "paragraph_time", "article_language", "source_country", "domain_url",
                "paragraph_id", "original_text", "disaster_label", "disaster_score", "hasard_type", "hasard_type_score", "nb_death", "score_death", "answer_death",
                "nb_homeless", "score_homeless", "answer_homeless", "nb_injured", "score_injured", "answer_injured", "nb_affected", "score_affected", 
                "answer_affected", "nb_missing", "score_missing", "answer_missing", "nb_evacuated", "score_evacuated", "answer_evacuated", "publication_time",
                "extracted_location", "ner_score", "latitude", "longitude", "std_dev", "min_lat", "max_lat", "min_lon", "max_lon", "n_locations", "nb_death_min",
                "nb_death_max", "nb_homeless_min", "nb_homeless_max", "nb_injured_min", "nb_injured_max", "nb_affected_min", "nb_affected_max", "nb_missing_min",
                "nb_missing_max", "nb_evacuated_min", "nb_evacuated_max", "unnamed_column", "country", "wkt", "country_found"];
            let paragraph_property_str = ["title", "extracted_text", "original_text", "extracted_location", "ner_score"];

            // Création du tableau pour le join final, initialisation du texte (header)
            let paragraph_content_lines = [paragraph_download_properties.join(',')];

            // Récupérer le nombre de paragraphs
            let url_n_paragraphs = "http://localhost:8080/geoserver/webGIS/ows?service=WFS&version=1.1.0&request=GetFeature&typeName=webGIS:paragraphs2020_23" 
                + "&outputFormat=application/json&resultType=hits"; 
            let xmlString = await fetch(url_n_paragraphs).then(r => r.text());
            let xmlDoc = new DOMParser().parseFromString(xmlString, "application/xml");
            let featureCollection = xmlDoc.querySelector("wfs\\:FeatureCollection, FeatureCollection");
            let n_paragraphs = parseInt(featureCollection.getAttribute("numberOfFeatures"));

            // Lancer tous les fetch en parallèle, pour récupérer les paragraphs 50 par 50
            let batchSize = 50;
            let nb_boucles = Math.ceil(n_paragraphs / batchSize);
            let fetchPromises = Array.from({length: nb_boucles}, (_, i) => {
                let offset = 50 * i;
                let url = `http://localhost:8080/geoserver/webGIS/ows?service=WFS&version=1.1.0&request=GetFeature&typeName=webGIS:paragraphs2020_23`
                    + `&outputFormat=application/json&maxFeatures=50&startIndex=${offset}`;
                return fetch(url).then(res => res.json());
            });

            // Attendre d'avoir récupéré toutes les promesses
            let results = await Promise.all(fetchPromises);

            results.forEach((data, i) => {
                let features = data.features || [];

                // Pour chaque paragraph
                features.forEach(f => {

                    // Création d'une ligne de texte (paragraphs.csv)
                    // Si la valeur contient une virgule ou si la propriété nécessite des guillemets, on l'entoure de guillemets
                    let props = f.properties;
                    let row = paragraph_download_properties.map(prop => {
                        let value = props[prop];
                        if (value == null) return ''; // gérer les null
                        if (paragraph_property_str.includes(prop)) {
                            value = String(value).replace(/"/g, '""');
                            return `"${value}"`;
                        }
                        return String(value);
                    }).join(',');
                    paragraph_content_lines.push(row);

                });

            });

            return paragraph_content_lines.join('\n');

        },

        // Download
        async download() {

            // Définition du type de download
            let type = null;
            if (this.download_all_e) {
                type = 'all';
            }
            if (this.download_filter_e || this.download_filter_p || this.download_filter_e_p) {
                type = 'filter';
            }

            // Si aucun mode de download n'est choisi
            if (type === null) {
                alert("No download mode selected!");
                return;
            }

            // Liste des propriétés
            let event_download_properties = ["id_integer", "event_id", "hazard_type", "disaster_score", "hasard_type_score", "latitude", "longitude", 
                "event_time", "bbox_event", "n_languages", "n_source_countries", "paragraphs_list", "articles_list", "n_paragraphs", "n_articles", 
                "start_time", "end_time", "duration", "mostfreq_death", "n_mostfreq_death", "time_mostfreq_death", "max_death", "n_max_death", 
                "time_max_death", "median_death", "mostfreq_homeless", "n_mostfreq_homeless", "time_mostfreq_homeless", "max_homeless", "n_max_homeless", 
                "time_max_homeless", "median_homeless", "mostfreq_injured", "n_mostfreq_injured", "time_mostfreq_injured", "max_injured", "n_max_injured", 
                "time_max_injured", "median_injured", "mostfreq_affected", "n_mostfreq_affected", "time_mostfreq_affected", "max_affected", "n_max_affected", 
                "time_max_affected", "median_affected", "mostfreq_missing", "n_mostfreq_missing", "time_mostfreq_missing", "max_missing", "n_max_missing", 
                "time_max_missing", "median_missing", "mostfreq_evacuated", "n_mostfreq_evacuated", "time_mostfreq_evacuated", "max_evacuated", 
                "n_max_evacuated", "time_max_evacuated", "median_evacuated", "country", "wkt", "country_found"];
            let event_property_str = ["bbox_event", "paragraphs_list", "articles_list"];
            let paragraph_download_properties = ["article_id", "title", "extracted_text", "paragraph_time", "article_language", "source_country", "domain_url",
                "paragraph_id", "original_text", "disaster_label", "disaster_score", "hasard_type", "hasard_type_score", "nb_death", "score_death", "answer_death",
                "nb_homeless", "score_homeless", "answer_homeless", "nb_injured", "score_injured", "answer_injured", "nb_affected", "score_affected", 
                "answer_affected", "nb_missing", "score_missing", "answer_missing", "nb_evacuated", "score_evacuated", "answer_evacuated", "publication_time",
                "extracted_location", "ner_score", "latitude", "longitude", "std_dev", "min_lat", "max_lat", "min_lon", "max_lon", "n_locations", "nb_death_min",
                "nb_death_max", "nb_homeless_min", "nb_homeless_max", "nb_injured_min", "nb_injured_max", "nb_affected_min", "nb_affected_max", "nb_missing_min",
                "nb_missing_max", "nb_evacuated_min", "nb_evacuated_max", "unnamed_column", "country", "wkt", "country_found"];

            // Création des tableaux pour le join final, initialisation des textes (header)
            let event_content_lines = [event_download_properties.join(',')];
            let paragraph_content_lines = [paragraph_download_properties.join(',')];

            // Récupérer filtres
            let { cqlFilter, draw_filter } = this.set_cqlfilter_event(type);

            // Si la liste des hazard type est vide
            if (cqlFilter === 'No event') {
                alert("No event matches the criteria!");
                return;
            }

            // Si on ne filtre pas selon un polygone
            if (draw_filter == 0) {

                // Récupérer le nombre d'events
                let url_n_events;
                if (type == 'all') {
                    url_n_events = "http://localhost:8080/geoserver/webGIS/ows?service=WFS&version=1.1.0&request=GetFeature&typeName=webGIS:events2020_23" 
                    + "&outputFormat=application/json&resultType=hits";
                }
                if (type == 'filter' && cqlFilter !== 'No event') {
                    url_n_events = "http://localhost:8080/geoserver/webGIS/ows?service=WFS&version=1.1.0&request=GetFeature&typeName=webGIS:events2020_23" 
                    + "&outputFormat=application/json&resultType=hits" + "&CQL_FILTER=" + encodeURIComponent(cqlFilter);
                }     
                let xmlString = await fetch(url_n_events).then(r => r.text());
                let xmlDoc = new DOMParser().parseFromString(xmlString, "application/xml");
                let featureCollection = xmlDoc.querySelector("wfs\\:FeatureCollection, FeatureCollection");
                let n_events = parseInt(featureCollection.getAttribute("numberOfFeatures"));

                // Si aucun event ne correspond aux critères
                if (n_events === 0) {
                    alert("No event matches the criteria!");
                    return;
                }

                // Si on veut télécharger des paragraphs et que trop d'events correspondent aux critères (>10000)
                if (this.download_filter_p || this.download_filter_e_p) {
                    if (n_events > 10000) {
                        alert("To many events, use more filters!");
                        return;
                    }
                }

                // Affichage de la progression du download
                this.show_fetch_progression = true;
                this.show_download_progression = true;

                // Lancer tous les fetch en parallèle, pour récupérer les events 50 par 50
                let batchSize = 50;
                let nb_boucles = Math.ceil(n_events / batchSize);
                let completed = 0;
                let fetchPromises = Array.from({length: nb_boucles}, (_, i) => {
                    let offset = 50 * i;
                    let url;
                    if (type == 'all') {
                        url = `http://localhost:8080/geoserver/webGIS/ows?service=WFS&version=1.1.0&request=GetFeature&typeName=webGIS:events2020_23` 
                        + `&outputFormat=application/json&maxFeatures=50&startIndex=${offset}`;
                    }
                    if (type == 'filter') {
                        url = `http://localhost:8080/geoserver/webGIS/ows?service=WFS&version=1.1.0&request=GetFeature&typeName=webGIS:events2020_23` 
                        + `&outputFormat=application/json&maxFeatures=50&startIndex=${offset}` + "&CQL_FILTER=" + encodeURIComponent(cqlFilter);
                    }  
                    return fetch(url).then(res => res.json())
                    .then(data => {
                        completed++;
                        this.fetch_progression = Math.round((completed / nb_boucles) * 100);
                        return data;
                    });
                });

                // Attendre d'avoir récupéré toutes les promesses
                let results = await Promise.all(fetchPromises);

                let compteur_pages = 0;
                for (data of results) {
                    let features = data.features || [];

                    // Pour chaque event
                    for (let f of features) {

                        // Création d'une ligne de texte (events.csv)
                        // Si la valeur contient une virgule ou si la propriété nécessite des guillemets, on l'entoure de guillemets
                        if(this.download_all_e || this.download_filter_e || this.download_filter_e_p) {
                            let props = f.properties;
                            let row = event_download_properties.map(prop => {
                                let value = props[prop];
                                if (value == null) return ''; // gérer les null
                                if (event_property_str.includes(prop)) {
                                    value = String(value).replace(/"/g, '""');
                                    return `"${value}"`;
                                }
                                return String(value);
                            }).join(',');
                            event_content_lines.push(row);
                        }

                        // Création du texte de paragraphs.csv
                        if(this.download_filter_p || this.download_filter_e_p) {
                            paragraph_content_lines = await this.paragraph_download_text_filter(f,paragraph_content_lines,'geoserver');
                        }

                    };

                    // Calcul de la progression
                    compteur_pages += 1
                    this.download_progression = parseInt(compteur_pages*100/nb_boucles)

                };

                // Désaffichage de la progression du download
                this.show_fetch_progression = false;
                this.show_download_progression = false;
                this.fetch_progression = 0;
                this.download_progression = 0;

            }
            
            // Si on filtre selon un polygone
            if (draw_filter == 1) {

                // Récupérer le nombre d'events
                let event_features = this.events_layer.getSource().getFeatures();
                let n_events_visibles = event_features.filter(f => f.get('visible') === true).length;
                let nb_total_events = event_features.length;

                // Si aucun event ne correspond aux critères
                if (n_events_visibles === 0) {
                    alert("No event matches the criteria!");
                    return;
                }

                // Si on veut télécharger des paragraphs et que trop d'events correspondent aux critères (>10000)
                if (this.download_filter_p || this.download_filter_e_p) {
                    if (n_events_visibles > 10000) {
                        alert("To many events, use more filters!");
                        return;
                    }
                }

                // Affichage de la progression du download
                this.show_download_progression = true;

                let compteur_events = 0;
                // On récupère les events de la couche events 1 par 1
                for (let f of this.events_layer.getSource().getFeatures()) {

                    // Pour chaque event correspondant aux critères
                    if (f.get('visible')) {

                        // Création d'une ligne de texte (events.csv)
                        // Si la valeur contient une virgule ou si la propriété nécessite des guillemets, on l'entoure de guillemets
                        if(this.download_all_e || this.download_filter_e || this.download_filter_e_p) {
                            let row = event_download_properties.map(prop => {
                                let value = f.get(prop);
                                if (value == null) return ''; // gérer les null
                                if (event_property_str.includes(prop)) {
                                    value = String(value).replace(/"/g, '""');
                                    return `"${value}"`;
                                }
                                return String(value);
                            }).join(',');
                            event_content_lines.push(row);
                        }

                        // Création du texte de paragraphs.csv
                        if(this.download_filter_p || this.download_filter_e_p) {
                            paragraph_content_lines = await this.paragraph_download_text_filter(f,paragraph_content_lines,'event layer');
                        }

                    }

                    // Calcul de la progression du download
                    compteur_events += 1;
                    this.download_progression = parseInt(compteur_events*100/nb_total_events);
                    
                }

                // Désaffichage de la progression du download
                this.show_download_progression = false;
                this.download_progression = 0;

            }

            // Téléchargement des events
            if(this.download_all_e || this.download_filter_e || this.download_filter_e_p) {
                this.creation_csv(event_content_lines, "events.csv");
            }

            // Téléchargement des paragraphs
            if(this.download_filter_p || this.download_filter_e_p) {
                this.creation_csv(paragraph_content_lines, "paragraphs.csv");
            }

        },

        // Crée le csv à partir du texte
        creation_csv(contentLines, filename) {

            try {

                let content = contentLines.join('\n');

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

        // Récupérer la localisation et l'afficher
        affichage_localisation() {

            navigator.geolocation.getCurrentPosition((position) => {

                // Récupérer les valeurs sur le position de l'appareil
                let latitude_pos = position.coords.latitude;
                let longitude_pos = position.coords.longitude;
                let precision_pos = position.coords.accuracy;

                // Vider la couche localisation
                this.localisation_layer.getSource().clear();

                // Transformer les coordonnées en EPSG:3857
                let center = ol.proj.fromLonLat([longitude_pos, latitude_pos]);

                // Feature pour le point central
                let pointFeature = new ol.Feature(new ol.geom.Point(center));

                // Feature pour le cercle de précision (en mètres, donc dans la projection EPSG:3857)
                let circleFeature = new ol.Feature(new ol.geom.Circle(center, precision_pos));

                // Ajouter les deux features à la couche
                this.localisation_layer.getSource().addFeatures([circleFeature, pointFeature]);

                // Appliquer les styles
                this.localisation_layer.setStyle((feature) => {
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

        },

    },

    mounted() {

        // Initialisation de la carte
        this.map = new ol.Map({
            target: 'map',
            view: new ol.View({
                center: ol.proj.fromLonLat([4.517, 50.830]),
                zoom: 15,
            }),
            layers: [
                new ol.layer.Tile({
                    source: new ol.source.XYZ({
                        url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
                        maxZoom: 19,
                        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                    }),
                    zIndex: 1,
                }),
            ],
        });

        // Couche des pays (source : Natural Earth, https://geojson-maps.kyd.au/?utm_source=self&utm_medium=redirect)
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
            zIndex: 2,
        });
        this.map.addLayer(this.countries_layer);

        // Créer la liste des pays une fois que les entités sont chargées
        this.countries_layer.getSource().on('featuresloadend', () => {
            this.set_countries_list();
        });

        // Couche du polygone de l'extent
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
            zIndex: 3,
        });
        this.map.addLayer(this.extent_layer);

        // Couche de dessin (pour récupérer l'emprise d'un polygone)
        this.draw_layer = new ol.layer.Vector({
            source: new ol.source.Vector({}),
            zIndex: 4,
        });
        this.map.addLayer(this.draw_layer);

        // Fin de l'interaction de dessin dès qu'une feature est dessinée
        this.draw_layer.getSource().on('addfeature', event => {
            this.draw_actif = false;
            this.map.removeInteraction(this.draw);
        });
 
        // Création de la couche events (se remplit selon la bbox)
        this.events_layer = new ol.layer.Vector({
            source: new ol.source.Vector({
                format: new ol.format.GeoJSON(),
                url: function(extent) {
                    return 'http://localhost:8080/geoserver/webGIS/ows?' +
                        'service=WFS&version=1.1.0&request=GetFeature&typeName=webGIS:events2020_23&' +
                        'outputFormat=application/json&bbox=' + extent.join(',') + ',EPSG:3857';
                },
                strategy: ol.loadingstrategy.bbox
            }),
            style: new ol.style.Style({
                image: new ol.style.Circle({
                    radius: 10,
                    fill: new ol.style.Fill({
                        color: 'rgba(255, 0, 0, 1)',
                    }),
                }),
            }),
            zIndex: 10,
        });
        this.map.addLayer(this.events_layer);

        // À chaque ajout de nouvelles features, création de la variable visibilité selon les filtres actifs
        this.events_layer.getSource().on('featuresloadend', event => {
            let features = event.features;
            features.forEach((feature) => {
                this.visibilite_features_ajoutees(feature)
            })
        });

        // Création de la couche event selectionné (vide)
        this.selected_event_layer = new ol.layer.Vector({
            source: new ol.source.Vector(),
            style: new ol.style.Style({
                image: new ol.style.Circle({
                    radius: 10,
                    fill: new ol.style.Fill({
                        color: 'rgba(0, 255, 0, 1)',
                    }),
                }),
            }),
            zIndex: 11,
        });
        this.map.addLayer(this.selected_event_layer);

        // Style au départ
        this.change_style();

        // Création de la couche géolocalisation vide
        this.localisation_layer = new ol.layer.Vector({
            source: new ol.source.Vector(),
            zIndex: 12,
        });
        this.map.addLayer(this.localisation_layer);

        // Création du popup vide pour le pointermove
        let var_popup_pointermove = new ol.Overlay({
            element: document.getElementById("popup_pointermove"),
            positioning: "bottom-center"
        });
        this.map.addOverlay(var_popup_pointermove);

        // Création du popup vide pour le clic
        let var_popup_clic = new ol.Overlay({
            element: document.getElementById("popup_clic"),
            positioning: "bottom-center"
        });
        this.map.addOverlay(var_popup_clic);

        // Bouton pour accéder à l'outil filtrage
        var filtrage_control = new ol.control.Control({
            element: document.getElementById("outil_filtrage_div"),
        });
        this.map.addControl(filtrage_control);

        // Bouton pour changer le style
        var change_style_control = new ol.control.Control({
            element: document.getElementById("changer_style_div"),
        });
        this.map.addControl(change_style_control);

        // Bouton download
        var download_control = new ol.control.Control({
            element: document.getElementById("download_div"),
        });
        this.map.addControl(download_control);

        // Bouton pour activer la localisation
        var localisation_control = new ol.control.Control({
            element: document.getElementById("affichage_localisation_div"),
        });
        this.map.addControl(localisation_control);

        // Scale line
        var scaleline = new ol.control.ScaleLine({
            element: document.getElementById("scaleline_div"),
        });
        this.map.addControl(scaleline);

        // A chaque déplacement/zoom, ajout des events à la couche events selon la bbox (pas utilisé pour l'instant)
        // Suppression du popup clic
        this.map.on('moveend', () => {
            // this.ajout_events();
            document.getElementById("popup_clic").style.display = "none";
        });

        // A chaque déplacement du pointer, si plusieurs events sont superposées au niveau du pointer, on affiche leur nombre
        this.map.on("pointermove", evt => {

            let event_features = [];
        
            // Récupérer les features à partir des différentes couches
            this.map.forEachFeatureAtPixel(evt.pixel, (feature, layer) => {
                if (layer === this.events_layer) {
                    event_features.push(feature);
                }
            });
    
            // Si il y a plusieurs events, le popup affiche "n events"
            if (event_features.length > 1) {
                document.getElementById("popup_pointermove").innerHTML = event_features.length + " events";
                var_popup_pointermove.setPosition(evt.coordinate);
                document.getElementById("popup_pointermove").style.display = "block";
            }
        
            else {
                document.getElementById("popup_pointermove").style.display = "none";
            }

        });

        // Quand on clique sur une ou plusieurs features :
        this.map.on('click', evt => {

            let event_features = [];
        
            // Récupérer les features à partir des différentes couches
            this.map.forEachFeatureAtPixel(evt.pixel, (feature, layer) => {
                if (layer === this.events_layer) {
                    event_features.push(feature);
                }
            });
    
            // Si la feature est un seul event, le texte contenant les infos sur cet event s'affiche en haut à droite de l'écran
            if (event_features.length == 1) {
                document.getElementById("popup_clic").style.display = "none";
                this.affichage_selection_event(event_features[0]);
            }

            // Si plusieurs events sont sélectionnés, on affiche la liste sous forme de liens cliquables
            // Cliquer sur un lien affiche le texte contenant les infos sur l'event sélectionné en haut à droite de l'écran
            else if (event_features.length > 1) {
                let html_popup = 'Choose the event:<ul>'
                event_features.forEach((event_feature, index) => {
                    let ligne = event_feature.get('hazard_type') + ' - ' + event_feature.get('event_time').substring(0,10);
                    html_popup += `<li><a href="#" id="event_link_${index}">${ligne}</a></li>`;
                });
                html_popup += '</ul>';
                document.getElementById("popup_clic").innerHTML = html_popup;
                event_features.forEach((event_feature, index) => {
                    document.getElementById(`event_link_${index}`).addEventListener('click', (e) => {
                        e.preventDefault(); // empêcher le scroll en haut de page
                        this.affichage_selection_event(event_feature);
                    });
                });
                var_popup_clic.setPosition(evt.coordinate);
                document.getElementById("popup_clic").style.display = "block";
            }

            else {
                document.getElementById("popup_clic").style.display = "none";
            }

        });

    },

    created() {
    
    },

}).mount('#vue_map');
