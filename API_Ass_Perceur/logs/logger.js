const winston = require('winston');
const { combine, timestamp, printf } = winston.format;
const path = require('path');

// Création d'un formateur de journal personnalisé
const logFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level}: ${message}`;
});

// Configuration du logger pour écrire dans un fichier
const logger = winston.createLogger({
  level: 'info',
  format: combine(
    timestamp(),
    logFormat
  ),
  transports: [
    new winston.transports.File({ filename: path.join(__dirname, './', 'app.log') })
  ]
});

// Utilisation du logger
logger.info('Logger démarré avec succès');

