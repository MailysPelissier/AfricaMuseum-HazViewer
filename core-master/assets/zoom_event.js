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
            event_main_property: ["hazard_type", "event_time", "start_time", "end_time", "median_death", "median_injured", "median_affected",
                 "n_paragraphs", "n_articles"],
            // Autres propriétés des events
            event_other_property: ["country", "country_found", "n_languages", "n_source_countries", "duration", "disaster_score", "hasard_type_score"],
            // Propriétés locations des events
            event_location_property: ["latitude", "longitude", "bbox_event"],
            // Propriétés chiffrées des events (souvent null)
            event_number_property: ["mostfreq_death", "n_mostfreq_death", "time_mostfreq_death", "max_death", "n_max_death", "time_max_death", 
                "median_death", "mostfreq_homeless", "n_mostfreq_homeless", "time_mostfreq_homeless", "max_homeless", "n_max_homeless", 
                "time_max_homeless", "median_homeless", "mostfreq_injured", "n_mostfreq_injured", "time_mostfreq_injured", "max_injured", 
                "n_max_injured", "time_max_injured", "median_injured", "mostfreq_affected", "n_mostfreq_affected", "time_mostfreq_affected", 
                "max_affected", "n_max_affected", "time_max_affected", "median_affected", "mostfreq_missing", "n_mostfreq_missing", 
                "time_mostfreq_missing", "max_missing", "n_max_missing", "time_max_missing", "median_missing", "mostfreq_evacuated", 
                "n_mostfreq_evacuated", "time_mostfreq_evacuated", "max_evacuated", "n_max_evacuated", "time_max_evacuated", "median_evacuated"],
            // Propriétés principales des paragraphs
            paragraph_main_property: ["title", "hasard_type", "publication_time", "paragraph_time", "nb_death", "nb_injured", "nb_affected",
                "article_language"],
            // Autres propriétés des paragraphs
            paragraph_other_property: ["extracted_text", "original_text", "country", "source_country", "domain_url", "extracted_location", 
                "ner_score", "n_locations", "disaster_label", "disaster_score", "hasard_type_score", "unnamed_column"],
            // Propriétés locations des events
            paragraph_location_property: ["latitude", "longitude", "std_dev", "min_lat", "max_lat", "min_lon", "max_lon"],
            // Propriétés chiffrées des paragraphs (souvent null)
            paragraph_number_property: ["nb_death", "score_death", "answer_death", "nb_homeless", "score_homeless", "answer_homeless", 
                "nb_injured", "score_injured", "answer_injured", "nb_affected", "score_affected", "answer_affected", "nb_missing",
                "score_missing", "answer_missing", "nb_evacuated", "score_evacuated", "answer_evacuated", "nb_death_min",
                "nb_death_max", "nb_homeless_min", "nb_homeless_max", "nb_injured_min", "nb_injured_max", "nb_affected_min",
                "nb_affected_max", "nb_missing_min", "nb_missing_max", "nb_evacuated_min", "nb_evacuated_max"],
            event_main_text: 'Select an event to get more information!', // Texte sur les events (haut droite de l'écran)
            event_other_text: '', // Texte sur les events, partie optionnelle others (haut droite de l'écran)
            event_location_text: '', // Texte sur les events, partie optionnelle locations (haut droite de l'écran)
            event_number_text: '', // Texte sur les events, partie optionnelle numbers (haut droite de l'écran)
            paragraph_text: '', // Texte sur les pargraphs (bas droite de l'écran)
            event_id: '',
            selected_event: null, // Permet de conserver l'event sélectionné
            selected_paragraph: null, // Permet de conserver le paragraph sélectionné
            more_info_button: false, // Permet de faire apparaitre le bouton plus d'infos quand un event est sélectionné
            back_to_map_button: false, // Permet de faire apparaitre le bouton pour retourner à la carte
            zoom_auto: true, // Zoom auto activé ou non (actif par défaut)
            other_information: false, // Affichage des informations de other ou non (inactif par défaut)
            location_information: false, // Affichage des informations de location ou non (inactif par défaut)
            number_information: false, // Affichage des informations de number ou non (inactif par défaut)  
        };
    },

    methods: {

        // Récupération de l'évènement
        recuperer_event () {

            // Récupération de l'event_id depuis le php
            this.event_id = document.getElementById('app').dataset.event_id;

            // Partie filtre cql de la requête
            let cqlFilter = `event_id = '${this.event_id}'`;

            // Requête vers le geoserver, on récupère l'event
            let url = "http://localhost:8080/geoserver/webGIS/ows?" +
                "service=WFS&version=1.1.0&request=GetFeature" +
                "&typeName=webGIS:events2020_23" +
                "&outputFormat=application/json" +
                "&CQL_FILTER=" + encodeURIComponent(cqlFilter);

            fetch(url)
            .then(result => result.json())
            .then(json => {

                // Récupération de l'event
                let features = new ol.format.GeoJSON().readFeatures(json, {
                    featureProjection: 'EPSG:3857'
                });

                features.forEach(event => {
                    // L'event est ajouté à la couche selected event et gardé dans la variable selected_event
                    this.selected_event = event;
                    this.selected_event_layer.getSource().addFeature(event);
                    console.log(this.selected_event_layer.getSource().getFeatures())
                });
                

            });
            
        },

        // Crée le texte en récupérant les infos sur l'event, change le style de l'event
        affichage_selection_event (feature) {

            // Chargement et affichage du texte sur l'event
            this.event_main_text = '<ul>';
            this.event_other_text = '<ul>';
            this.event_location_text = '<ul>';
            this.event_number_text = '<ul>';
            // Les propriétés principales s'affichent tout le temps
            for (let property of this.event_main_property) {
                this.event_main_text += '<li>' + property + ': ' + feature.get(property) + '</li>';
            }
            // Les propriétés de other se chargent, mais elles ne s'affichent que si la checkbox Show other information est cochée
            // L'utilisateur peut choisir s'il veut afficher les informations supplémentaires ou non, son choix est conservé
            for (let property of this.event_other_property) {
                this.event_other_text += '<li>' + property + ': ' + feature.get(property) + '</li>';
            }
            // Les propriétés de location se chargent, mais elles ne s'affichent que si la checkbox Show location information est cochée
            // L'utilisateur peut choisir s'il veut afficher les informations sur la location ou non, son choix est conservé
            for (let property of this.event_location_property) {
                this.event_location_text += '<li>' + property + ': ' + feature.get(property) + '</li>';
            }
            // Les propriétés de number se chargent, mais elles ne s'affichent que si la checkbox Show number information est cochée
            // L'utilisateur peut choisir s'il veut afficher les informations statistiques ou non, son choix est conservé
            for (let property of this.event_number_property) {
                this.event_number_text += '<li>' + property + ': ' + feature.get(property) + '</li>';
            }
            this.event_main_text += '</ul>';
            this.event_other_text += '</ul>';
            this.event_location_text += '</ul>';
            this.event_number_text += '</ul>';

            // Affichage contours scrollbox
            document.getElementById('event_data_scroll_box').style.border = "1px solid #ccc";

            // Apparition du bouton More infos
            this.more_info_button = true;

            // Garder l'event actuel
            this.selected_event = feature;

            // Couche selected_event vidée
            this.selected_event_layer.getSource().clear();

            // Couche selected_event contient l'event sélectionné : permet de voir l'event
            this.selected_event_layer.getSource().addFeature(feature);

        },

        // Fonction appelée quand on appuie sur le bouton pour avoir plus d'infos
        // Rend les autres events invisibles, affiche les paragraphs et la bbox associés
        more_infos_page () {

            window.open("/event", '_blank').focus();

            // Récupération de l'event
            let feature = this.selected_event;

            // Disparition du bouton More infos
            this.more_info_button = false;

            // Apparition du bouton Back to map
            this.back_to_map_button = true;

            // Disparition du popup clic
            document.getElementById("popup_clic").style.display = "none";

            // Couche events invisible
            this.events_layer.setVisible(false);

            // Afficher bbox
            this.affichage_bbox_event(feature);

            // Afficher paragraphs
            this.affichage_paragraphs_geoserver(feature);

        },

        // Fonction appelée quand on appuie sur le bouton pour retourner sur la map
        // Réinitialise la carte à l'état précédent
        back_to_map () {

            // Apparition du bouton More infos
            this.more_info_button = true;

            // Disparition du bouton Back to map
            this.back_to_map_button = false;

            // Disparition du popup clic
            document.getElementById("popup_clic").style.display = "none";

            // Suppression contours scrollbox
            document.getElementById('paragraph_data_scroll_box').style.border = "none";

            // Couche events visible
            this.events_layer.setVisible(true);

            // Couche selected paragraph vidée
            this.selected_paragraph_layer.getSource().clear();

            // Déselection du paragraph
            this.selected_paragraph = null;

            // Suppression du paragraph_text
            this.paragraph_text = '';

        },

        // Affichage de la bbox de l'event et zoom sur cette emprise
        affichage_bbox_event (feature) {

            // Récupérer les valeurs de la bbox (en 4326)
            let bbox = feature.get('bbox_event').replace(/\s+/g, '').replace('{', '').replace('}', '').split(',');
            let min_lat_4326 = bbox[0].substring(9);
            let max_lat_4326 = bbox[1].substring(9);
            let min_lon_4326 = bbox[2].substring(9);
            let max_lon_4326 = bbox[3].substring(9);

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

            // Zoom sur la bbox si zoom_auto activé
            // L'utilisateur peut choisir s'il veut zoomer automatiquement sur l'emprise de l'event, son choix est conservé
            if (this.zoom_auto) {
                this.map.getView().fit([min_lon, min_lat, max_lon, max_lat], this.map.getSize());
                this.map.getView().setZoom(this.map.getView().getZoom() - 0.5);
            }

        },

        // Affichage des paragraphs correspondant à l'event (depuis Postgres)
        affichage_paragraphs_postgres (feature) {

            // Récupérer les valeurs des paragraphs_id
            let paragraphs_list = feature.get('paragraphs_list');
            // Nettoyage de la chaîne pour enlever les parenthèses extérieures
            paragraphs_list = paragraphs_list.replace(/^\(|\)$/g, '');
            // Transformation en tableau
            paragraphs_list = paragraphs_list.split(',').map(e => e.trim().replace(/^'|'$/g, ''));

            // Création de listes de 50 paragraph_id (url peut être trop longue si on ne fait qu'une liste)
            let nb_boucles = Math.ceil(paragraphs_list.length/50)

            for(let i = 0; i < nb_boucles; i++) {

                // Tableaux de 50 paragraph_id
                let paragraphs_list_50 = paragraphs_list.slice(50*i, 50*(i+1));
                // Liste de 50 paragraph_id reformatée pour la requête
                paragraphs_list_50 = `(${paragraphs_list_50.map(e => `'${e}'`).join(',')})`;

                // Requête vers la bdd, on récupère seulement les paragraphs de l'event, par groupe de 50
                url = "/postgres/paragraphs?paragraphs_list=" + paragraphs_list_50;
                fetch(url)
                .then( (result) => {
                    return result.json();
                })
                .then( (json) => {

                    // Pour chaque paragraph récupéré :
                    for (let j = 0; j < json.length; j++) {

                        // Récupération de l'identifiant
                        let paragraph_id = json[j].paragraph_id;

                        // Si le paragraph n'est pas déjà dans la couche :
                        let exists = this.paragraphs_layer.getSource().getFeatureById(paragraph_id);
                        if (!exists) {

                            // Création de la feature à l'aide de ses coordonnées (projection en 3857)
                            let new_paragraph = new ol.Feature(new ol.geom.Point(ol.proj.fromLonLat([json[j].longitude,json[j].latitude])));

                            // Stockage de l'identifiant
                            new_paragraph.setId(paragraph_id);

                            // Récupération et stockage des propriétés
                            for (let key in json[j]) {
                                if (json[j].hasOwnProperty(key)) {
                                    new_paragraph.set(key, json[j][key]);
                                }
                            }

                            // Ajout à la couche paragraphs
                            this.paragraphs_layer.getSource().addFeature(new_paragraph);    
                             
                        }
                    
                    }; 
                    
                });

            }
        
        },

        // Affichage des paragraphs correspondant à l'event (depuis Geoserver)
        affichage_paragraphs_geoserver(feature) {

            // Récupérer les valeurs des paragraphs_id
            let paragraphs_list = feature.get('paragraphs_list');
            // Nettoyage de la chaîne pour enlever les parenthèses extérieures
            paragraphs_list = paragraphs_list.replace(/^\(|\)$/g, '');
            // Transformation en tableau
            paragraphs_list = paragraphs_list.split(',').map(e => e.trim().replace(/^'|'$/g, ''));

            // Création de listes de 50 paragraph_id (url peut être trop longue si on ne fait qu'une liste)
            let nb_boucles = Math.ceil(paragraphs_list.length/50);

            for (let i = 0; i < nb_boucles; i++) {

                // Tableaux de 50 paragraph_id
                let paragraphs_list_50 = paragraphs_list.slice(50*i, 50*(i+1));
                // Partie filtre cql de la requête
                let cqlFilter = "paragraph_id IN (" + paragraphs_list_50.map(id => `'${id}'`).join(",") + ")";

                // Requête vers le geoserver, on récupère seulement les paragraphs de l'event, par groupe de 50
                let url = "http://localhost:8080/geoserver/webGIS/ows?" +
                    "service=WFS&version=1.1.0&request=GetFeature" +
                    "&typeName=webGIS:paragraphs2020_23" +
                    "&outputFormat=application/json" +
                    "&CQL_FILTER=" + encodeURIComponent(cqlFilter);

                fetch(url)
                .then(result => result.json())
                .then(json => {

                    // Récupération des groupes de paragraphs
                    let features = new ol.format.GeoJSON().readFeatures(json, {
                        featureProjection: 'EPSG:3857'  // Pour afficher correctement sur la carte
                    });

                    // Chaque paragraph récupéré est ajouté à la couche paragraphs
                    features.forEach(feature => {
                        this.paragraphs_layer.getSource().addFeature(feature);
                    });

                });

            }
            
        },

        // Crée le texte en récupérant les infos sur le paragraph, change le style du paragraph
        affichage_selection_paragraph (feature) {

            // Chargement et affichage du texte sur le paragraph
            this.paragraph_text = '<ul>';
            // Les propriétés principales s'affichent tout le temps
            for (let property of this.paragraph_main_property) {
                this.paragraph_text += '<li>' + property + ': ' + feature.get(property) + '</li>';
            }     
            this.paragraph_text += '</ul>';

            // Affichage contours scrollbox
            document.getElementById('paragraph_data_scroll_box').style.border = "1px solid #ccc";

            // Garder le paragraph actuel
            this.selected_paragraph = feature;

            // Couche selected_paragraph vidée
            this.selected_paragraph_layer.getSource().clear();

            // Couche selected_paragraph contient le paragraph sélectionné : permet de voir le paragraph
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

        // Change la variable passée en paramètre (utilisée avec boutons)
        change_true_false (parameters) {
            for (let parameter of parameters) {
                this[parameter] = !this[parameter];
            }
        },

        // Création du style de l'event selon ses propriétés et le style choisi dans la carte principale
        creation_style(color,size) { 
            
            return new ol.style.Style({
                image: new ol.style.Circle({
                    radius: size,
                    fill: new ol.style.Fill({
                        color: color,
                    }),
                })
            });

        },

        // Change le style des évènements
        change_style() {

            // Appliquer le style à la couche selected event (couleur imposée)
            this.selected_event_layer.setStyle(this.creation_style());
        
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

        this.recuperer_event();

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

        // A chaque déplacement/zoom, suppression du popup clic
        this.map.on('moveend', () => {
            document.getElementById("popup_clic").style.display = "none";
        });

        // A chaque déplacement du pointer, si plusieurs paragraphs sont superposées au niveau du pointer,
        // on affiche leur nombre
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

        // Quand on clique sur une ou plusieurs features :
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

    created() {
    
    },

}).mount('#vue_map');