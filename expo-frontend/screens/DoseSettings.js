import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { schedulePushNotification } from '../notifications/handleNotifications';
import {
  StyledContainer,
  InnerContainer,
  PageLogo,
  PageTitle,
  SubTitle,
  StyledFormArea,
  LeftIcon,
  StyledInputLabel,
  StyledTextInput,
  RightIcon,
  StyledButton,
  ButtonText,
  Colors,
  MessageBox,
  Line,
  ExtraText,
  ExtraView,
  TextLink,
  TextLinkContent
} from '../components/styles';
const DoseSettings = ({ route }) => {
 const { scannedData, apiData } = route.params;
 const [reminderInterval, setReminderInterval] = useState(null);
 const [reminderTimes, setReminderTimes] = useState([]);
 const [showTimePicker, setShowTimePicker] = useState(false);
 const [selectedTimeIndex, setSelectedTimeIndex] = useState(null);

 useEffect(() => {
    if (reminderInterval) {
      const newReminderTimes = Array.from({ length: 3 }, (_, index) => {
        let currentTime = new Date();
        
        // Set default times based on interval
        if (reminderInterval === 8 * 60 * 60 * 1000) {
          // For 8-hour interval
          reminderTimes.push({time: currentTime.setHours(10, 0, 0, 0), selected: false,doseGiven: false  }); // 10:00 AM
          reminderTimes.push({ time: currentTime.setHours(18, 0, 0, 0), selected: false,doseGiven: false }); // 6:00 PM
          switch (index) {
            case 0:
              currentTime.setHours(10, 0, 0, 0);
              break;
            case 1:
              currentTime.setHours(18, 0, 0, 0);
              break;
            case 2:
              currentTime.setDate(currentTime.getDate() + 1); // Next day for 2 am
              
              reminderTimes.push({time:  currentTime.setHours(2, 0, 0, 0), selected: false,doseGiven: false  }); // Next day 2:00 AM

              break;
            default:
              break;
          }
        } else if (reminderInterval === 6 * 60 * 60 * 1000) {
          // For 6-hour interval
          reminderTimes.push({ selected: false,time: currentTime.setHours(9, 0, 0, 0), selected: false,doseGiven: false }); // 9:00 AM
          reminderTimes.push({ selected: false,time: currentTime.setHours(15, 0, 0, 0), selected: false,doseGiven: false  }); // 3:00 PM
          reminderTimes.push({ selected: false,time: currentTime.setHours(21, 0, 0, 0), selected: false,doseGiven: false  }); // 9:00 PM
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
        
        return { time: currentTime, selected: false,doseGiven: false };
      });
      
      setReminderTimes(newReminderTimes);
    }
  }, [reminderInterval]);

  const handleReminderIntervalSelect = (interval) => {
      setReminderInterval(interval);
      
   
   
 };

 const toggleReminderTime = (index) => {
    setSelectedTimeIndex(index);
    setShowTimePicker(true);
    const newReminderTimes = [...reminderTimes];
    newReminderTimes[index].doseGiven = !newReminderTimes[index].doseGiven;
    setReminderTimes(newReminderTimes);
 };

 const handleTimeChange = (event, selectedTime) => {
    if (selectedTime !== undefined) {
      const newReminderTimes = [...reminderTimes];
      newReminderTimes[selectedTimeIndex].time = selectedTime;
      
      // Update times in previous boxes if not the first box
      if (selectedTimeIndex > 0) {
        const interval = reminderInterval || newReminderTimes[1].time.getTime() - newReminderTimes[0].time.getTime();
        for (let i = selectedTimeIndex - 1; i >= 0; i--) {
          newReminderTimes[i].time = new Date(newReminderTimes[i + 1].time.getTime() - interval);
        }
      }
      
      // Update times in following boxes if not the last box
      if (selectedTimeIndex < newReminderTimes.length - 1) {
        const interval = reminderInterval || newReminderTimes[1].time.getTime() - newReminderTimes[0].time.getTime();
        for (let i = selectedTimeIndex + 1; i < newReminderTimes.length; i++) {
          newReminderTimes[i].time = new Date(newReminderTimes[i - 1].time.getTime() + interval);
        }
      }
      
      setReminderTimes(newReminderTimes);
      setShowTimePicker(false);
    } else {
      setShowTimePicker(false);
    }
  };
  
  const generateUniqueReminderId = () => {
    const baseId = 'reminder_'; // Base ID
    const uniqueId = Date.now().toString(36); // Unique identifier (timestamp converted to base-36 string)
    return baseId + uniqueId;
  };
  const handleLocalPushNotification = async () => {
    const medicineName = scannedData["name"];
    const dosage = apiData["dosage"];

    for (let i = 0; i < reminderTimes.length; i++) {
      const time = reminderTimes[i].time;
      const doseGiven = reminderTimes[i].doseGiven;
      const reminderId = generateUniqueReminderId();
      const scheduledNotificationId = await schedulePushNotification(time, medicineName, dosage, doseGiven,reminderId);
      const medications = [
        {
          name: medicineName,
          upc: scannedData["upc"],
          dosage: dosage,
          notification: {
            timestamp1: ["action1", "action2"],
            timestamp2: ["action3", "action4"]
          }
        },
        // Add more medications as needed
      ];
      // Update the notificationIds object with the new mapping
      /*setNotificationIds(prevIds => ({
        ...prevIds,
        [reminderId]: scheduledNotificationId
      }));*/

      if (doseGiven) {
        const nextDayTime = new Date(time);
        nextDayTime.setDate(nextDayTime.getDate() + 1);
        const nextDayIndex = reminderTimes.findIndex((item) => item.time.getTime() === nextDayTime.getTime());
        if (nextDayIndex !== -1) {
          reminderTimes[nextDayIndex].doseGiven = false;
        }
      }
    }
  };
  
 const toggleTimeSelection = (index) => {
   const newReminderTimes = [...reminderTimes];
   newReminderTimes[index].selected = !newReminderTimes[index].selected;
   setReminderTimes(newReminderTimes);
 };
 // Function to cancel a notification based on reminder ID
  const cancelNotification = (notifId) => {
    const notificationId = notificationIds[reminderId];
    if (notificationId) {
      // Cancel the notification using its ID
      Notifications.cancelScheduledNotificationAsync(localNotificationId)
      
      // Remove the mapping from notificationIds
      setNotificationIds(prevIds => {
        const updatedIds = { ...prevIds };
        delete updatedIds[reminderId];
        return updatedIds;
      });
    }
  };

 return (
   <View style={styles.container}>
     <Text style={styles.upc}>{scannedData.upc}</Text>
     <Image source={{ uri: scannedData.image }} style={styles.image} />
     <View style={styles.productContainer}>
       <Text style={styles.productName}>{scannedData.name}</Text>
     </View>
     <Text style={styles.doseText}>Dose</Text>
     <Text style={styles.dosageText}>{apiData.dosage}</Text>
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
     {reminderTimes.map((item, index) => (
       <View key={index} style={[styles.reminderTimeContainer]}>
         <TouchableOpacity
           style={[styles.checkbox, item.selected ? styles.checkboxSelected : styles.checkboxUnselected]}
           onPress={() => toggleTimeSelection(index)}
         >
          <Text style={styles.checkboxText}>{item.doseGiven ? '✓' : '✕'}</Text>
         </TouchableOpacity>
         <TouchableOpacity
           style={styles.reminderTimeTextContainer}
           onPress={() => toggleReminderTime(index)}
         >
           <Text style={[styles.reminderTimeText, !item.selected && styles.blurText]}>
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
      <StyledButton onPress={handleLocalPushNotification} >
        <ButtonText>Confirm</ButtonText>
      </StyledButton>
   </View>
 );
};

const styles = StyleSheet.create({
 container: {
   flex: 1,
   backgroundColor: '#fff',
   alignItems: 'center',
   justifyContent: 'center',
   paddingHorizontal: 20,
 },
 upc: {
   fontSize: 16,
   marginBottom: 10,
 },
 image: {
   width: 100,
   height: 100,
   resizeMode: 'contain',
   marginBottom: 20,
 },
 productContainer: {
   alignItems: 'center',
   marginBottom: 20,
 },
 productName: {
   fontSize: 18,
   fontWeight: 'bold',
   textAlign: 'center',
 },
 directionContainer: {
   marginTop: 10,
 },
 directionText: {
   fontSize: 16,
   fontWeight: 'bold',
 },
 directionDetails: {
   fontSize: 14,
   textAlign: 'center',
 },
 doseText: {
   fontSize: 16,
   fontWeight: 'bold',
   marginBottom: 10,
 },
 dosageText: {
   fontSize: 14,
   marginBottom: 20,
 },
 reminderButtonContainer: {
   flexDirection: 'row',
   justifyContent: 'space-around',
   width: '80%',
   marginBottom: 20,
 },
 reminderButton: {
   backgroundColor: '#e6e6e6',
   paddingVertical: 10,
   paddingHorizontal: 20,
   borderRadius: 5,
 },
 reminderButtonSelected: {
   backgroundColor: '#FFA500',
 },
 reminderButtonText: {
   fontSize: 16,
   alignItems: 'center',
   fontWeight: 'bold',
   color: '#333',
 },
 reminderTimeContainer: {
   flexDirection: 'row',
   alignItems: 'center',
   justifyContent: 'space-between',
   backgroundColor: '#e6e6e6',
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
   borderColor: '#333',
   alignItems: 'center',
   justifyContent: 'center',
 },
 checkboxSelected: {
   backgroundColor: '#FFA500',
   borderColor: '#FFA500',
 },
 checkboxUnselected: {
   backgroundColor: 'transparent',
   borderColor: '#333',
 },
 checkboxText: {
   color: '#333',
   fontSize: 14,
 },
 blurText: {
   color: 'rgba(0,0,0,0.3)',
 },
 reminderTimeTextContainer: {
   flex: 1,
 },
 reminderTimeText: {
   fontSize: 16,
   fontWeight: 'bold',
   color: '#333',
 },
 selectedReminderTimeContainer: {
   backgroundColor: '#FFA500',
 },
});

export default DoseSettings;
