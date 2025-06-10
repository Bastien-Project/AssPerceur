import React from 'react';
import { StyleSheet, View, TouchableOpacity, Modal, Text } from 'react-native';

const AnnonceModal = ({ modalVisible, setModalVisible, selectedAnnonces, handleCandidater }) => {

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(!modalVisible);
      }}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          {selectedAnnonces.map((annonce, index) => (
            <View key={index} style={styles.annonceContainer}>
              <Text style={styles.annonceText}>Annonce {annonce.id}</Text>
              <Text style={styles.annonceText}>{annonce.titre}</Text>
              <Text style={styles.annonceText}>Description : {annonce.description}</Text>
              <Text style={styles.annonceText}>Du : {annonce.dateDebut} au : {annonce.dateFin}</Text>
              {/* Ajoutez d'autres informations ici */}
            </View>
          ))}
          <TouchableOpacity
            style={{ ...styles.button, backgroundColor: "#2196F3" }}
            onPress={() => handleCandidater()} // Appel de la fonction handleCandidater
          >
            <Text style={styles.textStyle}>Candidater</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ ...styles.button, backgroundColor: "#F194FF" }}
            onPress={() => setModalVisible(!modalVisible)}
          >
            <Text style={styles.textStyle}>Fermer</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginVertical: 5,
    width: '100%',
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  annonceContainer: {
    paddingBottom: 20,
    alignItems: 'center',
  },
  annonceText: {
    textAlign: 'center',
    paddingBottom: 5,
    // Ajoutez d'autres styles selon vos besoins
  },
});

export default AnnonceModal;
