const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const logger = require('../logs/logger');

// Chemin vers la base de données SQLite
const dbPath = path.resolve(__dirname, '..', 'AssPerceur.db');

// Vérifier si le fichier de base de données existe déjà
if (!fs.existsSync(dbPath)) {
    console.log('La base de données n\'existe pas. Création en cours...');
    fs.closeSync(fs.openSync(dbPath, 'w'));
}

// Création d'une nouvelle instance de base de données SQLite
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.error('Erreur lors de la connexion à la base de données :', err.message);
    } else {
        console.log('Connexion à la base de données SQLite réussie.');
    }
});

// Script de création des tables.
const createTableUtilisateur = `
    CREATE TABLE IF NOT EXISTS utilisateur (
        id INTEGER PRIMARY KEY,
        nom TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        mot_de_passe TEXT NOT NULL,
        id_role INTEGER
    );
`;

const createTableRole = `
    CREATE TABLE IF NOT EXISTS role (
        id INTEGER PRIMARY KEY,
        nom TEXT NOT NULL
    );
`;

const createTableAnnonce = `
    CREATE TABLE IF NOT EXISTS annonces (
        id INTEGER PRIMARY KEY,
        idUtilisateur INTEGER NOT NULL,
        idListePlantes TEXT NOT NULL,
        idLocalisation INTEGER NOT NULL,
        titre TEXT NOT NULL,
        description TEXT NOT NULL,
        dateDebut TEXT NOT NULL,
        dateFin TEXT NOT NULL,
        FOREIGN KEY (idUtilisateur) REFERENCES utilisateur(id), 
        FOREIGN KEY (idListePlantes) REFERENCES plante(id),
        FOREIGN KEY (idLocalisation) REFERENCES localisation(id) 
    );
`;

const createTablePlante = `
    CREATE TABLE IF NOT EXISTS plante (
        id INTEGER PRIMARY KEY,
        nom TEXT NOT NULL,
        description TEXT,
        famille TEXT,
        genre TEXT,
        espece TEXT,
        photo_url TEXT,
        date_plantation DATE,
        date_recolte DATE,
        commentaire TEXT
    );
`;

const createTableLocalisation = `
    CREATE TABLE IF NOT EXISTS localisation (
        id INTEGER PRIMARY KEY,
        latitude REAL NOT NULL,
        longitude REAL NOT NULL,
        adresse TEXT,
        complement_adresse TEXT,
        ville TEXT,
        code_postal TEXT,
        pays TEXT
    );
`;

const createTableMessages = `
    CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        texte TEXT,
        image VARCHAR(255),
        utilisateur_envoyant_id INT,
        utilisateur_recevant_id INT,
        date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (utilisateur_envoyant_id) REFERENCES utilisateur(id),
        FOREIGN KEY (utilisateur_recevant_id) REFERENCES utilisateur(id)
    );
`;

const createTableCandidater = `
    CREATE TABLE IF NOT EXISTS candidatures (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        annonce_id INT NOT NULL,
        candidat_id INT NOT NULL,
        responsable_id INT NOT NULL,
        accepte BOOLEAN DEFAULT FALSE,
        FOREIGN KEY (annonce_id) REFERENCES annonces(id),
        FOREIGN KEY (candidat_id) REFERENCES utilisateur(id),
        FOREIGN KEY (responsable_id) REFERENCES utilisateur(id)
    );
`;

//Insertion Data.
const insertDefaultDataRole = `
    INSERT INTO role (nom) VALUES ('admin');
`;

const insertDefaultDataUtilisateur = `
    INSERT INTO utilisateur (nom,email,mot_de_passe,id_role) VALUES("admin","admin@admin.com","admin",1);
`;

