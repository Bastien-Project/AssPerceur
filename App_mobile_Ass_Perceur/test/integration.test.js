const axios = require('axios');

// Test d'intégration
test('Peut récupérer des données utilisateur depuis le backend', () => {
    return axios.get('http://localhost:3000/utilisateurs', {
        headers: {
            'Authorization': 'SUB',
            'Content-Type': 'application/json',
        }
    })
        .then(response => {
            expect(response.status).toBe(200); // Vérifie l'état 200
            expect(response.data).toBeDefined(); // Vérifie si des données ont été renvoyées
        })
});
