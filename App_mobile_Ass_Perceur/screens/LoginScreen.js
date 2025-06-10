import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert, ScrollView } from 'react-native';
import API_IP from '../config/config';
import CryptoJS from 'crypto-js'; // Importez CryptoJS

const LoginScreen = ({ setIsLoggedIn, setUserId }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [legalAccepted, setLegalAccepted] = useState(false);
  const [showLegalPopup, setShowLegalPopup] = useState(false); // Pour afficher les mentions légales
  const [showPasswordResetPopup, setShowPasswordResetPopup] = useState(false); // Ajout de l'état pour gérer l'affichage du popup de récupération de mot de passe
  const [resetEmail, setResetEmail] = useState(''); // Ajout de l'état pour stocker l'adresse e-mail saisie pour la récupération de mot de passe

  // Fonction pour ouvrir le popup de récupération de mot de passe
  const handleForgotPassword = () => {
    setShowPasswordResetPopup(true);
  };

  // Fonction pour fermer le popup de récupération de mot de passe
  const handleClosePasswordReset = () => {
    setShowPasswordResetPopup(false);
  };

  // Fonction pour gérer la saisie de l'adresse e-mail pour la récupération de mot de passe
  const handleResetEmailChange = (text) => {
    setResetEmail(text);
  };


  const hashPassword = (password) => {
    return CryptoJS.SHA256(password).toString();
  };

  const isStrongPassword = (password) => {
    return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{7,}$/.test(password);
  };

  const handleLogin = async () => {
    try {
      const hashedPassword = hashPassword(password);
      const response = await fetch(`http://${API_IP}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password: hashedPassword })
      });

      const data = await response.json();

      if (response.ok) {
        await AsyncStorage.setItem('userToken', data.token);
        setUserId(data.id);
        setIsLoggedIn(true);
      } else {
        throw new Error(data.message || 'Erreur lors de la connexion');
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleSignup = () => {
    if (!legalAccepted) {
      Alert.alert('Mentions Légales', 'Veuillez accepter les mentions légales pour continuer.');
      return;
    }
    if (!isStrongPassword(password)) {
      Alert.alert('Mot de passe faible', 'Le mot de passe doit contenir au moins 8 caractères, une majuscule et un chiffre.');
      return;
    }
    fetch(`http://${API_IP}/utilisateurs`, {
      method: 'POST',
      headers: {
        'Authorization': 'SUB',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nom: username,
        email: email,
        mot_de_passe: hashPassword(password),
      }),
    })
      .then(response => {
        if (response.ok) {
          setIsSignup(false);
          setUsername('');
          setEmail('');
          setPassword('');
          setError('');
        } else {
          throw new Error('Erreur lors de l\'inscription');
        }
      })
      .catch(error => {
        setError(error.message);
      });
  };

  const toggleSignup = () => {
    setIsSignup(!isSignup);
  };

  const handleLegalPopup = () => {
    setShowLegalPopup(true);
  };
  const handlePasswordReset  = async () => {
    try {
        const response = await fetch(`http://${API_IP}/messages`, {
            method: 'POST',
            headers: {
                'Authorization': 'SUB',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                texte: 'Change le mot de passe de cette adresse mail : '+resetEmail,
                image: '',
                utilisateur_envoyant_id: 7,
                utilisateur_recevant_id: 7,
                date_creation: new Date().toISOString(),
            }),
        });
        if (response.ok) {
            console.log('Message de suppression envoyé avec succès.');
        } else {
            console.error('Erreur lors de la création de la conversation');
        }
    } catch (error) {
        console.error('Erreur lors de la création de la conversation :', error);
    }
    setShowPasswordResetPopup(false);
  }

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={require('../assets/logo.png')} style={styles.logo} resizeMode="contain" />
      </View>
      <Text style={styles.title}>{isSignup ? 'Inscription' : 'Connexion'}</Text>
      {isSignup && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
          />
        </>
      )}
      <TextInput
        style={styles.input}
        placeholder="Nom d'utilisateur"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true}
      />
            <Text style={styles.passwordFormatText}>{isSignup ? 'Le mot de passe doit contenir au moins 8 caractères, une majuscule et un chiffre.': ''}</Text>
      {isSignup && (
      <View style={styles.checkboxContainer}>
            <TouchableOpacity onPress={() => setLegalAccepted(!legalAccepted)}>
              <View style={[styles.checkbox, legalAccepted ? styles.checked : null]} />
            </TouchableOpacity>
            <Text style={styles.checkboxText}>J'accepte les <Text style={styles.legalText} onPress={handleLegalPopup}>mentions légales</Text></Text>
          </View>
          )}
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TouchableOpacity style={styles.button} onPress={isSignup ? handleSignup : handleLogin}>
        <Text style={styles.buttonText}>{isSignup ? 'S\'inscrire' : 'Se connecter'}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={toggleSignup}>
        <Text style={styles.signupText}>
          {isSignup ? 'Déjà un compte ? Se connecter' : 'Pas encore de compte ? S\'inscrire'}
        </Text>
      </TouchableOpacity>
      {!isSignup && (
        <TouchableOpacity onPress={handleForgotPassword}>
          <Text style={styles.forgotPasswordText}>J'ai oublié mon mot de passe</Text>
        </TouchableOpacity>
      )}
      {/* Affichage des mentions légales */}
      {showLegalPopup && (
        <ScrollView style={styles.legalPopup}>
          <Text style={styles.legalContent}>
          1. Éditeur de l'application : L'application "Ass-Perceur" est éditée par la société Ass-Perceur.{'\n'}
          {'\n'}
          2. Directeur de la publication : Les directeurs de la publication de l'application "Ass-Perceur" sont Pierre LEDEUIL, Sébastien COLIN, Amyne EL AICHOUNI et Bastien THOMAS.{'\n'}
          {'\n'}
          3. Propriété intellectuelle : Tous les éléments constitutifs de l'application "Ass-Perceur", tels que les textes, les graphiques, les logos, les images, les vidéos, les sons, les marques, ainsi que la structure générale de l'application, sont la propriété exclusive de la société Ass-Perceur. Toute reproduction, représentation, modification, publication, transmission ou adaptation, même partielle, de ces éléments est strictement interdite sans l'autorisation préalable écrite de l'éditeur.{'\n'}
          {'\n'}
          4. Protection des données personnelles : L'application "Ass-Perceur" collecte et traite des données personnelles dans le respect de la législation en vigueur, notamment du Règlement Général sur la Protection des Données (RGPD). Pour plus d'informations sur la collecte, le traitement et l'utilisation de vos données personnelles, veuillez consulter notre Politique de Confidentialité.{'\n'}
          {'\n'}
          5. Cookies : L'application "Ass-Perceur" utilise des cookies afin d'améliorer l'expérience utilisateur et de collecter des données statistiques sur l'utilisation de l'application. En naviguant sur l'application, vous consentez à l'utilisation de ces cookies. Vous avez la possibilité de refuser l'installation de cookies en modifiant les paramètres de votre navigateur.{'\n'}
          {'\n'}
          6. Limitation de responsabilité : L'éditeur de l'application "Ass-Perceur" met tout en œuvre pour assurer l'exactitude et la mise à jour des informations diffusées sur l'application, mais ne saurait être tenu pour responsable des erreurs, omissions ou indisponibilités constatées. L'éditeur décline toute responsabilité quant à l'utilisation qui pourrait être faite des informations et contenus disponibles sur l'application.{'\n'}
          {'\n'}
          7. Droit applicable et juridiction compétente : Les présentes mentions légales sont soumises au droit français. En cas de litige, les tribunaux français seront seuls compétents.{'\n'}
          {'\n'}
          Pour toute question ou réclamation concernant l'application "Ass-Perceur", vous pouvez nous contacter à l'adresse suivante : contact@ass-perceur.com
          </Text>
          <TouchableOpacity onPress={() => setShowLegalPopup(false)}>
            <Text style={styles.closeLegalPopup}>Fermer</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
      {showPasswordResetPopup && (
        <View style={styles.passwordResetPopup}>
          <Text style={styles.popupTitle}>Mot de passe oublié</Text>
          <TextInput
            style={styles.input}
            placeholder="Adresse e-mail"
            value={resetEmail}
            onChangeText={handleResetEmailChange}
          />
          <TouchableOpacity style={styles.button} onPress={handlePasswordReset}>
            <Text style={styles.buttonText}>Envoyer</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleClosePasswordReset}>
            <Text style={styles.closePopupText}>Annuler</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '80%',
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  button: {
    backgroundColor: '#51B272',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
  },
  error: {
    color: 'red',
    marginTop: 10,
  },
  signupText: {
    color: 'blue',
    marginTop: 10,
  },
  forgotPasswordText: {
    color: 'blue',
    marginTop: 10,
  },
  logoContainer: {
    top: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    marginTop: -20, // Ajustez cette valeur selon vos besoins
    marginBottom: 40,
  },
  logo: {
    borderRadius: 20,
    width: 150,
    height: 150,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#000',
    marginRight: 5,
  },
  checked: {
    backgroundColor: '#51B272',
  },
  checkboxText: {
    fontSize: 16,
  },
  legalText: {
    textDecorationLine: 'underline',
    color: 'blue',
  },
  passwordFormatText: {
    fontSize: 12,
    color: '#888',
    marginTop: 5,
  },
  legalPopup: {
    backgroundColor: '#fff',
    borderRadius: 10,
    position: 'absolute',
    top: '20%',
    left: '5%',
    right: '5%',
    zIndex: 999,
    elevation: 5,
    height: '50%'
  },
  passwordResetPopup : {
    backgroundColor: '#fff',
    borderRadius: 10,
    position: 'absolute',
    top: '20%',
    left: '5%',
    right: '5%',
    zIndex: 999,
    elevation: 5,
    textAlign: 'center',
    alignContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  legalContent: {
    padding: 20,
    paddingBottom: 0,
    fontSize: 16,
  },
  closeLegalPopup: {
    padding: 20,
    fontSize: 16,
    color: 'blue',
    marginTop: 10,
    textAlign: 'center',
  },
});

export default LoginScreen;