const insertDefaultDataPlante = `
INSERT INTO plante (nom, description, famille, genre, espece, photo_url, date_plantation, date_recolte, commentaire)
VALUES
    ('Rose', 'La rose est une fleur très populaire et symbolise l''amour et la passion. Elle appartient à la famille des Rosaceae.', 'Rosaceae', 'Rosa', 'Rosa gallica', 'https://example.com/rose.jpg', '2024-02-22', '2024-08-22', 'Fleur très parfumée'),
	('Tournesol', 'Le tournesol est une plante annuelle appartenant à la famille des Asteraceae. Elle est connue pour suivre la trajectoire du soleil.', 'Asteraceae', 'Helianthus', 'Helianthus annuus', 'https://example.com/tournesol.jpg', '2024-03-01', '2024-09-30', 'Nécessite beaucoup de soleil'),
    ('Lavande', 'La lavande est une plante vivace appartenant à la famille des Lamiaceae. Elle est utilisée pour ses propriétés aromatiques et médicinales.', 'Lamiaceae', 'Lavandula', 'Lavandula angustifolia', 'https://example.com/lavande.jpg', '2024-03-15', '2024-09-15', 'Attire les abeilles'),
    ('Basilic', 'Le basilic est une plante annuelle aromatique appartenant à la famille des Lamiaceae. Il est largement utilisé en cuisine.', 'Lamiaceae', 'Ocimum', 'Ocimum basilicum', 'https://example.com/basilic.jpg', '2024-04-01', '2024-09-30', 'Herbe aromatique populaire'),
    ('Orchidée', 'L''orchidée est une plante appartenant à la famille des Orchidaceae. Elle est appréciée pour ses fleurs exotiques et sa variété de formes.', 'Orchidaceae', 'Orchidaceae', 'Phalaenopsis', 'https://example.com/orchidee.jpg', '2024-02-15', '2024-08-15', 'Requiert des soins spécifiques'),
    ('Fougère', 'La fougère est une plante non fleurie appartenant à la famille des Polypodiaceae. Elle est appréciée pour son feuillage décoratif.', 'Polypodiaceae', 'Polypodiaceae', 'Polypodium', 'https://example.com/fougere.jpg', '2024-03-10', '2024-09-10', 'Idéale pour les coins ombragés'),
    ('Tulipe', 'La tulipe est une plante bulbeuse appartenant à la famille des Liliaceae. Elle est appréciée pour ses fleurs vives et variées.', 'Liliaceae', 'Tulipa', 'Tulipa gesneriana', 'https://example.com/tulipe.jpg', '2024-02-25', '2024-05-15', 'Fleur emblématique des Pays-Bas'),
    ('Cactus', 'Le cactus est une plante succulente adaptée à des conditions arides. Il appartient à la famille des Cactaceae.', 'Cactaceae', 'Cactaceae', 'Opuntia', 'https://example.com/cactus.jpg', '2024-04-15', '2024-10-15', 'Nécessite peu d''eau'),
    ('Tomate', 'La tomate est une plante annuelle appartenant à la famille des Solanaceae. Elle est largement cultivée pour ses fruits comestibles.', 'Solanaceae', 'Solanum', 'Solanum lycopersicum', 'https://example.com/tomate.jpg', '2024-03-20', '2024-08-31', 'Peut être cultivée en pot'),
    ('Oranger', 'L''oranger est un arbre fruitier appartenant à la famille des Rutaceae. Il est cultivé pour ses fruits juteux et parfumés.', 'Rutaceae', 'Citrus', 'Citrus sinensis', 'https://example.com/oranger.jpg', '2024-01-15', '2024-12-15', 'Nécessite beaucoup de soleil'),
    ('Menthe', 'La menthe est une plante vivace aromatique appartenant à la famille des Lamiaceae. Elle est utilisée en cuisine et en médecine traditionnelle.', 'Lamiaceae', 'Mentha', 'Mentha piperita', 'https://example.com/menthe.jpg', '2024-03-01', '2024-09-30', 'Utilisée pour les boissons rafraîchissantes'),
    ('Bambou', 'Le bambou est une plante à croissance rapide appartenant à la famille des Poaceae. Il est utilisé comme matériau de construction et décoratif.', 'Poaceae', 'Bambusa', 'Bambusa vulgaris', 'https://example.com/bambou.jpg', '2024-02-29', '2024-10-31', 'Nécessite une croissance contrôlée'),
    ('Chrysanthème', 'Le chrysanthème est une plante vivace appartenant à la famille des Asteraceae. Elle est appréciée pour ses fleurs variées.', 'Asteraceae', 'Chrysanthemum', 'Chrysanthemum morifolium', 'https://example.com/chrysantheme.jpg', '2024-03-05', '2024-11-15', 'Fleur de saison automnale'),
    ('Bégonia', 'Le bégonia est une plante annuelle ou vivace appartenant à la famille des Begoniaceae. Il est apprécié pour ses fleurs colorées.', 'Begoniaceae', 'Begonia', 'Begonia x semperflorens-cultorum', 'https://example.com/begonia.jpg', '2024-03-10', '2024-10-15', 'Idéal pour les jardinières'),
    ('Pivoine', 'La pivoine est une plante vivace appartenant à la famille des Paeoniaceae. Elle est appréciée pour ses grandes fleurs et son parfum.', 'Paeoniaceae', 'Paeonia', 'Paeonia lactiflora', 'https://example.com/pivoine.jpg', '2024-03-15', '2024-06-30', 'Fleur de saison printanière'),
    ('Olivier', 'L''olivier est un arbre fruitier appartenant à la famille des Oleaceae. Il est cultivé pour ses fruits, les olives, et son huile.', 'Oleaceae', 'Olea', 'Olea europaea', 'https://example.com/olivier.jpg', '2024-01-20', '2024-12-31', 'Symbole de paix et de sagesse'),
    ('Jasmin', 'Le jasmin est une plante grimpante appartenant à la famille des Oleaceae. Il est apprécié pour ses fleurs blanches très parfumées.', 'Oleaceae', 'Jasminum', 'Jasminum officinale', 'https://example.com/jasmin.jpg', '2024-04-01', '2024-10-31', 'Parfume délicatement le jardin'),
    ('Aloe Vera', 'L''aloès est une plante succulente appartenant à la famille des Asphodelaceae. Elle est utilisée pour ses propriétés médicinales.', 'Asphodelaceae', 'Aloe', 'Aloe vera', 'https://example.com/aloe.jpg', '2024-03-15', '2024-12-15', 'Apaise les brûlures et les irritations de la peau'),
    ('Magnolia', 'Le magnolia est un arbre ou un arbuste à feuilles caduques ou persistantes appartenant à la famille des Magnoliaceae. Il est apprécié pour ses grandes fleurs parfumées.', 'Magnoliaceae', 'Magnolia', 'Magnolia grandiflora', 'https://example.com/magnolia.jpg', '2024-02-20', '2024-06-30', 'Arbre d''ornement très décoratif'),
    ('Dahlia', 'Le dahlia est une plante vivace appartenant à la famille des Asteraceae. Elle est cultivée pour ses fleurs colorées et sa diversité de formes.', 'Asteraceae', 'Dahlia', 'Dahlia x hortensis', 'https://example.com/dahlia.jpg', '2024-03-01', '2024-10-15', 'Fleur de saison estivale'),
    ('Sauge', 'La sauge est une plante vivace appartenant à la famille des Lamiaceae. Elle est utilisée comme plante aromatique et médicinale.', 'Lamiaceae', 'Salvia', 'Salvia officinalis', 'https://example.com/sauge.jpg', '2024-03-10', '2024-09-30', 'Utilisée en cuisine et en médecine'),
    ('Palmier', 'Le palmier est un arbre caractéristique des régions tropicales et subtropicales. Il appartient à la famille des Arecaceae.', 'Arecaceae', 'Arecaceae', 'Cocos nucifera', 'https://example.com/palmier.jpg', '2024-04-15', '2024-10-15', 'Symbole de vacances et de détente'),
    ('Cerisier', 'Le cerisier est un arbre fruitier appartenant à la famille des Rosaceae. Il est cultivé pour ses fruits, les cerises.', 'Rosaceae', 'Prunus', 'Prunus avium', 'https://example.com/cerisier.jpg', '2024-03-20', '2024-06-30', 'Fruit délicieux en été'),
    ('Hortensia', 'L''hortensia est un arbuste à fleurs appartenant à la famille des Hydrangeaceae. Il est apprécié pour ses grandes fleurs colorées.', 'Hydrangeaceae', 'Hydrangea', 'Hydrangea macrophylla', 'https://example.com/hortensia.jpg', '2024-03-15', '2024-08-31', 'Fleur d''ornement pour les jardins'),
    ('Bleuet', 'Le bleuet est une plante annuelle appartenant à la famille des Caprifoliaceae. Elle est cultivée pour ses fruits, les bleuets.', 'Caprifoliaceae', 'Vaccinium', 'Vaccinium corymbosum', 'https://example.com/bleuet.jpg', '2024-04-01', '2024-08-31', 'Délicieux en confiture et en pâtisserie');
`;

