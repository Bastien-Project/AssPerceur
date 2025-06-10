// utilisateursController.js
const db = require('../config/db'); // Assurez-vous de créer un fichier db.js pour la gestion de la base de données

const getAllUsers = (req, res) => {
    const query = 'SELECT * FROM utilisateur';

    db.all(query, (err, rows) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Erreur lors de la récupération des utilisateurs' });
        } else {
            res.status(200).json({ utilisateurs: rows });
        }
    });
};

const getUserById = (req, res) => {
    const userId = req.params.id;
    const query = 'SELECT * FROM utilisateur WHERE id = ?';

    db.get(query, [userId], (err, row) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Erreur lors de la récupération de l\'utilisateur' });
        } else if (!row) {
            res.status(404).json({ error: 'Utilisateur non trouvé' });
        } else {
            res.status(200).json({ utilisateur: row });
        }
    });
};

const createUser = (req, res) => {
    const { nom, email, mot_de_passe, id_role } = req.body;

    if (!nom || !email || !mot_de_passe || !id_role) {
        return res.status(400).json({ error: 'Veuillez fournir un nom, un email et un mot de passe' });
    }

    const query = 'INSERT INTO utilisateur (nom, email, mot_de_passe, id_role) VALUES (?, ?, ?, ?)';

    db.run(query, [nom, email, mot_de_passe, id_role], function (err) {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Erreur lors de la création de l\'utilisateur' });
        }

        const userId = this.lastID; // Récupère l'ID du nouvel utilisateur créé
        res.status(201).json({ message: 'Utilisateur créé avec succès', userId });
    });
};

const updateUser = (req, res) => {
    const userId = req.params.id;
    const { nom, email, mot_de_passe, id_role } = req.body;

    if (!nom || !email || !mot_de_passe || !id_role) {
        return res.status(400).json({ error: 'Veuillez fournir un nom, un email et un mot de passe' });
    }

    const query = 'UPDATE utilisateur SET nom = ?, email = ?, mot_de_passe = ?, id_role = ? WHERE id = ?';

    db.run(query, [nom, email, mot_de_passe, id_role, userId], function (err) {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Erreur lors de la mise à jour de l\'utilisateur' });
        }

        if (this.changes === 0) {
            return res.status(404).json({ error: 'Utilisateur non trouvé' });
        }

        res.status(200).json({ message: 'Utilisateur mis à jour avec succès' });
    });
};

const deleteUser = (req, res) => {
    const userId = req.params.id;
    const query = 'DELETE FROM utilisateur WHERE id = ?';

    db.run(query, [userId], function (err) {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Erreur lors de la suppression de l\'utilisateur' });
        }

        if (this.changes === 0) {
            return res.status(404).json({ error: 'Utilisateur non trouvé' });
        }

        res.status(200).json({ message: 'Utilisateur supprimé avec succès' });
    });
};

function authenticate(username, password, callback) {
    const query = 'SELECT * FROM utilisateur WHERE nom = ? AND mot_de_passe = ?';
    db.get(query, [username, password], (err, row) => {
        if (err) {
            console.error(err);
            return callback(err);
        }
        return callback(null, row);
    });
}


module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    authenticate
};
