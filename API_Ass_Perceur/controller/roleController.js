// roleController.js
const db = require('../config/db');

// Récupérer tous les rôles
const getAllRoles = (req, res) => {
    const query = 'SELECT * FROM role';

    db.all(query, (err, rows) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Erreur lors de la récupération des rôles' });
        } else {
            res.status(200).json({ roles: rows });
        }
    });
};

// Récupérer un rôle par son ID
const getRoleById = (req, res) => {
    const roleId = req.params.id;
    const query = 'SELECT * FROM role WHERE id = ?';

    db.get(query, [roleId], (err, row) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Erreur lors de la récupération du rôle' });
        } else if (!row) {
            res.status  (404).json({ error: 'Rôle non trouvé' });
        } else {
            res.status(200).json({ role: row });
        }
    });
};

// Créer un nouveau rôle
const createRole = (req, res) => {
    const { nom } = req.body;

    // Vérifie que tous les champs nécessaires sont fournis
    if (!nom) {
        return res.status(400).json({ error: 'Veuillez fournir toutes les informations nécessaires pour créer un rôle' });
    }

    const query = 'INSERT INTO role (nom) VALUES (?)';

    db.run(query, [nom], function (err) {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Erreur lors de la création du rôle' });
        }

        const roleId = this.lastID;
        res.status(201).json({ message: 'Rôle créé avec succès', roleId });
    });
};

// Mettre à jour un rôle par son ID
const updateRole = (req, res) => {
    const roleId = req.params.id;
    const { nom } = req.body;

    // Vérifie que tous les champs nécessaires sont fournis
    if (!nom) {
        return res.status(400).json({ error: 'Veuillez fournir toutes les informations nécessaires pour mettre à jour un rôle' });
    }

    const query = 'UPDATE role SET nom = ? WHERE id = ?';

    db.run(query, [nom, roleId], function (err) {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Erreur lors de la mise à jour du rôle' });
        }

        if (this.changes === 0) {
            return res.status(404).json({ error: 'Rôle non trouvé' });
        }

        res.status(200).json({ message: 'Rôle mis à jour avec succès' });
    });
};

// Supprimer un rôle par son ID
const deleteRole = (req, res) => {
    const roleId = req.params.id;
    const query = 'DELETE FROM role WHERE id = ?';

    db.run(query, [roleId], function (err) {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Erreur lors de la suppression du rôle' });
        }

        if (this.changes === 0) {
            return res.status(404).json({ error: 'Rôle non trouvé' });
        }

        res.status(200).json({ message: 'Rôle supprimé avec succès' });
    });
};

// Exporte les fonctions pour les utiliser dans les routes
module.exports = {
    getAllRoles,
    getRoleById,
    createRole,
    updateRole,
    deleteRole
};
