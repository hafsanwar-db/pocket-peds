
// Import Screens
import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
// Async storage
import AsyncStorage from '@react-native-async-storage/async-storage';

// Credentials context
import { CredentialsContext } from './components/CredentialsContext';

// Splash Screen
import * as SplashScreen from 'expo-splash-screen';
// Import RootStack
import RootStack from './navigators/RootStack';
import { useLocalNotification } from './notifications/useLocalNotification';
import * as Notifications from "expo-notifications";
import { schedulePushNotification } from "./notifications/handleNotifications";
import { Button } from "react-native";
import ReminderPickerButton from "./notifications/ReminderPickerButton";
import {TokenProvider} from './components/Token';
//SplashScreen.preventAutoHideAsync();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false
  })
});

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

  useLocalNotification();
  
  //const [reminderInterval, setReminderInterval] = useState(8);
  
  //console.log("intervalSEC BEFORE: ",reminderInterval)
  /*const handleLocalPushNotification = async (reminderInterval) => {
    let intervalInSeconds = reminderInterval * 3600;
    //console.log("intervalSEC ",intervalInSeconds);
    await schedulePushNotification(intervalInSeconds);
  };*/
  return (
    <CredentialsContext.Provider value={{storedCredentials, setStoredCredentials}}>
      <TokenProvider>
      <RootStack
        //reminderInterval={reminderInterval}
        //setReminderInterval={setReminderInterval}
        //handleLocalPushNotification={handleLocalPushNotification}
      />
      </TokenProvider>
     </CredentialsContext.Provider>
  );
} 