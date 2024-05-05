<<<<<<< HEAD
import React, {useState} from 'react';

// Import Screens
import Login from './screens/Login';
import Signup from './screens/Signup';
import Welcome from './screens/Welcome';
=======
import React, { useState, useEffect, useCallback } from 'react';
import { View } from 'react-native';
>>>>>>> eric-branch

// Import RootStack
import RootStack from './navigators/RootStack';
import { useLocalNotification } from './notifications/useLocalNotification';
import * as Notifications from "expo-notifications";
import { schedulePushNotification } from "./notifications/handleNotifications";
import { Button } from "react-native";
import ReminderPickerButton from "./notifications/ReminderPickerButton";

<<<<<<< HEAD
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false
  })
});
export default function App() {
  
  useLocalNotification();
  const [reminderInterval, setReminderInterval] = useState(8);
  
  //console.log("intervalSEC BEFORE: ",reminderInterval)
  const handleLocalPushNotification = async (reminderInterval) => {
    let intervalInSeconds = reminderInterval * 3600;
    //console.log("intervalSEC ",intervalInSeconds);
    await schedulePushNotification(intervalInSeconds);
  };
  return (
    <>
      <RootStack
        reminderInterval={reminderInterval}
        setReminderInterval={setReminderInterval}
        handleLocalPushNotification={handleLocalPushNotification}
      />
=======
// Async storage
import AsyncStorage from '@react-native-async-storage/async-storage';

// Credentials context
import { CredentialsContext } from './components/CredentialsContext';

// Splash Screen
import * as SplashScreen from 'expo-splash-screen';

// Keep the splash screen visible while we fetch resources
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
>>>>>>> eric-branch
    </>
  );
} 