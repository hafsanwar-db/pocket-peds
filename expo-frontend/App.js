import React, {useState} from 'react';

// Import Screens
import Login from './screens/Login';
import Signup from './screens/Signup';
import Welcome from './screens/Welcome';

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
  
  useLocalNotification();
  //const [reminderInterval, setReminderInterval] = useState(8);
  
  //console.log("intervalSEC BEFORE: ",reminderInterval)
  /*const handleLocalPushNotification = async (reminderInterval) => {
    let intervalInSeconds = reminderInterval * 3600;
    //console.log("intervalSEC ",intervalInSeconds);
    await schedulePushNotification(intervalInSeconds);
  };*/
  return (
    <>
      <RootStack
        //reminderInterval={reminderInterval}
        //setReminderInterval={setReminderInterval}
        //handleLocalPushNotification={handleLocalPushNotification}
      />
    </>
  );
} 