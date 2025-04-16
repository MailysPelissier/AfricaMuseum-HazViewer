<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Accueil</title>
    <link rel="stylesheet" href="https://unpkg.com/ol/ol.css">
    <script src="https://unpkg.com/ol/dist/ol.js"></script>
</head>

<body>
    <div id="entete"><h1>Page d'accueil</h1></div>
    <?php
if (function_exists('pg_connect')) {
    echo "PostgreSQL support is enabled!";
} else {
    echo "PostgreSQL support is NOT enabled!";
}
?>
    <?php phpinfo(); ?>

</body>
</html>