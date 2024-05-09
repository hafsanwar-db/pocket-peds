import React, { useContext, useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import axios from 'axios';
import ip from './ip.js';
import { Token } from "../components/Token";
import { InnerContainer } from "../components/styles";
import { useNavigation } from '@react-navigation/native';

const EditMedication = ({ route }) => {
  const { tokenValue, child,  } = useContext(Token);
  const { medicationData } = route.params;
  const [notificationData, setNotificationData] = useState({});
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedTimeIndex, setSelectedTimeIndex] = useState(null);
  const [reminderTimes, setReminderTimes] = useState([]);
  const [reminderInterval, setReminderInterval] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    // Fetch notification data for the child
    fetchNotificationData();
  }, []);

  const imagePaths = {
    avatar1: require('../assets/img/avatar1.png'),
    avatar2: require('../assets/img/avatar2.png'),
    avatar3: require('../assets/img/avatar3.png'),
    avatar4: require('../assets/img/avatar4.png'),
    avatar5: require('../assets/img/avatar5.png'),
    avatar6: require('../assets/img/avatar6.png'),
    // Add more images as needed
  };

  const parseTimeString = (timeString) => {
    const [hours, minutes] = timeString.split(':').map(Number);
    const currentDate = new Date();
    currentDate.setHours(hours);
    currentDate.setMinutes(minutes);
    currentDate.setSeconds(0);
    return currentDate;
  };

  const handleConfirm = async () => {
    try {
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
          name: medicationData.name,
          dosage: medicationData.dosage,
          upc: medicationData.upc,
          image: medicationData.image,
          notifications: {
            interval: reminderInterval / (60 * 60 * 1000), // Convert milliseconds to hours
            notification1:  {
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
      console.log('Update notifications payload:', payload);
      // Make the API call using Axios with headers
      const response = await axios.post(`http://${ip}:8000/update_notifications`, payload, { headers });

      // Handle successful response
      console.log('Update notifications response:', response.data);

      navigation.navigate('ChildInfo', { name: child.name });
      
    } catch (error) {
      // Handle error
      console.error('Error updating notifications:', error);
    }
  };

  const formatTime = (time) => {
    const hours = time.getHours().toString().padStart(2, '0');
    const minutes = time.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
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

  const handleTimeChange = (event, selectedTime) => {
    if (selectedTime !== undefined) {
      const newReminderTimes = [...reminderTimes];
      newReminderTimes[selectedTimeIndex].time = selectedTime;
    
      // Calculate interval in milliseconds based on the provided hours
      const interval = reminderInterval; // assuming it's already in milliseconds
    
      // Update times in previous boxes if not the first box
      if (selectedTimeIndex > 0) {
        for (let i = selectedTimeIndex - 1; i >= 0; i--) {
          newReminderTimes[i].time = new Date(
            newReminderTimes[i + 1].time.getTime() - interval
          );
        }
      }
    
      // Update times in following boxes if not the last box
      if (selectedTimeIndex < newReminderTimes.length - 1) {
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

  const toggleTimeSelection = (index) => {
    setSelectedTimeIndex(index);
    setShowTimePicker(true);
  };

  const handleReminderIntervalSelect = (interval) => {
    setReminderInterval(interval);
  
    // Calculate new reminder times based on the first time
    const newReminderTimes = [...reminderTimes];
    const firstTime = reminderTimes[0].time;
  
    // Update times for remaining reminders
    for (let i = 1; i < newReminderTimes.length; i++) {
      newReminderTimes[i].time = new Date(firstTime.getTime() + interval * i);
    }
  
    // Update state with new reminder times
    setReminderTimes(newReminderTimes);
  };  

  const fetchNotificationData = async () => {
    try {
      // Retrieve the access token
      const token = tokenValue;

      // Prepare the headers
      const headers = {
        Authorization: `Bearer ${token}`
      };

      const payload = {
        child_name: child.name,
        upc: medicationData.upc,
      };

      // Make the API call using Axios with headers
      const response = await axios.post(`http://${ip}:8000/get_notifications`, payload, { headers });

      // Handle successful response
      console.log('Notification data:', response.data);
      setNotificationData(response.data);

      // Process notification times
      const times = [
        { time: parseTimeString(response.data.notification1.time), given: response.data.notification1.given },
        { time: parseTimeString(response.data.notification2.time), given: response.data.notification2.given },
        { time: parseTimeString(response.data.notification3.time), given: response.data.notification3.given }
      ];
      setReminderTimes(times);
      setReminderInterval(response.data.interval * 60 * 60 * 1000); // Convert hours to milliseconds
    } catch (error) {
      // Handle error
      console.error('Error fetching notification data:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.upcContainer}>
        <Text style={styles.upc}>UPC: {medicationData.upc}</Text>
      </View>
      <View style={styles.contentContainer}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: medicationData.image }} style={styles.image} />
        </View>
        <View style={styles.infoContainer}>
          {renderChildInfo()}
        </View>
      </View>
      <View style={styles.productContainer}>
        <Text style={styles.productName}>
          {medicationData.name
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
          Dose: <Text style={styles.dosageText}>{medicationData.dosage}</Text>{" "}
        </Text>
      </InnerContainer>

    {/* Interval selection buttons */}
    <View style={styles.reminderButtonContainer}>
        <TouchableOpacity
          style={[
            styles.reminderButton,
            reminderInterval === 6 * 60 * 60 * 1000 && styles.reminderButtonSelected,
          ]}
          onPress={() => handleReminderIntervalSelect(6 * 60 * 60 * 1000)}
        >
          <Text style={styles.reminderButtonText}>6 Hours</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.reminderButton,
            reminderInterval === 8 * 60 * 60 * 1000 && styles.reminderButtonSelected,
          ]}
          onPress={() => handleReminderIntervalSelect(8 * 60 * 60 * 1000)}
        >
          <Text style={styles.reminderButtonText}>8 Hours</Text>
        </TouchableOpacity>
      </View>

      {/* Render reminder times */}
      {reminderTimes.map((item, index) => (
        <View key={index} style={[styles.reminderTimeContainer]}>
        <TouchableOpacity
            style={[
              styles.checkbox,
              item.given ? styles.checkboxGiven : styles.checkboxNotGiven // Updated
            ]}
            onPress={() => toggleTimeSelection(index)}
        >
        </TouchableOpacity>
        <TouchableOpacity
            style={styles.reminderTimeTextContainer}
            onPress={() => toggleTimeSelection(index)}
        >
            <Text
            style={[
                styles.reminderTimeText,
                !item.given && styles.blurText, // Updated
            ]}
            >
            {item.time.toLocaleTimeString()}
            </Text>
        </TouchableOpacity>
      </View>
      
        ))}


      {/* Show time picker */}
      {showTimePicker && (
        <DateTimePicker
          value={reminderTimes[selectedTimeIndex].time}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={handleTimeChange}
        />
      )}

      {/* Confirm button */}
      <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
        <Text style={styles.confirmButtonText}>Confirm</Text>
      </TouchableOpacity>
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
    textAlign: "center",
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
  checkboxGiven: {
    backgroundColor: "#00FF00", // Green for given notification
    borderColor: "#00FF00",
  },
  checkboxNotGiven: {
    backgroundColor: "#FF0000", // Red for not given notification
    borderColor: "#FF0000",
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
    color: "#000",
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

export default EditMedication;
