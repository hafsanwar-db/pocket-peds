import { useState, useEffect, useRef, useContext} from "react";
import * as Notifications from "expo-notifications";
import { registerForPushNotificationsAsync } from "./handleNotifications";
import navigation from '../NavigationService';
// import DoseSettings, { toggleReminderTime } from '../screens/DoseSettings';
// import {cancelNotifications} from "../screens/DoseSettings";
import {Token} from '../components/Token';
import ip from "../screens/ip";
import axios from "axios";


//useLocalNotification hook will request a permission from user upon the initial launch of the App
export const useLocalNotification = () => {
//   console.log(Token)
//   const {child} = useContext(Token)
// const childName = child.name
// const {tokenValue} = useContext(Token);
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
  const medication_upc = response.notification.request.content.data.medicationUpc;
  Notifications.getNotificationCategoriesAsync().then((categories) => {
    //console.log("categories", categories);
    
    if (response.actionIdentifier === 'DOSE_GIVEN') {
      //change doseGiven to True
      //toggleReminderTime(reminderIndex);
      handleDoseGiven(medication_upc, dateofNotification);

      //call api with notifId notification from this child
      Notifications.dismissNotificationAsync(response.actionIdentifier);
//dismissAllNotificationAsync clears notification as soon user clicks on notification in phone
    } else if (response.actionIdentifier === 'NO_LONGER_GIVING') {
      
      
      notificationsToDelete = getNotificationInfo(medication_upc);
      for (let i = 0; i < notificationsToDelete.length; i++) {
        Notifications.cancelScheduledNotificationAsync(notificationsToDelete[i]);
        Notifications.dismissNotificationAsync(notificationsToDelete[i]);
      }

      //now delete from db
      handleNoLongerGiving(medication_upc, dateofNotification);


        
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

const handleNoLongerGiving = async (medication_upc) => {
  console.log('No Longer Dose Given'); // Add this line to check if the function is triggered
  

  try {
    // Make API call to process scanned data
    console.log('Making API call for No Longer Dose Given:'); // Add this line to check if the function is triggered
    const url = `http://${ip}:8000/delete-child-medication`;
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${tokenValue}`,
        body: JSON.stringify({
          child_name: childName,
          medication_upc: encodeURIComponent(medication_upc),
        })
      },
      
    })

    if (response.ok) {
      const responseData = await response.json();
      console.log(responseData);
    } else {
      console.error(`Error while handling No Longer Dose Given `);
    }
  } catch (error) {
    console.error(`Error while handling No Longer Dose Given `, error);
  }
};

const handleDoseGiven = async (medication_upc, dateofNotification) => {
  console.log('Handling dose Given of '); // Add this line to check if the function is triggered
  

  try {
    // Make API call to process scanned data
    console.log('Making API call for handlingDoseGiven:'); // Add this line to check if the function is triggered
    const url = `http://${ip}:8000/handle-dose-given`;
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${tokenValue}`,
        body: JSON.stringify({
          child_name: childName,
          medication_upc: encodeURIComponent(medication_upc),
          notifications: {
            medication_upc: medication_upc,
            child_name: childName,
            date: dateofNotification,
          }
        })
      },
      
    })

    if (response.ok) {
      const responseData = await response.json();
      console.log(responseData);
    } else {
      console.error(`Error while handling Dose Given `);
    }
  } catch (error) {
    console.error(`Error while handling Dose Given `, error);
  }
};

const handleRemoveNotificationInfo = async (medication_upc) => {
  console.log('All data of notifications'); // Add this line to check if the function is triggered
  

  try {
    // Make API call to process scanned data
    console.log('Making API call for inserting info for notification:'); // Add this line to check if the function is triggered
    const url = `http://${ip}:8000/update_notifications`;
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${tokenValue}`,
        body: JSON.stringify({
          child_name: childName,
          medication_upc: encodeURIComponent(medication_upc),
          notifications: "None"
        })
      },
      
    })

    if (response.ok) {
      const responseData = await response.json();
      console.log(responseData);
    } else {
      console.error(`Error while removing notification info `);
    }
  } catch (error) {
    console.error(`Error while removing notification info: `, error);
  }
};

export const getNotificationInfo = async (medication_upc, token) => {
   // Add this line to check if the function is triggered
  const {tokenValue, child} = token;
  console.log('All data of notifications for child: ', child);
  try {
    // Make API call to process scanned data
    console.log('Making API call for getting info for notification:'); // Add this line to check if the function is triggered
    const url = `http://${ip}:8000/get-notifications-ids`;
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${tokenValue}`,
      },
      body: JSON.stringify({
        data: {child_name: child.name,
        parent_id: child.parent_id,
        medication_upc: encodeURIComponent(medication_upc)}
        
      })
    })

    if (response.ok) {
      const responseData = await response.json();
      console.log(responseData);
    } else {
      console.error(`Error while getting notification info `);
    }
  } catch (error) {
    console.error(`Error while getting notification info: `, error);
  }
};