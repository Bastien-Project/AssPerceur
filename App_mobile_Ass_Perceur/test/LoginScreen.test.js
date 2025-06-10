import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import LoginScreen from '../screens/LoginScreen';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
    setItem: jest.fn(),
}));

// Mock fetch API
global.fetch = jest.fn();

describe('LoginScreen', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should handle login successfully', async () => {
        const setIsLoggedInMock = jest.fn();
        const setUserIdMock = jest.fn();

        // Mock successful login response
        fetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve({ token: 'mockToken' }),
        });

        const { getByPlaceholderText, getByText } = render(
            <LoginScreen setIsLoggedIn={setIsLoggedInMock} setUserId={setUserIdMock} />
        );

        const usernameInput = getByPlaceholderText('Nom d\'utilisateur');
        const passwordInput = getByPlaceholderText('Mot de passe');
        const loginButton = getByText('Se connecter');

        fireEvent.changeText(usernameInput, 'testUser');
        fireEvent.changeText(passwordInput, 'testPassword');
        fireEvent.press(loginButton);

        await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
        expect(fetch).toHaveBeenCalledWith('http://192.168.1.27:3000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            "body": "{\"username\":\"testUser\",\"password\":\"fd5cb51bafd60f6fdbedde6e62c473da6f247db271633e15919bab78a02ee9eb\"}",
        });
        expect(setIsLoggedInMock).toHaveBeenCalledWith(true);
        expect(global.fetch).toHaveBeenCalledTimes(1);
    }, 10000);

});
