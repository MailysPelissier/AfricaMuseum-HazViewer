Vue.createApp({

    data() {
        return {
            map: null, // Initialisation de la map
            // locations: null, // Initialisation de la couche locations
            bbox_events: null, // Initialisation de la couche bbox events
            events: null, // Initialisation de la couche events
            selected_event_layer: null, // Initialisation de la couche selected events
            paragraphs: null, // Initialisation de la couche paragraphs
            event_property: [], // Liste des propriétés pour les events
            paragraph_property: [], // Liste des propriétés pour les paragraphs
            event_text: 'Select an event to get more information!', // Texte sur les events (droite de l'écran)
            selected_event: null, // Permet de conserver l'event sélectionné
            more_info_button: false, // Permet de faire apparaitre le bouton plus d'infos quand un event est sélectionné
            back_to_map_button: false, // Permet de faire apparaitre le bouton pour retourner à la carte

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

        // // Ajout des locations à la couche locations, selon la bbox
        // ajout_locations () {

        //     const { min_lon, min_lat, max_lon, max_lat } = this.emprise_ecran();

        //     // Requête vers la bdd, on récupère seulement les locations dans la bbox
        //     url = "/postgres/locations?min_lon=" + min_lon + '&min_lat=' + min_lat + '&max_lon=' + max_lon + '&max_lat=' + max_lat;
        //     fetch(url)
        //     .then( (result) => {
        //         return result.json();
        //     })
        //     .then( (json) => {

        //         // Pour chaque location récupérée :
        //         for (let i = 0; i < json.length; i++) {

        //             // Récupération de l'identifiant
        //             let location_id = json[i].location_id;

        //             // Si la location n'est pas déjà dans la couche :
        //             let exists = this.locations.getSource().getFeatureById(location_id);
        //             if (!exists) {

        //                 // Création de la feature à l'aide de ses coordonnées (projection en 3857)
        //                 let new_location = new ol.Feature(new ol.geom.Point(ol.proj.fromLonLat([json[i].longitude,json[i].latitude])));

        //                 // Stockage de l'identifiant
        //                 new_location.setId(location_id);

        //                 // Récupération et stockage des propriétés
        //                 for (const key in json[i]) {
        //                     if (json[i].hasOwnProperty(key)) {
        //                         new_location.set(key, json[i][key]);
        //                     }
        //                 }

        //                 // Ajout à la couche locations
        //                 this.locations.getSource().addFeature(new_location);
        //             }     
        //         };
        //     });
        // },

        // Ajout des events à la couche events, selon la bbox
        ajout_events () {

            const { min_lon, min_lat, max_lon, max_lat } = this.emprise_ecran();

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
                    let exists = this.events.getSource().getFeatureById(event_id);
                    if (!exists) {

                        // Création de la liste des propriétés (une seule fois)
                        if (this.events.getSource().getFeatures().length == 0) {
                            for (const key in json[i]) {
                                if (json[i].hasOwnProperty(key)) {
                                    this.event_property.push(key);
                                }
                            }
                        }

                        // Création de la feature à l'aide de ses coordonnées (projection en 3857)
                        let new_event = new ol.Feature(new ol.geom.Point(ol.proj.fromLonLat([json[i].longitude,json[i].latitude])));

                        // Stockage de l'identifiant
                        new_event.setId(event_id);

                        // Récupération et stockage des propriétés
                        for (const key in json[i]) {
                            if (json[i].hasOwnProperty(key)) {
                                new_event.set(key, json[i][key]);
                            }
                        }

                        // Ajout à la couche events
                        this.events.getSource().addFeature(new_event); 

                    }      
                
                };
            
            });
        
        },

        // Crée le texte en récupérant les infos sur l'event, change le style de l'event
        affichage_selection_event (feature) {

            // Affichage du texte sur l'event
            this.event_text = '';
            for (let property of this.event_property) {
                this.event_text += property + ' : ' + feature.get(property) + '<br>';
            }

            // Affichage contours scrollbox
            document.getElementById('event_data_scroll_box').style.border = "1px solid #ccc";

            // Apparition du bouton More infos
            this.more_info_button = true;

            // Retour au style normal de la feature précédente
            if (this.selected_event != null) {
                this.selected_event.setStyle(new ol.style.Style({
                    image: new ol.style.Circle({
                        radius: 10,
                        fill: new ol.style.Fill({
                            color: 'rgba(255, 0, 0, 1)',
                        }),
                    }),
                }))
            }
            // Garder l'event actuel
            this.selected_event = feature;
            // Changer le style de l'event sélectionné
            this.selected_event.setStyle(new ol.style.Style({
                image: new ol.style.Circle({
                    radius: 10,
                    fill: new ol.style.Fill({
                        color: 'rgba(0, 255, 0, 1)',
                    }),
                }),
            })) 

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

            // Couche events invisible
            this.events.setVisible(false);

            // Couche selected_event contient l'event sélectionné
            let feature_geometry = new ol.Feature(new ol.geom.Point(ol.proj.fromLonLat([feature.get('longitude'),feature.get('latitude')])));
            this.selected_event_layer.getSource().addFeature(feature_geometry);

            // Afficher bbox
            this.affichage_bbox(feature);

            // Afficher paragraphs
            this.affichage_paragraphs(feature);

        },

        // Fonction appelée quand on appuie sur le bouton pour retourner sur la map
        // Réinitialise la carte à l'état précédent
        back_to_map () {

            // Texte des events réinitialisé
            this.event_text = 'Select an event to get more information!';

            // Suppression contours scrollbox
            document.getElementById('event_data_scroll_box').style.border = 'none';

            // Disparition du bouton Back to map
            this.back_to_map_button = false;

            // Couche events visible
            this.events.setVisible(true);

            // Couche selected_event vidée
            this.selected_event_layer.getSource().clear();

            // Couche bbox_events vidée
            this.bbox_events.getSource().clear();

            // Couche paragraphs vidée
            this.paragraphs.getSource().clear();

        },

        // Affichage de la bbox de l'event et zoom sur cette emprise
        affichage_bbox (feature) {

            // Récupérer les valeurs de la bbox (en 4326)
            let bbox = feature.get('bbox').replace(/\s+/g, '').replace('{', '').replace('}', '').split(',');
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

            // Ajout à la couche bbox_events
            this.bbox_events.getSource().addFeature(new_event);

            // Zoom sur la bbox
            this.map.getView().fit([min_lon, min_lat, max_lon, max_lat], this.map.getSize());
            this.map.getView().setZoom(this.map.getView().getZoom() - 0.5);

        },

        // Affichage des paragraphs correspondant à l'event
        affichage_paragraphs (feature) {

            // Récupérer les valeurs des paragraphs_id
            let paragraphs_list = feature.get('paragraphs_list');
            // Nettoyage de la chaîne pour enlever les parenthèses extérieures
            paragraphs_list = paragraphs_list.replace(/^\(|\)$/g, '');
            // Transformation en tableau en séparant par virgule
            paragraphs_list = paragraphs_list.split(',').map(e => e.trim().replace(/^'|'$/g, ''));
            // Reformater proprement
            paragraphs_list = `(${paragraphs_list.map(e => `'${e}'`).join(',')})`;

            // Requête vers la bdd, on récupère seulement les paragraphs de l'event
            url = "/postgres/paragraphs?paragraphs_list=" + paragraphs_list;
            console.log(url)
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
                    let exists = this.paragraphs.getSource().getFeatureById(paragraph_id);
                    if (!exists) {

                        // Création de la liste des propriétés (une seule fois)
                        if (this.paragraphs.getSource().getFeatures().length == 0) {
                            for (const key in json[i]) {
                                if (json[i].hasOwnProperty(key)) {
                                    this.paragraph_property.push(key);
                                }
                            }
                        }

                        // Création de la feature à l'aide de ses coordonnées (projection en 3857)
                        let new_paragraph = new ol.Feature(new ol.geom.Point(ol.proj.fromLonLat([json[i].longitude,json[i].latitude])));

                        // Stockage de l'identifiant
                        new_paragraph.setId(paragraph_id);

                        // Récupération et stockage des propriétés
                        for (const key in json[i]) {
                            if (json[i].hasOwnProperty(key)) {
                                new_paragraph.set(key, json[i][key]);
                            }
                        }

                        // Ajout à la couche paragraphs
                        this.paragraphs.getSource().addFeature(new_paragraph);                   
                    
                    }      
                
                };
            
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

        // // Création de la couche locations (vide)
        // this.locations = new ol.layer.Vector({
        //     source: new ol.source.Vector(),
        //     style: new ol.style.Style({
        //         image: new ol.style.Circle({
        //             radius: 10,
        //             fill: new ol.style.Fill({
        //                 color: 'rgba(0, 0, 255, 1)',
        //             }),
        //         }),
        //     }),
        // });
        // this.map.addLayer(this.locations);

        // Création de la couche bbox events (vide)
        this.bbox_events = new ol.layer.Vector({
            source: new ol.source.Vector(),
            style: new ol.style.Style({
                fill: new ol.style.Fill({
                    color: 'rgba(255, 255, 255, 0.2)'
                }),
                stroke: new ol.style.Stroke({
                    color: '#ffcc33',
                    width: 2
                })
            }),
            zIndex: 2,
        });
        this.map.addLayer(this.bbox_events);

        // Création de la couche events (vide)
        this.events = new ol.layer.Vector({
            source: new ol.source.Vector(),
            style: new ol.style.Style({
                image: new ol.style.Circle({
                    radius: 10,
                    fill: new ol.style.Fill({
                        color: 'rgba(255, 0, 0, 1)',
                    }),
                }),
            }),
            zIndex: 3,
        });
        this.map.addLayer(this.events);

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
            zIndex: 4,
        });
        this.map.addLayer(this.selected_event_layer);

        // Création de la couche paragraphs (vide)
        this.paragraphs = new ol.layer.Vector({
            source: new ol.source.Vector(),
            style: new ol.style.Style({
                image: new ol.style.Circle({
                    radius: 5,
                    fill: new ol.style.Fill({
                        color: 'rgba(0, 0, 0, 1)',
                    }),
                }),
            }),
            zIndex: 5,
        });
        this.map.addLayer(this.paragraphs);

        // A chaque déplacement/zoom, ajout des events à la couche events selon la bbox
        this.map.on('moveend', () => {
            // this.ajout_locations();
            this.ajout_events();
        });

        // Quand on clique sur une feature :
        this.map.on('click', evt => {

            let feature = this.map.forEachFeatureAtPixel(evt.pixel, feature => feature);

            if (feature) {

                // Parcours des couches pour trouver celle qui contient la feature
                this.map.getLayers().forEach(layer => {
                    const source = layer.getSource();
                    // Vérifier si la source est une source vectorielle
                    if (source instanceof ol.source.Vector) {
                        // Vérifier si la feature fait partie de cette source
                        if (source.getFeatures().includes(feature)) {
                            foundLayer = layer;
                        }
                    }
                });

                // Si la feature est bien un event, le texte contenant les infos sur les events s'affiche à droite de l'écran
                if (foundLayer && foundLayer === this.events) {
                    this.affichage_selection_event(feature);
                }

            }

        });

    },

    created() {
    
    },

}).mount('#vue_map');