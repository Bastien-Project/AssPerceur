<?php include('admin_header.php');


$routes = [
    'localisations' => 'localisations',
];

$data = [];
foreach ($routes as $route) {
    $url = 'http://localhost:3000/' . $route;
    $data[$route] = json_decode(file_get_contents($url, false, $context), true);
}
?>

<br> <br>
<div class="form-api">
    <table id="localisationTable">
        <thead>
            <tr>
                <th>ID</th>
                <th>Latitude</th>
                <th>Longitude</th>
                <th>Adresse</th>
                <th>Complément d'adresse</th>
                <th>Ville</th>
                <th>Code Postal</th>
                <th>Pays</th>
            </tr>
        </thead>
        <tbody>
            <?php foreach ($data['localisations'] as $localisation) {
                foreach ($localisation as $AAAAA) { ?>
                    <tr>
                        <td><?php echo $AAAAA['id']; ?></td>
                        <td>
                            <input type="text" name="latitudePatch" data-localisation-id="<?php echo $AAAAA['id']; ?>" data-field="latitude" value="<?php echo $AAAAA['latitude']; ?>">
                        </td>
                        <td>
                            <input type="text" name="longitudePatch" data-localisation-id="<?php echo $AAAAA['id']; ?>" data-field="longitude" value="<?php echo $AAAAA['longitude']; ?>">
                        </td>
                        <td>
                            <input type="text" name="adressePatch" data-localisation-id="<?php echo $AAAAA['id']; ?>" data-field="adresse" value="<?php echo $AAAAA['adresse']; ?>">
                        </td>
                        <td>
                            <input type="text" name="complementAdressePatch" data-localisation-id="<?php echo $AAAAA['id']; ?>" data-field="complementAdresse" value="<?php echo $AAAAA['complement_adresse']; ?>">
                        </td>
                        <td>
                            <input type="text" name="villePatch" data-localisation-id="<?php echo $AAAAA['id']; ?>" data-field="ville" value="<?php echo $AAAAA['ville']; ?>">
                        </td>
                        <td>
                            <input type="text" name="codePostalPatch" data-localisation-id="<?php echo $AAAAA['id']; ?>" data-field="codePostal" value="<?php echo $AAAAA['code_postal']; ?>">
                        </td>
                        <td>
                            <input type="text" name="paysPatch" data-localisation-id="<?php echo $AAAAA['id']; ?>" data-field="pays" value="<?php echo $AAAAA['pays']; ?>">
                        </td>
                        <td>
                            <form id="updateLocalisationForm_<?php echo $AAAAA['id']; ?>">
                                <input type="hidden" name="localisationIdPatch" data-localisation-id="<?php echo $AAAAA['id']; ?>" data-field="id"  value="<?php echo $AAAAA['id']; ?>">
                                <button type="submit">Modifier</button>
                            </form>
                            <form id="deleteLocalisationForm_<?php echo $AAAAA['id']; ?>">
                                <input type="hidden" name="localisationIdDelete" value="<?php echo $AAAAA['id']; ?>">
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
        <h2>Créer une nouvelle localisation</h2>
        <form id="addLocalisationForm">
            <label for="localisationLatitudeAdd">Latitude:</label><br>
            <input type="text" id="localisationLatitudeAdd" name="localisationLatitudeAdd" required><br>
            <label for="localisationLongitudeAdd">Longitude:</label><br>
            <input type="text" id="localisationLongitudeAdd" name="localisationLongitudeAdd" required><br>
            <label for="localisationAdresseAdd">Adresse:</label><br>
            <input type="text" id="localisationAdresseAdd" name="localisationAdresseAdd" required><br>
            <label for="localisationComplementAdresseAdd">Complément d'adresse:</label><br>
            <input type="text" id="localisationComplementAdresseAdd" name="localisationComplementAdresseAdd"><br>
            <label for="localisationVilleAdd">Ville:</label><br>
            <input type="text" id="localisationVilleAdd" name="localisationVilleAdd" required><br>
            <label for="localisationCodePostalAdd">Code postal:</label><br>
            <input type="text" id="localisationCodePostalAdd" name="localisationCodePostalAdd"><br>
            <label for="localisationPaysAdd">Pays:</label><br>
            <input type="text" id="localisationPaysAdd" name="localisationPaysAdd" required><br>
            <button type="submit">Ajouter Localisation</button>
        </form>
    </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
<script>
    // Ajouter une localisation
    document.getElementById('addLocalisationForm').addEventListener('submit', function(event) {
        event.preventDefault();

        const latitude = document.getElementById('localisationLatitudeAdd').value;
        const longitude = document.getElementById('localisationLongitudeAdd').value;
        const adresse = document.getElementById('localisationAdresseAdd').value;
        const complementAdresse = document.getElementById('localisationComplementAdresseAdd').value;
        const ville = document.getElementById('localisationVilleAdd').value;
        const codePostal = document.getElementById('localisationCodePostalAdd').value;
        const pays = document.getElementById('localisationPaysAdd').value;

        const headers = {
            'Authorization': 'SUB',
            'Content-Type': 'application/json'
        };

        axios.post('http://localhost:3000/localisations', {
                latitude,
                longitude,
                adresse,
                complementAdresse,
                ville,
                codePostal,
                pays
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

    // Modifier une localisation
    document.querySelectorAll('form[id^="updateLocalisationForm_"]').forEach(form => {
        form.addEventListener('submit', function(event) {
            event.preventDefault();

            const localisationId = this.querySelector('input[name="localisationIdPatch"]').value;

            const inputs = document.querySelectorAll(`input[data-localisation-id="${localisationId}"]`);

            const localisationData = {};
            inputs.forEach(input => {
                const fieldName = input.getAttribute('data-field');
                localisationData[fieldName] = input.value;
                console.log(`${fieldName}: ${localisationData[fieldName]}`);
            });
            console.log(localisationData);

            const latitude = localisationData.latitude;
            const longitude = localisationData.longitude;
            const adresse = localisationData.adresse;
            const complement_adresse = localisationData.complementAdresse;
            const ville = localisationData.ville;
            const code_postal = localisationData.codePostal;
            const pays = localisationData.pays;

            const headers = {
                'Authorization': 'SUB',
                'Content-Type': 'application/json'
            };

            axios.patch(`http://localhost:3000/localisations/${localisationId}`, {
                    latitude,
                    longitude,
                    adresse,
                    complement_adresse,
                    ville,
                    code_postal,
                    pays
                }, {
                    headers
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

    // Supprimer une localisation
    document.querySelectorAll('form[id^="deleteLocalisationForm_"]').forEach(form => {
        form.addEventListener('submit', function(event) {
            event.preventDefault();

            const localisationId = this.querySelector('input[name="localisationIdDelete"]').value;

            const headers = {
                'Authorization': 'SUB',
                'Content-Type': 'application/json'
            };

            axios.delete(`http://localhost:3000/localisations/${localisationId}`, {
                    headers
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