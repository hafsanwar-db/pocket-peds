import { useState, useEffect, useRef } from "react";
import * as Notifications from "expo-notifications";
import { registerForPushNotificationsAsync } from "./handleNotifications";
import navigation from '../NavigationService';


//useLocalNotification hook will request a permission from user upon the initial launch of the App
export const useLocalNotification = () => {
  const [expoPushToken, setExpoPushToken] = useState("");
  
  const [notification, setNotification] = useState({});
  const notificationListener = useRef();
  const responseListener = useRef();
  const setupComplete = useRef(false);
  useEffect(() => {
    if (!setupComplete.current) {
      
      setupNotificationCategories();
      setupComplete.current = true;
    }
    registerForPushNotificationsAsync().then(token => {
      setExpoPushToken(token || "");
    });

    notificationListener.current =
      Notifications.addNotificationReceivedListener(notification => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener(response => {
        setNotification(response.notification);
        handleNotificationResponse(response);

      });

    return () => {
      if (notificationListener.current?.remove) {
        notificationListener.current.remove();
      }
      if (responseListener.current?.remove) {
        responseListener.current.remove();
      }
    };
  }, []);

  return { expoPushToken, notification };
};

export const handleNotificationResponse = async (response) => {
  const medicineName = response.notification.request.content.data.medicineName;
  const dateofNotification = response.notification.request.content.data.date;
  Notifications.getNotificationCategoriesAsync().then((categories) => {
    //console.log("categories", categories);
    
    if (response.actionIdentifier === 'DOSE_GIVEN') {
      Notifications.dismissNotificationAsync(response.actionIdentifier);
//dismissAllNotificationAsync clears notification as soon user clicks on notification in phone
    } else if (response.actionIdentifier === 'NO_LONGER_GIVING') {
        
        navigation.navigate('ConfirmationScreen',{medicineName: medicineName});
        
      } 
  });
  
};
export const setupNotificationCategories = async () => {
  await Notifications.setNotificationCategoryAsync("reminder", [
    {
      identifier: "DOSE_GIVEN",
      buttonTitle: "Dose Given",
      options: {
        opensAppToForeground: true
      }
    },
    {
      identifier: "NO_LONGER_GIVING",
      buttonTitle: "No Longer Giving",
      options: {
        opensAppToForeground: true
      }
    }
  ]);
};