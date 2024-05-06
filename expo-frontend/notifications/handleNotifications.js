import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

//use these functions to get user permissions and trigger the notification process.

export const schedulePushNotification = async (date,medicineName,dosage) => {
  await Notifications.scheduleNotificationAsync({
    //identifier: "PocketPeds",
    content: {
      title: "PocketPeds",
      
      body: `Time for Lily's next dose!\nGive ${dosage} of ${medicineName} to Lily.`,
      categoryIdentifier: "reminder",
      data: { medicineName: medicineName,date:date }
    },
    //trigger: { date: date},
    trigger: { seconds: 4 },
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

