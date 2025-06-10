import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Image, ScrollView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import API_IP from '../config/config';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Importez AsyncStorage

const MessagesScreen = ({ navigation, userId }) => {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [selectedUserKey, setSelectedUserKey] = useState(null);
    const [imagePaths, setImagePaths] = useState({});
    const [utilisateurs, setUsers] = useState([]);
    const [selectedUserForConversation, setSelectedUserForConversation] = useState(null);

    useEffect(() => {
        fetchMessages();
        loadImages();
        fetchUsers();
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

    const fetchMessages = async () => {
        const token = await getToken(); // Récupérer le token JWT
        if (!token) {
            console.error('Token JWT non trouvé.');
            return;
        }
        try {
            const response = await fetch(`http://${API_IP}/messages/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${token}` // Ajouter le token JWT dans l'en-tête
                }
            });
            const data = await response.json();
            setMessages(data.messages);
            console.log(data);
        } catch (error) {
            console.error('Erreur lors du chargement des messages :', error);
        }
    };

    const loadImages = async () => {
        try {
            const images = {};
            const imageDir = '../assets';
            const imageFiles = require.context(imageDir, false, /\.(png|jpe?g|svg)$/);
            imageFiles.keys().forEach((key) => {
                images[key.replace('./', '')] = imageFiles(key);
            });
            setImagePaths(images);
        } catch (error) {
            console.error('Erreur lors du chargement des images :', error);
        }
    };

    const fetchUsers = async () => {
        const token = await getToken(); // Récupérer le token JWT
        if (!token) {
            console.error('Token JWT non trouvé.');
            return;
        }
        try {
            const response = await fetch(`http://${API_IP}/utilisateurs`, {
                headers: {
                    'Authorization': `Bearer ${token}` // Ajouter le token JWT dans l'en-tête
                }
            });
            const data = await response.json();
            setUsers(data.utilisateurs);
        } catch (error) {
            console.error('Erreur lors du chargement des utilisateurs :', error);
        }
    };

    const handleSendMessage = async () => {
        const token = await getToken(); // Récupérer le token JWT
        if (!token) {
            console.error('Token JWT non trouvé.');
            return;
        }
        try {
            const response = await fetch(`http://${API_IP}/messages`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    texte: inputMessage,
                    image: '',
                    utilisateur_envoyant_id: userId,
                    utilisateur_recevant_id: selectedUserKey,
                    date_creation: new Date().toISOString(),
                }),
            });
            if (response.ok) {
                fetchMessages();
                setInputMessage('');
            } else {
                console.error('Erreur lors de l\'envoi du message');
            }
        } catch (error) {
            console.error('Erreur lors de l\'envoi du message :', error);
        }
    };

    const handleBlockPress = (userKey) => {
        setSelectedUserKey(userKey);
    };

    const handleBackToMessages = () => {
        setSelectedUserKey(null);
    };

    const handleUserSelection = (userKey) => {
        setSelectedUserForConversation(userKey);
    };

    const handleCreateConversation = async () => {
        const token = await getToken(); // Récupérer le token JWT
        if (!token) {
            console.error('Token JWT non trouvé.');
            return;
        }
        if (selectedUserForConversation) {
            try {
                const response = await fetch(`http://${API_IP}/messages`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        texte: '',
                        image: '',
                        utilisateur_envoyant_id: userId,
                        utilisateur_recevant_id: selectedUserForConversation,
                        date_creation: new Date().toISOString(),
                    }),
                });
                if (response.ok) {
                    console.log('Premier message envoyé avec succès.');
                    fetchMessages();
                } else {
                    console.error('Erreur lors de la création de la conversation');
                }
            } catch (error) {
                console.error('Erreur lors de la création de la conversation :', error);
            }
        }
    };

    const renderMessageBlocks = () => {
        const messageGroups = {};
        messages.forEach(message => {
            const key = message.utilisateur_recevant_id === userId ? message.utilisateur_envoyant_id : message.utilisateur_recevant_id;
            if (!messageGroups[key]) {
                messageGroups[key] = [];
            }
            messageGroups[key].push(message);
        });
    
        return Object.keys(messageGroups).map(userKey => {
            const userNameKey = userKey;
            console.log('ettststststst');
            const userNameKeyParse = parseInt(userNameKey);
            console.log(userNameKeyParse);
            const user = utilisateurs.find(utilisateur => utilisateur.id === userNameKeyParse);
            const userName = user ? user.nom : "Utilisateur inconnu";
            return (
                <TouchableOpacity key={userKey} onPress={() => handleBlockPress(userKey)}>
                    <View style={styles.block}>
                        <Text>{"Discussion avec : " + userName}</Text>
                    </View>
                </TouchableOpacity>
            );
        });
    };

    const renderMessageBlockss = () => {
        const messageGroups = {};
        messages.forEach(message => {
            const key = message.utilisateur_recevant_id === userId ? message.utilisateur_envoyant_id : message.utilisateur_recevant_id;
            if (!messageGroups[key]) {
                messageGroups[key] = [];
            }
            messageGroups[key].push(message);
        });

        return Object.keys(messageGroups).map(userKey => {
            return (
                <TouchableOpacity key={userKey} onPress={() => handleBlockPress(userKey)}>
                    <View style={styles.block}>
                        <Text>{"Discussion avec : " + userKey}</Text>
                    </View>
                </TouchableOpacity>
            );
        });
    };

    
    

    const renderMessages = () => {
        if (selectedUserKey) {
            return messages
                .filter(message => 
                    (parseInt(message.utilisateur_recevant_id) === parseInt(selectedUserKey) || 
                    parseInt(message.utilisateur_envoyant_id) === parseInt(selectedUserKey)) &&
                    ((message.texte !== null && message.texte !== '') || (message.image && message.image !== ''))
                )
                .map(message => {
                    const isSent = parseInt(message.utilisateur_envoyant_id) === parseInt(userId);
                    const messageStyle = isSent ? styles.sentMessage : styles.receivedMessage;
                    const alignStyle = isSent ? { alignSelf: 'flex-end' } : { alignSelf: 'flex-start' };
                    return (
                        <View key={message.id} style={[styles.message, messageStyle, alignStyle]}>
                            {message.texte !== null && message.texte !== '' && (
                                <Text style={styles.messageText}>{message.texte}</Text>
                            )}
                            {message.image && (
                                <Image
                                    style={styles.image}
                                    source={imagePaths[message.image]}
                                />
                            )}
                        </View>
                    );
                }); 
        }
        return null;
    };
    
    

    const handleImageUpload = async () => {
        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
        const token = await getToken(); // Récupérer le token JWT
        if (!token) {
            console.error('Token JWT non trouvé.');
            return;
        }
    
        try {
            if (!result.cancelled) {
                const localUri = result.assets[0].uri;
                console.log("Image sélectionnée:", localUri);
                const randomname = Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10) + '.jpg';
                
                const formData = new FormData();
                formData.append('image', {
                    uri: localUri,
                    name: randomname,
                    type: 'image/jpeg',
                });
    
                const response = await fetch(`http://${API_IP}/uploadImage`, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                });

                const response2 = await fetch(`http://${API_IP}/messages`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        texte: null,
                        image: randomname,
                        utilisateur_envoyant_id: userId,
                        utilisateur_recevant_id: selectedUserKey,
                        date_creation: new Date().toISOString(),
                    }),
                });
    
                if (response.ok) {
                    console.log('Image téléchargée avec succès.');
                } else {
                    console.error('Erreur lors de l\'envoi de l\'image.');
                }
            }
        } catch (error) {
            console.error('Erreur lors de la manipulation de l\'image :', error);
        }
    };
    const selectedUserName = utilisateurs.find(utilisateur => utilisateur.id === parseInt(selectedUserKey))?.nom || "Utilisateur inconnu";

    return (
        <View style={styles.container}>
            {selectedUserKey ? (
                <View style={styles.conversationContainer}>
                    <View style={styles.header}>
                        <TouchableOpacity onPress={handleBackToMessages}>
                            <Text style={styles.backButton}>Retour</Text>
                        </TouchableOpacity>
                        <Text style={styles.headerText}>{selectedUserName}</Text>
                    </View>
                    <ScrollView style={styles.conversationScrollView}>
                        {renderMessages()}
                    </ScrollView>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Tapez votre message..."
                            value={inputMessage}
                            onChangeText={setInputMessage}
                        />
                        <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
                            <Text style={styles.sendButtonText}>Envoyer</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleImageUpload}>
                            <FontAwesome name="camera" size={24} color="black" />
                        </TouchableOpacity>
                    </View>
                </View>
            ) : (
                <View style={styles.blockContainer}>
                    {renderMessageBlocks()}
                </View>
            )}
            {/* Partie de sélection en bas de la page */}
            {selectedUserKey === null && (
                <View style={styles.userSelectionContainer}>
                    <Text>Sélectionnez un utilisateur :</Text>
                    <View style={styles.usersContainer}>
                        {utilisateurs.map(utilisateur => (
                            utilisateur.id !== userId && (
                                <TouchableOpacity 
                                    key={utilisateur.id} 
                                    style={[styles.userButton, utilisateur.id === selectedUserForConversation ? styles.selectedUserButton : null]} 
                                    onPress={() => handleUserSelection(utilisateur.id)}
                                >
                                    <Text>{utilisateur.nom}</Text>
                                </TouchableOpacity>
                            )
                        ))}
                    </View>
                    <TouchableOpacity style={styles.createConversationButton} onPress={handleCreateConversation}>
                        <Text style={styles.createConversationButtonText}>Créer une conversation</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
    
    
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#DFF2D8',
    },
    blockContainer: {
        flex: 1,
    },
    block: {
        backgroundColor: '#FFFFFF',
        padding: 10,
        borderBottomColor: '#717171',
        borderBottomWidth: 2,
    },
    conversationContainer: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        padding: 10,
    },
    backButton: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#51B272',
        marginRight: 10,
    },
    headerText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    conversationScrollView: {
        flex: 1,
        paddingHorizontal: 10,
        marginBottom: 10,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#CCCCCC',
        paddingHorizontal: 10,
    },
    input: {
        flex: 1,
        height: 40,
        backgroundColor: '#F2F2F2',
        borderRadius: 20,
        paddingHorizontal: 10,
        marginRight: 10,
    },
    sendButton: {
        backgroundColor: '#51B272',
        borderRadius: 20,
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    sendButtonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    message: {
        backgroundColor: '#FFFFFF',
        padding: 10,
        borderBottomColor: '#CCCCCC',
        borderBottomWidth: 1,
        maxHeight: 360,
    },
    messageText: {
        fontSize: 16,
    },
    image: {
        maxWidth: 200,
        maxHeight: 200,
    },
    userSelectionContainer: {
        backgroundColor: '#FFFFFF',
        padding: 10,
        borderTopWidth: 1,
        borderTopColor: '#CCCCCC',
    },
    usersContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    userButton: {
        backgroundColor: '#DFF2D8',
        padding: 10,
        margin: 5,
        borderRadius: 5,
    },
    createConversationButton: {
        backgroundColor: '#51B272',
        borderRadius: 20,
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginTop: 10,
        alignSelf: 'flex-end',
    },
    createConversationButtonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    selectedUserButton: {
        backgroundColor: '#51B272', // ou toute autre couleur que vous souhaitez utiliser
    },
    
});

export default MessagesScreen;
