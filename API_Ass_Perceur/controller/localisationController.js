// localisationController.js
const db = require('../config/db');

// Récupérer toutes les localisations
const getAllLocalisations = (req, res) => {
    const query = 'SELECT * FROM localisation';

    db.all(query, (err, rows) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Erreur lors de la récupération des localisations' });
        } else {
            res.status(200).json({ localisations: rows });
        }
    });
};

// Récupérer une localisation par son ID
const getLocalisationById = (req, res) => {
    const localisationId = req.params.id;
    const query = 'SELECT * FROM localisation WHERE id = ?';

    db.get(query, [localisationId], (err, row) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Erreur lors de la récupération de la localisation' });
        } else if (!row) {
            res.status  (404).json({ error: 'Localisation non trouvée' });
        } else {
            res.status(200).json({ localisation: row });
        }
    });
};

// Créer une nouvelle localisation
const createLocalisation = (req, res) => {
    const { latitude, longitude, adresse, complement_adresse, ville, code_postal, pays } = req.body;

    // Vérifie que tous les champs nécessaires sont fournis
    if (!latitude || !longitude || !adresse || !ville || !pays) {
        return res.status(400).json({ error: 'Veuillez fournir toutes les informations nécessaires pour créer une localisation' });
    }

    const query = 'INSERT INTO localisation (latitude, longitude, adresse, complement_adresse, ville, code_postal, pays) VALUES (?, ?, ?, ?, ?, ?, ?)';

    db.run(query, [latitude, longitude, adresse, complement_adresse, ville, code_postal, pays], function (err) {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Erreur lors de la création de la localisation' });
        }

        const localisationId = this.lastID;
        res.status(201).json({ message: 'Localisation créée avec succès', localisationId });
    });
};

// Mettre à jour une localisation par son ID
const updateLocalisation = (req, res) => {
    const localisationId = req.params.id;
    const { latitude, longitude, adresse, complement_adresse, ville, code_postal, pays } = req.body;

    // Vérifie que tous les champs nécessaires sont fournis
    if (!latitude || !longitude || !adresse || !complement_adresse || !ville || !code_postal || !pays) {
        return res.status(400).json({ error: 'Veuillez fournir toutes les informations nécessaires pour mettre à jour une localisation' });
    }

    const query = 'UPDATE localisation SET latitude = ?, longitude = ?, adresse = ?, complement_adresse = ?, ville = ?, code_postal = ?, pays = ? WHERE id = ?';

    db.run(query, [latitude, longitude, adresse, complement_adresse, ville, code_postal, pays, localisationId], function (err) {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Erreur lors de la mise à jour de la localisation' });
        }

        if (this.changes === 0) {
            return res.status(404).json({ error: 'Localisation non trouvée' });
        }

        res.status(200).json({ message: 'Localisation mise à jour avec succès' });
    });
};

// Supprimer une localisation par son ID
const deleteLocalisation = (req, res) => {
    const localisationId = req.params.id;
    const query = 'DELETE FROM localisation WHERE id = ?';

    db.run(query, [localisationId], function (err) {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Erreur lors de la suppression de la localisation' });
        }

        if (this.changes === 0) {
            return res.status(404).json({ error: 'Localisation non trouvée' });
        }

        res.status(200).json({ message: 'Localisation supprimée avec succès' });
    });
};

// Trouver la prochaine ID disponible pour une annonce
const findNextlocalisationId = (req, res) => {
    const query = 'SELECT MAX(id) AS max_id FROM localisation';

    db.get(query, (err, row) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Erreur lors de la récupération de la prochaine ID de localisation' });
        } else {
            console.log("ID retourné par la requête SQL :", row ? row.max_id : "Aucun résultat");
            const nextId = row && row.max_id !== null ? row.max_id : 0; // Ne pas incrémenter de 1 si la valeur est nulle
            res.status(200).json({ nextId });
        }
    });
};


// Exporte les fonctions pour les utiliser dans les routes
module.exports = {
    getAllLocalisations,
    getLocalisationById,
    createLocalisation,
    updateLocalisation,
    deleteLocalisation,
    findNextlocalisationId
};
