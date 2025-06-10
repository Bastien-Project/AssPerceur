const express = require('express');
const router = express.Router();

// Import des fonctions de gestion des utilisateurs
const {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
} = require('../controller/utilisateursController');

// Import des fonctions de gestion des annonces
const {
    getAllAnnonces,
    getAnnonceById,
    createAnnonce,
    updateAnnonce,
    deleteAnnonce,
    findNextAnnonceId
} = require('../controller/annonceController');

// Import des fonctions de gestion des rôles
const {
    getAllRoles,
    getRoleById,
    createRole,
    updateRole,
    deleteRole
} = require('../controller/roleController');

// Import des fonctions de gestion des localisations
const {
    getAllLocalisations,
    getLocalisationById,
    createLocalisation,
    updateLocalisation,
    deleteLocalisation,
    findNextlocalisationId
} = require('../controller/localisationController');

// Import des fonctions de gestion des plantes
const {
    getAllPlantes,
    getPlanteById,
    createPlante,
    updatePlante,
    deletePlante
} = require('../controller/planteController');

// Import des fonctions de gestion des messages
const {
    getAllMessages,
    getMessagesByUserId,
    createMessage,
    updateMessage,
    deleteMessage
} = require('../controller/messageController');

// Import des fonctions de gestion des candidater
const {
    getAllCandidatures,
    createCandidature,
    updateCandidature,
    deleteCandidature,
    getCandidaturesByResponsableId
} = require('../controller/candidaterController');

// Routes pour les utilisateurs
router.get('/utilisateurs', getAllUsers);
router.get('/utilisateurs/:id', getUserById);
router.post('/utilisateurs', createUser);
router.patch('/utilisateurs/:id', updateUser);
router.delete('/utilisateurs/:id', deleteUser);

// Routes pour les annonces
router.get('/annonces', getAllAnnonces);
router.get('/annonces/:id', getAnnonceById);
router.post('/annonces', createAnnonce);
router.patch('/annonces/:id', updateAnnonce);
router.delete('/annonces/:id', deleteAnnonce);
router.get('/nextidannonce', findNextAnnonceId);

// Routes pour les rôles
router.get('/roles', getAllRoles);
router.get('/roles/:id', getRoleById);
router.post('/roles', createRole);
router.patch('/roles/:id', updateRole);
router.delete('/roles/:id', deleteRole);

// Routes pour les localisations
router.get('/localisations', getAllLocalisations);
router.get('/localisations/:id', getLocalisationById);
router.post('/localisations', createLocalisation);
router.patch('/localisations/:id', updateLocalisation);
router.delete('/localisations/:id', deleteLocalisation);
router.get('/nextidlocalisations', findNextlocalisationId);

// Routes pour la gestion des plantes
router.get('/plantes', getAllPlantes);
router.get('/plantes/:id', getPlanteById);
router.post('/plantes', createPlante);
router.patch('/plantes/:id', updatePlante);
router.delete('/plantes/:id', deletePlante);

// Routes pour les messages
router.get('/messages', getAllMessages);
router.get('/messages/:userId', getMessagesByUserId);
router.post('/messages', createMessage);
router.patch('/messages/:id', updateMessage);
router.delete('/messages/:id', deleteMessage);

// Routes pour les candidatures
router.get('/candidater', getAllCandidatures);
router.post('/candidater', createCandidature);
router.patch('/candidater/:id', updateCandidature);
router.delete('/candidater/:id', deleteCandidature);
router.get('/candidater/:id', getCandidaturesByResponsableId);

module.exports = router;
