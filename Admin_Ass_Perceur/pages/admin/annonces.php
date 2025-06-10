<?php include('admin_header.php');

$routes = [
    'annonces' => 'annonces',
];

$data = [];
foreach ($routes as $route) {
    $url = 'http://localhost:3000/' . $route;
    $data[$route] = json_decode(file_get_contents($url, false, $context), true);
}
?>

<br> <br>
<div class="form-api">
    <table id="annonceTable">
        <thead>
            <tr>
                <th>ID</th>
                <th>Id Utilisateur</th>
                <th>Id Liste Plantes</th>
                <th>Id Localisation</th>
                <th>Titre</th>
                <th>Description</th>
                <th>Date de début</th>
                <th>Date de fin</th>
            </tr>
        </thead>
        <tbody>
            <?php foreach ($data['annonces'] as $annonce) {
                foreach ($annonce as $AAAAA) { ?>
                    <tr>
                        <td><?php echo $AAAAA['id']; ?></td>
                        <td>
                            <input type="text" name="idUtilisateurPatch" data-annonces-id="<?php echo $AAAAA['id']; ?>" data-field="idUtilisateur" value="<?php echo $AAAAA['idUtilisateur']; ?>">
                        </td>
                        <td>
                            <input type="text" name="idListePlantesPatch" data-annonces-id="<?php echo $AAAAA['id']; ?>" data-field="idListePlantes" value="<?php echo $AAAAA['idListePlantes']; ?>">
                        </td>
                        <td>
                            <input type="text" name="idLocalisationPatch" data-annonces-id="<?php echo $AAAAA['id']; ?>" data-field="idLocalisation" value="<?php echo $AAAAA['idLocalisation']; ?>">
                        </td>
                        <td>
                            <input type="text" name="titrePatch" data-annonces-id="<?php echo $AAAAA['id']; ?>" data-field="titre" value="<?php echo $AAAAA['titre']; ?>">
                        </td>
                        <td>
                            <input type="text" name="descriptionPatch" data-annonces-id="<?php echo $AAAAA['id']; ?>" data-field="description" value="<?php echo $AAAAA['description']; ?>">
                        </td>
                        <td>
                            <input type="date" name="dateDebutPatch" data-annonces-id="<?php echo $AAAAA['id']; ?>" data-field="dateDebut" value="<?php echo $AAAAA['dateDebut']; ?>">
                        </td>
                        <td>
                            <input type="date" name="dateFinPatch" data-annonces-id="<?php echo $AAAAA['id']; ?>" data-field="dateFin" value="<?php echo $AAAAA['dateFin']; ?>">
                        </td>
                        <td>
                            <form id="updateAnnonceForm_<?php echo $AAAAA['id']; ?>">
                                <input type="hidden" name="annonceIdPatch" data-annonces-id="<?php echo $AAAAA['id']; ?>" data-field="id" value="<?php echo $AAAAA['id']; ?>">
                                <button type="submit">Modifier</button>
                            </form>
                            <form id="deleteAnnonceForm_<?php echo $AAAAA['id']; ?>">
                                <input type="hidden" name="annonceIdToDelete" value="<?php echo $AAAAA['id']; ?>">
                                <button type="submit">Supprimer</button>
                            </form>
                        </td>
                    </tr>
            <?php }
            } ?>
        </tbody>
    </table>
</div>
<br> <br>

<div class="form-api">
    <div class="add">
        <h2>Ajouter une annonce</h2>
        <form id="addAnnonceForm">
            <label for="annonceIdUtilisateurAdd">ID de l'utilisateur:</label><br>
            <input type="number" id="annonceIdUtilisateurAdd" name="annonceIdUtilisateurAdd" required><br>
            <label for="annonceIdListePlantesAdd">ID de la liste de plantes:</label><br>
            <input type="number" id="annonceIdListePlantesAdd" name="annonceIdListePlantesAdd" required><br>
            <label for="annonceIdLocalisationAdd">ID de la localisation:</label><br>
            <input type="number" id="annonceIdLocalisationAdd" name="annonceIdLocalisationAdd" required><br>
            <label for="annonceTitreAdd">Titre:</label><br>
            <input type="text" id="annonceTitreAdd" name="annonceTitreAdd" required><br>
            <label for="annonceDescriptionAdd">Description:</label><br>
            <textarea id="annonceDescriptionAdd" name="annonceDescriptionAdd" required></textarea><br>
            <label for="annonceDateDebutAdd">Date de début:</label><br>
            <input type="date" id="annonceDateDebutAdd" name="annonceDateDebutAdd" required><br>
            <label for="annonceDateFinAdd">Date de fin:</label><br>
            <input type="date" id="annonceDateFinAdd" name="annonceDateFinAdd" required><br>
            <button type="submit">Ajouter Annonce</button>
        </form>
    </div>
