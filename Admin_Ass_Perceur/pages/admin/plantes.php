<?php include('admin_header.php');

$routes = [
    'plantes' => 'plantes'
];

$data = [];
foreach ($routes as $route) {
    $url = 'http://localhost:3000/' . $route;
    $data[$route] = json_decode(file_get_contents($url, false, $context), true);
}
?>

<br> <br>
<div class="form-api">
    <table id="planteTable">
        <thead>
            <tr>
                <th>ID</th>
                <th>Nom</th>
                <th>Description</th>
                <th>Famille</th>
                <th>Genre</th>
                <th>Espèce</th>
                <th>Photo URL</th>
                <th>Date de plantation</th>
                <th>Date de récolte</th>
                <th>Commentaire</th>
            </tr>
        </thead>
        <tbody>
            <?php foreach ($data['plantes'] as $plante) {
                foreach ($plante as $AAAAA) { ?>
                    <tr>
                        <td><?php echo $AAAAA['id']; ?></td>
                        <td>
                            <input type="text" name="planteNomPatch" data-plantes-id="<?php echo $AAAAA['id']; ?>" data-field="nom" value="<?php echo $AAAAA['nom']; ?>">
                        </td>
                        <td>
                            <input type="textarea" name="planteDescriptionPatch" data-plantes-id="<?php echo $AAAAA['id']; ?>" data-field="description" value="<?php echo $AAAAA['description']; ?>">
                            </input>
                        </td>
                        <td>
                            <input type="text" name="planteFamillePatch" data-plantes-id="<?php echo $AAAAA['id']; ?>" data-field="famille" value="<?php echo $AAAAA['famille']; ?>">
                        </td>
                        <td>
                            <input type="text" name="planteGenrePatch" data-plantes-id="<?php echo $AAAAA['id']; ?>" data-field="genre" value="<?php echo $AAAAA['genre']; ?>">
                        </td>
                        <td>
                            <input type="text" name="plnateEspecePatch" data-plantes-id="<?php echo $AAAAA['id']; ?>" data-field="espece" value="<?php echo $AAAAA['espece']; ?>">
                        </td>
                        <td>
                            <input type="text" name="plantesPhoto_urlPatch" data-plantes-id="<?php echo $AAAAA['id']; ?>" data-field="photo_url" value="<?php echo $AAAAA['photo_url']; ?>">
                        </td>
                        <td>
                            <input type="date" name="planteDate_plantationPatch" data-plantes-id="<?php echo $AAAAA['id']; ?>" data-field="date_plantation" value="<?php echo $AAAAA['date_plantation']; ?>">
                        </td>
                        <td>
                            <input type="date" name="planteDate_recoltePatch" data-plantes-id="<?php echo $AAAAA['id']; ?>" data-field="date_recolte" value="<?php echo $AAAAA['date_recolte']; ?>">
                        </td>
                        <td>
                            <input type="textarea" name="planteCommentairePatch" data-plantes-id="<?php echo $AAAAA['id']; ?>" data-field="commentaire" value="<?php echo $AAAAA['commentaire']; ?>">
                        </td>
                        <td>
                            <form id="updatePlanteForm_<?php echo $AAAAA['id']; ?>">
                                <input type="hidden" name="plantesIdPatch" data-plantes-id="<?php echo $AAAAA['id']; ?>" data-field="id" value="<?php echo $AAAAA['id']; ?>">
                                <button type="submit">Modifier</button>
                            </form>
                            <form id="deletePlanteForm_<?php echo $AAAAA['id']; ?>">
                                <input type="hidden" name="planteIdToDelete" value="<?php echo $AAAAA['id']; ?>">
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
        <h2>Créer une nouvelle plante</h2>
        <form id="addPlanteForm">
            <label for="planteNomAdd">Nom de la plante:</label><br>
            <input type="text" id="planteNomAdd" name="planteNomAdd" required><br>
            <label for="planteDescriptionAdd">Description:</label><br>
            <textarea id="planteDescriptionAdd" name="planteDescriptionAdd"></textarea><br>
            <label for="planteFamilleAdd">Famille:</label><br>
            <input type="text" id="planteFamilleAdd" name="planteFamilleAdd"><br>
            <label for="planteGenreAdd">Genre:</label><br>
            <input type="text" id="planteGenreAdd" name="planteGenreAdd"><br>
            <label for="plnateEspeceAdd">Espèce:</label><br>
            <input type="text" id="plnateEspeceAdd" name="plnateEspeceAdd"><br>
            <label for="plantesPhoto_urlAdd">URL de la photo:</label><br>
            <input type="text" id="plantesPhoto_urlAdd" name="plantesPhoto_urlAdd"><br>
            <label for="planteDate_plantationAdd">Date de plantation:</label><br>
            <input type="date" id="planteDate_plantationAdd" name="planteDate_plantationAdd"><br>
            <label for="planteDate_recolteAdd">Date de récolte:</label><br>
            <input type="date" id="planteDate_recolteAdd" name="planteDate_recolteAdd"><br>
            <label for="planteCommentaireAdd">Commentaire:</label><br>
            <textarea id="planteCommentaireAdd" name="planteCommentaireAdd"></textarea><br>
            <button type="submit">Ajouter Plante</button>
        </form>
    </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
<script>
    // Ajouter une plante
    document.getElementById('addPlanteForm').addEventListener('submit', function(event) {
        event.preventDefault();

        const nom = document.getElementById('planteNomAdd').value;
        const description = document.getElementById('planteDescriptionAdd').value;
        const famille = document.getElementById('planteFamilleAdd').value;
        const genre = document.getElementById('planteGenreAdd').value;
        const espece = document.getElementById('plnateEspeceAdd').value;
        const photo_url = document.getElementById('plantesPhoto_urlAdd').value;
        const date_plantation = document.getElementById('planteDate_plantationAdd').value;
        const date_recolte = document.getElementById('planteDate_recolteAdd').value;
        const commentaire = document.getElementById('planteCommentaireAdd').value;

        const headers = {
            'Authorization': 'SUB',
            'Content-Type': 'application/json'
        };

        axios.post('http://localhost:3000/plantes', {
                nom,
                description,
                famille,
                genre,
                espece,
                photo_url,
                date_plantation,
                date_recolte,
                commentaire
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

    //Modifier une plante
    document.querySelectorAll('form[id^="updatePlanteForm_"]').forEach(form => {
        form.addEventListener('submit', function(event) {
            event.preventDefault();

            const planteId = this.querySelector('input[name="plantesIdPatch"]').value;

            const inputs = document.querySelectorAll(`input[data-plantes-id="${planteId}"]`);

            const planteData = {};
            inputs.forEach(input => {
                const field = input.getAttribute('data-field');
                planteData[field] = input.value;
            });

            const nom = planteData.nom;
            const description = planteData.description;
            const famille = planteData.famille;
            const genre = planteData.genre;
            const espece = planteData.espece;
            const photo_url = planteData.photo_url;
            const date_plantation = planteData.date_plantation;
            const date_recolte = planteData.date_recolte;
            const commentaire = planteData.commentaire;

            const headers = {
                'Authorization': 'SUB',
                'Content-Type': 'application/json'
            };


            axios.patch(`http://localhost:3000/plantes/${planteId}`, {
                    nom,
                    description,
                    famille,
                    genre,
                    espece,
                    photo_url,
                    date_plantation,
                    date_recolte,
                    commentaire
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
    // Supprimer une plante
    document.querySelectorAll('form[id^="deletePlanteForm_"]').forEach(form => {
        form.addEventListener('submit', function(event) {
            event.preventDefault();

            const planteId = this.querySelector('input[name="planteIdToDelete"]').value;

            const headers = {
                'Authorization': 'SUB',
                'Content-Type': 'application/json'
            };

            axios.delete(`http://localhost:3000/plantes/${planteId}`, {
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