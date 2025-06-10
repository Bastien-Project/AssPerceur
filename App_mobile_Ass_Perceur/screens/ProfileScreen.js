import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import API_IP from '../config/config';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Importez AsyncStorage

const ProfileScreen = ({ userId }) => {
    const [userData, setUserData] = useState(null);
    const [showMyAds, setShowMyAds] = useState(false);
    const [myCandidatures, setMyCandidatures] = useState([]);

    useEffect(() => {
        const fetchUserData = async () => {
            const token = await getToken(); // Récupérer le token JWT
            if (!token) {
                console.error('Token JWT non trouvé.');
                return;
            }
            try {
                const response = await fetch(`http://${API_IP}/utilisateurs/${userId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}` // Ajouter le token JWT dans l'en-tête
                    }
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch user data');
                }
                const userData = await response.json();
                setUserData(userData);
            } catch (error) {
                console.error(error);
            }
        };

        fetchUserData();
    }, [userId]);

    
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
    

    useEffect(() => {
        const fetchMyCandidatures = async () => {
            const token = await getToken(); // Récupérer le token JWT
            if (!token) {
                console.error('Token JWT non trouvé.');
                return;
            }
            try {
                const response = await fetch(`http://${API_IP}/candidater/${userId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}` // Ajouter le token JWT dans l'en-tête
                    }
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch my candidatures');
                }
                const candidaturesData = await response.json();
                console.log(candidaturesData);
                setMyCandidatures(candidaturesData.candidatures);
            } catch (error) {
                console.error(error);
            }
        };

        if (showMyAds) {
            fetchMyCandidatures();
        } else {
            setMyCandidatures([]);
        }
    }, [userId, showMyAds]);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Mon profil</Text>
            <Image
                style={styles.image}
                source={require('../assets/profil.png')}
            />
            {userData && (
                <View>
                    <Text style={styles.text}>Nom: {userData.nom}</Text>
                    <Text style={styles.text}>Email: {userData.email}</Text>
                </View>
            )}
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={[styles.button, showMyAds ? styles.activeButton : null]}
                    onPress={() => setShowMyAds(true)}>
                    <Text style={styles.buttonText}>Mes annonces</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.button, !showMyAds ? styles.activeButton : null]}
                    onPress={() => setShowMyAds(false)}>
                    <Text style={styles.buttonText}>Mes candidatures</Text>
                </TouchableOpacity>
            </View>
            {showMyAds ? (
                <View style={styles.tabContainer}>
                    <Text style={styles.tabText}>Contenu de Mes annonces</Text>
                    {myCandidatures.map((candidature, index) => (
                        <View key={index} style={styles.adContainer}>
                            <Text style={styles.adTitle}>Annonce ID: {candidature.annonce_id}</Text>
                            <Text style={styles.adDescription}>Candidat ID: {candidature.candidat_id}</Text>
                            {/* Ajoutez d'autres champs de candidature ici si nécessaire */}
                        </View>
                    ))}
                </View>
            ) : (
                <View style={styles.tabContainer}>
                    <Text style={styles.tabText}>Contenu de Mes candidatures</Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#DFF2D8',
        padding: 20,
    },
    title: {
        fontSize: 20,
        textAlign: 'center',
        marginVertical: 10,
    },
    image: {
        width: 200,
        height: 200,
        marginVertical: 15,
    },
    buttonContainer: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    button: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        backgroundColor: '#ccc',
        marginHorizontal: 5,
    },
    activeButton: {
        backgroundColor: '#888',
    },
    buttonText: {
        fontSize: 16,
        color: '#fff',
    },
    tabContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    tabText: {
        fontSize: 18,
    },
    adContainer: {
        marginTop: 20,
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    adTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    adDescription: {
        fontSize: 14,
    },
});

export default ProfileScreen;
