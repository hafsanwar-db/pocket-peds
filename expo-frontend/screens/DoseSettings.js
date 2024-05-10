import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Modal,
  Dimensions
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Token } from "../components/Token";
import ChangeWeightModal from '../components/modal/ChangeWeightModal';
import axios from 'axios';
import ip from './ip.js';
import { useNavigation } from '@react-navigation/native';
import { schedulePushNotification } from "../notifications/handleNotifications";
import { getNotificationInfo } from "../notifications/useLocalNotification";
// import {
//   StyledContainer,
//   InnerContainer,
//   PageLogo,
//   PageTitle,
//   SubTitle,
//   StyledFormArea,
//   LeftIcon,
//   StyledInputLabel,
//   StyledTextInput,
//   RightIcon,
//   StyledButton,
//   ButtonText,
//   Colors,
//   MessageBox,
//   Line,
//   ExtraText,
//   ExtraView,
//   TextLink,
//   TextLinkContent,
// } from "../components/styles";

const imagePaths = {
  avatar1: require("../assets/img/avatar1.png"),
  avatar2: require("../assets/img/avatar2.png"),
  avatar3: require("../assets/img/avatar3.png"),
  avatar4: require("../assets/img/avatar4.png"),
  avatar5: require("../assets/img/avatar5.png"),
  avatar6: require("../assets/img/avatar6.png"),
  // Add more images as needed
};
const {height, width} = Dimensions.get("window");
const DoseSettings = ({ navigation, route }) => {
  //apiData is the medicine data received from the API
  //scannedData is the data retrieve from the barcode scanner after making an api call to the backend
  const { scannedData, apiData } = route.params;
  const [reminderInterval, setReminderInterval] = useState(null);
  const [reminderTimes, setReminderTimes] = useState([]);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedTimeIndex, setSelectedTimeIndex] = useState(null);
  const { child } = useContext(Token);
  const { tokenValue } = useContext(Token);
  const [isIntervalSelected, setIsIntervalSelected] = useState(false);
  const navigation = useNavigation();
  const childName = child.name || " ";

  // console.log(apiData);
  // console.log(child);
  useEffect(() => {
    if (reminderInterval) {
      const newReminderTimes = Array.from({ length: 3 }, (_, index) => {
        let currentTime = new Date();

        // Set default times based on interval
        if (reminderInterval === 8 * 60 * 60 * 1000) {
          // For 8-hour interval
          reminderTimes.push({
            time: currentTime.setHours(10, 0, 0, 0),
            selected: false,
            doseGiven: false,
          }); // 10:00 AM
          reminderTimes.push({
            time: currentTime.setHours(18, 0, 0, 0),
            selected: false,
            doseGiven: false,
          }); // 6:00 PM
          switch (index) {
            case 0:
              currentTime.setHours(10, 0, 0, 0);
              break;
            case 1:
              currentTime.setHours(18, 0, 0, 0);
              break;
            case 2:
              currentTime.setDate(currentTime.getDate() + 1); // Next day for 2 am

              reminderTimes.push({
                time: currentTime.setHours(2, 0, 0, 0),
                selected: false,
                doseGiven: false,
              }); // Next day 2:00 AM

              break;
            default:
              break;
          }
        } else if (reminderInterval === 6 * 60 * 60 * 1000) {
          // For 6-hour interval
          reminderTimes.push({
            selected: false,
            time: currentTime.setHours(9, 0, 0, 0),
            selected: false,
            doseGiven: false,
          }); // 9:00 AM
          reminderTimes.push({
            selected: false,
            time: currentTime.setHours(15, 0, 0, 0),
            selected: false,
            doseGiven: false,
          }); // 3:00 PM
          reminderTimes.push({
            selected: false,
            time: currentTime.setHours(21, 0, 0, 0),
            selected: false,
            doseGiven: false,
          }); // 9:00 PM
          switch (index) {
            case 0:
              currentTime.setHours(9, 0, 0, 0);
              break;
            case 1:
              currentTime.setHours(15, 0, 0, 0);
              break;
            case 2:
              currentTime.setHours(21, 0, 0, 0);
              break;
            default:
              break;
          }
        }

        return { time: currentTime, selected: false, doseGiven: false };
      });

      setReminderTimes(newReminderTimes);
    }
  }, [reminderInterval]);

  const handleReminderIntervalSelect = (interval) => {
    setReminderInterval(interval);
    setIsIntervalSelected(true);
  };

  const formatTime = (time) => {
    const hours = time.getHours().toString().padStart(2, "0");
    const minutes = time.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  //  const toggleReminderTime = (index) => {
  //   //setSelectedTimeIndex(index);
  //   //setShowTimePicker(true);
  //   const newReminderTimes = [...reminderTimes];
  //   newReminderTimes[index].doseGiven = !newReminderTimes[index].doseGiven;
  //   setReminderTimes(newReminderTimes);
  // }

  const handleConfirm = async () => {
    try {
      // Check if the interval is selected
      if (isIntervalSelected) {
        // Retrieve the access token
        const token = tokenValue;
        //scheduling all push notifications
        handleLocalPushNotification();
        // Prepare the headers
        const headers = {
          Authorization: `Bearer ${token}`,
        };

        // Prepare the payload
        const payload = {
          child_name: child.name,
          medication: {
            name: scannedData.name,
            dosage: apiData.dose,
            upc: scannedData.upc,
            image: scannedData.image,
            notifications: {
              interval: reminderInterval / (60 * 60 * 1000),
              notification1: {
                time: formatTime(reminderTimes[0].time),
                given: false,
              },
              notification2: {
                time: formatTime(reminderTimes[1].time),
                given: false,
              },
              notification3: {
                time: formatTime(reminderTimes[2].time),
                given: false,
              },
            },
          },
        };
        // console.log("Update notifications payload:", payload);
        // Make the API call using Axios with headers
        const response = await axios.post(
          `http://${ip}:8000/add-child-medication`,
          payload,
          { headers }
        );

        // Handle successful response
        // console.log("Update notifications response:", response.data);

        navigation.navigate("ChildInfo", { name: child.name });
      }
    } catch (error) {
      // Handle error
      console.error("Error updating notifications:", error);
    }
  };

  const toggleReminderTime = (index) => {
    setSelectedTimeIndex(index);
    setShowTimePicker(true);
  };

  const handleTimeChange = (event, selectedTime) => {
    if (selectedTime !== undefined) {
      const newReminderTimes = [...reminderTimes];
      newReminderTimes[selectedTimeIndex].time = selectedTime;

      //I don't see why you have to delete notifications right now
      // notificationsToDelete = getNotificationInfo(scannedData.upc, {tokenValue, child});
      // for (let i = 0; i < notificationsToDelete.length; i++) {
      //   Notifications.cancelScheduledNotificationAsync(
      //     notificationsToDelete[i]
      //   );
      //   Notifications.dismissNotificationAsync(notificationsToDelete[i]);
      // }

      // Update times in previous boxes if not the first box
      if (selectedTimeIndex > 0) {
        const interval =
          reminderInterval ||
          newReminderTimes[1].time.getTime() -
            newReminderTimes[0].time.getTime();
        for (let i = selectedTimeIndex - 1; i >= 0; i--) {
          newReminderTimes[i].time = new Date(
            newReminderTimes[i + 1].time.getTime() - interval
          );
        }
      }

      // Update times in following boxes if not the last box
      if (selectedTimeIndex < newReminderTimes.length - 1) {
        const interval =
          reminderInterval ||
          newReminderTimes[1].time.getTime() -
            newReminderTimes[0].time.getTime();
        for (let i = selectedTimeIndex + 1; i < newReminderTimes.length; i++) {
          newReminderTimes[i].time = new Date(
            newReminderTimes[i - 1].time.getTime() + interval
          );
        }
      }

      setReminderTimes(newReminderTimes);
      if (event.type === 'dismissed') {
        setShowTimePicker(false);
      }
      // handleLocalPushNotification();
    } else {
      // setShowTimePicker(false);
    }
  };

  const handleLocalPushNotification = async () => {
    const medicineName = scannedData["name"];
    const dosage = apiData["dosage"];
    const medication_upc = scannedData["upc"];
    const allNotificationInfo = {};
    for (let i = 0; i < reminderTimes.length; i++) {
      const time = reminderTimes[i].time;
      const doseGiven = reminderTimes[i].doseGiven;
      //const reminderId = generateUniqueReminderId();
      // console.log("child info before sending to schedule", child)
      const scheduledNotificationId = await schedulePushNotification({
        time,
        medicineName,
        dosage,
        doseGiven,
        medication_upc,
        child,
      });
      allNotificationInfo[time] = [scheduledNotificationId, false];
    }

    const notificationInfo = {
      child_name: childName,
      medicineName: medicineName,
      medication_upc: medication_upc,
      dosage: dosage,
      image:
        "https://dailymed.nlm.nih.gov/dailymed/image.cfm?setid=808f4790-cadd-42…",
      notification: allNotificationInfo,
    };

    // Update the notificationIds object with the new mapping
    /*setNotificationIds(prevIds => ({
        ...prevIds,
        [reminderId]: scheduledNotificationId*/
  };

  const toggleTimeSelection = (index) => {
    const newReminderTimes = [...reminderTimes];
    newReminderTimes[index].selected = !newReminderTimes[index].selected;
    setReminderTimes(newReminderTimes);
  };

  const calculateAge = (dateOfBirth) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    const months = (today.getMonth() - birthDate.getMonth() + 12) % 12;
    return { years: age, months };
  };

  // handleConfirm(); // this was uncommented, nish's work

  // const toggleTimeSelection = (index) => {
  //   const newReminderTimes = [...reminderTimes];
  //   newReminderTimes[index].selected = !newReminderTimes[index].selected;
  //   setReminderTimes(newReminderTimes);
  // };
  // Function to cancel a notification based on reminder ID

  const handleAddNotificationInfo = async ({ data }) => {
    console.log("All data of notifications", data); // Add this line to check if the function is triggered

    try {
      // Make API call to process scanned data
      console.log("Making API call for inserting info for notification:", data); // Add this line to check if the function is triggered
      const url = `http://${ip}:8000/update_notifications`;
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${tokenValue}`,
          body: data,
        },
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log(responseData);
      } else {
        console.error(`Error while adding notification info ${data}`);
      }
    } catch (error) {
      console.error(`Error while adding notification info ${data}:`, error);
    }
  };

  const renderChildInfo = () => {
    if (!child) return null;

    const { name, date_of_birth, weight, last_updated } = child;
    const { years, months } = calculateAge(date_of_birth);
    const weightInKg = (weight * 0.45359237).toFixed(1);
    // const last_updated_date = new Date(last_updated).toLocaleDateString();

    return (
      <View style={styles.childInfoContainer}>
        <Image source={imagePaths[child.image]} style={styles.profileImage} />
        <View style={styles.childInfoTextContainer}>
          <Text style={styles.childName}>
            {name.toLowerCase().replace(/\b(\s\w|^\w)/g, function (txt) {
              return txt.toUpperCase();
            })}
          </Text>
          <Text style={styles.childAge}>
            {years} years {months} {months > 1 ? "months" : "month"}
          </Text>
          <Text style={styles.childWeight}>
            {weight} lbs ({weightInKg} kg)
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.upcContainer}>
        <Text style={styles.upc}>UPC: {scannedData.upc}</Text>
      </View>
      <View style={styles.contentContainer}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: scannedData.image }} style={styles.image} />
        </View>
        <View style={{ flex:1,flexDirection: "column" }}>
          <View style={styles.infoContainer}>{renderChildInfo()}</View>
          <View style={styles.productContainer}>
            <Text style={styles.productName}>
              {scannedData.name
                .toLowerCase()
                .split(" ")
                .slice(0, 2)
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ")}
              ...
            </Text>
        <Text style={styles.doseText}>
          Dose: <Text style={styles.dosageText}>{apiData.dose}</Text>{" "}
        </Text>
          </View>
        </View>
      </View>

     

      <View style={styles.reminderButtonContainer}>
        <TouchableOpacity
          style={[
            styles.reminderButton,
            reminderInterval === 6 * 60 * 60 * 1000 &&
              styles.reminderButtonSelected,
          ]}
          onPress={() => handleReminderIntervalSelect(6 * 60 * 60 * 1000)}
        >
          <Text style={styles.reminderButtonText}>6 Hours</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.reminderButton,
            reminderInterval === 8 * 60 * 60 * 1000 &&
              styles.reminderButtonSelected,
          ]}
          onPress={() => handleReminderIntervalSelect(8 * 60 * 60 * 1000)}
        >
          <Text style={styles.reminderButtonText}>8 Hours</Text>
        </TouchableOpacity>
      </View>
      {reminderTimes.map((item, index) => (
        <View key={index} style={[styles.reminderTimeContainer]}>
          <TouchableOpacity
            style={[
              styles.checkbox,
              item.selected
                ? styles.checkboxSelected
                : styles.checkboxUnselected,
            ]}
            onPress={() => toggleTimeSelection(index)}
          ></TouchableOpacity>
          <TouchableOpacity
            style={styles.reminderTimeTextContainer}
            onPress={() => toggleReminderTime(index)}
          >
            <Text
              style={[
                styles.reminderTimeText,
                !item.selected && styles.blurText,
              ]}
            >
              {item.time.toLocaleTimeString()}
            </Text>
          </TouchableOpacity>
        </View>
      ))}
      {showTimePicker && (
        <View style= {{flexDirection: 'row', justifyContent:'center', marginBottom: 10}}>
        <DateTimePicker
          value={reminderTimes[selectedTimeIndex].time}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={handleTimeChange}
        />
        </View>
      )}
      {isIntervalSelected && (
        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
          <Text style={styles.confirmButtonText}>Confirm</Text>
        </TouchableOpacity>
      )}
    </View>
  );
  //this was GUI's
  // handleAddNotificationInfo(notificationInfo);
};
//  return (
//    <View style={styles.container}>
//      <Text style={styles.upc}>{scannedData.upc}</Text>
//      <Image source={{ uri: scannedData.image }} style={styles.image} />
//      <View style={styles.productContainer}>
//        <Text style={styles.productName}>{scannedData.name}</Text>
//      </View>
//      <Text style={styles.doseText}>Dose</Text>
//      <Text style={styles.dosageText}>{apiData.dosage}</Text>
//      <View style={styles.reminderButtonContainer}>
//        <TouchableOpacity
//          style={[
//            styles.reminderButton,
//            reminderInterval === 6 * 60 * 60 * 1000 && styles.reminderButtonSelected,
//          ]}
//          onPress={() => handleReminderIntervalSelect(6 * 60 * 60 * 1000)}
//        >
//          <Text style={styles.reminderButtonText}>6 Hours</Text>
//        </TouchableOpacity>
//        <TouchableOpacity
//          style={[
//            styles.reminderButton,
//            reminderInterval === 8 * 60 * 60 * 1000 && styles.reminderButtonSelected,
//          ]}
//          onPress={() => handleReminderIntervalSelect(8 * 60 * 60 * 1000)}
//        >
//          <Text style={styles.reminderButtonText}>8 Hours</Text>
//        </TouchableOpacity>
//      </View>
//      {reminderTimes.map((item, index) => (
//        <View key={index} style={[styles.reminderTimeContainer]}>
//          <TouchableOpacity
//            style={[styles.checkbox, item.selected ? styles.checkboxSelected : styles.checkboxUnselected]}
//           //  onPress={() => toggleTimeSelection(index)}
//          >

//          </TouchableOpacity>
//          <TouchableOpacity
//            style={styles.reminderTimeTextContainer}
//            //onPress={() => toggleReminderTime(index)}
//          >
//            <Text style={[styles.reminderTimeText, !item.selected && styles.blurText]}>
//              {item.time.toLocaleTimeString()}
//            </Text>
//          </TouchableOpacity>
//        </View>
//      ))}
//      {showTimePicker && (
//        <DateTimePicker
//          value={reminderTimes[selectedTimeIndex].time}
//          mode="time"
//          is24Hour={true}
//          display="default"
//          onChange={handleTimeChange}
//        />
//      )}
//       <StyledButton onPress={handleLocalPushNotification} >
//         <ButtonText>Confirm</ButtonText>
//       </StyledButton>
//    </View>
//  );
// };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
  },
  contentContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  confirmButton: {
    backgroundColor: "#FFA500",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    borderRadius: 5,
    width: 0.5*width,
    alignSelf: "center",
  },
  confirmButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  imageContainer: {
    flex: 0.55,
    height: 0.25*height,
    alignItems: "center",
  },
  infoContainer: {
    marginLeft: 20,
  },
  upc: {
    fontSize: 16,
    color: "white",
    paddingVertical: 5,
    textAlign: "center", // Center the text horizontally
  },
  image: {
    width: 200,
    height: 150,
    resizeMode: "contain",
  },
  productContainer: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: '#e0f2ff',
    marginLeft:20,
    borderRadius: 10,
    paddingVertical: 15,
    marginBottom: 20,
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  directionContainer: {
    marginTop: 10,
  },
  directionText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  directionDetails: {
    fontSize: 14,
    textAlign: "center",
  },
  doseText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  dosageText: {
    fontSize: 18,
    color: "#FFA500",
  },
  upcContainer: {
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    alignContent: "center",
    marginTop: 65,
    marginBottom: 15,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: "#C9DAF8",
    borderRadius: 30,
   
  },
  reminderButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "80%",
    marginBottom: 20,
    alignSelf: "center",
  },
  reminderButton: {
    backgroundColor: "#e6e6e6",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  reminderButtonSelected: {
    backgroundColor: "#FFA500",
  },
  reminderButtonText: {
    fontSize: 16,
    alignItems: "center",
    fontWeight: "bold",
    color: "#333",
  },
  reminderTimeContainer: {
    width: 0.75*width,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#e6e6e6",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    marginRight: 20,
    borderColor: "#333",
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxSelected: {
    backgroundColor: "#FFA500",
    borderColor: "#FFA500",
  },
  checkboxUnselected: {
    backgroundColor: "transparent",
    borderColor: "#333",
  },
  checkboxText: {
    color: "#333",
    fontSize: 14,
  },
  blurText: {
    color: "rgba(0,0,0,0.3)",
  },
  reminderTimeTextContainer: {
    flex: 1,
  },
  reminderTimeText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  selectedReminderTimeContainer: {
    backgroundColor: "#FFA500",
  },
  childInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 10,
  },
  childInfoTextContainer: {
    flex: 1,
  },
  childName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  childAge: {
    fontSize: 14,
    marginBottom: 5,
  },
  childWeight: {
    fontSize: 14,
    marginBottom: 5,
  },
  lastUpdated: {
    fontSize: 10,
    color: "#666",
  },
});

export default DoseSettings;
