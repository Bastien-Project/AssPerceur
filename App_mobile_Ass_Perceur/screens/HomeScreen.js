import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import ModalComponent from '../components/CreateAnnonce';
import AnnonceModal from '../components/AnnonceModal';
import API_IP from '../config/config';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Importez AsyncStorage

const AnnoncesPage = ({ navigation , userId }) => {
    const [annonces, setAnnonces] = useState([]); 
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredAnnonces, setFilteredAnnonces] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [titre, setTitre] = useState('');
    const [description, setDescription] = useState('');
    const [selectedStartDate, setSelectedStartDate] = useState(new Date());
    const [selectedEndDate, setSelectedEndDate] = useState(new Date());
    const [showAnnonceModal, setShowAnnonceModal] = useState(false);
    const [selectedAnnonces, setSelectedAnnonces] = useState([]);
    // Logique pour la candidature
    const annonceId = selectedAnnonces.map(annonce => annonce.id).toString();
    const candidatId = userId;
    const responsableId = selectedAnnonces.map(annonce => annonce.idUtilisateur).toString();

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
        fetchAnnonces();
    }, [showModal, showAnnonceModal]); // Rafraîchir les annonces lorsque showModal ou showAnnonceModal change

    const fetchAnnonces = async () => {
        const token = await getToken(); // Récupérer le token JWT
        if (!token) {
            console.error('Token JWT non trouvé.');
            return;
        }
        try {
            const response = await fetch(`http://${API_IP}/annonces`, {
                headers: {
                    'Authorization': `Bearer ${token}` // Ajouter le token JWT dans l'en-tête
                }
            });
            const data = await response.json();
            setAnnonces(data.annonces);
            setFilteredAnnonces(data.annonces);
        } catch (error) {
            console.error('Erreur lors de la récupération des annonces:', error);
        }
    };

    const handleSearch = (query) => {
        setSearchQuery(query);
        const filtered = annonces.filter(annonce =>
            annonce.titre.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredAnnonces(filtered);
    };

    const handleAjouterPress = () => {
        setShowModal(true);
    };

    const handleCreateAnnonce = () => {
        // Envoyer les données de la nouvelle annonce à l'API
        // Assurez-vous de valider les données avant de les envoyer
        // Réinitialiser les champs de saisie après la création de l'annonce
        console.log('Création de l\'annonce avec les données suivantes :', {
            titre,
            description,
            selectedStartDate,
            selectedEndDate
        });
        setTitre('');
        setDescription('');
        setSelectedStartDate(new Date());
        setSelectedEndDate(new Date());
        setShowModal(false);
        // Réinitialiser la recherche
        setSearchQuery('');
        // Retourner à la page 1
        navigation.navigate('Page1'); // Remplacez 'Page1' par le nom de votre écran de liste des annonces
    };

    const handleAfficherAnnonce = async (annonceId) => {
        try {
            const token = await getToken(); // Récupérer le token JWT
            if (!token) {
                console.error('Token JWT non trouvé.');
                return;
            }
            const response = await fetch(`http://${API_IP}/annonces/${annonceId}`, {
                headers: {
                    'Authorization': `Bearer ${token}` // Ajouter le token JWT dans l'en-tête
                }
            });
            const data = await response.json();
            if (data.annonce) {
                setSelectedAnnonces([data.annonce]); // Mettre les données de l'annonce dans un tableau
                setShowAnnonceModal(true);
            } else {
                console.error('Aucune annonce trouvée avec cet ID');
            }
        } catch (error) {
            console.error('Erreur lors de la récupération de l\'annonce:', error);
        }
    };
    
    const handleCandidater = async () => {
        try {
            const token = await getToken(); // Récupérer le token JWT
            if (!token) {
                console.error('Token JWT non trouvé.');
                return;
            }
            // Vérifier si des annonces sont sélectionnées
            if (selectedAnnonces.length === 0) {
                throw new Error('Veuillez sélectionner au moins une annonce pour candidater');
            }
    
            // Pour chaque annonce sélectionnée, envoyer une requête POST pour créer la candidature
            const candidaturePromises = selectedAnnonces.map(async annonce => {
                const { id: annonceId, idUtilisateur: responsableId } = annonce;
                const candidatId = userId; // Utilisez l'ID de l'utilisateur connecté comme ID du candidat
    
                const response = await fetch(`http://${API_IP}/candidater`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`, // Ajouter le token JWT dans l'en-tête
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        annonce_id: annonceId,
                        candidat_id: candidatId,
                        responsable_id: responsableId,
                        
                    }),
                });
    
                const data = await response.json();
    
                if (!response.ok) {
                    throw new Error(data.error || 'Erreur lors de la création de la candidature');
                }
    
                return data;
            });
    
            // Attendre que toutes les candidatures soient créées avec succès
            const results = await Promise.all(candidaturePromises);
    
            // Traiter les résultats si nécessaire
            console.log('Candidatures créées avec succès :', results);
        } catch (error) {
            console.error('Erreur lors de la candidature :', error.message);
        }
    };
    
    

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.searchInput}
                placeholder="Rechercher..."
                value={searchQuery}
                onChangeText={handleSearch}
            />
            <ScrollView style={styles.scrollView}>
                {filteredAnnonces.map(annonce => (
                    <TouchableOpacity key={annonce.id} style={styles.annonce} onPress={() => handleAfficherAnnonce(annonce.id)}>
                        <Text style={styles.annonceTitle}>{annonce.titre}</Text>
                        <Text style={styles.annonceDescription}>{annonce.description}</Text>
                        <Text style={styles.annonceDate}>Du {annonce.dateDebut} au {annonce.dateFin}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
            <TouchableOpacity style={styles.addButton} onPress={handleAjouterPress}>
                <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
            {/* Modal */}
            <ModalComponent
                visible={showModal}
                titre={titre}
                setTitre={setTitre}
                description={description}
                setDescription={setDescription}
                selectedStartDate={selectedStartDate}
                setSelectedStartDate={setSelectedStartDate}
                selectedEndDate={selectedEndDate}
                setSelectedEndDate={setSelectedEndDate}
                handleCreateAnnonce={handleCreateAnnonce}
                closeModal={() => setShowModal(false)}
                userId={userId}
            />
            {/* Annonce Modal */}
            <AnnonceModal
                modalVisible={showAnnonceModal}
                setModalVisible={setShowAnnonceModal}
                selectedAnnonces={selectedAnnonces}
                handleCandidater={handleCandidater} // Passer la fonction handleCandidater ici
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 10,
        backgroundColor: '#DFF2D8',
    },
    searchInput: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 10,
        paddingHorizontal: 10,
        backgroundColor: 'white',
    },
    scrollView: {
        flex: 1,
    },
    annonce: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        padding: 10,
        marginBottom: 10,
        backgroundColor: 'white',
    },
    annonceTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    annonceDescription: {
        fontSize: 16,
        marginBottom: 5,
    },
    annonceDate: {
        fontSize: 14,
        color: '#666',
    },
    addButton: {
        position: 'absolute',
        bottom: 20,
        alignSelf: 'center',
        backgroundColor: 'green',
        width: 50,
        height: 50,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
    },
    addButtonText: {
        color: 'white',
        fontSize: 30,
    },
});

export default AnnoncesPage;
