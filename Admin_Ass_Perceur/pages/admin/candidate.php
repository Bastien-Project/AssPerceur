<?php include('admin_header.php');

$routes = [
    'candidater' => 'candidater',
];

$data = [];
foreach ($routes as $route) {
    $url = 'http://localhost:3000/' . $route;
    $data[$route] = json_decode(file_get_contents($url, false, $context), true);
}
?>

<br> <br>
<div class="form-api">
    <table id="candidaterTable">
        <thead>
            <tr>
                <th>ID</th>
                <th>ID Annonces</th>
                <th>Id Utilisateur</th>
                <th>Id Responssable</th>
                <th>Accepte</th>
            </tr>
        </thead>
        <tbody>
            <?php foreach ($data['candidater'] as $candidater) {
                foreach ($candidater as $AAAAA) { ?>
                    <tr>
                        <td><?php echo $AAAAA['id']; ?></td>
                        <td>
                            <input type="text" name="idAnnoncesPatch" data-candidater-id="<?php echo $AAAAA['id']; ?>" data-field="idAnnonces" value="<?php echo $AAAAA['annonce_id']; ?>">
                        </td>
                        <td>
                            <input type="text" name="idUtilisateurPatch" data-candidater-id="<?php echo $AAAAA['id']; ?>" data-field="idUtilisateur" value="<?php echo $AAAAA['candidat_id']; ?>">
                        </td>
                        <td>
                            <input type="text" name="idResponssablePatch" data-candidater-id="<?php echo $AAAAA['id']; ?>" data-field="idResponssable" value="<?php echo $AAAAA['responsable_id']; ?>">
                        </td>
                        <td>
                            <input type="checkbox" name="acceptePatch" data-candidater-id="<?php echo $AAAAA['id']; ?>" data-field="accepte" <?php echo $AAAAA['accepte'] ? 'checked' : ''; ?>>
                        </td>

                        <td>
                            <form id="updateCandidaterForm_<?php echo $AAAAA['id']; ?>">
                                <input type="hidden" name="candidaterIdPatch" data-candidater-id="<?php echo $AAAAA['id']; ?>" data-field="id" value="<?php echo $AAAAA['id']; ?>">
                                <button type="submit">Modifier</button>
                            </form>
                            <form id="deleteCandidaterForm_<?php echo $AAAAA['id']; ?>">
                                <input type="hidden" name="candidaterIdDelete" data-candidater-id="<?php echo $AAAAA['id']; ?>" data-field="id" value="<?php echo $AAAAA['id']; ?>">
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
        <h2>Ajouter une Candidature</h2>
        <form id="addCandidaterForm">
            <label for="idAnnonces">ID Annonces:</label>
            <input type="text" name="idAnnonces" required>
            <br>
            <label for="idUtilisateur">ID Utilisateur:</label>
            <input type="text" name="idUtilisateur" required>
            <br>
            <label for="idResponssable">ID Responssable:</label>
            <input type="text" name="idResponssable" required>
            <br>
            <label for="accepte">Accepte:</label>
            <input type="checkbox" name="accepte" value="false">
            <br>
            <button type="submit">Ajouter</button>
        </form>
    </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
<script>
    // Ajouter une candidature
    document.getElementById('addCandidaterForm').addEventListener('submit', function(event) {
        event.preventDefault();

        const annonce_id = document.querySelector('input[name="idAnnonces"]').value;
        const candidat_id = document.querySelector('input[name="idUtilisateur"]').value;
        const responsable_id = document.querySelector('input[name="idResponssable"]').value;
        const accepte = document.querySelector('input[name="accepte"]').checked;

        const headers = {
            'Authorization': 'SUB',
            'Content-Type': 'application/json'
        };

        axios.post('http://localhost:3000/candidater', {
                annonce_id,
                candidat_id,
                responsable_id,
                accepte
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

    // Modifier une candidature
    document.querySelectorAll('form[id^="updateCandidaterForm_"]').forEach(form => {
        form.addEventListener('submit', function(event) {
            event.preventDefault();

            const candidaterId = this.querySelector('input[name="candidaterIdPatch"]').value;

            const accepteInput = document.querySelector(`input[name="acceptePatch"][data-candidater-id="${candidaterId}"]`);
            const accepte = accepteInput.checked;

            const inputs = document.querySelectorAll(`input[data-candidater-id="${candidaterId}"]`);

            const candidaterData = {};
            inputs.forEach(input => {
                const fieldName = input.getAttribute('data-field');
                if (input.type === 'checkbox') {
                    candidaterData[fieldName] = input.checked;
                } else {
                    candidaterData[fieldName] = input.value;
                }
            });

            const annonce_id = candidaterData.idAnnonces;
            const candidat_id = candidaterData.idUtilisateur;
            const responsable_id = candidaterData.idResponssable;

            const headers = {
                'Authorization': 'SUB',
                'Content-Type': 'application/json'
            };

            //vérifier candidaterId
            if (!candidaterId) {
                console.log(candidaterId);
                console.error('ID de candidature manquant');
                alert('ID de candidature manquant');
                return;
            }

            axios.patch(`http://localhost:3000/candidater/${candidaterId}`, {
                    annonce_id,
                    candidat_id,
                    responsable_id,
                    accepte
                }, {
                    headers: headers
                })
                .then(response => {
                    console.log('Réponse du serveur:', response.data);
                    window.location.reload(true);
                })
                .catch(error => {
                    console.error('Erreur lors de la requête PATCH:', error);
                    alert(JSON.stringify(error.response.data));
                });
        });
    });

    // Supprimer une candidature
    document.querySelectorAll('form[id^="deleteCandidaterForm_"]').forEach(form => {
        form.addEventListener('submit', function(event) {
            event.preventDefault();

            const candidaterId = this.querySelector('input[name="candidaterIdDelete"]').value;

            const headers = {
                'Authorization': 'SUB',
                'Content-Type': 'application/json'
            };

            axios.delete(`http://localhost:3000/candidater/${candidaterId}`, {
                    headers: headers
                })
                .then(response => {
                    console.log('Réponse du serveur:', response.data);
                    window.location.reload(true);
                })
                .catch(error => {
                    console.error('Erreur lors de la requête DELETE:', error);
                    alert(JSON.stringify(error.response.data));
                });
        });
    });
</script>

<?php
include('../footer.php'); ?>