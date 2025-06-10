import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaView, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from './screens/HomeScreen';
import MessagesScreen from './screens/MessagesScreen';
import ProfileScreen from './screens/ProfileScreen';
import OptionsScreen from './screens/OptionsScreen';
import MapScreen from './screens/MapScreen'; 
import LoginScreen from './screens/LoginScreen';

const Tab = createBottomTabNavigator();

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null); // Ajoutez l'état userId

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar backgroundColor="#51B272"/>
      <NavigationContainer>
        {isLoggedIn ? (
          <Tab.Navigator
            screenOptions={({ route }) => ({
              headerShown: false,
              tabBarIcon: ({ focused, color, size }) => {
                let iconName;

                if (route.name === 'Home') {
                  iconName = focused ? 'home' : 'home-outline';
                } else if (route.name === 'Messages') {
                  iconName = focused ? 'chatbox' : 'chatbox-outline';
                } else if (route.name === 'Profile') {
                  iconName = focused ? 'person' : 'person-outline';
                } else if (route.name === 'Options') {
                  iconName = focused ? 'settings' : 'settings-outline';
                } else if (route.name === 'Map') {
                  iconName = focused ? 'map' : 'map-outline';
                }

                return <Ionicons name={iconName} size={size} color={color} />;
              },
              tabBarLabel: () => null
            })}
            tabBarOptions={{
              activeTintColor: 'green',
              inactiveTintColor: 'lightgreen',
              tabBarStyle: {
                backgroundColor: 'blue',
                height: 50,
              },
            }}
          >
            <Tab.Screen name="Home" component={() => <HomeScreen userId={userId} />} />
            <Tab.Screen name="Map" component={() => <MapScreen userId={userId} />} />
            <Tab.Screen 
                name="Messages" 
                component={() => <MessagesScreen userId={userId} />} // Passer userId comme prop
                initialParams={{ userId }} 
            />
            <Tab.Screen name="Profile" component={() => <ProfileScreen userId={userId} />} />
            <Tab.Screen 
              name="Options" 
              component={() => <OptionsScreen isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} userId={userId}/>} 
              initialParams={{ setIsLoggedIn }} 
            />
          </Tab.Navigator>
        ) : (
          <LoginScreen setIsLoggedIn={setIsLoggedIn} setUserId={setUserId} />
        )}
      </NavigationContainer>
    </SafeAreaView>
  );
}

export default App;
