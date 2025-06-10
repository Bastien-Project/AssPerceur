<?php include('admin_header.php');

$routes = [
    'utilisateurs' => 'utilisateurs',
];

$data = [];
foreach ($routes as $route) {
    $url = 'http://localhost:3000/utilisateurs';
    $data[$route] = json_decode(file_get_contents($url, false, $context), true);
}
?>
<br> <br>

<div class="form-api">
    <table id="userTable">
        <thead>
            <tr>
                <th>ID</th>
                <th>Nom</th>
                <th>Email</th>
                <th>Mot de passe</th>
                <th>Rôle</th>
                <th>Action</th>
            </tr>
        </thead>
        <tbody>
            <?php foreach ($data['utilisateurs'] as $user) {
                foreach ($user as $AAAAA) { ?>
                    <tr>
                        <td><?php echo $AAAAA['id']; ?></td>
                        <td>
                            <input type="text" name="userNomPatch" data-user-id="<?php echo $AAAAA['id']; ?>" data-field="nom" value="<?php echo $AAAAA['nom']; ?>">
                        </td>
                        <td>
                            <input type="email" name="userEmailPatch" data-user-id="<?php echo $AAAAA['id']; ?>" data-field="email" value="<?php echo $AAAAA['email']; ?>">
                        </td>
                        <td>
                            <input type="password" name="userMot_de_passePatch" data-user-id="<?php echo $AAAAA['id']; ?>" data-field="mot_de_passe" placeholder="Nouveau mot de passe">
                        </td>
                        <td>
                            <input type="number" name="userId_rolePatch" data-user-id="<?php echo $AAAAA['id']; ?>" data-field="id_role" value="<?php echo $AAAAA['id_role']; ?>">
                        </td>
                        <td>
                            <form id="updateUserForm_<?php echo $AAAAA['id']; ?>">
                                <input type="hidden" name="userIdPatch" data-user-id="<?php echo $AAAAA['id']; ?>" data-field="id" value="<?php echo $AAAAA['id']; ?>">
                                <button type="submit">Modifier</button>
                            </form>
                            <form id="deleteUserForm_<?php echo $AAAAA['id']; ?>">
                                <input type="hidden" name="userIdDelete" value="<?php echo $AAAAA['id']; ?>">
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
        <h2>Ajouter un utilisateur</h2>
        <form id="addUserForm">
            <label for="userNomAdd">Nom:</label><br>
            <input type="text" id="userNomAdd" name="userNomAdd" required><br>
            <label for="userEmailAdd">Email:</label><br>
            <input type="email" id="userEmailAdd" name="userEmailAdd" required><br>
            <label for="userMot_de_passeAdd">Mot de passe:</label><br>
            <input type="password" id="userMot_de_passeAdd" name="userMot_de_passeAdd" required><br>
            <label for="userId_roleAdd">Rôle:</label><br>
            <input type="number" id="userId_roleAdd" name="userId_roleAdd" required><br>
            <button type="submit">Ajouter Utilisateur</button>
        </form>
    </div>
</div>

<br> <br>

<script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
<script>
    // Ajouter un utilisateur
    document.getElementById('addUserForm').addEventListener('submit', function(event) {
        event.preventDefault();

        const nom = document.getElementById('userNomAdd').value;
        const email = document.getElementById('userEmailAdd').value;
        const mot_de_passe = document.getElementById('userMot_de_passeAdd').value;
        const id_role = document.getElementById('userId_roleAdd').value;

        const headers = {
            'Authorization': 'SUB',
            'Content-Type': 'application/json'
        };

        axios.post('http://localhost:3000/utilisateurs', {
                nom,
                email,
                mot_de_passe,
                id_role
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

    // Modifier un utilisateur
    document.querySelectorAll('[id^="updateUserForm_"]').forEach(form => {
        form.addEventListener('submit', function(event) {
            event.preventDefault();

            // Récupérer l'ID de l'utilisateur associé au formulaire
            const userId = this.querySelector('[name="userIdPatch"]').value;

            // Sélectionner les inputs correspondant à cet utilisateur
            const inputs = document.querySelectorAll(`[data-user-id="${userId}"]`);

            // Créer un objet pour stocker les valeurs des champs
            const userData = {};

            // Parcourir chaque input et ajouter sa valeur à l'objet userData
            inputs.forEach(input => {
                const fieldName = input.getAttribute('data-field');
                const value = input.value;
                userData[fieldName] = value;
            });

            // userData contient maintenant les valeurs des champs du formulaire
            console.log(userData);

            const nom = userData.nom;
            const email = userData.email;
            const mot_de_passe = userData.mot_de_passe;
            const id_role = userData.id_role;

            const headers = {
                'Authorization': 'SUB',
                'Content-Type': 'application/json'
            };

            axios.patch(`http://localhost:3000/utilisateurs/${userId}`, {
                    nom,
                    email,
                    mot_de_passe,
                    id_role
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

    // Supprimer un utilisateur
    document.querySelectorAll('[id^="deleteUserForm_"]').forEach(form => {
        form.addEventListener('submit', function(event) {
            event.preventDefault();

            const userId = this.querySelector('[name="userIdDelete"]').value;

            const headers = {
                'Authorization': 'SUB',
                'Content-Type': 'application/json'
            };

            axios.delete(`http://localhost:3000/utilisateurs/${userId}`, {
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