// Fonction pour exécuter une requête SQL avec des paramètres
function runQuery(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function (err) {
            if (err) {
                reject(err.message);
            } else {
                resolve(this.lastID);
            }
        });
    });
}

// Exécution du script de création de la table
async function createTable() {
    try {
        // Table Utilisateur
        await runQuery(createTableUtilisateur);
        console.log('Table "Utilisateur" créée avec succès.');
        // Table Role
        await runQuery(createTableRole);
        console.log('Table "Role" créée avec succès.');
        // Table Annonce
        await runQuery(createTableAnnonce);
        console.log('Table "Annonce" créée avec succès.')
        // Table Plante
        await runQuery(createTablePlante);
        console.log('Table "Plante" créée avec succès.')
        // Table Localisation
        await runQuery(createTableLocalisation);
        console.log('Table "Localisation" créée avec succès.')
        // Table Messages
        await runQuery(createTableMessages);
        console.log('Table "Messages" créée avec succès.')
        // Table Candidater
        await runQuery(createTableCandidater);
        console.log('Table "Candidater" créée avec succès.')

        // Insertion valeurs Role Admin
        await runQuery(insertDefaultDataRole);
        console.log('Insertion des données par défault "Role" avec succès.');
        // Insertion valeurs Utilisateur
        await runQuery(insertDefaultDataUtilisateur);
        console.log('Insertion des données par défault "Utilisateur" avec succès.');
        // Insertion valeurs Plante
        await runQuery(insertDefaultDataPlante);
        console.log('Insertion des données par défault "Plante" avec succès.');

    } catch (error) {
        console.error('Erreur lors de la création de la table :', error);
    } finally {
        db.close((err) => {
            if (err) {
                return console.error('Erreur lors de la fermeture de la connexion à la base de données :', err.message);
            }
            console.log('Connexion à la base de données SQLite fermée avec succès.');
        });
    }
}

// Appel de la fonction pour créer la table
createTable();
