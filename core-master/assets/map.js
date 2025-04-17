Vue.createApp({

    data() {
        return {
            map: null, // Initialisation de la map
            locations: null, // Initialisation de la couche locations
            events: null, // Initialisation de la couche events

        };
    },

    methods: {

        emprise_ecran () {

        },

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

        // Ajout des events à la couche events, selon la bbox
        ajout_events () {

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

                        // Récupération des données
                        let hazard_type = json[i].hazard_type;
                        let disaster_score = json[i].disaster_score;
                        let hasard_type_score = json[i].hasard_type_score;
                        let latitude = json[i].latitude;
                        let longitude = json[i].longitude;
                        let event_time = json[i].event_time;
                        let bbox = json[i].bbox;
                        let n_languages = json[i].n_languages;
                        let n_source_countries = json[i].n_source_countries;
                        let paragraphs_list = json[i].paragraphs_list;
                        let articles_list = json[i].articles_list;
                        let n_paragraphs = json[i].n_paragraphs;
                        let n_articles = json[i].n_articles;
                        let start_time = json[i].start_time;
                        let end_time = json[i].end_time;
                        let duration = json[i].duration;
                        let mostfreq_death = json[i].mostfreq_death;
                        let n_mostfreq_death = json[i].n_mostfreq_death;
                        let time_mostfreq_death = json[i].time_mostfreq_death;
                        let max_death = json[i].max_death;
                        let n_max_death = json[i].n_max_death;
                        let time_max_death = json[i].time_max_death;
                        let median_death = json[i].median_death;
                        let mostfreq_homeless = json[i].mostfreq_homeless;
                        let n_mostfreq_homeless = json[i].n_mostfreq_homeless;
                        let time_mostfreq_homeless = json[i].time_mostfreq_homeless;
                        let max_homeless = json[i].max_homeless;
                        let n_max_homeless = json[i].n_max_homeless;
                        let time_max_homeless = json[i].time_max_homeless;
                        let median_homeless = json[i].median_homeless;
                        let mostfreq_injured = json[i].mostfreq_injured;
                        let n_mostfreq_injured = json[i].n_mostfreq_injured;
                        let time_mostfreq_injured = json[i].time_mostfreq_injured;
                        let max_injured = json[i].max_injured;
                        let n_max_injured = json[i].n_max_injured;
                        let time_max_injured = json[i].time_max_injured;
                        let median_injured = json[i].median_injured;
                        let mostfreq_affected = json[i].mostfreq_affected;
                        let n_mostfreq_affected = json[i].n_mostfreq_affected;
                        let time_mostfreq_affected = json[i].time_mostfreq_affected;
                        let max_affected = json[i].max_affected;
                        let n_max_affected = json[i].n_max_affected;
                        let time_max_affected = json[i].time_max_affected;
                        let median_affected = json[i].median_affected;
                        let mostfreq_missing = json[i].mostfreq_missing;
                        let n_mostfreq_missing = json[i].n_mostfreq_missing;
                        let time_mostfreq_missing = json[i].time_mostfreq_missing;
                        let max_missing = json[i].max_missing;
                        let n_max_missing = json[i].n_max_missing;
                        let time_max_missing = json[i].time_max_missing;
                        let median_missing = json[i].median_missing;
                        let mostfreq_evacuated = json[i].mostfreq_evacuated;
                        let n_mostfreq_evacuated = json[i].n_mostfreq_evacuated;
                        let time_mostfreq_evacuated = json[i].time_mostfreq_evacuated;
                        let max_evacuated = json[i].max_evacuated;
                        let n_max_evacuated = json[i].n_max_evacuated;
                        let time_max_evacuated = json[i].time_max_evacuated;
                        let median_evacuated = json[i].median_evacuated;
                        let ipcc_region = json[i].ipcc_region;
                        let ipcc_continent = json[i].ipcc_continent;

                        // Création de la feature à l'aide de ses coordonnées (projection en 3857)
                        let new_event = new ol.Feature(new ol.geom.Point(ol.proj.fromLonLat([longitude,latitude])));

                        // Récupération de ses attributs
                        new_event.setId(event_id);
                        new_event.set('hazard_type', hazard_type);
                        new_event.set('disaster_score', disaster_score);
                        new_event.set('hasard_type_score', hasard_type_score);
                        new_event.set('event_time', event_time);
                        new_event.set('bbox', bbox);
                        new_event.set('n_languages', n_languages);
                        new_event.set('n_source_countries', n_source_countries);
                        new_event.set('paragraphs_list', paragraphs_list);
                        new_event.set('articles_list', articles_list);
                        new_event.set('n_paragraphs', n_paragraphs);
                        new_event.set('n_articles', n_articles);
                        new_event.set('start_time', start_time);
                        new_event.set('end_time', end_time);
                        new_event.set('duration', duration);
                        new_event.set('mostfreq_death', mostfreq_death);
                        new_event.set('n_mostfreq_death', n_mostfreq_death);
                        new_event.set('time_mostfreq_death', time_mostfreq_death);
                        new_event.set('max_death', max_death);
                        new_event.set('n_max_death', n_max_death);
                        new_event.set('time_max_death', time_max_death);
                        new_event.set('median_death', median_death);
                        new_event.set('mostfreq_homeless', mostfreq_homeless);
                        new_event.set('n_mostfreq_homeless', n_mostfreq_homeless);
                        new_event.set('time_mostfreq_homeless', time_mostfreq_homeless);
                        new_event.set('max_homeless', max_homeless);
                        new_event.set('n_max_homeless', n_max_homeless);
                        new_event.set('time_max_homeless', time_max_homeless);
                        new_event.set('median_homeless', median_homeless);
                        new_event.set('mostfreq_injured', mostfreq_injured);
                        new_event.set('n_mostfreq_injured', n_mostfreq_injured);
                        new_event.set('time_mostfreq_injured', time_mostfreq_injured);
                        new_event.set('max_injured', max_injured);
                        new_event.set('n_max_injured', n_max_injured);
                        new_event.set('time_max_injured', time_max_injured);
                        new_event.set('median_injured', median_injured);
                        new_event.set('mostfreq_affected', mostfreq_affected);
                        new_event.set('n_mostfreq_affected', n_mostfreq_affected);
                        new_event.set('time_mostfreq_affected', time_mostfreq_affected);
                        new_event.set('max_affected', max_affected);
                        new_event.set('n_max_affected', n_max_affected);
                        new_event.set('time_max_affected', time_max_affected);
                        new_event.set('median_affected', median_affected);
                        new_event.set('mostfreq_missing', mostfreq_missing);
                        new_event.set('n_mostfreq_missing', n_mostfreq_missing);
                        new_event.set('time_mostfreq_missing', time_mostfreq_missing);
                        new_event.set('max_missing', max_missing);
                        new_event.set('n_max_missing', n_max_missing);
                        new_event.set('time_max_missing', time_max_missing);
                        new_event.set('median_missing', median_missing);
                        new_event.set('mostfreq_evacuated', mostfreq_evacuated);
                        new_event.set('n_mostfreq_evacuated', n_mostfreq_evacuated);
                        new_event.set('time_mostfreq_evacuated', time_mostfreq_evacuated);
                        new_event.set('max_evacuated', max_evacuated);
                        new_event.set('n_max_evacuated', n_max_evacuated);
                        new_event.set('time_max_evacuated', time_max_evacuated);
                        new_event.set('median_evacuated', median_evacuated);
                        new_event.set('ipcc_region', ipcc_region);
                        new_event.set('ipcc_continent', ipcc_continent);
    
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
            this.ajout_locations()
            this.ajout_events()
        });

    },

    created() {

        
        
    },

}).mount('#vue_map');