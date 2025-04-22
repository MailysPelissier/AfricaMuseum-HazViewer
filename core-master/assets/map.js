Vue.createApp({

    data() {
        return {
            map: null, // Initialisation de la map
            locations: null, // Initialisation de la couche locations
            events: null, // Initialisation de la couche events
            bbox_events: null, // Initialisation de la couche bbox events
            event_property: [], // Liste des propriétés pour les events
            event_text: 'Select an event to get more information !', // Texte sur les events (droite de l'écran)
            info_button: false, // Permet de faire apparaitre le bouton plus d'infos quand un event est sélectionné

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

        // Ajout des locations à la couche locations, selon la bbox
        ajout_locations () {

            const { min_lon, min_lat, max_lon, max_lat } = this.emprise_ecran();

            // Requête vers la bdd, on récupère seulement les locations dans la bbox
            url = "/postgres/locations?min_lon=" + min_lon + '&min_lat=' + min_lat + '&max_lon=' + max_lon + '&max_lat=' + max_lat;
            fetch(url)
            .then( (result) => {
                return result.json();
            })
            .then( (json) => {

                // Pour chaque location récupérée :
                for (let i = 0; i < json.length; i++) {

                    // Récupération de l'identifiant
                    let location_id = json[i].location_id;

                    // Si la location n'est pas déjà dans la couche :
                    let exists = this.locations.getSource().getFeatureById(location_id);
                    if (!exists) {

                        // Création de la feature à l'aide de ses coordonnées (projection en 3857)
                        let new_location = new ol.Feature(new ol.geom.Point(ol.proj.fromLonLat([json[i].longitude,json[i].latitude])));

                        // Stockage de l'identifiant
                        new_location.setId(location_id);

                        // Récupération et stockage des propriétés
                        for (const key in json[i]) {
                            if (json[i].hasOwnProperty(key)) {
                                new_location.set(key, json[i][key]);
                            }
                        }

                        // Ajout à la couche locations
                        this.locations.getSource().addFeature(new_location);
                    }     
                };
            });
        },

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

        // Crée le texte en récupérant les infos sur l'event
        async create_event_text (feature) {
            this.event_text = '';
            for (let property of this.event_property) {
                this.event_text += property + ' : ' + feature.get(property) + '<br>';
            }
            // Affichage contours scrollbox
            document.getElementById('event_data_scroll_box').style.border = "1px solid #ccc";
            // Apparition du bouton More infos
            this.info_button = true;
        },

        // Fonction appelée quand on appuie sur le bouton pour avoir plus d'infos
        async more_infos_page (feature) {
            // Bouton afficher la bbox
            document.getElementById("more_info_button").onclick = () => {

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

                // Couche bbox_events vidée
                this.bbox_events.getSource().clear();
                
                // Création de la feature à l'aide de ses coordonnées
                let new_event = new ol.Feature(
                    ol.geom.Polygon.fromExtent([min_lon, min_lat, max_lon, max_lat])
                );

                // Ajout à la couche bbox_events
                this.bbox_events.getSource().addFeature(new_event);

            }

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

        // A chaque déplacement/zoom, ajout des locations à la couche locations, et des events à la couche events, selon la bbox
        this.map.on('moveend', () => {
            // this.ajout_locations();
            this.ajout_events();
        });

        // Quand on clique sur un event
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

                // Le texte sur les events s'affiche uniquement si la feature est bien un event
                if (foundLayer && foundLayer === this.events) {
                    // Texte contenant les infos à droite de l'écran
                    this.create_event_text(feature)
                    .then(() => {
                        // Bouton pour avoir plus d'infos
                        this.more_infos_page(feature);
                    })
                }
            }
        });


    },

    created() {
    
    },

}).mount('#vue_map');