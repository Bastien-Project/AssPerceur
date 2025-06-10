const db = require('../config/db');

// Récupérer toutes les candidatures
const getAllCandidatures = (req, res) => {
    const query = 'SELECT * FROM candidatures';

    db.all(query, (err, rows) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Erreur lors de la récupération des candidatures' });
        } else {
            res.status(200).json({ candidatures: rows });
        }
    });
};

// Créer une nouvelle candidature
const createCandidature = (req, res) => {
    const { annonce_id, candidat_id, responsable_id, accepte } = req.body;


    if (!annonce_id || !candidat_id || !responsable_id || accepte === undefined) {
        return res.status(400).json({ error: 'Veuillez fournir toutes les informations nécessaires pour créer une candidature' });
    }

    const accepteValue = accepte ? 1 : 0;

    const query = 'INSERT INTO candidatures (annonce_id, candidat_id, responsable_id, accepte) VALUES (?, ?, ?, ?)';

    db.run(query, [annonce_id, candidat_id, responsable_id, accepteValue], function (err) {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Erreur lors de la création de la candidature' });
        }

        const candidatureId = this.lastID;
        res.status(201).json({ message: 'Candidature créée avec succès', candidatureId });
    });
};

// Mettre à jour une candidature pour accepter ou refuser
const updateCandidature = (req, res) => {
    const candidatureId = req.params.id;
    const {annonce_id, candidat_id, responsable_id, accepte } = req.body;

    if (!annonce_id || !candidat_id || !responsable_id || accepte === undefined) {
        return res.status(400).json({ error: 'Veuillez fournir toutes les informations nécessaires pour mettre à jour la candidature' });
    }

    const accepteValue = accepte ? 1 : 0;

    const query = 'UPDATE candidatures SET annonce_id = ?, candidat_id = ?, responsable_id = ?, accepte = ? WHERE id = ?';

    db.run(query, [annonce_id, candidat_id, responsable_id, accepteValue, candidatureId], function (err) {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Erreur lors de la mise à jour de la candidature' });
        }

        if (this.changes === 0) {
            return res.status(404).json({ error: 'Candidature non trouvée' });
        }

        res.status(200).json({ message: 'Candidature mise à jour avec succès' });
    });
};

// Supprimer une candidature par son ID
const deleteCandidature = (req, res) => {
    const candidatureId = req.params.id;
    const query = 'DELETE FROM candidatures WHERE id = ?';

    db.run(query, [candidatureId], function (err) {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Erreur lors de la suppression de la candidature' });
        }

        if (this.changes === 0) {
            return res.status(404).json({ error: 'Candidature non trouvée' });
        }

        res.status(200).json({ message: 'Candidature supprimée avec succès' });
    });
};

// Récupérer les candidatures par l'ID du responsable
const getCandidaturesByResponsableId = (req, res) => {
    const responsableId = req.params.id;
    const query = 'SELECT * FROM candidatures WHERE responsable_id = ?';

    db.all(query, [responsableId], (err, rows) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Erreur lors de la récupération des candidatures par l\'ID du responsable' });
        } else {
            res.status(200).json({ candidatures: rows });
        }
    });
};

module.exports = {
    getAllCandidatures,
    createCandidature,
    updateCandidature,
    deleteCandidature,
    getCandidaturesByResponsableId
};
