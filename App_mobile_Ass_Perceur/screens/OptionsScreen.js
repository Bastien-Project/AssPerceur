import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import API_IP from '../config/config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const OptionsScreen = ({ navigation, isLoggedIn, setIsLoggedIn, userId }) => {
    const [selectedOption, setSelectedOption] = useState('');
    const [subOptions, setSubOptions] = useState([]);
    const [showBackButton, setShowBackButton] = useState(false);
    const [subOptionTexts, setSubOptionTexts] = useState({});

    
    // Fonction pour récupérer le token JWT stocké localement
    const getToken = async () => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            return token;
        } catch (error) {
            console.error('Erreur lors de la récupération du token:', error);
            return null;
        }
    };

    const handleOptionPress = (option) => {
        setShowBackButton(true);
        setSelectedOption(option);
        if (option === '1') {
            setSubOptions(['1']);setSubOptionTexts({ '1': '1. Éditeur de l\'application : L\'application "Ass-Perceur" est éditée par la société Ass-Perceur.\n\n2. Directeur de la publication : Les directeurs de la publication de l\'application "Ass-Perceur" sont Pierre LEDEUIL, Sébastien COLIN, Amyne EL AICHOUNI et Bastien THOMAS.\n\n3. Propriété intellectuelle : Tous les éléments constitutifs de l\'application "Ass-Perceur", tels que les textes, les graphiques, les logos, les images, les vidéos, les sons, les marques, ainsi que la structure générale de l\'application, sont la propriété exclusive de la société Ass-Perceur. Toute reproduction, représentation, modification, publication, transmission ou adaptation, même partielle, de ces éléments est strictement interdite sans l\'autorisation préalable écrite de l\'éditeur.\n\n4. Protection des données personnelles : L\'application "Ass-Perceur" collecte et traite des données personnelles dans le respect de la législation en vigueur, notamment du Règlement Général sur la Protection des Données (RGPD). Pour plus d\'informations sur la collecte, le traitement et l\'utilisation de vos données personnelles, veuillez consulter notre Politique de Confidentialité.\n\n5. Cookies : L\'application "Ass-Perceur" utilise des cookies afin d\'améliorer l\'expérience utilisateur et de collecter des données statistiques sur l\'utilisation de l\'application. En naviguant sur l\'application, vous consentez à l\'utilisation de ces cookies. Vous avez la possibilité de refuser l\'installation de cookies en modifiant les paramètres de votre navigateur.\n\n6. Limitation de responsabilité : L\'éditeur de l\'application "Ass-Perceur" met tout en œuvre pour assurer l\'exactitude et la mise à jour des informations diffusées sur l\'application, mais ne saurait être tenu pour responsable des erreurs, omissions ou indisponibilités constatées. L\'éditeur décline toute responsabilité quant à l\'utilisation qui pourrait être faite des informations et contenus disponibles sur l\'application.\n\n7. Droit applicable et juridiction compétente : Les présentes mentions légales sont soumises au droit français. En cas de litige, les tribunaux français seront seuls compétents.\n\nPour toute question ou réclamation concernant l\'application "Ass-Perceur", vous pouvez nous contacter à l\'adresse suivante : contact@ass-perceur.com' });
        } else if (option === '2') {
            setSubOptions(['1']);
            setSubOptionTexts({ '1': '1. Collecte des données personnelles : L\'application "Ass-Perceur" peut collecter des données personnelles auprès des utilisateurs dans le cadre de son fonctionnement et de la fourniture de ses services. Ces données peuvent inclure, sans s\'y limiter, les informations suivantes :\n    Informations d\'identification : nom, prénom, adresse e-mail, numéro de téléphone.\n    Informations sur les plantes : photos des plantes à faire garder, localisation des plantes.\n    Informations de transaction : informations de paiement, le cas échéant.\n    Informations d\'utilisation : données de navigation, interactions avec l\'application.\n\n2. Finalités de la collecte : Les données personnelles collectées par l\'application "Ass-Perceur" sont utilisées dans le but de fournir et d\'améliorer les services proposés. Elles peuvent être utilisées notamment pour :\n    Faciliter la communication entre les utilisateurs et les botanistes.\n    Permettre la garde et l\'entretien des plantes.\n    Fournir des conseils d\'entretien personnalisés.\n    Assurer la sécurité et la conformité des transactions.\n    Personnaliser l\'expérience utilisateur.\n\n3. Conservation des données : Les données personnelles sont conservées aussi longtemps que nécessaire pour atteindre les finalités pour lesquelles elles ont été collectées, sauf si une durée de conservation plus longue est requise ou autorisée par la loi applicable.\n\n4. Sécurité des données : L\'application "Ass-Perceur" met en œuvre des mesures de sécurité techniques et organisationnelles appropriées pour protéger les données personnelles contre tout accès non autorisé, toute divulgation, toute altération ou toute destruction.\n\n5. Partage des données : Les données personnelles des utilisateurs peuvent être partagées avec des tiers dans les cas suivants :\n    Avec les botanistes pour fournir des conseils d\'entretien personnalisés.\n    Avec les prestataires de services tiers agissant au nom de "Ass-Perceur", tels que les fournisseurs de services de paiement ou les prestataires d\'hébergement.\n    En cas de demande légale ou réglementaire, ou pour protéger les droits, la propriété ou la sécurité de "Ass-Perceur" ou d\'autres personnes.\n\n6. Droits des utilisateurs : Les utilisateurs disposent de droits sur leurs données personnelles, notamment le droit d\'accès, de rectification, de suppression et de portabilité de leurs données. Pour exercer ces droits, les utilisateurs peuvent contacter "Ass-Perceur" à l\'adresse indiquée dans les mentions légales.\n\n7. Modification de la politique de confidentialité : "Ass-Perceur" se réserve le droit de modifier sa politique de confidentialité à tout moment. Les utilisateurs seront informés de toute modification substantielle par le biais d\'une notification dans l\'application ou par tout autre moyen approprié.\n\nEn utilisant l\'application "Ass-Perceur", les utilisateurs consentent à la collecte, au traitement et à l\'utilisation de leurs données personnelles conformément à la présente politique de confidentialité.' });
        }
    };

    const handleBackButtonPress = () => {
        setShowBackButton(false);
        setSelectedOption('');
        setSubOptions([]);
        setSubOptionTexts({});
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
    };

    const handleDelete = async () => {
        const token = await getToken(); // Récupérer le token JWT
        if (!token) {
            console.error('Token JWT non trouvé.');
            return;
        }
        console.log('userId');
        console.log(userId);
        try {
            const response = await fetch(`http://${API_IP}/messages`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    texte: 'Supprime mes données',
                    image: '',
                    utilisateur_envoyant_id: userId,
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
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                {showBackButton && (
                    <TouchableOpacity style={styles.backButton} onPress={handleBackButtonPress}>
                        <Ionicons name="arrow-back" size={32} color="black" />
                    </TouchableOpacity>
                )}
                <Text style={styles.headerText}>Options</Text>
            </View>
            <View style={styles.optionsContainer}>
                {subOptions.length === 0 ? (
                    <>
                        <TouchableOpacity
                            style={[styles.optionButton, selectedOption === 'Mentions légales' && styles.selectedOption]}
                            onPress={() => handleOptionPress('1')}>
                            <Text style={styles.optionText}>Mentions légales</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.optionButton, selectedOption === 'Politique de confidentialité' && styles.selectedOption]}
                            onPress={() => handleOptionPress('2')}>
                            <Text style={styles.optionText}>Politique de confidentialité</Text>
                        </TouchableOpacity>
                    </>
                ) : (
                    subOptions.map((subOption, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.subOptionButton}
                            onPress={() => console.log('Clic')}>
                            <Text style={styles.subOptionText}>{subOption}</Text>
                            <Text style={styles.subOptionDescription}>{subOptionTexts[subOption]}</Text>
                        </TouchableOpacity>
                    ))
                )}
            </View>
            {isLoggedIn && (
                <React.Fragment>
                    <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                        <Text style={styles.logoutText}>Déconnexion</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.logoutButton} onPress={handleDelete}>
                        <Text style={styles.logoutText}>Supprimer les données</Text>
                    </TouchableOpacity>
                </React.Fragment>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#DFF2D8',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: '#FFFFFF',
        height: 80,
        borderBottomWidth: 2,
        borderBottomColor: '#717171',
        paddingLeft: 20,
    },
    headerText: {
        fontSize: 22,
        fontWeight: 'bold',
        marginRight: 'auto',
    },
    backButton: {
        marginRight: 10,
    },
    optionsContainer: {
        marginBottom: 20,
    },
    optionButton: {
        height: 80,
        justifyContent: 'center',
        alignContent: 'center',
        borderBottomWidth: 2,
        borderBottomColor: '#717171',
        backgroundColor: 'white',
    },
    selectedOption: {
        backgroundColor: '#51B272',
    },
    optionText: {
        fontSize: 20,
        paddingLeft: 20,
    },
    subOptionButton: {
        justifyContent: 'center',
        alignContent: 'center',
        borderBottomWidth: 2,
        borderBottomColor: '#717171',
        backgroundColor: 'white',
    },
    subOptionText: {
        fontSize: 20,
        paddingLeft: 20,
        display: 'none',
    },
    subOptionDescription: {
        fontSize: 20,
        padding: 20,
        color: '#717171',
    },
    logoutButton: {
        backgroundColor: 'red',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 10,
        alignSelf: 'center',
        marginTop: 20,
    },
    logoutText: {
        marginVertical: 20,
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default OptionsScreen;
