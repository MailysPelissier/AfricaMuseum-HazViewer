Vue.createApp({

    data() {
        return {
            map: null, // Initialisation de la map
            countries_layer: null, // Initialisation de la couche countries
            bbox_events_layer: null, // Initialisation de la couche bbox events
            bbox_paragraphs_layer: null, // Initialisation de la couche bbox paragraphs
            selected_event_layer: null, // Initialisation de la couche selected event
            paragraphs_layer: null, // Initialisation de la couche paragraphs
            selected_paragraph_layer: null, // Initialisation de la couche selected paragraph
            // Propriétés principales des events
            event_main_properties: ["hazard_type", "event_time", "start_time", "end_time", "median_death", "median_injured", "median_affected",
                 "n_paragraphs", "n_articles"],
            event_main_properties_title: ["Hazard type", "Event time", "Start time", "End time", "Median death", "Median injured", "Median affected",
                "Number of paragraphs", "Number of articles"],
            // Autres propriétés des events
            event_other_properties: ["country", "country_found", "n_languages", "n_source_countries", "n_domains", "duration", "hazard_score"],
            event_other_properties_title: ["Country code", "Country", "Number of languages", "Number of source countries", "Number of domains", 
                "Duration", "Hazard score"],
            // Propriétés localisations des events
            event_location_properties: ["latitude", "longitude", "min_lat", "max_lat", "min_lon", "max_lon"],
            event_location_properties_title: ["Latitude", "Longitude", "Minimum latitude", "Maximum latitude", "Minimum longitude", "Maximum longitude"],
            // Propriétés statistiques des events (souvent null)
            event_number_properties: ["mostfreq_death", "n_mostfreq_death", "time_mostfreq_death", "max_death", "n_max_death", "time_max_death", 
                "median_death", "mostfreq_homeless", "n_mostfreq_homeless", "time_mostfreq_homeless", "max_homeless", "n_max_homeless", 
                "time_max_homeless", "median_homeless", "mostfreq_injured", "n_mostfreq_injured", "time_mostfreq_injured", "max_injured", 
                "n_max_injured", "time_max_injured", "median_injured", "mostfreq_affected", "n_mostfreq_affected", "time_mostfreq_affected", 
                "max_affected", "n_max_affected", "time_max_affected", "median_affected", "mostfreq_missing", "n_mostfreq_missing", 
                "time_mostfreq_missing", "max_missing", "n_max_missing", "time_max_missing", "median_missing", "mostfreq_evacuated", 
                "n_mostfreq_evacuated", "time_mostfreq_evacuated", "max_evacuated", "n_max_evacuated", "time_max_evacuated", "median_evacuated"],
            event_number_properties_title: ["Most frequent death", "Number of most frequent death", "Time of most frequent death", "Max death", 
                "Number of max death", "Time of max death", "Median death", "Most frequent homeless", "Number of most frequent homeless", 
                "Time of most frequent homeless", "Max homeless", "Number of max homeless", "Time of max homeless", "Median homeless", "Most frequent injured", 
                "Number of most frequent injured", "Time of most frequent injured", "Max injured", "Number of max injured", "Time of max injured", 
                "Median injured", "Most frequent affected", "Number of most frequent affected", "Time of most frequent affected", "Max affected", 
                "Number of max affected", "Time of max affected", "Median affected", "Most frequent missing", "Number of most frequent missing", 
                "Time of most frequent missing", "Max missing", "Number of max missing", "Time of max missing", "Median missing", "Most frequent evacuated", 
                "Number of most frequent evacuated", "Time of most frequent evacuated", "Max evacuated", "Number of max evacuated", "Time of max evacuated", 
                "Median evacuated"],
            // Propriétés principales des paragraphs
            paragraph_main_properties: ["title", "hasard_type", "publication_time", "paragraph_time", "nb_death", "nb_injured", "nb_affected",
                "article_language"],
            paragraph_main_properties_title: ["Title", "Hasard type", "Publication time", "Paragraph time", "Number of death", "Number of injured", 
                "Number of affected", "Article language"],
            // Autres propriétés des paragraphs
            paragraph_other_properties: ["extracted_text", "original_text", "country", "country_found", "continent", "population_density", "source_country", 
                "domain_url", "extracted_location", "ner_score", "n_locations", "disaster_label", "disaster_score", "hasard_type_score"],
            // Propriétés localisations des events
            paragraph_location_properties: ["latitude", "longitude", "std_dev", "min_lat", "max_lat", "min_lon", "max_lon"],
            // Propriétés statistiques des paragraphs (souvent null)
            paragraph_number_properties: ["nb_death", "score_death", "answer_death", "nb_homeless", "score_homeless", "answer_homeless", 
                "nb_injured", "score_injured", "answer_injured", "nb_affected", "score_affected", "answer_affected", "nb_missing",
                "score_missing", "answer_missing", "nb_evacuated", "score_evacuated", "answer_evacuated", "nb_death_min",
                "nb_death_max", "nb_homeless_min", "nb_homeless_max", "nb_injured_min", "nb_injured_max", "nb_affected_min",
                "nb_affected_max", "nb_missing_min", "nb_missing_max", "nb_evacuated_min", "nb_evacuated_max"],
            event_main_text: '', // Texte sur les events (haut droite de l'écran)
            event_other_text: '', // Texte sur les events, partie optionnelle autres (haut droite de l'écran)
            event_location_text: '', // Texte sur les events, partie optionnelle localisations (haut droite de l'écran)
            event_number_text: '', // Texte sur les events, partie optionnelle statistiques (haut droite de l'écran)
            paragraph_text: '', // Texte sur les paragraphs (bas droite de l'écran)
            selected_paragraph: null, // Permet de conserver le paragraph sélectionné
            event_id: '', // Permet de récupérer l'event
            selected_event: null, // Permet de garder l'event
            other_information: false, // Affichage des informations supplémentaires ou non (inactif par défaut)
            location_information: false, // Affichage des informations de localisation ou non (inactif par défaut)
            number_information: false, // Affichage des informations statistiques ou non (inactif par défaut)  
            // Affichage popup download
            show_download_form: false,
            download_e: true,
            download_p: false,
            download_e_p: false,
            show_fetch_progression: false,
            show_download_progression: false,
            fetch_progression: 'Fetch data in progress...',
            download_progression: 0,
        };
    },

    methods: {

        // Récupération de l'évènement, mise en place de la page
        recuperer_event () {

            // Récupération de l'event_id depuis le php
            this.event_id = document.getElementById('app').dataset.event_id;

            // Requête vers le geoserver, on récupère l'event
            let cqlFilter = `event_id = '${this.event_id}'`;
            let url = `http://localhost:8080/geoserver/webGIS/ows?service=WFS&version=1.1.0&request=GetFeature&typeName=webGIS:events`
                + `&outputFormat=application/json` + `&CQL_FILTER=` + encodeURIComponent(cqlFilter);
            fetch(url)
            .then(result => result.json())
            .then(json => {

                // Récupération de l'event
                let features = new ol.format.GeoJSON().readFeatures(json, {
                    featureProjection: 'EPSG:3857'
                });

                // L'event est sauvegardé et ajouté à la couche selected event
                features.forEach(event => {
                    this.selected_event = event;
                    this.selected_event_layer.getSource().addFeature(event);
                });

                // Afficher le texte sur l'event
                this.affichage_selection_event(this.selected_event)

                // Afficher la bbox de l'event
                this.affichage_bbox_event(this.selected_event);

                // Afficher les paragraphs liés à l'event
                this.affichage_paragraphs_geoserver();

            })
            
        },

        // Crée le texte en récupérant les infos sur l'event
        affichage_selection_event (feature) {

            // Chargement et affichage du texte sur l'event
            this.event_main_text = '<ul>';
            this.event_other_text = '<ul>';
            this.event_location_text = '<ul>';
            this.event_number_text = '<ul>';
            // Les propriétés principales s'affichent tout le temps
            for (let i = 0; i < this.event_main_properties.length; i++) {
                if (["event_time", "start_time", "end_time"].includes(this.event_main_properties[i])) {
                    this.event_main_text += '<li>' + this.event_main_properties_title[i] + ': ' 
                    + feature.get(this.event_main_properties[i]).substring(0,10) + '</li>';
                }
                else {
                    this.event_main_text += '<li>' + this.event_main_properties_title[i] + ': ' 
                    + feature.get(this.event_main_properties[i]) + '</li>';
                } 
            }
            // Les propriétés supplémentaires se chargent, mais elles ne s'affichent que si la checkbox Show other information est cochée
            // L'utilisateur peut choisir s'il veut afficher les informations supplémentaires ou non, son choix est conservé
            for (let i = 0; i < this.event_other_properties.length; i++) {
                this.event_other_text += '<li>' + this.event_other_properties_title[i] + ': ' + feature.get(this.event_other_properties[i]) + '</li>';
            }
            // Les propriétés sur la localisation se chargent, mais elles ne s'affichent que si la checkbox Show location information est cochée
            // L'utilisateur peut choisir s'il veut afficher les informations sur la localisation ou non, son choix est conservé
            for (let i = 0; i < this.event_location_properties.length; i++) {
                this.event_location_text += '<li>' + this.event_location_properties_title[i] + ': ' + feature.get(this.event_location_properties[i]) + '</li>';
            }
            // Les propriétés statistiques se chargent, mais elles ne s'affichent que si la checkbox Show more statistics est cochée
            // L'utilisateur peut choisir s'il veut afficher les informations statistiques ou non, son choix est conservé
            for (let i = 0; i < this.event_number_properties.length; i++) {
                this.event_number_text += '<li>' + this.event_number_properties_title[i] + ': ' + feature.get(this.event_number_properties[i]) + '</li>';
            }
            this.event_main_text += '</ul>';
            this.event_other_text += '</ul>';
            this.event_location_text += '</ul>';
            this.event_number_text += '</ul>';

            // Affichage contours scrollbox
            document.getElementById('event_data_zoom_event_scroll_box').style.border = "1px solid #ccc";

        },

        // Affichage de la bbox de l'event et zoom sur cette emprise
        affichage_bbox_event (feature) {

            // Récupérer les valeurs de la bbox (en 4326)
            let min_lat_4326 = feature.get('min_lat');
            let max_lat_4326 = feature.get('max_lat');
            let min_lon_4326 = feature.get('min_lon');
            let max_lon_4326 = feature.get('max_lon');

            // Projection en 3857
            let coord_transfo = [
                ol.proj.fromLonLat([min_lon_4326, min_lat_4326]),
                ol.proj.fromLonLat([max_lon_4326, max_lat_4326]),
            ];
            let extent3857 = [].concat(...coord_transfo);
            let min_lon = extent3857[0];
            let min_lat = extent3857[1];
            let max_lon = extent3857[2];
            let max_lat = extent3857[3];
            
            // Création de la feature à l'aide de ses coordonnées
            let new_event = new ol.Feature(
                ol.geom.Polygon.fromExtent([min_lon, min_lat, max_lon, max_lat])
            );

            // Ajout à la couche bbox events
            this.bbox_events_layer.getSource().addFeature(new_event);

            // Zoom sur l'emprise de l'event
            this.map.getView().fit([min_lon, min_lat, max_lon, max_lat], this.map.getSize());
            this.map.getView().setZoom(this.map.getView().getZoom() - 0.5);

        },

        // Affichage des paragraphs correspondant à l'event (depuis Geoserver)
        affichage_paragraphs_geoserver() {

            // Affichage du popup qui indique que les données chargent
            document.getElementById("loading_popup").style.display = "block";

            // Requête vers le geoserver, on récupère seulement les paragraphs de l'event
            // Requête vue virtuelle geoserver
            // let url = `http://localhost:8080/geoserver/webGIS/ows?service=WFS&version=1.1.0&request=GetFeature&typeName=webGIS:vue_paragraphs_geo`
            //     + `&outputFormat=application/json` + `&viewparams=event_id:${this.event_id}`;
            // Requête vue matérialisée postgres
            let cqlFilter = `event_id = '${this.event_id}'`;
            let url = `http://localhost:8080/geoserver/webGIS/ows?service=WFS&version=1.1.0&request=GetFeature&typeName=webGIS:vue_paragraphs_pg`
                + `&outputFormat=application/json`  + `&CQL_FILTER=` + encodeURIComponent(cqlFilter);
            fetch(url)
            .then(result => result.json())
            .then(json => {
                
                // Récupération des groupes de paragraphs
                let features = new ol.format.GeoJSON().readFeatures(json, {
                    dataProjection: 'EPSG:4326',         // Projection des données dans le GeoJSON
                    featureProjection: 'EPSG:3857'       // Projection de la carte (Web Mercator)
                });

                // Chaque paragraph récupéré est ajouté à la couche paragraphs
                features.forEach(feature => {
                    this.paragraphs_layer.getSource().addFeature(feature);
                });

            })
            .then(data => {
                // Désffichage du popup qui indique que les données chargent
                document.getElementById("loading_popup").style.display = "none";
                return data;
            })
       
        },

        // Crée le texte en récupérant les infos sur le paragraph, change le style du paragraph
        affichage_selection_paragraph (feature) {

            // Garder le paragraph
            this.selected_paragraph = feature

            // Chargement et affichage du texte sur le paragraph
            this.paragraph_text = '<ul>';
            // Les propriétés principales s'affichent tout le temps
            for (let i = 0; i < this.paragraph_main_properties.length; i++) {
                if (["publication_time", "paragraph_time"].includes(this.paragraph_main_properties[i])) {
                    this.paragraph_text += '<li>' + this.paragraph_main_properties_title[i] + ': ' 
                    + feature.get(this.paragraph_main_properties[i]).substring(0,10) + '</li>';
                }
                else {
                    this.paragraph_text += '<li>' + this.paragraph_main_properties_title[i] + ': ' 
                    + feature.get(this.paragraph_main_properties[i]) + '</li>';
                } 
            }
            this.paragraph_text += '</ul>';

            // Affichage contours scrollbox
            document.getElementById('paragraph_data_scroll_box').style.border = "1px solid #ccc";

            // Couche selected paragraph vidée
            this.selected_paragraph_layer.getSource().clear();

            // Couche selected paragraph contient le paragraph sélectionné : permet de voir le paragraph
            this.selected_paragraph_layer.getSource().addFeature(feature);

            // Affichage bbox et standard deviation du paragraph
            this.affichage_bbox_paragraph(feature)

        },

        // Affichage bbox et standard deviation du paragraph
        affichage_bbox_paragraph (feature) {

            // Couche bbox paragraphs vidée
            this.bbox_paragraphs_layer.getSource().clear();

            // Récupérer les valeurs de la bbox (en 4326)
            let min_lat_4326 = feature.get('min_lat');
            let max_lat_4326 = feature.get('max_lat');
            let min_lon_4326 = feature.get('min_lon');
            let max_lon_4326 = feature.get('max_lon');

            // Projection en 3857
            let coord_transfo = [
                ol.proj.fromLonLat([min_lon_4326, min_lat_4326]),
                ol.proj.fromLonLat([max_lon_4326, max_lat_4326]),
            ];
            let extent3857 = [].concat(...coord_transfo);
            let min_lon = extent3857[0];
            let min_lat = extent3857[1];
            let max_lon = extent3857[2];
            let max_lat = extent3857[3];
            
            // Création de la feature à l'aide de ses coordonnées
            let new_paragraph = new ol.Feature(
                ol.geom.Polygon.fromExtent([min_lon, min_lat, max_lon, max_lat])
            );

            // Ajout à la couche bbox paragraphs
            this.bbox_paragraphs_layer.getSource().addFeature(new_paragraph);

            // Affichage de l'écart-type s'il existe
            if (feature.get('std_dev') != null) {
                std_dev = feature.get('std_dev') * 1000;

                // Calcul des milieux de chaque côté
                let centerTop = [(min_lon + max_lon) / 2, max_lat];
                let centerBottom = [(min_lon + max_lon) / 2, min_lat];
                let centerLeft = [min_lon, (min_lat + max_lat) / 2];
                let centerRight = [max_lon, (min_lat + max_lat) / 2];

                // Création des segments (écart-type)
                let lineTop = new ol.Feature(new ol.geom.LineString([
                    [centerTop[0], centerTop[1] - std_dev/2],
                    [centerTop[0], centerTop[1] + std_dev/2]
                ]));
                  
                let lineBottom = new ol.Feature(new ol.geom.LineString([
                    [centerBottom[0], centerBottom[1] + std_dev/2],
                    [centerBottom[0], centerBottom[1] - std_dev/2]
                ]));
                  
                let lineLeft = new ol.Feature(new ol.geom.LineString([
                    [centerLeft[0] + std_dev/2, centerLeft[1]],
                    [centerLeft[0] - std_dev/2, centerLeft[1]]
                ]));
                  
                let lineRight = new ol.Feature(new ol.geom.LineString([
                    [centerRight[0] - std_dev/2, centerRight[1]],
                    [centerRight[0] + std_dev/2, centerRight[1]]
                ]));

                // Calcul des bouts des segments
                let TopBottom = [centerTop[0], centerTop[1] - std_dev/2];
                let TopTop = [centerTop[0], centerTop[1] + std_dev/2];
                let BottomTop = [centerBottom[0], centerBottom[1] + std_dev/2];
                let BottomBottom = [centerBottom[0], centerBottom[1] - std_dev/2];
                let LeftRight = [centerLeft[0] + std_dev/2, centerLeft[1]];
                let LeftLeft = [centerLeft[0] - std_dev/2, centerLeft[1]];
                let RightLeft = [centerRight[0] - std_dev/2, centerRight[1]];
                let RightRight = [centerRight[0] + std_dev/2, centerRight[1]]

                // Création des sous segments
                let lineTopBottom = new ol.Feature(new ol.geom.LineString([
                    [TopBottom[0] - std_dev/10, TopBottom[1]],
                    [TopBottom[0] + std_dev/10, TopBottom[1]]
                ]));
                let lineTopTop = new ol.Feature(new ol.geom.LineString([
                    [TopTop[0] - std_dev/10, TopTop[1]],
                    [TopTop[0] + std_dev/10, TopTop[1]]
                ]));
                let lineBottomTop = new ol.Feature(new ol.geom.LineString([
                    [BottomTop[0] - std_dev/10, BottomTop[1]],
                    [BottomTop[0] + std_dev/10, BottomTop[1]]
                ]));
                let lineBottomBottom = new ol.Feature(new ol.geom.LineString([
                    [BottomBottom[0] - std_dev/10, BottomBottom[1]],
                    [BottomBottom[0] + std_dev/10, BottomBottom[1]]
                ]));
                let lineLeftRight = new ol.Feature(new ol.geom.LineString([
                    [LeftRight[0], LeftRight[1] - std_dev/10],
                    [LeftRight[0], LeftRight[1] + std_dev/10]
                ]));
                let lineLeftLeft = new ol.Feature(new ol.geom.LineString([
                    [LeftLeft[0], LeftLeft[1] - std_dev/10],
                    [LeftLeft[0], LeftLeft[1] + std_dev/10]
                ]));
                let lineRightLeft = new ol.Feature(new ol.geom.LineString([
                    [RightLeft[0], RightLeft[1] - std_dev/10],
                    [RightLeft[0], RightLeft[1] + std_dev/10]
                ]));
                let lineRightRight = new ol.Feature(new ol.geom.LineString([
                    [RightRight[0], RightRight[1] - std_dev/10],
                    [RightRight[0], RightRight[1] + std_dev/10]
                ]));
                
                // Ajout à la couche bbox paragraphs
                this.bbox_paragraphs_layer.getSource().addFeature(lineTop);
                this.bbox_paragraphs_layer.getSource().addFeature(lineBottom);
                this.bbox_paragraphs_layer.getSource().addFeature(lineLeft);
                this.bbox_paragraphs_layer.getSource().addFeature(lineRight);
                this.bbox_paragraphs_layer.getSource().addFeature(lineTopBottom);
                this.bbox_paragraphs_layer.getSource().addFeature(lineTopTop);
                this.bbox_paragraphs_layer.getSource().addFeature(lineBottomTop);
                this.bbox_paragraphs_layer.getSource().addFeature(lineBottomBottom);
                this.bbox_paragraphs_layer.getSource().addFeature(lineLeftRight);
                this.bbox_paragraphs_layer.getSource().addFeature(lineLeftLeft);
                this.bbox_paragraphs_layer.getSource().addFeature(lineRightLeft);
                this.bbox_paragraphs_layer.getSource().addFeature(lineRightRight);

            }

        },

        // Affiche le form de download
        setup_download_form() {
            this.show_download_form = !this.show_download_form;
        },

        // Permet d'avoir une seule checkbox sélectionnée pour le choix du mode de download
        checkbox_download(checkbox_name) {
            let checkbox_list = ['download_e', 'download_p', 'download_e_p']
            for (let checkbox of checkbox_list) {
                if (checkbox_name != checkbox) {
                    this[checkbox] = false;
                }
            }
        },

        // Download
        async download() {

            // Si aucun mode de download n'est choisi
            if (!(this.download_e || this.download_p || this.download_e_p)) {
                alert("No download mode selected!");
                return;
            }

            // Liste des propriétés des events
            let event_download_properties = ["event_id", "hazard_type", "hazard_score", "latitude", "longitude", 
                "event_time", "min_lat", "max_lat", "min_lon", "max_lon", "n_languages", "n_source_countries", "n_domains", "n_paragraphs", "n_articles", 
                "start_time", "end_time", "duration", "mostfreq_death", "n_mostfreq_death", "time_mostfreq_death", "max_death", "n_max_death", 
                "time_max_death", "median_death", "mostfreq_homeless", "n_mostfreq_homeless", "time_mostfreq_homeless", "max_homeless", "n_max_homeless", 
                "time_max_homeless", "median_homeless", "mostfreq_injured", "n_mostfreq_injured", "time_mostfreq_injured", "max_injured", "n_max_injured", 
                "time_max_injured", "median_injured", "mostfreq_affected", "n_mostfreq_affected", "time_mostfreq_affected", "max_affected", "n_max_affected", 
                "time_max_affected", "median_affected", "mostfreq_missing", "n_mostfreq_missing", "time_mostfreq_missing", "max_missing", "n_max_missing", 
                "time_max_missing", "median_missing", "mostfreq_evacuated", "n_mostfreq_evacuated", "time_mostfreq_evacuated", "max_evacuated", 
                "n_max_evacuated", "time_max_evacuated", "median_evacuated", "country", "country_found"];

            // Création du tableau pour le join final, initialisation du texte (header)
            let event_content_lines = [event_download_properties.join(',')];

            // Affichage de la progression du download
            this.show_fetch_progression = true;
            this.show_download_progression = true;

            // Récupération de l'event
            let f = this.selected_event;

            // Création d'une ligne de texte (event.csv)
            // Si la valeur contient une virgule ou si la propriété nécessite des guillemets, on l'entoure de guillemets
            if(this.download_e || this.download_e_p) {
                let row = event_download_properties.map(prop => {
                    let value = f.get(prop);
                    if (value == null) return ''; // gérer les null
                    value = String(value).replace(/"/g, '""');
                    return `"${value}"`;
                }).join(',');
                event_content_lines.push(row);
            }

            // Création du texte de paragraphs.csv
            let paragraph_content_lines
            if(this.download_p || this.download_e_p) {
                paragraph_content_lines = await this.paragraph_download_text_filter();
            }
                
            // Désaffichage de la progression du download
            this.show_fetch_progression = false;
            this.show_download_progression = false;
            this.fetch_progression = 'Fetch data in progress...';
            this.download_progression = 0;

            // Téléchargement des events
            if(this.download_e || this.download_e_p) {
                this.creation_csv(event_content_lines, `event_${this.event_id}.csv`);
            }

            // Téléchargement des paragraphs
            if(this.download_p || this.download_e_p) {
                this.creation_csv(paragraph_content_lines, `paragraphs_${this.event_id}.csv`);
            }

        },

        // Création du texte de download des paragraphs liés à un event
        async paragraph_download_text_filter() {

            // Liste des propriétés des paragraphs
            let paragraph_download_properties = ["article_id", "title", "extracted_text", "paragraph_time", "article_language", "source_country", "domain_url",
                "paragraph_id", "original_text", "disaster_label", "disaster_score", "hasard_type", "hasard_type_score", "nb_death", "score_death", "answer_death",
                "nb_homeless", "score_homeless", "answer_homeless", "nb_injured", "score_injured", "answer_injured", "nb_affected", "score_affected", 
                "answer_affected", "nb_missing", "score_missing", "answer_missing", "nb_evacuated", "score_evacuated", "answer_evacuated", "publication_time",
                "extracted_location", "ner_score", "latitude", "longitude", "std_dev", "min_lat", "max_lat", "min_lon", "max_lon", "n_locations", "nb_death_min",
                "nb_death_max", "nb_homeless_min", "nb_homeless_max", "nb_injured_min", "nb_injured_max", "nb_affected_min", "nb_affected_max", "nb_missing_min",
                "nb_missing_max", "nb_evacuated_min", "nb_evacuated_max", "country", "country_found", "continent", "population_density"];

            // Création du tableau pour le join final, initialisation du texte (header)
            let paragraph_content_lines = [paragraph_download_properties.join(',')];

            // Liste permettent d'éviter les paragraphs en double
            let seen_paragraph_id = new Set();

            // Requête vers le geoserver, on récupère seulement les paragraphs de l'event
            // Requête vue virtuelle geoserver
            // let url = `http://localhost:8080/geoserver/webGIS/ows?service=WFS&version=1.1.0&request=GetFeature&typeName=webGIS:vue_paragraphs_geo`
            //     + `&outputFormat=application/json` + `&viewparams=event_id:${this.event_id}`;
            // Requête vue matérialisée postgres
            let cqlFilter = `event_id = '${this.event_id}'`
            let url = `http://localhost:8080/geoserver/webGIS/ows?service=WFS&version=1.1.0&request=GetFeature&typeName=webGIS:vue_paragraphs_pg`
                + `&outputFormat=application/json` + `&CQL_FILTER=` + encodeURIComponent(cqlFilter);
            let result = await fetch(url);
            let json = await result.json();
            this.fetch_progression = 'Fetch data completed!';
                
            // Récupération des paragraphs
            let features = json.features;

            // Pour chaque paragraph
            let compteur_features = 0;
            for (let f of features) {

                let paragraph_id = f.properties.paragraph_id;

                // Si ce paragraphe a déjà été ajouté, on passe
                if (seen_paragraph_id.has(paragraph_id)) {
                    continue;
                }
                // Marquer comme traité
                seen_paragraph_id.add(paragraph_id);

                // Création d'une ligne de texte (paragraphs.csv)
                // Si la valeur contient une virgule ou si la propriété nécessite des guillemets, on l'entoure de guillemets
                let row = paragraph_download_properties.map(prop => {
                    let value = f.properties[prop];
                    if (value == null) return ''; // gérer les null
                    value = String(value).replace(/"/g, '""');
                    return `"${value}"`;
                }).join(',');
                paragraph_content_lines.push(row);

                // Calcul de la progression
                compteur_features += 1;
                this.download_progression = parseInt(compteur_features*100/features.length);

                // Forcer une pause très courte pour mettre à jour le DOM
                if (compteur_features % 100 === 0) {
                    await new Promise(resolve => setTimeout(resolve, 0));
                }

            };

            return paragraph_content_lines;

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

        download_screenshot() {

            const mapCanvas = document.createElement('canvas');
            const size = this.map.getSize();
            mapCanvas.width = size[0];
            mapCanvas.height = size[1];
            const mapContext = mapCanvas.getContext('2d');
            Array.prototype.forEach.call(
            this.map.getViewport().querySelectorAll('.ol-layer canvas, canvas.ol-layer'),
            function (canvas) {
                if (canvas.width > 0) {
                const opacity =
                    canvas.parentNode.style.opacity || canvas.style.opacity;
                mapContext.globalAlpha = opacity === '' ? 1 : Number(opacity);
                let matrix;
                const transform = canvas.style.transform;
                if (transform) {
                    // Get the transform parameters from the style's transform matrix
                    matrix = transform
                    .match(/^matrix\(([^\(]*)\)$/)[1]
                    .split(',')
                    .map(Number);
                } else {
                    matrix = [
                    parseFloat(canvas.style.width) / canvas.width,
                    0,
                    0,
                    parseFloat(canvas.style.height) / canvas.height,
                    0,
                    0,
                    ];
                }
                // Apply the transform to the export map context
                CanvasRenderingContext2D.prototype.setTransform.apply(
                    mapContext,
                    matrix,
                );
                const backgroundColor = canvas.parentNode.style.backgroundColor;
                if (backgroundColor) {
                    mapContext.fillStyle = backgroundColor;
                    mapContext.fillRect(0, 0, canvas.width, canvas.height);
                }
                mapContext.drawImage(canvas, 0, 0);
                }
            },
            );
            mapContext.globalAlpha = 1;
            mapContext.setTransform(1, 0, 0, 1, 0, 0);
            const link = document.getElementById('image-download');
            // link.href = mapCanvas.toDataURL();
            // link.click();


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
        }),
        this.map.addLayer(this.countries_layer);

        // Création de la couche bbox events (vide)
        this.bbox_events_layer = new ol.layer.Vector({
            source: new ol.source.Vector(),
            style: new ol.style.Style({
                fill: new ol.style.Fill({
                    color: 'rgba(255, 255, 255, 0.2)'
                }),
                stroke: new ol.style.Stroke({
                    color: 'rgb(216, 231, 81)',
                    width: 2
                })
            }),
            zIndex: 10,
        });
        this.map.addLayer(this.bbox_events_layer);

        // Création de la couche bbox paragraphs (vide)
        this.bbox_paragraphs_layer = new ol.layer.Vector({
            source: new ol.source.Vector(),
            style: new ol.style.Style({
                fill: new ol.style.Fill({
                    color: 'rgba(255, 255, 255, 0.2)'
                }),
                stroke: new ol.style.Stroke({
                    color: 'rgba(0, 0, 0, 1)',
                    width: 1
                })
            }),
            zIndex: 11,
        });
        this.map.addLayer(this.bbox_paragraphs_layer);

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
            zIndex: 12,
        });
        this.map.addLayer(this.selected_event_layer);

        // Récupérer l'event et le rajouter dans la couche event selectionné
        this.recuperer_event()

        // Création de la couche paragraphs (vide)
        this.paragraphs_layer = new ol.layer.Vector({
            source: new ol.source.Vector(),
            style: new ol.style.Style({
                image: new ol.style.Circle({
                    radius: 5,
                    fill: new ol.style.Fill({
                        color: 'rgba(0, 0, 0, 1)',
                    }),
                }),
            }),
            zIndex: 13,
        });
        this.map.addLayer(this.paragraphs_layer);

        // Création de la couche paragraph selectionné (vide)
        this.selected_paragraph_layer = new ol.layer.Vector({
            source: new ol.source.Vector(),
            style: new ol.style.Style({
                image: new ol.style.Circle({
                    radius: 5,
                    fill: new ol.style.Fill({
                        color: 'rgba(255, 0, 0, 1)',
                    }),
                }),
            }),
            zIndex: 14,
        });
        this.map.addLayer(this.selected_paragraph_layer);

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

        // Bouton download
        var download_control = new ol.control.Control({
            element: document.getElementById("download_div"),
        });
        this.map.addControl(download_control);

        // Bouton screenshot
        var screenshot_control = new ol.control.Control({
            element: document.getElementById("screenshot_div"),
        });
        this.map.addControl(screenshot_control);

        // Scale line
        var scaleline = new ol.control.ScaleLine({
            element: document.getElementById("scaleline_div"),
        })
        this.map.addControl(scaleline);

        // A chaque déplacement/zoom, suppression du popup clic
        this.map.on('moveend', () => {
            document.getElementById("popup_clic").style.display = "none";
        });

        // A chaque déplacement du pointer, si plusieurs paragraphs sont superposées au niveau du pointer, on affiche leur nombre
        this.map.on("pointermove", evt => {

            let paragraph_features = [];
        
            // Récupérer les features à partir des différentes couches
            this.map.forEachFeatureAtPixel(evt.pixel, (feature, layer) => {
                if (layer === this.paragraphs_layer) {
                    paragraph_features.push(feature);
                }
            });
    
            // Si il y a plusieurs paragraphs, le popup affiche "n paragraphs"
            if (paragraph_features.length > 1) {
                document.getElementById("popup_pointermove").innerHTML = paragraph_features.length + " paragraphs";
                var_popup_pointermove.setPosition(evt.coordinate);
                document.getElementById("popup_pointermove").style.display = "block";
            }

            else {
                document.getElementById("popup_pointermove").style.display = "none";
            }

        });

        // Quand on clique sur un ou plusieurs paragraphs :
        this.map.on('click', evt => {

            let paragraph_features = [];
        
            // Récupérer les features à partir des différentes couches
            this.map.forEachFeatureAtPixel(evt.pixel, (feature, layer) => {
                if (layer === this.paragraphs_layer) {
                    paragraph_features.push(feature);
                }
            });
        
            // Si la feature est un seul paragraph, le texte contenant les infos sur ce paragraph s'affiche en bas à droite de l'écran
            if (paragraph_features.length == 1) {
                document.getElementById("popup_clic").style.display = "none";
                this.affichage_selection_paragraph(paragraph_features[0]);
            }

            // Si plusieurs paragraphs sont sélectionnés, on affiche la liste sous forme de liens cliquables
            // Cliquer sur un lien affiche le texte contenant les infos sur le paragraph sélectionné en bas à droite de l'écran
            else if (paragraph_features.length > 1) {
                let html_popup = 'Choose the paragraph:<ul>'
                paragraph_features.forEach((paragraph_feature, index) => {
                    let ligne = paragraph_feature.get('article_id');
                    html_popup += `<li><a href="#" id="paragraph_link_${index}">${ligne}</a></li>`;
                });
                html_popup += '</ul>'
                document.getElementById("popup_clic").innerHTML = html_popup;
                paragraph_features.forEach((paragraph_feature, index) => {
                    document.getElementById(`paragraph_link_${index}`).addEventListener('click', (e) => {
                        e.preventDefault(); // empêcher le scroll en haut de page
                        this.affichage_selection_paragraph(paragraph_feature);
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
    
}).mount('#vue_map');