Vue.createApp({

    data() {
        return {
            map: null, // Initialisation de la map
            bbox_events_layer: null, // Initialisation de la couche bbox events
            bbox_paragraphs_layer: null, // Initialisation de la couche bbox paragraphs
            events_layer: null, // Initialisation de la couche events
            selected_event_layer: null, // Initialisation de la couche selected event
            paragraphs_layer: null, // Initialisation de la couche paragraphs
            selected_paragraph_layer: null, // Initialisation de la couche selected paragraph
            // Liste de toutes les propriétés pour les events
            event_all_property: [],
            // Propriétés principales des events
            event_main_property: ["hazard_type", "event_time", "start_time", "end_time", "median_death", "median_injured", "median_affected",
                 "n_paragraphs", "n_articles"],
            // Autres propriétés des events
            event_other_property: ["country", "n_languages", "n_source_countries", "duration", "disaster_score", "hasard_type_score"],
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
            // Liste de toutes les propriétés pour les paragraphs
            paragraph_all_property: [],
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
            selected_event: null, // Permet de conserver l'event sélectionné
            selected_paragraph: null, // Permet de conserver le paragraph sélectionné
            more_info_button: false, // Permet de faire apparaitre le bouton plus d'infos quand un event est sélectionné
            back_to_map_button: false, // Permet de faire apparaitre le bouton pour retourner à la carte
            zoom_auto: true, // Zoom auto activé ou non (actif par défaut)
            other_information: false, // Affichage des informations de other ou non (inactif par défaut)
            location_information: false, // Affichage des informations de location ou non (inactif par défaut)
            number_information: false, // Affichage des informations de number ou non (inactif par défaut)
            // Propriétés par défaut du changement de style
            color_style: 'Standard',
            color_standard: '#ff0000',
            color_flood: '#3252a8',
            color_flashflood: '#7f14cc',
            color_landslide: '#4a2c03',
            size_style: 'Standard',
            size_standard: 10,
            size_death: [
                { label: 'No value', min: null, max: null, size: 2 },
                { label: '0 - 9', min: 0, max: 9, size: 4 },
                { label: '10 - 99', min: 10, max: 99, size: 6 },
                { label: '100 - 999', min: 100, max: 999, size: 8 },
                { label: '1000 - 9999', min: 1000, max: 9999, size: 10 },
                { label: '10000 - 99999', min: 10000, max: 99999, size: 12 },
                { label: '≥ 100000', min: 100000, max: Infinity, size: 15 }
            ],
            // Filtre dates
            min_date: "01-01-2020",
            max_date: "31-12-2023",
            start_date: "01-01-2020",
            end_date: "31-12-2023",
            flatpickr_start: null,
            flatpickr_end: null,
        };
    },

    methods: {

        // Calcul de l'emprise de l'écran
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

        // Ajout des events à la couche events, selon la bbox
        ajout_events () {

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

                        // Création de la liste des propriétés (une seule fois)
                        if (this.event_all_property.length == 0) {
                            for (let key in json[i]) {
                                if (json[i].hasOwnProperty(key)) {
                                    this.event_all_property.push(key);
                                }
                            }                           
                        }   

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

                        // Ajout à la couche events
                        this.events_layer.getSource().addFeature(new_event); 

                    }      
                
                };
            
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
            for (let property of this.event_other_property) {
                this.event_other_text += '<li>' + property + ': ' + feature.get(property) + '</li>';
            }
            // Les propriétés de location se chargent, mais elles ne s'affichent que si la checkbox Show location information est cochée
            for (let property of this.event_location_property) {
                this.event_location_text += '<li>' + property + ': ' + feature.get(property) + '</li>';
            }
            // Les propriétés de number se chargent, mais elles ne s'affichent que si la checkbox Show number information est cochée
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

        // Change la variable other information selon si la chechbox other information est cochée ou non
        // L'utilisateur peut choisir s'il veut afficher les informations supplémentaires ou non, son choix est conservé
        change_others_information () {

            if (this.other_information) {
                this.other_information = false;
            }
            else {
                this.other_information = true;
            };

        },

        // Change la variable location information selon si la chechbox location information est cochée ou non
        // L'utilisateur peut choisir s'il veut afficher les informations sur la location ou non, son choix est conservé
        change_locations_information () {

            if (this.location_information) {
                this.location_information = false;
            }
            else {
                this.location_information = true;
            };

        },

        // Change la variable number information selon si la chechbox number information est cochée ou non
        // L'utilisateur peut choisir s'il veut afficher les informations sur la number ou non, son choix est conservé
        change_numbers_information () {

            if (this.number_information) {
                this.number_information = false;
            }
            else {
                this.number_information = true;
            };

        },

        // Fonction appelée quand on appuie sur le bouton pour avoir plus d'infos
        // Rend les autres events invisibles, affiche les paragraphs et la bbox associés
        more_infos_page () {

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
            this.affichage_paragraphs(feature);

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

            // Couche events visible
            this.events_layer.setVisible(true);

            // Couche bbox events vidée
            this.bbox_events_layer.getSource().clear();

            // Couche paragraphs vidée
            this.paragraphs_layer.getSource().clear();

            // Couche selected paragraph vidée
            this.selected_paragraph_layer.getSource().clear();

            // Couche bbox paragraphs vidée
            this.bbox_paragraphs_layer.getSource().clear();

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
            if (this.zoom_auto) {
                this.map.getView().fit([min_lon, min_lat, max_lon, max_lat], this.map.getSize());
                this.map.getView().setZoom(this.map.getView().getZoom() - 0.5);
            }

        },

        // Change la variable zoom auto selon si la chechbox zoom auto est cochée ou non
        // L'utilisateur peut choisir s'il veut zoomer automatiquement sur l'emprise de l'event, son choix est conservé
        change_zoom_auto () {

            if (this.zoom_auto) {
                this.zoom_auto = false;
            }
            else {
                this.zoom_auto = true;
            };

        },

        // Affichage des paragraphs correspondant à l'event
        affichage_paragraphs (feature) {

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
                let paragraphs_list_50 = paragraphs_list.slice(50*i,50*(i+1));
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
                    for (let i = 0; i < json.length; i++) {

                        // Récupération de l'identifiant
                        let paragraph_id = json[i].paragraph_id;

                        // Si le paragraph n'est pas déjà dans la couche :
                        let exists = this.paragraphs_layer.getSource().getFeatureById(paragraph_id);
                        if (!exists) {

                            // Création de la liste des propriétés (une seule fois)
                            if (this.paragraph_all_property.length == 0) {
                                for (let key in json[i]) {
                                    if (json[i].hasOwnProperty(key)) {
                                        this.paragraph_all_property.push(key);
                                    }
                                }
                            }

                            // Création de la feature à l'aide de ses coordonnées (projection en 3857)
                            let new_paragraph = new ol.Feature(new ol.geom.Point(ol.proj.fromLonLat([json[i].longitude,json[i].latitude])));

                            // Stockage de l'identifiant
                            new_paragraph.setId(paragraph_id);

                            // Récupération et stockage des propriétés
                            for (let key in json[i]) {
                                if (json[i].hasOwnProperty(key)) {
                                    new_paragraph.set(key, json[i][key]);
                                }
                            }

                            // Ajout à la couche paragraphs
                            this.paragraphs_layer.getSource().addFeature(new_paragraph);                   
                        
                        }
                    
                    };
                
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

        // Affiche le popup pour changer le style
        afficher_form_changer_style() {
            document.getElementById("form_changer_style").style.display = "block";
        },

        // Création du style de chaque feature selon ses propriétés et le style choisi
        creation_style(couleur_fixee = null) {
            
            return (feature) => {

                // Définition de la couleur
                let color;
                if (couleur_fixee) {
                    color = couleur_fixee;
                } else if (this.color_style === 'Standard') {
                    color = this.color_standard;
                } else if (this.color_style === 'Event_type') {
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
          
                // Définition de la taille
                let size;
                if (this.size_style === 'Standard') {
                    size = this.size_standard;
                } else if (this.size_style === 'Max_death') {
                    let max_death = feature.get('max_death');
                    let size_death_f = this.size_death.find(interval => {
                        if (interval.min === null && interval.max === null) {
                            return max_death === null;
                        }
                        return max_death >= interval.min && max_death <= interval.max;
                    });          
                    size = size_death_f.size;
                }
          
                return new ol.style.Style({
                    image: new ol.style.Circle({
                        radius: size,
                        fill: new ol.style.Fill({
                            color: color,
                        }),
                    })
                });

            };

        },

        // Change le style quand on appuie sur le bouton Apply
        change_style() {
            
            // Appliquer le style à la couche events
            this.events_layer.setStyle(this.creation_style());

            // Appliquer le style à la couche selected event (couleur imposée)
            this.selected_event_layer.setStyle(this.creation_style('rgba(0, 255, 0, 1)'));
        
        },

        // Ferme le popup pour changer le style
        fermer_form_changer_style() {
            document.getElementById("form_changer_style").style.display = "none";
        },

        // Affiche le popup pour filtrer les évènements
        afficher_form_filtrage() {
            document.getElementById("form_filter").style.display = "block";
        },

        search() {
            console.log(this.start_date,this.end_date)
        },

        // Ferme le popup pour filtrer les évènements
        fermer_form_filtrage() {
            document.getElementById("form_filter").style.display = "none";
        }


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
            zIndex: 2,
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
            zIndex: 3,
        });
        this.map.addLayer(this.bbox_paragraphs_layer);

        // Création de la couche events (vide)
        this.events_layer = new ol.layer.Vector({
            source: new ol.source.Vector(),
            style: new ol.style.Style({
                image: new ol.style.Circle({
                    radius: 10,
                    fill: new ol.style.Fill({
                        color: 'rgba(255, 0, 0, 1)',
                    }),
                }),
            }),
            zIndex: 4,
        });
        this.map.addLayer(this.events_layer);

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
            zIndex: 5,
        });
        this.map.addLayer(this.selected_event_layer);

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
            zIndex: 6,
        });
        this.map.addLayer(this.paragraphs_layer);

        // Création de la couche paragraph selectionné (vide)
        this.selected_paragraph_layer = new ol.layer.Vector({
            source: new ol.source.Vector(),
            style: new ol.style.Style({
                image: new ol.style.Circle({
                    radius: 5,
                    fill: new ol.style.Fill({
                        color: 'rgba(0, 0, 255, 1)',
                    }),
                }),
            }),
            zIndex: 7,
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

        // Bouton pour accéder à l'outil filtrage
        var filtrage_control = new ol.control.Control({
            element: document.getElementById("outil_filtrage_div"),
        });
        this.map.addControl(filtrage_control);

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

        // Bouton pour changer le style
        var change_style_control = new ol.control.Control({
            element: document.getElementById("changer_style_div"),
        });
        this.map.addControl(change_style_control);

        // A chaque déplacement/zoom, ajout des events à la couche events selon la bbox
        // Suppression du popup clic
        this.map.on('moveend', () => {
            this.ajout_events();
            document.getElementById("popup_clic").style.display = "none";
        });

        // A chaque déplacement du pointer, si plusieurs features (events ou paragraphs) sont superposées au niveu du pointer,
        // on affiche leur nombre
        this.map.on("pointermove", evt => {

            let event_features = [];
            let paragraph_features = [];
        
            // Récupérer les features à partir des différentes couches
            this.map.forEachFeatureAtPixel(evt.pixel, (feature, layer) => {
                if (layer === this.events_layer) {
                    event_features.push(feature);
                }
                if (layer === this.paragraphs_layer) {
                    paragraph_features.push(feature);
                }
            });
    
            // Si il y a plusieurs events, le popup affiche "n events"
            if (event_features.length > 1) {
                document.getElementById("popup_pointermove").innerHTML = event_features.length + " events";
                var_popup_pointermove.setPosition(evt.coordinate);
                document.getElementById("popup_pointermove").style.display = "block";
            }
        
            // Si il y a plusieurs paragraphs, le popup affiche "n paragraphs"
            else if (paragraph_features.length > 1) {
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

            let event_features = [];
            let paragraph_features = [];
        
            // Récupérer les features à partir des différentes couches
            this.map.forEachFeatureAtPixel(evt.pixel, (feature, layer) => {
                if (layer === this.events_layer) {
                    event_features.push(feature);
                }
                if (layer === this.paragraphs_layer) {
                    paragraph_features.push(feature);
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
                html_popup += '</ul>'
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
        
            // Si la feature est un seul paragraph, le texte contenant les infos sur ce paragraph s'affiche en bas à droite de l'écran
            else if (paragraph_features.length == 1) {
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