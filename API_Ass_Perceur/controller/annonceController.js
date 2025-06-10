// annoncesController.js
const db = require('../config/db');

// Récupérer toutes les annonces
const getAllAnnonces = (req, res) => {
    const query = 'SELECT * FROM annonces';

    db.all(query, (err, rows) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Erreur lors de la récupération des annonces' });
        } else {
            res.status(200).json({ annonces: rows });
        }
    });
};

// Récupérer une annonce par son ID
const getAnnonceById = (req, res) => {
    const annonceId = req.params.id;
    const query = 'SELECT * FROM annonces WHERE id = ?';

    db.get(query, [annonceId], (err, row) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Erreur lors de la récupération de l\'annonce' });
        } else if (!row) {
            res.status(404).json({ error: 'Annonce non trouvée' });
        } else {
            res.status(200).json({ annonce: row });
        }
    });
};

// Créer une nouvelle annonce
const createAnnonce = (req, res) => {
    const { idUtilisateur, idListePlantes, idLocalisation, titre, description, dateDebut, dateFin } = req.body;

    if (!idUtilisateur || !idListePlantes || !idLocalisation || !titre || !description || !dateDebut || !dateFin) {
        return res.status(400).json({ error: 'Veuillez fournir toutes les informations nécessaires pour créer une annonce' });
    }

    const query = 'INSERT INTO annonces (idUtilisateur, idListePlantes, idLocalisation, titre, description, dateDebut, dateFin) VALUES (?, ?, ?, ?, ?, ?, ?)';

    db.run(query, [idUtilisateur, idListePlantes, idLocalisation, titre, description, dateDebut, dateFin], function (err) {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Erreur lors de la création de l\'annonce' });
        }

        const annonceId = this.lastID;
        res.status(201).json({ message: 'Annonce créée avec succès', annonceId });
    });
};

// Mettre à jour une annonce par son ID
const updateAnnonce = (req, res) => {
    const annonceId = req.params.id;
    const { idUtilisateur, idListePlantes, idLocalisation, titre, description, dateDebut, dateFin } = req.body;

    if (!idUtilisateur || !idListePlantes || !idLocalisation || !titre || !description || !dateDebut || !dateFin) {
        return res.status(400).json({ error: 'Veuillez fournir toutes les informations nécessaires pour mettre à jour une annonce' });
    }

    const query = 'UPDATE annonces SET idUtilisateur = ?, idListePlantes = ?, idLocalisation = ?, titre = ?, description = ?, dateDebut = ?, dateFin = ? WHERE id = ?';

    db.run(query, [idUtilisateur, idListePlantes, idLocalisation, titre, description, dateDebut, dateFin, annonceId], function (err) {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Erreur lors de la mise à jour de l\'annonce' });
        }

        if (this.changes === 0) {
            return res.status(404).json({ error: 'Annonce non trouvée' });
        }

        res.status(200).json({ message: 'Annonce mise à jour avec succès' });
    });
};

// Supprimer une annonce par son ID
const deleteAnnonce = (req, res) => {
    const annonceId = req.params.id;
    const query = 'DELETE FROM annonces WHERE id = ?';

    db.run(query, [annonceId], function (err) {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Erreur lors de la suppression de l\'annonce' });
        }

        if (this.changes === 0) {
            return res.status(404).json({ error: 'Annonce non trouvée' });
        }

        res.status(200).json({ message: 'Annonce supprimée avec succès' });
    });
};


// Trouver la prochaine ID disponible pour une annonce
const findNextAnnonceId = (req, res) => {
    const query = 'SELECT MAX(id) AS max_id FROM annonces';

    db.get(query, (err, row) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Erreur lors de la récupération de la prochaine ID d\'annonce' });
        } else {
            console.log("ID retourné par la requête SQL :", row ? row.max_id : "Aucun résultat");
            // Si aucune annonce n'existe encore, la prochaine ID sera 1
            const nextId = row && row.max_id !== null ? row.max_id + 1 : 1;
            res.status(200).json({ nextId });
        }
    });
};

// Exporte les fonctions pour les utiliser dans les routes
module.exports = {
    getAllAnnonces,
    getAnnonceById,
    createAnnonce,
    updateAnnonce,
    deleteAnnonce,
    findNextAnnonceId,
};