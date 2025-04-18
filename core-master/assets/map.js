Vue.createApp({

    data() {
        return {
            map: null, // Initialisation de la map
            locations: null, // Initialisation de la couche locations
            events: null, // Initialisation de la couche events

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
                }),
            ],
        });

        // Création de la couche locations (vide)
        this.locations = new ol.layer.Vector({
            source: new ol.source.Vector(),
            style: new ol.style.Style({
                image: new ol.style.Circle({
                    radius: 10,
                    fill: new ol.style.Fill({
                        color: 'rgba(0, 0, 255, 1)',
                    }),
                }),
            }),
        });
        this.map.addLayer(this.locations);

        // Création de la couche events (vide)
        this.events = new ol.layer.Vector({
            source: new ol.source.Vector(),
            style: new ol.style.Style({
                image: new ol.style.Circle({
                    radius: 10,
                    fill: new ol.style.Fill({
                        color: 'rgba(0, 255, 0, 1)',
                    }),
                }),
            }),
        });
        this.map.addLayer(this.events);

        // A chaque déplacement/zoom, ajout des locations à la couche locations, et des events à la couche events, selon la bbox
        this.map.on('moveend', () => {
            this.ajout_locations();
            this.ajout_events();
        });

    },

    created() {
    
    },

}).mount('#vue_map');