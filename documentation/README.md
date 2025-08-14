## Documentation HazViewer

<br>

### Sommaire
1. [Données](#1)
2. [Code](#2)
    1. [Arborescence](#21)
    2. [Fonctionnement](#22)
    3. [Frameworks utilisés](#23)
3. [Modifier le guide utilisateur](#3)
4. [Modifier la page d'information sur HazViewer](#4)

<br>

### Données : <a name="1"></a>

Les données sont en format csv de base, puis sous forme de tables sql, qui sont appelées par geoserver.

1re étape :
csv -> créer tables \
&rarr; voir creer_tables_postgres.txt

2e étape :
tables -> geoserver (soit repartir de l'étape précédente, soit des fichiers des tables .sql (events.sql, paragraphs.sql, citizen_observer.sql)) \
&rarr; voir config_geoserver.txt

<br>

### Code : <a name="2"></a>

<br>

#### Arborescence : <a name="21"></a>

Le code de HazViewer est contenu dans le dossier core-master, dans 8 fichiers (le reste des fichiers est lié à l'utilisation du Framework Flight) :
- index.php
- views/map.php
- views/zoom_event.php
- views/hazviewer_info.php
- assets/map.js
- assets/zoom_event.js
- assets/hazviewer_info.js
- assets/map.css
<br>

La couche des pays utilisée est stockée en local :
- assets/layers/countries50m.json
<br>

Les images s'affichant sur la page (logo, légende) sont stockées en local :
- assets/images/legend_landslide_susceptibility.png
- assets/images/logo_hazviewer.png
<br>

Les pages donnant des informations supplémentaires sur HazViewer (texte markdown, guide utilisateur) sont également stockées en local :
- assets/doc/HazViewer_Information_Notice.md
- assets/doc/user_guide.pdf

<br>

#### Fonctionnement : <a name="22"></a>

index.php permet d'accéder aux 3 pages selon l'url (à l'aide de Flight) : \
/ permet d'accéder à la carte globale (page principale) \
/event?event_id=20220904E27401CT20250704172929 (par exemple) permet d'accéder à la page dédiée à un évènement selon son identifiant \
/hazviewer_info permet d'accéder à la page donnant plus d'informations sur HazViewer

map.php : page principale, utilise map.js et map.css \
map.js : script js de la page principale

zoom_event.php : page dédiée à un évènement, utilise zoom_event.js et map.css \
zoom_event.js : script js de la page dédiée à un évènement

hazviewer_info.php : page donnant plus d'informations sur HazViewer, utilise hazviewer_info.js map.css \
hazviewer_info.js : script js de la page donnant plus d'informations sur HazViewer

map.css : feuille de style, utilisée pour les 3 pages

Voir le guide utilisateur pour comprendre les différentes pages et fonctions principales de HazViewer \
Voir la documentation du code pour comprendre le fonctionnement du code \
Les liens des données dans le code (en local ou par geoserver) sont listés dans code_liste_liens_donnees.txt.

<br>

#### Frameworks utilisés : <a name="23"></a>

- Flight (navigation entre les pages, index simplifié)
- vue.js (lien entre php et js)
- openlayers (gestion de la carte)
- bootstrap (style)
- flatpickr (calendriers)
- layerswitcher (gestionnaire de couches)
- dayjs (dates ne dépendent pas du navigateur)
- plotly (création de graphes)
- marked (lire fichier markdown)

Les frameworks nécessaires à chaque page sont appelés dans les fichiers php.

<br>

### Modifier le guide utilisateur : <a name="3"></a>
Le guide utilisateur en format latex (créé avec Overleaf) est disponible (guide_utilisateur/guide_utilisateur_latex.txt). \
Les images se trouvent dans les dossiers guide_utilisateur/captures et guide_utilisateur/logos. \
Après modification, le guide utilisateur doit être renommé user_guide.pdf, et mis dans le dossier doc de cette manière : core-master/assets/doc/user_guide.pdf.

<br>

### Modifier la page d'information sur HazViewer : <a name="4"></a>
La page d'information est créée à partir du fichier HazViewer_Information_Notice.md, disponible dans le dossier hazviewer_information_page. \
Après modification, la page d'information doit être renommée HazViewer_Information_Notice.md, et mise dans le dossier doc : core-master/assets/doc/HazViewer_Information_Notice.md.

<br>

Si vous avez des questions sur les données ou le code, n'hésitez pas à envoyer un mail à mailys.pelissier@gmail.com.

<br>