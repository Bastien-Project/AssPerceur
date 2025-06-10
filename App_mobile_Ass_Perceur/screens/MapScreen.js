import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Modal, Text } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as Location from 'expo-location';
import MapView, { Marker, Circle } from 'react-native-maps';
import API_IP from '../config/config';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Importez AsyncStorage

import AnnonceModal from '../components/AnnonceModal'; // Importez le composant CustomModal


const randomNumber1 = (Math.random() - 0.5) / 500;
const randomNumber2 = (Math.random() - 0.5) / 500;

const MapScreen = (userId) => {
  const [region, setRegion] = useState({
    latitude: 43.62505,
    longitude: 3.862038,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [currentLocation, setCurrentLocation] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [annonceLocations, setAnnonceLocations] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAnnonces, setSelectedAnnonces] = useState([]);

  // Logique pour la candidature
  const annonceId = selectedAnnonces.map(annonce => annonce.id).toString();
  const candidatId = userId;
  const responsableId = selectedAnnonces.map(annonce => annonce.idUtilisateur).toString();

  useEffect(() => {
    getCurrentLocation();
    fetchAnnonceLocations();
  }, []);

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

  const getCurrentLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      setCurrentLocation({ latitude, longitude });
      setRegion(prevRegion => ({
        ...prevRegion,
        latitude,
        longitude,
      }));
    } catch (error) {
      console.error('Error getting current location:', error);
    }
  };

  const fetchAnnonceLocations = async () => {
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
      const responseData = await response.json();
      if (responseData && responseData.annonces && Array.isArray(responseData.annonces)) {
        const locations = await Promise.all(responseData.annonces.map(async annonce => {
          try {
            const locationResponse = await fetch(`http://${API_IP}/localisations/${annonce.idLocalisation}`, {
              headers: {
                  'Authorization': `Bearer ${token}` // Ajouter le token JWT dans l'en-tête
              }
          });
            const locationData = await locationResponse.json();
            if (locationData && locationData.localisation) {
              const { latitude, longitude } = locationData.localisation;
              return { latitude, longitude, annonce };
            }
            console.log('Location data missing or malformed:', locationData);
          } catch (error) {
            console.error('Error fetching location data for annonce:', error);
          }
        }));
        setAnnonceLocations(locations.filter(location => location !== undefined));
      } else {
        console.error('Invalid response data structure:', responseData);
      }
    } catch (error) {
      console.error('Error fetching annonce locations:', error);
    }
  };

  const handleSearch = async () => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${searchQuery}`
      );
      const data = await response.json();
      if (data.length > 0) {
        const { lat, lon } = data[0];
        setRegion({
          latitude: parseFloat(lat),
          longitude: parseFloat(lon),
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      }
    } catch (error) {
      console.error('Error fetching data', error);
    }
  };
  const handleCandidater = async () => {
    const token = await getToken(); // Récupérer le token JWT
              if (!token) {
                  console.error('Token JWT non trouvé.');
                  return;
              }
    try {
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
                    'Authorization': `Bearer ${token}`,
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
  const handleMarkerPress = async (index) => {
    const token = await getToken(); // Récupérer le token JWT
        if (!token) {
            console.error('Token JWT non trouvé.');
            return;
        }
    try {
      // Ajouter 1 à l'index
      index += 1;

      // Récupérer toutes les annonces
      const allAnnoncesResponse = await fetch(`http://${API_IP}/annonces`, {
        headers: {
            'Authorization': `Bearer ${token}` // Ajouter le token JWT dans l'en-tête
        }
    });
      const allAnnoncesData = await allAnnoncesResponse.json();
      
      // Filtrer les annonces en fonction de l'index de la localisation
      const annoncesForLocalisation = allAnnoncesData.annonces.filter(annonce => annonce.idLocalisation === index);
      
      setSelectedAnnonces(annoncesForLocalisation);
      setModalVisible(true);
    } catch (error) {
      console.error('Error fetching annonces data for index:', error);
    }
  };

  const renderCurrentLocationMarker = () => {
    if (currentLocation) {
      return (
        <Marker
          coordinate={currentLocation}
          title="Vous êtes ici"
          pinColor="red"
        />
      );
    }
    return null;
  };

  const renderAnnonceMarkers = () => {
    return annonceLocations.map((location, index) => {
      // Vérifier si les coordonnées sont définies
      if (location.latitude !== null && location.longitude !== null) {
        // Appliquer une variation aléatoire aux coordonnées
        const randomizedLatitude = location.latitude + randomNumber1; // Variation aléatoire de ±0.002 degré (environ 250m)
        const randomizedLongitude = location.longitude + randomNumber2; // Variation aléatoire de ±0.002 degré (environ 250m)

        return (
          <React.Fragment key={index}>
            <Circle
              center={{ latitude: randomizedLatitude, longitude: randomizedLongitude }}
              radius={280} // Rayon de 250 mètres
              fillColor="rgba(0, 255, 0, 0.15)" // Couleur de remplissage vert avec une opacité de 20%
              strokeWidth={0} // Aucune bordure
            />
            <Marker
              coordinate={{ latitude: randomizedLatitude, longitude: randomizedLongitude }}
              title="Annonce"
              pinColor="#51B272"
              onPress={() => handleMarkerPress(index)} // Pass name to handler
            />
          </React.Fragment>
        );
      }
      return null; // Si les coordonnées sont nulles, ne pas créer de marqueur
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher sur la map..."
          value={searchQuery}
          onChangeText={text => setSearchQuery(text)}
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Icon name="search" size={20} color="black" />
        </TouchableOpacity>
      </View>
      <MapView style={styles.map} region={region}>
        {renderCurrentLocationMarker()}
        {renderAnnonceMarkers()}
      </MapView>
      {/* Utilisation du composant CustomModal */}
      <AnnonceModal
              modalVisible={modalVisible}
              setModalVisible={setModalVisible}
              selectedAnnonces={selectedAnnonces}
              handleCandidater={handleCandidater}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  searchContainer: {
    position: 'absolute',
    zIndex: 1,
    top: 0,
    left: 0,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 20,
    marginVertical: 20,
    marginHorizontal: 10,
  },
  searchInput: {
    flex: 1,
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 20,
    marginRight: 5,
    backgroundColor: 'white',
  },
  searchButton: {
    backgroundColor: 'white',
    padding: 18,
    borderRadius: 20,
  },
});

export default MapScreen;
