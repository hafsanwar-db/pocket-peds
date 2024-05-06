
// Import Screens
import Login from './screens/Login';
import Signup from './screens/Signup';
import Welcome from './screens/Welcome';
import React, { useState, useEffect, useCallback } from 'react';
import { View } from 'react-native';

// Async storage
//import AsyncStorage from '@react-native-async-storage/async-storage';

// Credentials context
// import { CredentialsContext } from './components/CredentialsContext';

// Import RootStack
import RootStack from './navigators/RootStack';
import { useLocalNotification } from './notifications/useLocalNotification';
import * as Notifications from "expo-notifications";
import { schedulePushNotification } from "./notifications/handleNotifications";
import { Button } from "react-native";
import ReminderPickerButton from "./notifications/ReminderPickerButton";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false
  })
});

export default function App() {

  // WE ARE USING TOKENS INSTEAD OF ASYNC STORAGE
  /* 
  const [appReady, setAppReady] = useState(false);
  const [storedCredentials, setStoredCredentials] = useState("");

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
  }, []); */

  useLocalNotification();
  const [reminderInterval, setReminderInterval] = useState(8);
  
  //console.log("intervalSEC BEFORE: ",reminderInterval)
  const handleLocalPushNotification = async (reminderInterval) => {
    let intervalInSeconds = reminderInterval * 3600;
    //console.log("intervalSEC ",intervalInSeconds);
    await schedulePushNotification(intervalInSeconds);
  };
  return (
    <RootStack
        reminderInterval={reminderInterval}
        setReminderInterval={setReminderInterval}
        handleLocalPushNotification={handleLocalPushNotification}
      />
  );
} 