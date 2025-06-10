<?php include('admin_header.php');

$routes = [
    'messages' => 'messages',
];

$data = [];
foreach ($routes as $route) {
    $url = 'http://localhost:3000/' . $route;
    $data[$route] = json_decode(file_get_contents($url, false, $context), true);
}
?>

<br> <br>
<div class="form-api">
    <table id="messageTable">
        <thead>
            <tr>
                <th>ID</th>
                <th>Texte</th>
                <th>Image</th>
                <th>Id Utilisateur (expéditeur)</th>
                <th>Id Utilisateur (destinataire)</th>
                <th>Date</th>
            </tr>
        </thead>
        <tbody>
            <?php foreach ($data['messages'] as $message) {
                foreach ($message as $msg) { ?>
                    <tr>
                        <td><?php echo $msg['id']; ?></td>
                        <td>
                            <input type="text" name="texteMessagePatch" data-message-id="<?php echo $msg['id']; ?>" data-field="textMessage" value="<?php echo $msg['texte']; ?>">
                        </td>
                        <td>
                            <input type="text" name="imageMessagePatch" data-message-id="<?php echo $msg['id']; ?>" data-field="imageMessage" value="<?php echo $msg['image']; ?>">
                        </td>
                        <td>
                            <input type="number" name="idUtilisateurExpediteurPatch" data-message-id="<?php echo $msg['id']; ?>" data-field="idUtilisateurExpediteur" value="<?php echo $msg['utilisateur_envoyant_id']; ?>">
                        </td>
                        <td>
                            <input type="number" name="idUtilisateurDestinatairePatch" data-message-id="<?php echo $msg['id']; ?>" data-field="idUtilisateurDestinataire" value="<?php echo $msg['utilisateur_recevant_id']; ?>">
                        </td>
                        <td>
                            <input type="date" name="dateMessagePatch" data-message-id="<?php echo $msg['id']; ?>" data-field="dateMessage" value="<?php echo $msg['date_creation']; ?>">
                        </td>
                        <td>
                            <form id="updateMessageForm_<?php echo $msg['id']; ?>">
                                <input type="hidden" name="messageIdPatch" data-message-id="<?php echo $msg['id']; ?>" data-field="id" value="<?php echo $msg['id']; ?>">
                                <button type="submit">Modifier</button>
                            </form>
                            <form id="deleteMessageForm_<?php echo $msg['id']; ?>">
                                <input type="hidden" name="messageIdDelete" value="<?php echo $msg['id']; ?>">
                                <button type="submit">Supprimer</button>
                            </form>
                        </td>
                    </tr>
            <?php }
            } ?>
        </tbody>
    </table>
</div>

<div class="form-api">
    <div class="add">
        <h2>Ajouter un nouveau message</h2>
        <form id="addMessageForm">
            <label for="messageTextAdd">Texte:</label><br>
            <input type="text" name="messageTextAdd" id="messageTextAdd"><br>
            <label for="messageImageAdd">Image:</label><br>
            <input type="text" name="messageImageAdd" id="messageImageAdd"><br>
            <label for="messageSenderIdAdd">Id Utilisateur (expéditeur):</label><br>
            <input type="number" name="messageSenderIdAdd" id="messageSenderIdAdd" required><br>
            <label for="messageReceiverIdAdd">Id Utilisateur (destinataire):</label><br>
            <input type="number" name="messageReceiverIdAdd" id="messageReceiverIdAdd" required><br>
            <label for="messageDateAdd">Date:</label><br>
            <input type="date" name="messageDateAdd" id="messageDateAdd" required><br>
            <button type="submit">Ajouter message</button>
        </form>
    </div>
</div>

<br> <br>
<script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
<script>
    // Ajouter un message
    document.getElementById('addMessageForm').addEventListener('submit', function(event) {
        event.preventDefault();

        const texte = document.getElementById('messageTextAdd').value;
        const image = document.getElementById('messageImageAdd').value;
        const utilisateur_envoyant_id = document.getElementById('messageSenderIdAdd').value;
        const utilisateur_recevant_id = document.getElementById('messageReceiverIdAdd').value;
        const date_creation = document.getElementById('messageDateAdd').value;

        const headers = {
            'Authorization': 'SUB',
            'Content-Type': 'application/json'
        };

        axios.post('http://localhost:3000/messages', {
                texte,
                image,
                utilisateur_envoyant_id,
                utilisateur_recevant_id,
                date_creation
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

    // Modifier un message
    document.querySelectorAll('form[id^="updateMessageForm_"]').forEach(form => {
        form.addEventListener('submit', function(event) {
            event.preventDefault();

            const messageId = this.querySelector('input[name="messageIdPatch"]').value;

            const inputs = document.querySelectorAll(`input[data-message-id="${messageId}"]`);

            const messageData = {};
            inputs.forEach(input => {
                const field = input.getAttribute('data-field');
                messageData[field] = input.value;
            });

            const texte = messageData.textMessage;
            const image = messageData.imageMessage;
            const utilisateur_envoyant_id = messageData.idUtilisateurExpediteur;
            const utilisateur_recevant_id = messageData.idUtilisateurDestinataire;
            const date_creation = messageData.dateMessage;

            const headers = {
                'Authorization': 'SUB',
                'Content-Type': 'application/json'
            };

            axios.patch(`http://localhost:3000/messages/${messageId}`, {
                    texte,
                    image,
                    utilisateur_envoyant_id,
                    utilisateur_recevant_id,
                    date_creation
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

    // Supprimer un message
    document.querySelectorAll('form[id^="deleteMessageForm_"]').forEach(form => {
        form.addEventListener('submit', function(event) {
            event.preventDefault();

            const messageId = this.querySelector('input[name="messageIdDelete"]').value;

            const headers = {
                'Authorization': 'SUB',
                'Content-Type': 'application/json'
            };

            axios.delete(`http://localhost:3000/messages/${messageId}`, {
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
include("../footer.php"); ?>