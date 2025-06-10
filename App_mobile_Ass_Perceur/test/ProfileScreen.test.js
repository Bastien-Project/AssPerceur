import { render, fireEvent, waitFor } from '@testing-library/react-native';
import React from 'react';
import ProfileScreen from '../screens/ProfileScreen';

// Mock de AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
    getItem: jest.fn().mockResolvedValue('mockToken'),
}));

// Mock de fetch
global.fetch = jest.fn();

describe('ProfileScreen', () => {
    // Test pour vérifier que les données de l'utilisateur sont récupérées et affichées correctement
    it('should fetch user data and display it correctly', async () => {
        // Mock de la réponse
        fetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve({ nom: 'John Doe', email: 'john@example.com' }),
        });

        const { getByText } = render(<ProfileScreen userId="123" />);

        await waitFor(() => {
            expect(getByText('Nom: John Doe')).toBeTruthy();
            expect(getByText('Email: john@example.com')).toBeTruthy();
        });
    });
});
