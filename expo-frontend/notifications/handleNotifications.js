import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform, } from "react-native";
import { Token } from "../components/Token";
import { useContext } from "react";


//use these functions to get user permissions and trigger the notification process.

export const schedulePushNotification = async ({ time, medicineName, dosage, medication_upc, child }) => {
  // const {child} = useContext(Token)
  const childName = child.name;
  console.log("Scheduling notification for: ", time);

  await Notifications.scheduleNotificationAsync({
    //identifier: "PocketPeds",
    content: {
      title: "PocketPeds",
      body: `Time for ${childName.charAt(0).toUpperCase() + childName.slice(1)}'s next dose!\nGive ${medicineName} to ${childName.charAt(0).toUpperCase() + childName.slice(1)}`,
      categoryIdentifier: "reminder",
      data: { medicineName: medicineName, date: new Date(time).toString(), medicationUpc: medication_upc.toString(), childName: child.name, parent_id: child.parent_id }
    },
    trigger: { date: time },
    //trigger: { seconds: 4 },
  })
  .then((response) => {
    console.log("Notification scheduled successfully:", response);
  })
  .catch((error) => {
    console.log("Failed to schedule notification:", error);
  });
};

export const registerForPushNotificationsAsync = async () => {
  let token = "";

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FFAABBCC"
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync({
      projectId: "98d4a62b-c3f8-429e-b275-049bd53d6b98"
    })).data;
  } else {
    alert("Must use physical device for Push Notifications");
  }

  return token;
};

