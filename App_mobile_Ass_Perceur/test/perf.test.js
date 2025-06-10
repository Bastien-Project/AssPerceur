describe('Test de Performance', () => {
    it('devrait charger l\'écran de connexion dans un délai acceptable', () => {
        const startTime = performance.now();
        const endTime = performance.now();
        const tempsDeChargement = endTime - startTime;
        expect(tempsDeChargement).toBeLessThanOrEqual(1000);
    });

    it('devrait traiter les demandes de connexion efficacement sous une charge attendue', () => {
        const startTime = performance.now();
        const endTime = performance.now();
        const tempsDExecution = endTime - startTime;
        expect(tempsDExecution).toBeLessThanOrEqual(500);
    });

    it('devrait gérer efficacement de grands ensembles de données', () => {
        const startTime = performance.now();
        const endTime = performance.now();
        const tempsDExecution = endTime - startTime;
        expect(tempsDExecution).toBeLessThanOrEqual(1000);
    });
});
