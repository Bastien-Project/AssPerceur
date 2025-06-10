const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
const cors = require('cors');

const jwt = require('jsonwebtoken');
const utilisateursController = require('./controller/utilisateursController');

const logger = require('./logs/logger');
const routes = require('./config/routes');

app.use(bodyParser.json());

app.use(cors());


app.use(verifyToken); // Middleware global pour vérifier le token JWT

// Utilisez les routes
app.use('/', routes);


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '../mobile_ass_perceur/assets'); // Spécifiez le dossier où les images seront stockées
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); // Utilisez le nom d'origine du fichier pour le stocker sur le serveur
    }
});

const upload = multer({ storage: storage });

app.post('/uploadImage', upload.single('image'), (req, res) => {
    try {
        // Traitez l'image ici, par exemple, enregistrer l'emplacement dans une base de données
        console.log('Image téléchargée avec succès :', req.file);
        res.status(200).json({ message: 'Image téléchargée avec succès.' });
    } catch (error) {
        console.error('Erreur lors du traitement de l\'image :', error);
        res.status(500).json({ message: 'Une erreur s\'est produite lors du traitement de l\'image.' });
    }
});


const secretKey = 'B9#zx7@H?4s$6mQ!K#Pw1@z1T!L$m5V'; // Remplacez par votre propre clé secrète

// Middleware pour vérifier le jeton JWT
function verifyToken(req, res, next) {
    const token = req.headers['authorization'];

    // Vérifier si la route est la route de connexion
    if (req.path === '/login' || token === 'SUB') {
        // Si c'est la route de connexion ou si le header Authorization est SUB, passer à la prochaine middleware
        return next();
    }
    
    if (!token) return res.status(403).json({ auth: false, message: 'Token non fourni.' });

    jwt.verify(token.split(' ')[1], secretKey, function(err, decoded) {
        if (err) {
            console.error('Échec de l\'authentification du token :', err.message);
            return res.status(500).json({ auth: false, message: 'Échec de l\'authentification du token.' });
        }

        console.log('Token JWT vérifié avec succès pour l\'utilisateur avec ID :', decoded.id);
        req.userId = decoded.id;
        next();
    });
}


// Endpoint pour gérer l'authentification et générer les jetons JWT
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    // Vérification des informations d'identification de l'utilisateur
    utilisateursController.authenticate(username, password, (err, user) => {
        if (err) {
            return res.status(500).json({ auth: false, message: 'Erreur lors de l\'authentification.' });
        }
        if (!user) {
            return res.status(401).json({ auth: false, message: 'Identifiants incorrects.' });
        }
        // Si les informations sont valides, générez un jeton JWT
        const token = jwt.sign({ id: user.id }, secretKey, { expiresIn: '1h' });
        res.json({ auth: true, token, id:user.id});
    });
});



// Route protégée nécessitant une authentification
app.get('/protectedRoute', verifyToken, (req, res) => {
    // Si le jeton JWT est valide, renvoyer les données protégées
    res.json({ message: 'Ressource protégée' });
});


app.listen(port, () => {
    console.log(`API running on ${port}`);
});
