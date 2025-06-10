<?php include('admin_header.php');

$routes = [
    'roles' => 'roles',
];

$data = [];
foreach ($routes as $route) {
    $url = 'http://localhost:3000/' . $route;
    $data[$route] = json_decode(file_get_contents($url, false, $context), true);
}
?>

<br> <br>

<div class="form-api">
    <table id="roleTable">
        <thead>
            <tr>
                <th>ID</th>
                <th>Nom</th>
            </tr>
        </thead>
        <tbody>
            <?php foreach ($data['roles'] as $roles) {
                foreach ($roles as $AAAAA) { ?>
                    <tr>
                        <td><?php echo $AAAAA['id']; ?></td>
                        <td>
                            <input type="text" name="roleNewNomPatch" data-roles-id="<?php echo $AAAAA['id']; ?>" data-field="nom" value="<?php echo $AAAAA['nom']; ?>">
                        </td>
                        <td>
                            <form id="updateRoleForm_<?php echo $AAAAA['id']; ?>">
                                <input type="hidden" name="roleIdPatch" data-roles-id="<?php echo $AAAAA['id']; ?>" data-field="id" value="<?php echo $AAAAA['id']; ?>">
                                <button type="submit">Modifier</button>
                            </form>
                            <form id="deleteRoleForm_<?php echo $AAAAA['id']; ?>">
                                <input type="hidden" name="roleIdToDelete" value="<?php echo $AAAAA['id']; ?>">
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
        <h2>Ajouter un rôle</h2>
        <form id="addRoleForm">
            <label for="roleNomAdd">Nom du rôle:</label><br>
            <input type="text" id="roleNomAdd" name="roleNomAdd" required><br>
            <button type="submit">Ajouter Rôle</button>
        </form>
    </div>
</div>

<br> <br>

<script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
<script>
    // Ajouter un rôle
    document.getElementById('addRoleForm').addEventListener('submit', function(event) {
        event.preventDefault();

        const nom = document.getElementById('roleNomAdd').value;

        const headers = {
            'Authorization': 'SUB',
            'Content-Type': 'application/json'
        };

        axios.post('http://localhost:3000/roles', {
                nom
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

    // Modifier un rôle
    document.querySelectorAll('[id^="updateRoleForm_"]').forEach(form => {
        form.addEventListener('submit', function(event) {
            event.preventDefault();

            // Récupérer l'ID de l'utilisateur associé au formulaire
            const rolesId = this.querySelector('[name="roleIdPatch"]').value;

            // Sélectionner les inputs correspondant à cet utilisateur
            const inputs = document.querySelectorAll(`[data-roles-id="${rolesId}"]`);

            // Créer un objet pour stocker les valeurs des champs
            const rolesData = {};

            // Parcourir chaque input et ajouter sa valeur à l'objet rolesData
            inputs.forEach(input => {
                const fieldName = input.getAttribute('data-field');
                const value = input.value;
                rolesData[fieldName] = value;
            });

            // rolesData contient maintenant les valeurs des champs du formulaire
            console.log(rolesData);

            const roleId = rolesData.id;
            const newNom = rolesData.nom;

            const headers = {
                'Authorization': 'SUB',
                'Content-Type': 'application/json'
            };

            axios.patch(`http://localhost:3000/roles/${roleId}`, {
                    nom: newNom
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

    // Supprimer un rôle
    document.querySelectorAll('[id^="deleteRoleForm_"]').forEach(form => {
        form.addEventListener('submit', function(event) {
            event.preventDefault();

            const roleIdToDelete = this.querySelector('[name="roleIdToDelete"]').value;

            const headers = {
                'Authorization': 'SUB',
                'Content-Type': 'application/json'
            };

            axios.delete(`http://localhost:3000/roles/${roleIdToDelete}`, {
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