import React, { useState, useEffect, useCallback } from 'react';
import { View } from 'react-native';

// Import RootStack
import RootStack from './navigators/RootStack';

// Async storage
import AsyncStorage from '@react-native-async-storage/async-storage';

// Credentials context
import { CredentialsContext } from './components/CredentialsContext';

// Splash Screen
import * as SplashScreen from 'expo-splash-screen';

// Keep the splash screen visible while loading user info
//SplashScreen.preventAutoHideAsync();

export default function App() {
  const [appReady, setAppReady] = useState(false);
  const [storedCredentials, setStoredCredentials] = useState("");

  // Load login info, hide splash screen when done
  useEffect(() => {
    const checkLoginCredentials = async () => {
      try {
        const value = await AsyncStorage.getItem('userCredentials');
        if (value !== null) {
          setStoredCredentials(JSON.parse(value));
        }
      } catch (error) {
        console.log('Error fetching user credentials:', error);
      } finally {
        if (!appReady) {
          setAppReady(true);
        }
      }
    };

    checkLoginCredentials();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    SplashScreen.hideAsync();
  }, [appReady]);

  return (
    <>
      <CredentialsContext.Provider value={{storedCredentials, setStoredCredentials}}>
        <RootStack/>
      </CredentialsContext.Provider>
    </>
  );
} 