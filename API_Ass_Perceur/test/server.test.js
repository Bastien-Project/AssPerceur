const request = require('supertest');
const app = require('../server'); // Assurez-vous de spécifier le bon chemin vers votre fichier de serveur

describe('Server Test', () => {

    it('should check if helloworld equals helloworld', () => {
        const helloworld = 'helloworld';
        expect(helloworld).toBe('helloworld');
    });

    it('should test someAsyncOperation', async () => {
        // Si someAsyncOperation est une fonction asynchrone, vous pouvez l'appeler directement avec await
        const result = await someAsyncOperation();
        // Effectuez vos assertions ici sur le résultat de someAsyncOperation
        expect(result).toBe(true); // Par exemple
    });
});
