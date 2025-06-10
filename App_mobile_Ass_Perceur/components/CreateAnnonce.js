import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, ScrollView } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import MapView, { Marker } from 'react-native-maps'; 
import API_IP from '../config/config';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Importez AsyncStorage

const windowWidth = Dimensions.get('window').width;

const CreateAnnonce = ({ visible, titre, setTitre, description, setDescription, selectedStartDate, setSelectedStartDate, selectedEndDate, setSelectedEndDate, closeModal, userId }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [showStartDatePicker, setShowStartDatePicker] = useState(false);
    const [showEndDatePicker, setShowEndDatePicker] = useState(false);
    const [plantes, setPlantes] = useState([]);
    const [selectedPlant, setSelectedPlant] = useState('');
    const [quantity, setQuantity] = useState('');
    const [selectedItems, setSelectedItems] = useState([]);
    const [adresse, setAdresse] = useState('');
    const [complementAdresse, setComplementAdresse] = useState('');
    const [ville, setVille] = useState('');
    const [codePostal, setCodePostal] = useState('');
    const [pays, setPays] = useState('');
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);

    useEffect(() => {
        fetchPlantes();
    }, []);

    const getToken = async () => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            return token;
        } catch (error) {
            console.error('Erreur lors de la récupération du token:', error);
            return null;
        }
    };
    

    const fetchPlantes = async () => {
        const token = await getToken(); // Récupérer le token JWT
        if (!token) {
            console.error('Token JWT non trouvé.');
            return;
        }
        fetch(`http://${API_IP}/plantes`, {
            headers: {
                'Authorization': `Bearer ${token}` // Ajouter le token JWT dans l'en-tête
            }
        })
            .then(response => response.json())
            .then(data => setPlantes(data.plantes))
            .catch(error => console.error('Erreur lors de la récupération des plantes :', error));
    };

    const handleNextPage = () => {
        setCurrentPage(currentPage + 1);
    };

    const handlePreviousPage = () => {
        setCurrentPage(currentPage - 1);
    };

    const handleStartDatePress = () => {
        setShowStartDatePicker(true);
    };

    const handleEndDatePress = () => {
        setShowEndDatePicker(true);
    };

    const handleStartDateChange = (event, date) => {
        setShowStartDatePicker(false);
        setSelectedStartDate(date);
    };

    const handleEndDateChange = (event, date) => {
        setShowEndDatePicker(false);
        setSelectedEndDate(date);
    };

    const formatDate = (date) => {
        return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    };

    const handleCreateAnnonce = async () => {
        const token = await getToken(); // Récupérer le token JWT
        if (!token) {
            console.error('Token JWT non trouvé.');
            return;
        }
        try {
            // Récupérer la prochaine ID d'annonce à partir de l'API
            const nextAnnonceResponse = await fetch(`http://${API_IP}/nextidannonce`, {
                headers: {
                    'Authorization': `Bearer ${token}` // Ajouter le token JWT dans l'en-tête
                }
            });
            if (!nextAnnonceResponse.ok) {
                throw new Error('Erreur lors de la récupération de la prochaine ID d\'annonce');
            }
            const nextAnnonce = await nextAnnonceResponse.json();
            const nextAnnonceId = nextAnnonce.nextId;
            
            // Récupérer la prochaine ID localisation à partir de l'API
            const nextLocalisationResponse = await fetch(`http://${API_IP}/nextidlocalisations`, {
                headers: {
                    'Authorization': `Bearer ${token}` // Ajouter le token JWT dans l'en-tête
                }
            });
            if (!nextLocalisationResponse.ok) {
                throw new Error('Erreur lors de la récupération de la prochaine ID de localisation');
            }
            const nextLocalisation = await nextLocalisationResponse.json();
            const nextLocalisationId = nextLocalisation.nextId;

            // Créer la localisation
            const localisationData = {
                latitude: latitude,
                longitude: longitude,
                adresse: adresse,
                complement_adresse: complementAdresse,
                ville: ville,
                code_postal: codePostal,
                pays: pays
            };
    
            const localisationResponse = await fetch(`http://${API_IP}/localisations`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(localisationData)
            });
    
            if (!localisationResponse.ok) {
                throw new Error('Erreur lors de la création de la localisation');
            }
    
            // Créer l'annonce
            const annonceData = {
                idUtilisateur: userId,
                idLocalisation: nextLocalisationId,
                titre: titre,
                description: description,
                dateDebut: formatDate(selectedStartDate),
                dateFin: formatDate(selectedEndDate)
            };
    
            const annonceResponse = await fetch(`http://${API_IP}/annonces`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(annonceData)
            });
            console.log(annonceData);
            if (!annonceResponse.ok) {
                throw new Error('Erreur lors de la création de l\'annonce');
            }
    
            // Fermer le modal si la création de l'annonce est réussie
            closeModal();
        } catch (error) {
            console.error('Erreur lors de la création de l\'annonce :', error.message);
            // Afficher un message d'erreur à l'utilisateur si la création de l'annonce échoue
            // Vous pouvez implémenter cela en utilisant un composant d'alerte ou en mettant à jour un état pour afficher un message dans l'interface utilisateur
        }
    };
    
    
    

    const handleAddItem = () => {
        if (selectedPlant && quantity) {
            const newItem = {
                plant: selectedPlant,
                quantity: parseInt(quantity), // Convertir la quantité en entier
            };
            setSelectedItems([...selectedItems, newItem]);
            setSelectedPlant('');
            setQuantity('');
        }
    };

    const handleDeleteItem = (index) => {
        const updatedItems = [...selectedItems];
        updatedItems.splice(index, 1);
        setSelectedItems(updatedItems);
    };

    const handleAddLocation = () => {
        if (adresse !== '') {
            fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${adresse}`)
                .then(response => response.json())
                .then(data => {
                    if (data && data.length > 0) {
                        const { lat, lon } = data[0];
                        setLatitude(lat);
                        setLongitude(lon);
                    } else {
                        setLatitude(null);
                        setLongitude(null);
                        alert("Adresse introuvable. Veuillez vérifier et réessayer.");
                    }
                })
                .catch(error => {
                    console.error('Erreur lors de la recherche d\'adresse:', error);
                    alert("Une erreur s'est produite lors de la recherche de l'adresse. Veuillez réessayer plus tard.");
                });
        } else {
            alert("Veuillez entrer une adresse.");
        }
    };

    const handleCancelPage = () => {
        closeModal();
    };

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType='slide'
            onRequestClose={closeModal}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Créer une annonce</Text>
                    {currentPage === 1 && (
                        <>
                            <TextInput
                                style={styles.input}
                                placeholder="Titre de l'annonce"
                                value={titre}
                                onChangeText={setTitre}
                            />
                            <TextInput
                                style={[styles.input, styles.descriptionInput]}
                                placeholder="Description de l'annonce"
                                value={description}
                                onChangeText={setDescription}
                                multiline={true}
                            />
                            <TouchableOpacity onPress={handleStartDatePress} style={styles.dateInput}>
                                <Text style={styles.dateText}>{selectedStartDate ? formatDate(selectedStartDate) : "Sélectionner une date de début"}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleEndDatePress} style={styles.dateInput}>
                                <Text style={styles.dateText}>{selectedEndDate ? formatDate(selectedEndDate) : "Sélectionner une date de fin"}</Text>
                            </TouchableOpacity>
                        </>
                    )}
                    {currentPage === 2 && (
                        <View style={styles.pickerContainer}>
                            <Text style={styles.pickerLabel}>Sélectionner une plante :</Text>
                            <View style={styles.inputRow}>
                                <Picker
                                    selectedValue={selectedPlant}
                                    onValueChange={(itemValue, itemIndex) => setSelectedPlant(itemValue)}
                                    style={styles.Plantpicker}
                                >
                                    <Picker.Item label="Sélectionner une plante..." value="" />
                                    {plantes.map(plant => (
                                        <Picker.Item key={plant.id} label={plant.nom} value={plant.id} />
                                    ))}
                                </Picker>
                                <TextInput
                                    style={styles.Plantinput}
                                    placeholder="Quantité"
                                    value={quantity}
                                    onChangeText={setQuantity}
                                    keyboardType="numeric"
                                />
                                <TouchableOpacity onPress={handleAddItem} style={styles.PlantaddButton}>
                                    <Text style={styles.buttonText}>+</Text>
                                </TouchableOpacity>
                            </View>
                            {selectedItems.length > 0 && (
                                <View style={styles.selectedItemsContainer}>
                                    <Text style={styles.selectedItemsTitle}>Plantes sélectionnées :</Text>
                                    <ScrollView style={styles.selectedItemsScrollView}>
                                        {selectedItems.map((item, index) => {
                                            const plant = plantes.find(plant => plant.id === item.plant);
                                            return (
                                                <View key={index} style={styles.selectedItem}>
                                                    <View style={styles.itemInfo}>
                                                        <Text style={styles.itemPlantName}>{plant ? plant.nom : 'Plante inconnue'}</Text>
                                                        <Text style={styles.itemQuantity}>Quantité : {item.quantity}</Text>
                                                    </View>
                                                    <TouchableOpacity onPress={() => handleDeleteItem(index)} style={styles.deleteButton}>
                                                        <Text style={styles.deleteButtonText}>Supprimer</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            );
                                        })}
                                    </ScrollView>
                                </View>
                            )}
                        </View>
                    )}
                    {currentPage === 3 && (
                        <>
                            <TextInput
                                style={styles.input}
                                placeholder="Adresse principale"
                                value={adresse}
                                onChangeText={setAdresse}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Complément d'adresse"
                                value={complementAdresse}
                                onChangeText={setComplementAdresse}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Ville"
                                value={ville}
                                onChangeText={setVille}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Code Postal"
                                value={codePostal}
                                onChangeText={setCodePostal}
                                keyboardType="numeric"
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Pays"
                                value={pays}
                                onChangeText={setPays}
                            />
                            <TouchableOpacity onPress={handleAddLocation} style={styles.addButton}>
                                <Text style={styles.buttonText}>Rechercher l'adresse</Text>
                            </TouchableOpacity>
                            {latitude !== null && longitude !== null && (
                                <View style={styles.mapContainer}>
                                    <MapView
                                        style={styles.map}
                                        region={{
                                            latitude: parseFloat(latitude),
                                            longitude: parseFloat(longitude),
                                            latitudeDelta: 0.0922,
                                            longitudeDelta: 0.0421,
                                        }}
                                    >
                                        <Marker
                                            coordinate={{
                                                latitude: parseFloat(latitude),
                                                longitude: parseFloat(longitude),
                                            }}
                                            title="Emplacement choisi"
                                        />
                                    </MapView>
                                    <Text style={styles.locationInfo}>
                                        Latitude : {latitude}, Longitude : {longitude}
                                    </Text>
                                </View>
                            )}
                        </>
                    )}
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity onPress={currentPage > 1 ?handlePreviousPage: handleCancelPage} style={[styles.modalButton, currentPage >1 ?styles.previousButton: styles.cancelButton]}>
                            <Text style={styles.modalButtonText}>{currentPage > 1 ? 'Précédent' : 'Annuler'}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={currentPage === 3 ? handleCreateAnnonce : handleNextPage} style={[styles.modalButton, currentPage === 3 ? styles.createButton : styles.nextButton]}>
                            <Text style={styles.modalButtonText}>{currentPage === 3 ? 'Créer' : 'Suivant'}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                {showStartDatePicker && (
                    <DateTimePicker
                        value={selectedStartDate}
                        mode="date"
                        display="default"
                        onChange={handleStartDateChange}
                    />
                )}
                {showEndDatePicker && (
                    <DateTimePicker
                        value={selectedEndDate}
                        mode="date"
                        display="default"
                        onChange={handleEndDateChange}
                    />
                )}
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        width: windowWidth - 40,
        alignSelf: 'center',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    descriptionInput: {
        height: 80,
    },
    dateInput: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 10,
        paddingHorizontal: 10,
        justifyContent: 'center',
    },
    dateText: {
        fontSize: 16,
    },
    pickerContainer: {
        marginBottom: 20,
    },
    pickerLabel: {
        fontSize: 16,
        marginBottom: 5,
    },
    addButton: {
        backgroundColor: 'green',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
    itemContainer: {
        maxHeight: 200,
    },
    item: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    modalButton: {
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
        alignItems: 'center',
        width: 100,
    },
    modalButtonText: {
        color: 'white',
        fontSize: 16,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    previousButton: {
        backgroundColor: '#ccc',
    },
    nextButton: {
        backgroundColor: 'green',
    },
    createButton: {
        backgroundColor: 'green',
    },
    cancelButton: {
        backgroundColor: 'red',
    },
    selectedItemsContainer: {
        marginTop: 20,
        padding: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#ccc',
        backgroundColor: '#f9f9f9',
    },
    selectedItemsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    selectedItem: {
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    selectedItemText: {
        fontSize: 16,
        flex: 1,
        flexDirection: 'row',
    },
    itemPlantName: {
        fontWeight: 'bold',
    },
    itemQuantity: {
        marginLeft: 10,
    },
    selectedItemsScrollView: {
        maxHeight: 150,
    },
    deleteButton: {
        backgroundColor: 'red',
        padding: 5,
        borderRadius: 5,
        marginLeft: 10,
    },
    deleteButtonText: {
        color: 'white',
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    PlantaddButton: {
        backgroundColor: 'green',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        width: 50,  
    },
    Plantpicker: {
        height: 50,
        width: 150,
        flex: 1,
        marginRight: 10,
    },
    Plantinput: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        marginHorizontal: 10,
        paddingHorizontal: 10,
        width: 50,
        width: 50,
    },
    selectedItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    itemInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    itemPlantName: {
        fontWeight: 'bold',
        marginRight: 10,
    },
    itemQuantity: {
        marginRight: 10,
    },
    deleteButton: {
        backgroundColor: 'red',
        padding: 5,
        borderRadius: 5,
    },
    deleteButtonText: {
        color: 'white',
    },
    
    mapContainer: {
        height: 200,
        marginVertical: 20,
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    locationInfo: {
        marginTop: 10,
        fontSize: 16,
    },
});

export default CreateAnnonce;
