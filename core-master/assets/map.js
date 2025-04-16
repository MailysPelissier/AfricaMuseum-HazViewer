Vue.createApp({

    data() {
        return {
            map: null, // Initialisation de la map
            locations: null, // Initialisation de la couche locations

        };
    },

    methods: {

        // Ajout des locations à la couche locations, selon la bbox
        ajout_locations () {

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

                        // Récupération des données
                        let article_id = json[i].article_id;
                        let paragraph_id = json[i].paragraph_id;
                        let char_location = json[i].char_location;
                        let latitude = json[i].latitude;
                        let longitude = json[i].longitude;
                        let rang = json[i].rang;
                        let min_lat = json[i].min_lat;
                        let max_lat = json[i].max_lat;
                        let min_lon = json[i].min_lon;
                        let max_lon = json[i].max_lon;
                        let squared_distance = json[i].squared_distance;

                        // Création de la feature à l'aide de ses coordonnées (projection en 3857)
                        let new_location = new ol.Feature(new ol.geom.Point(ol.proj.fromLonLat([longitude,latitude])));

                        // Récupération de ses attributs
                        new_location.setId(location_id);
                        new_location.set('article_id',article_id);
                        new_location.set('paragraph_id',paragraph_id);
                        new_location.set('char_location',char_location);
                        new_location.set('rang',rang);
                        new_location.set('min_lat',min_lat);
                        new_location.set('max_lat',max_lat);
                        new_location.set('min_lon',min_lon);
                        new_location.set('max_lon',max_lon);
                        new_location.set('squared_distance',squared_distance);

                        // Ajout à la couche locations
                        this.locations.getSource().addFeature(new_location);
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

        // A chaque déplacement/zoom, ajout des locations à la couche locations, selon la bbox
        this.map.on('moveend', () => {
            this.ajout_locations()
        });

        
       
    },

    created() {

        
        
    },

}).mount('#vue_map');