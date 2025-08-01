// Affichage du contenu du fichier HazViewer_Information_Notice.md
fetch('assets/doc/HazViewer_Information_Notice.md')
    .then(response => {
        if (!response.ok) {
            throw new Error('Erreur de chargement du fichier Markdown');
        }
        return response.text();
    })
    .then(markdown => {
        const html = marked.parse(markdown);
        document.getElementById('markdown-container').innerHTML = html;
    })
    .catch(error => {
        console.error(error);
        document.getElementById('markdown-container').innerText = "Impossible de charger le fichier.";
    });