</div>

<br> <br>
<script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
<script>
    // Ajouter une annonce
    document.getElementById('addAnnonceForm').addEventListener('submit', function(event) {
        event.preventDefault();

        const idUtilisateur = document.getElementById('annonceIdUtilisateurAdd').value;
        const idListePlantes = document.getElementById('annonceIdListePlantesAdd').value;
        const idLocalisation = document.getElementById('annonceIdLocalisationAdd').value;
        const titre = document.getElementById('annonceTitreAdd').value;
        const description = document.getElementById('annonceDescriptionAdd').value;
        const dateDebut = document.getElementById('annonceDateDebutAdd').value;
        const dateFin = document.getElementById('annonceDateFinAdd').value;

        const headers = {
            'Authorization': 'SUB',
            'Content-Type': 'application/json'
        };

        axios.post('http://localhost:3000/annonces', {
                idUtilisateur,
                idListePlantes,
                idLocalisation,
                titre,
                description,
                dateDebut,
                dateFin
            }, {
                headers: headers
            })
            .then(response => {
                console.log('Réponse du serveur:', response.data);  
                window.location.reload(true);
            })
            .catch(error => {
                console.error('Erreur lors de la requête POST:', error);
            });
    });

    // Modifier une annonce
    document.querySelectorAll('form[id^="updateAnnonceForm_"]').forEach(form => {
        form.addEventListener('submit', function(event) {
            event.preventDefault();

            const annonceId = this.querySelector('input[name="annonceIdPatch"]').value;

            const inputs = document.querySelectorAll(`input[data-annonces-id="${annonceId}"]`);

            const annonceData = {};
            inputs.forEach(input => {
                const fieldName = input.getAttribute('data-field');
                annonceData[fieldName] = input.value;
            });

            const idUtilisateur = annonceData.idUtilisateur;
            const idListePlantes = annonceData.idListePlantes;
            const idLocalisation = annonceData.idLocalisation;
            const titre = annonceData.titre;
            const description = annonceData.description;
            const dateDebut = annonceData.dateDebut;
            const dateFin = annonceData.dateFin;

            const headers = {
                'Authorization': 'SUB',
                'Content-Type': 'application/json'
            };

            axios.patch(`http://localhost:3000/annonces/${annonceId}`, {
                    idUtilisateur,
                    idListePlantes,
                    idLocalisation,
                    titre,
                    description,
                    dateDebut,
                    dateFin
                }, {
                    headers: headers
                })
                .then(response => {
                    console.log('Réponse du serveur:', response.data);
                    window.location.reload(true);
                })
                .catch(error => {
                    console.error('Erreur lors de la requête PATCH:', error);
                });
        });
    });

    // Supprimer une annonce
    document.querySelectorAll('form[id^="deleteAnnonceForm_"]').forEach(form => {
        form.addEventListener('submit', function(event) {
            event.preventDefault();

            const annonceId = this.querySelector('input[name="annonceIdToDelete"]').value;

            const headers = {
                'Authorization': 'SUB',
                'Content-Type': 'application/json'
            };

            axios.delete(`http://localhost:3000/annonces/${annonceId}`, {
                    headers: headers
                })
                .then(response => {
                    console.log('Réponse du serveur:', response.data);
                    window.location.reload(true);
                })
                .catch(error => {
                    console.error('Erreur lors de la requête DELETE:', error);
                });
        });
    });
</script>

<?php
include("../footer.php") ?>