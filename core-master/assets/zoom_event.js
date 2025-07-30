Vue.createApp({

    data() {

        return {

            // Initialisation de la carte et des couches
            map: null, // Initialisation de la carte
            landslide_susceptibility_layer: null, // Initialisation de la couche de susceptibilité des tremblements de terre
            rivers_layer: null, // Initialisation de la couche des rivières
            countries_layer: null, // Initialisation de la couche des pays
            bbox_events_layer: null, // Initialisation de la couche de l'emprise des évènements
            bbox_paragraphs_layer: null, // Initialisation de la couche de l'emprise des paragraphes
            selected_event_layer: null, // Initialisation de la couche contenant uniquement l'évènement sélectionné
            paragraphs_layer: null, // Initialisation de la couche des paragraphes
            selected_paragraph_layer: null, // Initialisation de la couche contenant uniquement le paragraphe sélectionné
            location_layer: null, // Initialisation de la couche de géolocalisation

            // Légende de la couche de susceptibilité des tremblements de terre
            landslide_susceptibility_visibility: false, // Visibilité de la couche de susceptibilité des tremblements de terre
            landslide_susceptibility_legend: false, // Légende de la couche de susceptibilité des tremblements de terre

            // Evènement et paragraphe sélectionnés
            event_id: '', // Permet de récupérer l'évènement par son identifiant
            selected_event: null, // Permet de conserver l'évènement sélectionné
            selected_paragraph: null, // Permet de conserver le paragraphe sélectionné
            
            // Affichage des propriétés des évènements et des paragraphes hazminer
            // Propriétés principales des évènements
            event_main_properties: ["hazard_type", "event_time", "start_time", "end_time", "median_death", "median_injured", "median_affected", "n_paragraphs", 
                "n_articles"],
            event_main_properties_title: ["Hazard type", "Event time", "Start time", "End time", "Median death", "Median injured", "Median affected",
                "Number of paragraphs", "Number of articles"],
            // Autres propriétés des évènements
            event_other_properties: ["country_found", "n_languages", "n_source_countries", "n_domains", "duration", "hazard_score"],
            event_other_properties_title: ["Country", "Number of languages", "Number of source countries", "Number of domains", "Duration (days)", "Hazard score"],
            // Propriétés localisations des évènements
            event_location_properties: ["latitude", "longitude", "min_lat", "max_lat", "min_lon", "max_lon"],
            event_location_properties_title: ["Latitude", "Longitude", "Minimum latitude", "Maximum latitude", "Minimum longitude", "Maximum longitude"],
            // Propriétés des évènements à télécharger
            event_download_properties: ["event_id", "n_paragraphs", "n_articles", "hazard_type", "hazard_score", "latitude", "longitude", "min_lat", "max_lat", 
                "min_lon", "max_lon", "event_time", "start_time", "end_time", "duration", "n_languages", "n_source_countries", "n_domains", "median_death", "median_injured", 
                "median_affected", "country_found"],
            // Propriétés principales des paragraphes
            paragraph_main_properties: ["title", "hazard_type", "publication_time", "paragraph_time", "nb_death", "nb_injured", "nb_affected", "article_language", 
                "source_country", "domain_url"],
            paragraph_main_properties_title: ["Title", "Hazard type", "Publication time", "Paragraph time", "Number of death", "Number of injured", 
                "Number of affected", "Article language", "Article source country", "Domain url"],
            // Propriétés localisations des paragraphes
            paragraph_location_properties: ["latitude", "longitude", "std_dev", "min_lat", "max_lat", "min_lon", "max_lon", "country_found", "places_names"],
            paragraph_location_properties_title: ["Latitude", "Longitude", "Standard deviation", "Minimum latitude", "Maximum latitude", "Minimum longitude", 
                "Maximum longitude", "Country", "Places names"],
            // Propriétés des paragraphes à télécharger
            paragraph_download_properties: ["title", "paragraph_time", "article_language", "paragraph_id", "hazard_type", "nb_death", "nb_injured", "nb_affected", 
                "publication_time", "latitude", "longitude", "std_dev", "min_lat", "max_lat", "min_lon", "max_lon", "source_country", "domain_url", "places_names", 
                "event_id", "country_found"],
            event_main_text: '', // Texte sur les évènements (haut droite de l'écran)
            event_other_text: '', // Texte sur les évènements, partie optionnelle autres (haut droite de l'écran)
            event_location_text: '', // Texte sur les évènements, partie optionnelle localisations (haut droite de l'écran)
            paragraph_main_text: '', // Texte sur les paragraphes (bas droite de l'écran)
            paragraph_location_text: '', // Texte sur les paragraphes, partie optionnelle localisations (bas droite de l'écran)
            event_other_information: false, // Affichage des informations supplémentaires des évènements ou non (inactif par défaut)
            event_location_information: false, // Affichage des informations de localisation des évènements ou non (inactif par défaut)
            paragraphs_location_information: false, // Affichage des informations de localisation des paragraphes ou non (inactif par défaut)

            // Affichage de la fenêtre des séries temporelles
            show_time_series_form: false,

            // Choix du type de série temporelle à afficher (date de l'évènement, date de publication)
            show_time_series_event_time: true,
            show_time_series_publication_time: false,

            // Choix de la série temporelle à afficher, en fonction du type de série temporelle (par minute / par jour)
            show_time_series_event_time_minute: true,
            show_time_series_event_time_day: false,
            show_time_series_publication_time_minute: false,
            show_time_series_publication_time_day: false,

            // Données sur la date de l'évènement et sur la date de publication des paragraphes pour créer les séries temporelles
            event_time_list: [],
            event_time_minute_array: [],
            event_time_minute_sum_array: [],
            event_time_day_array: [],
            event_time_day_sum_array: [],
            publication_time_list: [],
            publication_time_minute_array: [],
            publication_time_minute_sum_array: [],
            publication_time_day_array: [],
            publication_time_day_sum_array: [],

            // Affichage de la fenêtre de téléchargement
            show_download_form: false,

            // Choix du mode de téléchargement
            download_e: true,
            download_p: false,
            download_e_p: false,

            // Barre de progression du téléchargement
            show_fetch_progression: false,
            show_download_progression: false,
            fetch_progression: 'Fetch data in progress...',
            download_progression: 0,

        };

    },

    methods: {

        // Récupération et affichage de l'évènement (depuis Geoserver), mise en place de la page
        get_event() {

            // Récupération de l'identifiant de l'évènement depuis le php
            this.event_id = document.getElementById('app').dataset.event_id;

            // Requête vers le Geoserver, on récupère l'évènement
            let cql_filter = `event_id = '${this.event_id}'`;
            let url = `http://localhost:8080/geoserver/webGIS/ows?service=WFS&version=1.1.0&request=GetFeature&typeName=webGIS:events`
                + `&outputFormat=application/json` + `&CQL_FILTER=` + encodeURIComponent(cql_filter);
            fetch(url)
            .then(result => result.json())
            .then(json => {

                // Récupération de l'évènement
                let features = new ol.format.GeoJSON().readFeatures(json, {
                    featureProjection: 'EPSG:3857',
                });

                // L'évènement est sauvegardé et ajouté à la couche évènement sélectionné
                features.forEach(event => {
                    this.selected_event = event;
                    // Dates ne dépendent plus du fuseau horaire
                    this.selected_event.set('event_time', dayjs(this.selected_event.get('event_time')).format("YYYY-MM-DD HH:mm:ss"));
                    this.selected_event.set('start_time', dayjs(this.selected_event.get('start_time')).format("YYYY-MM-DD HH:mm:ss"));
                    this.selected_event.set('end_time', dayjs(this.selected_event.get('end_time')).format("YYYY-MM-DD HH:mm:ss"));
                    this.selected_event_layer.getSource().addFeature(event);
                });

                // Afficher le texte sur l'évènement
                this.show_selected_event_data(this.selected_event);

                // Afficher l'emprise de l'évènement
                this.show_selected_event_bbox(this.selected_event);

                // Afficher les paragraphes liés à l'évènement
                this.get_paragraphs();

            })
            
        },

        // Crée le texte en récupérant les infos sur l'évènement
        show_selected_event_data(feature) {

            // Chargement et affichage du texte sur l'évènement
            this.event_main_text = '<ul>';
            this.event_other_text = '<ul>';
            this.event_location_text = '<ul>';

            // Les propriétés principales s'affichent tout le temps
            for (let i = 0; i < this.event_main_properties.length; i++) {
                if (["event_time", "start_time", "end_time"].includes(this.event_main_properties[i])) {
                    this.event_main_text += '<li>' + this.event_main_properties_title[i] + ': ' + feature.get(this.event_main_properties[i]).substring(0,10) + '</li>';
                }
                else {
                    this.event_main_text += '<li>' + this.event_main_properties_title[i] + ': ' + feature.get(this.event_main_properties[i]) + '</li>';
                } 
            }
            // Les propriétés supplémentaires se chargent, mais elles ne s'affichent que si le bouton Show other information est coché
            // L'utilisateur peut choisir s'il veut afficher les informations supplémentaires ou non, son choix est conservé
            for (let i = 0; i < this.event_other_properties.length; i++) {
                this.event_other_text += '<li>' + this.event_other_properties_title[i] + ': ' + feature.get(this.event_other_properties[i]) + '</li>';
            }
            // Les propriétés sur la localisation se chargent, mais elles ne s'affichent que si le bouton Show location information est coché
            // L'utilisateur peut choisir s'il veut afficher les informations sur la localisation ou non, son choix est conservé
            for (let i = 0; i < this.event_location_properties.length; i++) {
                this.event_location_text += '<li>' + this.event_location_properties_title[i] + ': ' + feature.get(this.event_location_properties[i]) + '</li>';
            }

            this.event_main_text += '</ul>';
            this.event_other_text += '</ul>';
            this.event_location_text += '</ul>';

            // Affichage contours de la zone de texte
            document.getElementById('event_data_zoom_event_scroll_box').style.border = "1px solid #ccc";

        },

        // Affichage de l'emprise de l'évènement et zoom sur cette emprise
        show_selected_event_bbox(feature) {

            // Récupérer les valeurs de l'emprise (en 4326)
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
            
            // Création du rectangle de l'emprise à l'aide de ses coordonnées
            let event_bbox = new ol.Feature(
                ol.geom.Polygon.fromExtent([min_lon, min_lat, max_lon, max_lat])
            );

            // Ajout à la couche emprise de l'évènement
            this.bbox_events_layer.getSource().addFeature(event_bbox);

            // Zoom adapté sur l'emprise de l'évènement si cette emprise est non nulle
            // Zoom par défaut à 10 si l'emprise est nulle
            this.map.getView().fit([min_lon, min_lat, max_lon, max_lat], this.map.getSize());
            if (min_lon === max_lon || min_lat === max_lat) {
                this.map.getView().setZoom(10);
            }
            else {
                this.map.getView().setZoom(this.map.getView().getZoom() - 1);
            }

        },

        // Récupération et affichage des paragraphes correspondant à l'évènement (depuis Geoserver)
        get_paragraphs() {

            // Affichage de la fenêtre qui indique que les données chargent
            document.getElementById("loading_popup").style.display = "block";

            // Requête vers le Geoserver, on récupère seulement les paragraphes de l'évènement
            let cql_filter = `event_id = '${this.event_id}'`;
            let url = `http://localhost:8080/geoserver/webGIS/ows?service=WFS&version=1.1.0&request=GetFeature&typeName=webGIS:paragraphs`
                + `&outputFormat=application/json`  + `&CQL_FILTER=` + encodeURIComponent(cql_filter);
            fetch(url)
            .then(result => result.json())
            .then(json => {
                
                // Récupération des groupes de paragraphes
                let features = new ol.format.GeoJSON().readFeatures(json, {
                    dataProjection: 'EPSG:4326',         // Projection des données dans le GeoJSON
                    featureProjection: 'EPSG:3857',       // Projection de la carte (Web Mercator)
                });

                // Chaque paragraphe récupéré est ajouté à la couche paragraphes, la date de l'évènement et sa date de publication sont ajoutées à leur liste
                features.forEach(feature => {
                    this.paragraphs_layer.getSource().addFeature(feature);
                    this.event_time_list.push({date: dayjs(feature.get('paragraph_time')).format("YYYY-MM-DD HH:mm:ss")});
                    this.publication_time_list.push({date: dayjs(feature.get('publication_time')).format("YYYY-MM-DD HH:mm:ss")});
                });

            })
            .then(data => {
                // Création des données sur la date de l'évènement et sur la date de publication des paragraphes pour créer les séries temporelles
                this.create_time_series_data();
            })
            .then(data => {
                // Désaffichage de la fenêtre qui indique que les données chargent
                document.getElementById("loading_popup").style.display = "none";
                return data;
            })
       
        },

        // Crée le texte en récupérant les infos sur le paragraphe, change le style du paragraphe
        show_selected_paragraph_data(feature) {

            // Garder le paragraphe
            this.selected_paragraph = feature;

            // Chargement et affichage du texte sur le paragraphe
            this.paragraph_main_text = '<ul>';
            this.paragraph_location_text = '<ul>';

            // Les propriétés principales s'affichent tout le temps
            for (let i = 0; i < this.paragraph_main_properties.length; i++) {
                if (["publication_time", "paragraph_time"].includes(this.paragraph_main_properties[i])) {
                    this.paragraph_main_text += '<li>' + this.paragraph_main_properties_title[i] + ': ' 
                    + feature.get(this.paragraph_main_properties[i]).substring(0,10) + '</li>';
                }
                else if (["domain_url"].includes(this.paragraph_main_properties[i])) {
                    this.paragraph_main_text += '<li>' + this.paragraph_main_properties_title[i] + ': '        
                    + '<a href="' + feature.get(this.paragraph_main_properties[i]) + '" target="_blank">' + feature.get(this.paragraph_main_properties[i]) + '</a></li>';
                }
                else {
                    this.paragraph_main_text += '<li>' + this.paragraph_main_properties_title[i] + ': ' 
                    + feature.get(this.paragraph_main_properties[i]) + '</li>';
                } 
            }
            // Les propriétés sur la localisation se chargent, mais elles ne s'affichent que si le bouton Show location information est coché
            // L'utilisateur peut choisir s'il veut afficher les informations sur la localisation ou non, son choix est conservé
            for (let i = 0; i < this.paragraph_location_properties.length; i++) {
                this.paragraph_location_text += '<li>' + this.paragraph_location_properties_title[i] + ': ' + feature.get(this.paragraph_location_properties[i]) + '</li>';
            }

            this.paragraph_main_text += '</ul>';
            this.paragraph_location_text += '</ul>';

            // Affichage contours de la zone de texte
            this.$nextTick(() => {document.getElementById('paragraph_data_scroll_box').style.border = "1px solid #ccc";});

            // Couche du paragraphe sélectionné vidée
            this.selected_paragraph_layer.getSource().clear();

            // Paragraphe sélectionné ajouté à la couche du paragraphe sélectionné : permet de voir le paragraphe
            this.selected_paragraph_layer.getSource().addFeature(feature);

            // Affichage emprise et écart-type associés à l'emprise du paragraphe
            this.show_selected_paragraph_bbox(feature);

        },

        // Affichage de l'emprise et de l'écart-type associés à l'emprise du paragraphe
        show_selected_paragraph_bbox(feature) {

            // Couche emprise des paragraphes vidée
            this.bbox_paragraphs_layer.getSource().clear();

            // Récupérer les valeurs de l'emprise (en 4326)
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
            
            // Création du rectangle de l'emprise à l'aide de ses coordonnées
            let paragraph_bbox = new ol.Feature(
                ol.geom.Polygon.fromExtent([min_lon, min_lat, max_lon, max_lat])
            );

            // Ajout à la couche emprise des paragraphes
            this.bbox_paragraphs_layer.getSource().addFeature(paragraph_bbox);

            // Affichage de l'écart-type s'il existe
            if (feature.get('std_dev') != null) {
                std_dev = feature.get('std_dev') * 1000;

                // Calcul des milieux de chaque côté
                let center_top = [(min_lon + max_lon) / 2, max_lat];
                let center_bottom = [(min_lon + max_lon) / 2, min_lat];
                let center_left = [min_lon, (min_lat + max_lat) / 2];
                let center_right = [max_lon, (min_lat + max_lat) / 2];

                // Création des segments (écart-type)
                let line_top = new ol.Feature(new ol.geom.LineString([
                    [center_top[0], center_top[1] - std_dev/2],
                    [center_top[0], center_top[1] + std_dev/2]
                ]));
                  
                let line_bottom = new ol.Feature(new ol.geom.LineString([
                    [center_bottom[0], center_bottom[1] + std_dev/2],
                    [center_bottom[0], center_bottom[1] - std_dev/2]
                ]));
                  
                let line_left = new ol.Feature(new ol.geom.LineString([
                    [center_left[0] + std_dev/2, center_left[1]],
                    [center_left[0] - std_dev/2, center_left[1]]
                ]));
                  
                let line_right = new ol.Feature(new ol.geom.LineString([
                    [center_right[0] - std_dev/2, center_right[1]],
                    [center_right[0] + std_dev/2, center_right[1]]
                ]));

                // Calcul des bouts des segments
                let top_bottom = [center_top[0], center_top[1] - std_dev/2];
                let top_top = [center_top[0], center_top[1] + std_dev/2];
                let bottom_top = [center_bottom[0], center_bottom[1] + std_dev/2];
                let bottom_bottom = [center_bottom[0], center_bottom[1] - std_dev/2];
                let left_right = [center_left[0] + std_dev/2, center_left[1]];
                let left_left = [center_left[0] - std_dev/2, center_left[1]];
                let right_left = [center_right[0] - std_dev/2, center_right[1]];
                let right_right = [center_right[0] + std_dev/2, center_right[1]];

                // Création des sous segments
                let line_top_bottom = new ol.Feature(new ol.geom.LineString([
                    [top_bottom[0] - std_dev/10, top_bottom[1]],
                    [top_bottom[0] + std_dev/10, top_bottom[1]]
                ]));
                let line_top_top = new ol.Feature(new ol.geom.LineString([
                    [top_top[0] - std_dev/10, top_top[1]],
                    [top_top[0] + std_dev/10, top_top[1]]
                ]));
                let line_bottom_top = new ol.Feature(new ol.geom.LineString([
                    [bottom_top[0] - std_dev/10, bottom_top[1]],
                    [bottom_top[0] + std_dev/10, bottom_top[1]]
                ]));
                let line_bottom_bottom = new ol.Feature(new ol.geom.LineString([
                    [bottom_bottom[0] - std_dev/10, bottom_bottom[1]],
                    [bottom_bottom[0] + std_dev/10, bottom_bottom[1]]
                ]));
                let line_left_right = new ol.Feature(new ol.geom.LineString([
                    [left_right[0], left_right[1] - std_dev/10],
                    [left_right[0], left_right[1] + std_dev/10]
                ]));
                let line_left_left = new ol.Feature(new ol.geom.LineString([
                    [left_left[0], left_left[1] - std_dev/10],
                    [left_left[0], left_left[1] + std_dev/10]
                ]));
                let line_right_left = new ol.Feature(new ol.geom.LineString([
                    [right_left[0], right_left[1] - std_dev/10],
                    [right_left[0], right_left[1] + std_dev/10]
                ]));
                let line_right_right = new ol.Feature(new ol.geom.LineString([
                    [right_right[0], right_right[1] - std_dev/10],
                    [right_right[0], right_right[1] + std_dev/10]
                ]));
                
                // Ajout à la couche emprise des paragraphes
                this.bbox_paragraphs_layer.getSource().addFeature(line_top);
                this.bbox_paragraphs_layer.getSource().addFeature(line_bottom);
                this.bbox_paragraphs_layer.getSource().addFeature(line_left);
                this.bbox_paragraphs_layer.getSource().addFeature(line_right);
                this.bbox_paragraphs_layer.getSource().addFeature(line_top_bottom);
                this.bbox_paragraphs_layer.getSource().addFeature(line_top_top);
                this.bbox_paragraphs_layer.getSource().addFeature(line_bottom_top);
                this.bbox_paragraphs_layer.getSource().addFeature(line_bottom_bottom);
                this.bbox_paragraphs_layer.getSource().addFeature(line_left_right);
                this.bbox_paragraphs_layer.getSource().addFeature(line_left_left);
                this.bbox_paragraphs_layer.getSource().addFeature(line_right_left);
                this.bbox_paragraphs_layer.getSource().addFeature(line_right_right);

            }

        },

        // Change la / les variable(s) passée(s) en paramètre (true/false)
        change_true_false(parameters) {

            for (let parameter of parameters) {
                this[parameter] = !this[parameter];
            }

        },

        // Création des données sur la date de l'évènement et sur la date de publication des paragraphes pour créer les séries temporelles
        create_time_series_data() {

            // Date de l'évènement : données par minute
            let event_time_minute_dictionnary = this.event_time_list.reduce((value, {date}) => {
                value[date] = value[date] || {date: date, count: 0};
                value[date]['count'] += 1;        
                return value;
            }, {});
            this.event_time_minute_array = Object.values(event_time_minute_dictionnary).map(a => a.date);
            this.event_time_minute_sum_array = Object.values(event_time_minute_dictionnary).map(a => a.count);

            // Date de l'évènement : : données par jour
            let event_time_day_dictionnary = this.event_time_list.reduce((value, {date}) => {
                let day = date.substring(0,10);
                value[day] = value[day] || {date: day, count: 0};
                value[day]['count'] += 1;        
                return value;
            }, {});
            this.event_time_day_array = Object.values(event_time_day_dictionnary).map(a => a.date);
            this.event_time_day_sum_array = Object.values(event_time_day_dictionnary).map(a => a.count);

            // Date de publication : données par minute
            let publication_time_minute_dictionnary = this.publication_time_list.reduce((value, {date}) => {
                value[date] = value[date] || {date: date, count: 0};
                value[date]['count'] += 1;        
                return value;
            }, {});
            this.publication_time_minute_array = Object.values(publication_time_minute_dictionnary).map(a => a.date);
            this.publication_time_minute_sum_array = Object.values(publication_time_minute_dictionnary).map(a => a.count);

            // Date de publication : données par jour
            let publication_time_day_dictionnary = this.publication_time_list.reduce((value, {date}) => {
                let day = date.substring(0,10);
                value[day] = value[day] || {date: day, count: 0};
                value[day]['count'] += 1;        
                return value;
            }, {});
            this.publication_time_day_array = Object.values(publication_time_day_dictionnary).map(a => a.date);
            this.publication_time_day_sum_array = Object.values(publication_time_day_dictionnary).map(a => a.count);

        },

        // Affiche la fenêtre des séries temporelles, ferme les autres fenêtres ouvertes
        setup_time_series_form() {

            this.show_time_series_form = !this.show_time_series_form;
            this.show_download_form = false;

            if (this.show_time_series_form) {
                this.create_time_series_plot();
            }

        },

        // Permet de sélectionner le bon type de série temporelle (selon la date de l'évènement donnée dans le paragraphe ou sa date de publication)
        setup_time_series_type_change_menu() {

            this.show_time_series_event_time = !this.show_time_series_event_time;
            this.show_time_series_publication_time = !this.show_time_series_publication_time;
        
            if (this.show_time_series_event_time) {
                this.show_time_series_event_time_minute = true;
                this.show_time_series_event_time_day = false;
                this.show_time_series_publication_time_minute = false;
                this.show_time_series_publication_time_day = false;
            }

            if (this.show_time_series_publication_time) {
                this.show_time_series_event_time_minute = false;
                this.show_time_series_event_time_day = false;
                this.show_time_series_publication_time_minute = true;
                this.show_time_series_publication_time_day = false;
            }

            this.create_time_series_plot();
            
        },

        // Affiche le bon menu de la fenêtre des séries temporelles pour la date de l'évènement (par minute / par jour) selon le bouton sélectionné
        setup_time_series_event_time_change_menu() {

            this.show_time_series_event_time_minute = !this.show_time_series_event_time_minute;
            this.show_time_series_event_time_day = !this.show_time_series_event_time_day;

            this.create_time_series_plot();

        },

        // Affiche le bon menu de la fenêtre des séries temporelles pour la date de publication (par minute / par jour) selon le bouton sélectionné
        setup_time_series_publication_time_change_menu() {

            this.show_time_series_publication_time_minute = !this.show_time_series_publication_time_minute;
            this.show_time_series_publication_time_day = !this.show_time_series_publication_time_day;

            this.create_time_series_plot();

        },
        
        // Création des graphes des séries temporelles (utilisation de Plotly)
        create_time_series_plot() {

            let x;
            let y;
            let title;
            let subtitle;
            let div_name;
            let filename;

            if (this.show_time_series_event_time) {
                title = 'Event time';
            }

            if (this.show_time_series_publication_time) {
                title = 'Publication time';
            }

            if (this.show_time_series_event_time_minute || this.show_time_series_publication_time_minute) {
                subtitle = 'By time';
            }

            if (this.show_time_series_event_time_day || this.show_time_series_publication_time_day) {
                subtitle = 'By day';
            }

            if (this.show_time_series_event_time_minute) {
                x = this.event_time_minute_array;
                y = this.event_time_minute_sum_array;
                div_name = 'time_series_event_time_minute_plot';   
                filename = `graph_event_time_by_time_${this.event_id}`;
            }

            if (this.show_time_series_event_time_day) {
                x = this.event_time_day_array;
                y = this.event_time_day_sum_array;
                div_name = 'time_series_event_time_day_plot';
                filename = `graph_event_time_by_day_${this.event_id}`;
            }

            if (this.show_time_series_publication_time_minute) {
                x = this.publication_time_minute_array;
                y = this.publication_time_minute_sum_array;
                div_name = 'time_series_publication_time_minute_plot';   
                filename = `graph_publication_time_by_time_${this.event_id}`;
            }

            if (this.show_time_series_publication_time_day) {
                x = this.publication_time_day_array;
                y = this.publication_time_day_sum_array;
                div_name = 'time_series_publication_time_day_plot';
                filename = `graph_publication_time_by_day_${this.event_id}`;
            }

            this.$nextTick(() => {

                let data = [
                    {
                        x: x,
                        y: y,
                        type: 'bar',
                    }
                ];

                let layout = {
                    title: {
                        text: title,
                        subtitle: {
                            text: subtitle,
                        }
                    },
                    xaxis: {
                        title: {
                            text: 'Date',
                        }
                    },
                    yaxis: {
                        title: {
                            text: 'Number of paragraphs',
                        }
                    },
                };

                let config = {
                    scrollZoom: true,
                    editable: true,
                    toImageButtonOptions: { filename: filename },
                    displayModeBar: true,
                    modeBarButtonsToRemove: ['select2d', 'lasso2d', 'resetScale2d'],
                    responsive: true,
                };

                Plotly.newPlot(div_name, data, layout, config);
            
            })
            
        },

        // Affiche la fenêtre de téléchargement, ferme les autres fenêtres ouvertes
        setup_download_form() {

            this.show_download_form = !this.show_download_form;
            this.show_time_series_form = false;

        },

        // Permet d'avoir un seul bouton sélectionné pour le choix du mode de téléchargement
        checkbox_download(checkbox_name) {

            let checkbox_list = ['download_e', 'download_p', 'download_e_p'];
            for (let checkbox of checkbox_list) {
                if (checkbox_name != checkbox) {
                    this[checkbox] = false;
                }
            }

        },

        // Téléchargement des données (csv)
        async download_data() {

            // Message d'erreur si aucun mode de téléchargement n'est choisi
            if (!(this.download_e || this.download_p || this.download_e_p)) {
                alert("No download mode selected!");
                return;
            }

            // Création du tableau pour la jointure finale, initialisation du texte (noms des colonnes)
            let event_content_lines = [this.event_download_properties.join(',')];

            // Affichage de la progression du téléchargement
            this.show_fetch_progression = true;
            this.show_download_progression = true;

            // Récupération de l'évènement
            let f = this.selected_event;

            // Création d'une ligne de texte (event.csv)
            // Toutes les valeurs sont entourées de guillemets
            if(this.download_e || this.download_e_p) {
                let row = this.event_download_properties.map(prop => {
                    let value = f.get(prop);
                    if (value == null) return ''; // gérer les null
                    value = String(value).replace(/"/g, '""');
                    return `"${value}"`;
                }).join(',');
                event_content_lines.push(row);
            }

            // Création du texte concernant les paragraphes (paragraphs.csv)
            let paragraph_content_lines;
            if(this.download_p || this.download_e_p) {
                paragraph_content_lines = await this.create_paragraph_download_text();
            }
                
            // Désaffichage de la progression du téléchargement
            this.show_fetch_progression = false;
            this.show_download_progression = false;
            this.fetch_progression = 'Fetch data in progress...';
            this.download_progression = 0;

            // Téléchargement des évènements
            if(this.download_e || this.download_e_p) {
                this.create_csv(event_content_lines, `event_${this.event_id}.csv`);
            }

            // Téléchargement des paragraphes
            if(this.download_p || this.download_e_p) {
                this.create_csv(paragraph_content_lines, `paragraphs_${this.event_id}.csv`);
            }

        },

        // Création du texte de téléchargement des paragraphes liés à un évènement
        async create_paragraph_download_text() {

            // Création du tableau pour la jointure finale, initialisation du texte (noms des colonnes)
            let paragraph_content_lines = [this.paragraph_download_properties.join(',')];

            // Liste permettant d'éviter les paragraphes en double
            let seen_paragraph_id = new Set();

            // Requête vers le Geoserver, on récupère seulement les paragraphes liés à l'évènement
            let cql_filter = `event_id = '${this.event_id}'`;
            let url = `http://localhost:8080/geoserver/webGIS/ows?service=WFS&version=1.1.0&request=GetFeature&typeName=webGIS:paragraphs`
                + `&outputFormat=application/json` + `&CQL_FILTER=` + encodeURIComponent(cql_filter);
            let result = await fetch(url);
            let json = await result.json();
            this.fetch_progression = 'Fetch data completed!';
                
            // Récupération des paragraphes
            let features = json.features;

            // Pour chaque paragraphe :
            let count_features = 0;
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

                // Calcul de la progression
                count_features += 1;
                this.download_progression = parseInt(count_features*100/features.length);

                // Forcer une pause très courte pour mettre à jour le DOM
                if (count_features % 100 === 0) {
                    await new Promise(resolve => setTimeout(resolve, 0));
                }

            };

            return paragraph_content_lines;

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

        // Téléchargement d'une capture d'écran de la carte
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
                        let background_color = canvas.parentNode.style.backgroundColor;
                        if (background_color) {
                            map_context.fillStyle = background_color;
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
            link.download = `map_${this.event_id}.png`;
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
                        // Couche satellite
                        new ol.layer.Tile({
                            source: new ol.source.XYZ({
                                url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
                                crossOrigin: 'anonymous',
                                maxZoom: 19,
                            }),
                            title: 'World Imagery (© ESRI)',
                            type: 'base',
                            zIndex: 1,
                        }),
                        // Couche topographique
                        new ol.layer.Tile({
                            source: new ol.source.XYZ({
                                url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
                                crossOrigin: 'anonymous',
                                maxZoom: 19,
                            }),
                            title: 'Topographic (© ESRI)',
                            type: 'base',
                            zIndex: 1,
                        }),
                        // Couche relief ombré
                        new ol.layer.Tile({
                            source: new ol.source.XYZ({
                                url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Elevation/World_Hillshade/MapServer/tile/{z}/{y}/{x}',
                                crossOrigin: 'anonymous',
                                maxZoom: 19,
                            }),
                            title: 'Shaded Relief (© ESRI)',
                            type: 'base',
                            zIndex: 1,
                        }),
                        // Couche couleur gris clair
                        new ol.layer.Tile({
                            source: new ol.source.XYZ({
                                url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}',
                                crossOrigin: 'anonymous',
                                maxZoom: 19,
                            }),
                            title: 'Light Gray (© ESRI)',
                            type: 'base',
                            zIndex: 1,
                        }),
                        // Couche couleur gris sombre
                        new ol.layer.Tile({
                            source: new ol.source.XYZ({
                                url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
                                crossOrigin: 'anonymous',
                                maxZoom: 19,
                            }),
                            title: 'Dark Gray (© ESRI)',
                            type: 'base',
                            zIndex: 1,
                        }),
                        // Couche des rues
                        new ol.layer.Tile({
                            source: new ol.source.XYZ({
                                url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
                                crossOrigin: 'anonymous',
                                maxZoom: 19,
                            }),
                            title: 'Streets (© ESRI)',
                            type: 'base',
                            zIndex: 1,
                        }),
                        // Couche OpenTopoMap
                        new ol.layer.Tile({
                            source: new ol.source.XYZ({
                                url: 'https://tile.opentopomap.org/{z}/{x}/{y}.png',
                                crossOrigin: 'anonymous',
                                maxZoom: 19,
                                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                            }),
                            title: 'OpenTopoMap (© OSM / SRTM)',
                            type: 'base',
                            zIndex: 1,
                        }),
                        // Couche OSM
                        new ol.layer.Tile({
                            source: new ol.source.XYZ({
                                url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
                                crossOrigin: 'anonymous',
                                maxZoom: 19,
                                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                            }),
                            title: 'OpenStreetMap (© OSM)',
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
                    title: 'Hazminer data',
                    layers: [
                        new ol.layer.Group({
                            title: 'Event',
                            layers: [
                                // Création de la couche de l'emprise des évènements
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
                                    title: 'Bbox event',
                                    zIndex: 10,
                                }),
                                // Création de la couche contenant uniquement l'évènement sélectionné
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
                                    title: 'Event',
                                    zIndex: 12,
                                }),
                            ],
                        }),
                        // Création de la couche des paragraphes
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
                            title: 'Paragraphs',
                            zIndex: 13,
                        }),
                        new ol.layer.Group({
                            title: 'Selected paragraph',
                            layers: [
                                // Création de la couche de l'emprise des paragraphes
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
                                    title: 'Bbox paragraph',
                                    zIndex: 11,
                                }),                               
                                // Création de la couche contenant uniquement le paragraphe selectionné
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
                                    title: 'Selected paragraph',
                                    zIndex: 14,
                                }),
                            ],
                        }),
                    ],
                }),
                // Création de la couche de géolocalisation
                this.location_layer = new ol.layer.Vector({
                    source: new ol.source.Vector(),
                    zIndex: 15,
                    visible: false,
                }),
            ],
        });

        // Récupérer l'évènement et le rajouter dans la couche évènement selectionné
        this.get_event()

        // Écouter le changement de visibilité de la couche de susceptibilité des tremblements de terre
        this.landslide_susceptibility_layer.on('change:visible', () => {
            this.landslide_susceptibility_visibility = this.landslide_susceptibility_layer.getVisible();
            // Si la couche de susceptibilité des tremblements de terre est visible
            if (this.landslide_susceptibility_visibility) {
                // Affichage du bouton
                document.getElementById("legend_div").style.display = "block";
            }
            // Si la couche de susceptibilité des tremblements de terre n'est pas visible
            else {
                // Désaffichage du bouton, de la légende si elle est affichée
                document.getElementById("legend_div").style.display = "none";
                this.landslide_susceptibility_legend = false;
            }
        });

        // Création de la bulle vide qui affiche le nombre de paragraphes si plusieurs sont superposés
        let overlay_pointermove = new ol.Overlay({
            element: document.getElementById("popup_pointermove"),
            positioning: "bottom-center"
        });
        this.map.addOverlay(overlay_pointermove);

        // Création de la bulle vide qui permet de sélectionner un paragraphe quand plusieurs sont superposés
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

        // Bouton pour afficher la légende de la couche de susceptibilité des tremblements de terre
        let legend_control = new ol.control.Control({
            element: document.getElementById("legend_div"),
        });
        this.map.addControl(legend_control);

        // Bouton séries temporelles
        let time_series_control = new ol.control.Control({
            element: document.getElementById("time_series_div"),
        });
        this.map.addControl(time_series_control);

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
        })
        this.map.addControl(scaleline);

        // A chaque déplacement/zoom, suppression de la bulle qui permet de sélectionner un paragraphe quand plusieurs sont superposés
        this.map.on('moveend', () => {
            document.getElementById("popup_click").style.display = "none";
        });

        // A chaque déplacement du pointeur, si plusieurs paragraphes sont superposées au niveau du pointeur, on affiche leur nombre
        this.map.on("pointermove", evt => {

            let paragraph_features = [];
        
            // Récupérer les objets à partir des différentes couches
            this.map.forEachFeatureAtPixel(evt.pixel, (feature, layer) => {
                if (layer === this.paragraphs_layer) {
                    paragraph_features.push(feature);
                }
            });
    
            // Si il y a plusieurs paragraphes, la bulle affiche "n paragraphs"
            if (paragraph_features.length > 1) {
                document.getElementById("popup_pointermove").innerHTML = paragraph_features.length + " paragraphs";
                overlay_pointermove.setPosition(evt.coordinate);
                document.getElementById("popup_pointermove").style.display = "block";
            }

            else {
                document.getElementById("popup_pointermove").style.display = "none";
            }

        });

        // Quand on clique sur un ou plusieurs paragraphes :
        this.map.on('click', evt => {

            let paragraph_features = [];
        
            // Récupérer les objets à partir des différentes couches
            this.map.forEachFeatureAtPixel(evt.pixel, (feature, layer) => {
                if (layer === this.paragraphs_layer) {
                    paragraph_features.push(feature);
                }
            });
        
            // Si l'objet est un seul paragraphe, le texte contenant les infos sur ce paragraphe s'affiche en bas à droite de l'écran
            if (paragraph_features.length == 1) {
                document.getElementById("popup_click").style.display = "none";
                this.show_selected_paragraph_data(paragraph_features[0]);
            }

            // Si plusieurs paragraphes sont sélectionnés, on affiche la liste sous forme de liens cliquables
            // Cliquer sur un lien affiche le texte contenant les infos sur le paragraphe sélectionné en bas à droite de l'écran
            else if (paragraph_features.length > 1) {
                let html_popup = 'Choose the paragraph:<ul>'
                paragraph_features.forEach((paragraph_feature, index) => {
                    let line = paragraph_feature.get('publication_time').substring(0,10) + ' - ' + paragraph_feature.get('title');
                    html_popup += `<li><a href="#" id="paragraph_link_${index}">${line}</a></li>`;
                });
                html_popup += '</ul>'
                document.getElementById("popup_click").innerHTML = html_popup;
                paragraph_features.forEach((paragraph_feature, index) => {
                    document.getElementById(`paragraph_link_${index}`).addEventListener('click', (e) => {
                        e.preventDefault();
                        this.show_selected_paragraph_data(paragraph_feature);
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