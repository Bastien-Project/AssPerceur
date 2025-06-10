const sqlite = require('sqlite3').verbose();
const db = new sqlite.Database('AssPerceur.db', sqlite.OPEN_READWRITE, (err) => {
    if (err) {
        console.error(err);
    } else {
        console.log('Connected to the SQLite database.');
    }
});

module.exports = db;