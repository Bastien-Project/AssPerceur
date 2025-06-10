const db = require('../config/db');

// Récupérer tous les messages
const getAllMessages = (req, res) => {
    const query = 'SELECT * FROM messages';

    db.all(query, (err, rows) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Erreur lors de la récupération des messages' });
        } else {
            res.status(200).json({ messages: rows });
        }
    });
};



const getMessagesByUserId = (req, res) => {
    const userId = req.params.userId;
    const query = 'SELECT * FROM messages WHERE utilisateur_recevant_id = ? OR utilisateur_envoyant_id = ?';

    db.all(query, [userId, userId], (err, rows) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Erreur lors de la récupération des messages' });
        } else {
            res.status(200).json({ messages: rows });
        }
    });
};

// Créer un nouveau message
const createMessage = (req, res) => {
    const { texte, image, utilisateur_envoyant_id, utilisateur_recevant_id, date_creation } = req.body;

    const texteValue = texte || "null";
    const imageValue = image || "null";

    if (!utilisateur_envoyant_id || !utilisateur_recevant_id || !date_creation) {
        return res.status(400).json({ error: 'Veuillez fournir toutes les informations nécessaires pour créer un message' });
    }

    const query = 'INSERT INTO messages (texte, image, utilisateur_envoyant_id, utilisateur_recevant_id, date_creation) VALUES (?, ?, ?, ?, ?)';

    db.run(query, [texteValue, imageValue, utilisateur_envoyant_id, utilisateur_recevant_id, date_creation], function (err) {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Erreur lors de la création du message' });
        }
        const messageId = this.lastID;
        res.status(201).json({ message: 'Message créé avec succès', messageId });
    });
};

// Mettre à jour un message par son ID
const updateMessage = (req, res) => {
    const messageId = req.params.id;
    const { texte, image, utilisateur_envoyant_id, utilisateur_recevant_id, date_creation } = req.body;

    const texteValue = texte || "null";
    const imageValue = image || "null";

    if (!utilisateur_envoyant_id || !utilisateur_recevant_id || !date_creation) {
        return res.status(400).json({ error: 'Veuillez fournir toutes les informations nécessaires pour mettre à jour un message' });
    }

    const query = 'UPDATE messages SET texte = ?, image = ?, utilisateur_envoyant_id = ?, utilisateur_recevant_id = ?, date_creation = ? WHERE id = ?';

    db.run(query, [texteValue, imageValue, utilisateur_envoyant_id, utilisateur_recevant_id, date_creation, messageId], function (err) {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Erreur lors de la mise à jour du message' });
        }

        if (this.changes === 0) {
            return res.status(404).json({ error: 'Message non trouvé' });
        }

        res.status(200).json({ message: 'Message mis à jour avec succès' });
    });
};

// Supprimer un message par son ID
const deleteMessage = (req, res) => {
    const messageId = req.params.id;
    const query = 'DELETE FROM messages WHERE id = ?';

    db.run(query, [messageId], function (err) {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Erreur lors de la suppression du message' });
        }

        if (this.changes === 0) {
            return res.status(404).json({ error: 'Message non trouvé' });
        }

        res.status(200).json({ message: 'Message supprimé avec succès' });
    });
};

// Exporte les fonctions pour les utiliser dans les routes
module.exports = {
    getAllMessages,
    getMessagesByUserId,
    createMessage,
    updateMessage,
    deleteMessage,
};
