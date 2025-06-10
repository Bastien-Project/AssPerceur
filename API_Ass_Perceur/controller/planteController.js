// planteController.js
const db = require('../config/db');

// Récupérer toutes les plantes
const getAllPlantes = (req, res) => {
    const query = 'SELECT * FROM plante';

    db.all(query, (err, rows) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Erreur lors de la récupération des plantes' });
        } else {
            res.status(200).json({ plantes: rows });
        }
    });
};

// Récupérer une plante par son ID
const getPlanteById = (req, res) => {
    const planteId = req.params.id;
    const query = 'SELECT * FROM plante WHERE id = ?';

    db.get(query, [planteId], (err, row) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Erreur lors de la récupération de la plante' });
        } else if (!row) {
            res.status(404).json({ error: 'Plante non trouvée' });
        } else {
            res.status(200).json({ plante: row });
        }
    });
};

// Créer une nouvelle plante
const createPlante = (req, res) => {
    const { nom, description, famille, genre, espece, photo_url, date_plantation, date_recolte, commentaire } = req.body;

    // Vérifie que tous les champs nécessaires sont fournis
    if (!nom || !description || !famille || !genre || !espece || !photo_url || !date_plantation || !date_recolte || !commentaire) {
        return res.status(400).json({ error: 'Veuillez fournir tous les champs nécessaires' });
    }

    const query = 'INSERT INTO plante (nom, description, famille, genre, espece, photo_url, date_plantation, date_recolte, commentaire) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';

    db.run(query, [nom, description, famille, genre, espece, photo_url, date_plantation, date_recolte, commentaire], function (err) {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Erreur lors de la création de la plante' });
        }

        const planteId = this.lastID;
        res.status(201).json({ message: 'Plante créée avec succès', planteId });
    });
};

// Mettre à jour une plante par son ID
const updatePlante = (req, res) => {
    const planteId = req.params.id;
    const { nom, description, famille, genre, espece, photo_url, date_plantation, date_recolte, commentaire } = req.body;

    // Vérifie que le nom de la plante est fourni
    if (!nom || !description || !famille || !genre || !espece || !photo_url || !date_plantation || !date_recolte || !commentaire) {
        return res.status(400).json({ error: 'Veuillez fournir le nom de la plante' });
    }

    const query = 'UPDATE plante SET nom = ?, description = ?, famille = ?, genre = ?, espece = ?, photo_url = ?, date_plantation = ?, date_recolte = ?, commentaire = ? WHERE id = ?';

    db.run(query, [nom, description, famille, genre, espece, photo_url, date_plantation, date_recolte, commentaire, planteId], function (err) {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Erreur lors de la mise à jour de la plante' });
        }

        if (this.changes === 0) {
            return res.status(404).json({ error: 'Plante non trouvée' });
        }

        res.status(200).json({ message: 'Plante mise à jour avec succès' });
    });
};

// Supprimer une plante par son ID
const deletePlante = (req, res) => {
    const planteId = req.params.id;
    const query = 'DELETE FROM plante WHERE id = ?';

    db.run(query, [planteId], function (err) {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Erreur lors de la suppression de la plante' });
        }

        if (this.changes === 0) {
            return res.status(404).json({ error: 'Plante non trouvée' });
        }

        res.status(200).json({ message: 'Plante supprimée avec succès' });
    });
};

// Exporte les fonctions pour les utiliser dans les routes
module.exports = {
    getAllPlantes,
    getPlanteById,
    createPlante,
    updatePlante,
    deletePlante
};
