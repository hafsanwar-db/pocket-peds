import React, { useContext, useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Token } from "../components/Token";
import { InnerContainer } from "../components/styles";
import ChangeWeightModal from '../components/modal/ChangeWeightModal';
import axios from 'axios';
import ip from './ip.js';
import { useNavigation } from '@react-navigation/native';

const DoseSettings = ({ route }) => {
  const { scannedData, apiData } = route.params;
  const [reminderInterval, setReminderInterval] = useState(null);
  const [reminderTimes, setReminderTimes] = useState([]);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedTimeIndex, setSelectedTimeIndex] = useState(null);
  const { child } = useContext(Token);
  const {tokenValue} = useContext(Token);
  const [isIntervalSelected, setIsIntervalSelected] = useState(false);
  const navigation = useNavigation();

  const imagePaths = {
    avatar1: require('../assets/img/avatar1.png'),
    avatar2: require('../assets/img/avatar2.png'),
    avatar3: require('../assets/img/avatar3.png'),
    avatar4: require('../assets/img/avatar4.png'),
    avatar5: require('../assets/img/avatar5.png'),
    avatar6: require('../assets/img/avatar6.png'),
    // Add more images as needed
  };

  console.log(apiData);
  console.log(child);
  useEffect(() => {
    if (reminderInterval) {
      const newReminderTimes = Array.from({ length: 3 }, (_, index) => {
        let currentTime = new Date();

        // Set default times based on interval
        if (reminderInterval === 8 * 60 * 60 * 1000) {
          // For 8-hour interval
          switch (index) {
            case 0:
              currentTime.setHours(10, 0, 0, 0);
              break;
            case 1:
              currentTime.setHours(18, 0, 0, 0);
              break;
            case 2:
              currentTime.setDate(currentTime.getDate() + 1); // Next day for 2 am
              currentTime.setHours(2, 0, 0, 0);
              break;
            default:
              break;
          }
        } else if (reminderInterval === 6 * 60 * 60 * 1000) {
          // For 6-hour interval
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

        return { time: currentTime, selected: false };
      });

      setReminderTimes(newReminderTimes);
    }
  }, [reminderInterval]);

  const handleReminderIntervalSelect = (interval) => {
    setReminderInterval(interval);
    setIsIntervalSelected(true);
  };

  const formatTime = (time) => {
    const hours = time.getHours().toString().padStart(2, '0');
    const minutes = time.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const handleConfirm = async () => {
    try {
      // Check if the interval is selected
      if (isIntervalSelected) {
        // Retrieve the access token
        const token = tokenValue;
  
        // Prepare the headers
        const headers = {
          Authorization: `Bearer ${token}`
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
              interval: (reminderInterval / (60*60*1000)),
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
          }
        };
        console.log('Update notifications payload:', payload);
        // Make the API call using Axios with headers
        const response = await axios.post(`http://${ip}:8000/add-child-medication`, payload, { headers });
  
        // Handle successful response
        console.log('Update notifications response:', response.data);

        navigation.navigate("ChildInfo", {name: child.name})
      }
    } catch (error) {
      // Handle error
      console.error('Error updating notifications:', error);
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
      setShowTimePicker(false);
    } else {
      setShowTimePicker(false);
    }
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
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    const months = (today.getMonth() - birthDate.getMonth() + 12) % 12;
    return { years: age, months };
  };

  const renderChildInfo = () => {
    if (!child) return null;
  
    const { name, date_of_birth, weight, last_updated } = child;
    const { years, months } = calculateAge(date_of_birth);
    const weightInKg = (weight * 0.45359237).toFixed(1);
    const last_updated_date = new Date(last_updated).toLocaleDateString();
  
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
        <View style={styles.infoContainer}>
          {renderChildInfo()}
        </View>
      </View>
      <View style={styles.productContainer}>
      <Text style={styles.productName}>
          {scannedData.name
            .toLowerCase()
            .split(' ')
            .slice(0, 2)
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ')
          }...
        </Text>
      </View>
      <InnerContainer>
        <Text style={styles.doseText}>
          Dose: <Text style={styles.dosageText}>{apiData.dose}</Text>{" "}
        </Text>
      </InnerContainer>

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
        <DateTimePicker
          value={reminderTimes[selectedTimeIndex].time}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={handleTimeChange}
        />
      )}

      {isIntervalSelected && (
        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
          <Text style={styles.confirmButtonText}>Confirm</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
  },
  contentContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  confirmButton: {
    backgroundColor: "#FFA500",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    borderRadius: 5,
    marginTop: 20,
  },
  confirmButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  imageContainer: {
    flex: 0.75,
    alignItems: "center",
  },
  infoContainer: {
    flex: 1,
    marginLeft: 20,
  },
  upc: {
    fontSize: 16,
    color: "#F5F5F5",
    textAlign: "center", // Center the text horizontally
    marginBottom: 10,
  },
  image: {
    width: 200,
    height: 150,
    resizeMode: "contain",
  },
  productContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  productName: {
    fontSize: 24,
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
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  dosageText: {
    fontSize: 22,
    color: "#FFA500",
  },
  upcContainer: {
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    alignContent: "center",
    marginTop: 65,
    marginBottom: 30,
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
    paddingVertical: 5,
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
    fontSize: 13,
    fontWeight: "bold",
    marginBottom: 5,
  },
  childAge: {
    fontSize: 10,
    marginBottom: 5,
  },
  childWeight: {
    fontSize: 10,
    marginBottom: 5,
  },
  lastUpdated: {
    fontSize: 10,
    color: "#666",
  },
});

export default DoseSettings;
