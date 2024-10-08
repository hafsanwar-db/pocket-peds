import React, { useState, useEffect, useContext } from 'react';
import { View, AppState, Dimensions, Text, Image, TouchableOpacity, TextInput, StyleSheet, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { StyledContainer, InnerContainer, Colors, WeightModalButton } from '../components/styles';
import { SwipeListView } from 'react-native-swipe-list-view';
import Icon from 'react-native-vector-icons/FontAwesome';
import ip from './ip.js';
import {Token} from '../components/Token';
import axios from 'axios';
import ChangeWeightModal from '../components/modal/ChangeWeightModal';
import { useIsFocused } from '@react-navigation/native'

const { darkLight, primary, grey } = Colors;

const ChildInfo = ({ route, navigation }) => {
  const { name } = route.params;
  const [appState, setAppState] = useState(AppState.currentState);
  const [childInfo, setChildInfo] = useState(null);
  const [medications, setMedications] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const {tokenValue, updateChild} = useContext(Token);
  const isFocused = useIsFocused();
  const handleAppStateChange = (nextAppState) => {
    setAppState(nextAppState);
  };
  const imagePaths = {
    avatar1: require('../assets/img/avatar1.png'),
    avatar2: require('../assets/img/avatar2.png'),
    avatar3: require('../assets/img/avatar3.png'),
    avatar4: require('../assets/img/avatar4.png'),
    avatar5: require('../assets/img/avatar5.png'),
    avatar6: require('../assets/img/avatar6.png'),
    // Add more images as needed
  };

  // Fetch child info and medications on component mount
  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );
    if (appState === "active") {
      fetchChildInfo();
    }
      
    return () => {
      subscription?.remove();
    };
  }, [isFocused, appState]);

  // Fetch child info from the API
  const fetchChildInfo = async () => {
    try {
      const token = tokenValue //await getAccessToken(); // Implement the logic to get the access token
      const response = await axios.get(`http://${ip}:8000/child-profiles/${name.toLowerCase()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // console.log("RESPONSE CHILD: ", response.data);
      updateChild(response.data); //updates the context
      setChildInfo(response.data);
      setMedications(response.data.medications); // Set medications from child info
    } catch (error) {
      console.error('Error fetching child info:', error);
    }
  };

  // Fetch medications from the API
  const fetchMedications = async () => {
    try {
      const response = await axios.get(`http://${ip}:8000/get_medicine?upc=${childInfo.upc}`);
      // response = {
      //   data: {
      //     "child_id": {
      //       "$oid": "60a1234567890abcdef12345"
      //     },
      //     "medications": [
      //       {
      //         "name": "Acetaminophen",
      //         "time": {
      //           "$date": "2023-05-08T10:30:00Z"
      //         },
      //         "dose": 5.5,
      //         "upc": 123456789012
      //       },
      //       {
      //         "name": "Ibuprofen",
      //         "time": {
      //           "$date": "2023-05-08T14:45:00Z"
      //         },
      //         "dose": 7.5,
      //         "upc": 987654321098
      //       }
      //     ]
      //   }
      // };
      setMedications(response.data.medications);
    } catch (error) {
      console.error('Error fetching medications:', error);
    }
  };

  // Calculate child's age in years and months
  const calculateAge = (dateOfBirth) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    const months = (today.getMonth() - birthDate.getMonth() + 12) % 12;
    if(months > 1){
    return `${age} years ${months} months`;
    }else{
      return `${age} years ${months} month`;
    }
  };

  const calculateAgeFromMonths = (ageInMonths) => {
    const years = Math.floor(ageInMonths / 12);
    const months = ageInMonths % 12;
  
    if (years === 0) {
      if (months === 1) {
        return `${months} month`;
      } else {
        return `${months} months`;
      }
    } else if (months === 0) {
      return `${years} years`;
    } else if (months === 1) {
      return `${years} years ${months} month`;
    } else {
      return `${years} years ${months} months`;
    }
  };

  // Handle edit profile button press
  const handleEditProfile = () => {
    setIsEditing(true);
  };

  // Render the child info section
  const renderChildInfo = () => {
    if (!childInfo) return null;

    const { name, date_of_birth, weight, last_updated, image } = childInfo;
    // const { years, months } = calculateAge(date_of_birth);
    const weightInKg = (weight * 0.45359237).toFixed(1);
    // const last_updated_date = new Date(last_updated).toLocaleDateString();

    return (
      <>
        <ChangeWeightModal navigation={navigation} name={name} />
        <View style={styles.childInfoContainer}>
          <TouchableOpacity onPress = {() =>{
            navigation.navigate('UpdateProfile', {name: name, image: image});
          
          }}>
          <Image source={imagePaths[childInfo.image]} style={styles.profileImage} />
          </TouchableOpacity>
          <View style={styles.childInfoTextContainer}>
            <Text style={styles.childName}>{childInfo.name.toLowerCase().replace(/\b(\s\w|^\w)/g, function (txt) { return txt.toUpperCase(); })}</Text>
            <Text style={styles.childAge}>{calculateAgeFromMonths(childInfo.age)}</Text>
            <Text style={styles.childWeight}>{childInfo.weight} lbs ({(childInfo.weight * 0.45359237).toFixed(1)} kg)</Text>
            {/* <Text style={styles.lastUpdated}>Last Updated: {last_updated_date}</Text> */}
          </View>
        </View>
      </>
    );
  };

  const handleEditMedication = (medicationData) => {
    navigation.navigate('EditMedication', { medicationData });
  };

  const handleDeleteMedication = async (medicationData, index) => {
    try {
      const token = tokenValue; // await getAccessToken(); // Implement the logic to get the access token
  
      const payload = {
        upc: medicationData.upc,
        child_name: childInfo.name,
      };
  
      const headers = {
        Authorization: `Bearer ${token}`,
      };
  
      await axios.post(`http://${ip}:8000/delete-child-medication`, payload, { headers });
      
      // Update medications array to remove the deleted medication
      const updatedMedications = [...medications];
      updatedMedications.splice(index, 1);
      setMedications(updatedMedications);
    } catch (error) {
      console.error('Error deleting medication:', error);
    }
  };

// Render the medication list
const renderMedications = () => {
  return (
    <SwipeListView
      data={medications}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item }) => {
        if(item.upc != ""){
        return(<View style={styles.medicationItemContainer}>
          <Image source={{ uri: item.image }} style={styles.medicationImage} />
          <View style={styles.medicationTextContainer}>
            <Text style={styles.medicationName}>{item.name.toLowerCase().replace(/\b(\s\w|^\w)/g, function (txt) { return txt.toUpperCase(); })}</Text>
            <Text style={styles.medicationUPC}>UPC: {item.upc}</Text>
            <Text style={styles.medicationDosage}>Dose: {item.dosage}</Text>
          </View>
        </View>)}
        else{
          return(<View></View>)
        }
      }}
      renderHiddenItem={({ item, index }) => (
        <View style={styles.hiddenItemContainer}>
          <TouchableOpacity
            style={[styles.hiddenItemButton, styles.editButton]}
            onPress={() => handleEditMedication(item, index)}
          >
            <Icon name="clock-o" size={20} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.hiddenItemButton, styles.deleteButton]}
            onPress={() => handleDeleteMedication(item, index)}
          >
            <Icon name="trash" size={20} color="white" />
          </TouchableOpacity>
        </View>
      )}
      rightOpenValue={-75}
    />
  );
};

// Helper function to format the date
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

  return (
    <StyledContainer>
      <StatusBar style="dark" />
      <InnerContainer>
        {renderChildInfo()}
        {renderMedications()}
        {/* {!isEditing && (
          <TouchableOpacity style={styles.editProfileButton} onPress={(handleEditProfile)}>
            <Text style={styles.editProfileButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        )} */}

      <WeightModalButton onPress={() => navigation.navigate('MyCalendar')} title="History" style={{ backgroundColor: '#FEB624', width: "50%" }} >
          <Text style={{ fontSize: 20, color: "black" }}>History</Text>
      </WeightModalButton>

      </InnerContainer>
    </StyledContainer>
  );
};

const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  // ...
  childInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 25,
    marginLeft: 10,
  },
  profileImageContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'lightpink', //REMOVE. PULL FROM DB
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 20,
  },
  profileInitials: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  childInfoTextContainer: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: 10,
  },
  childName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  childAge: {
    fontSize: 16,
    marginBottom: 5,
  },
  childWeight: {
    fontSize: 16,
  },
  lastUpdated: {
    fontSize: 14,
    color: 'gray',
  },
  medicationListContainer: {
    width: '100%',
    color: 'black',
  },
  medicationDateContainer: {
    marginBottom: 10,
  },
  medicationDate: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  medicationItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 5,
    marginBottom: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    width: screenWidth * 0.86,
  },
  medicationImage: {
    width: 50,
    height: 75,
    backgroundColor: 'lightgrey',
    marginRight: 25,
  },
  medicationTextContainer: {
    backgroundColor: '#e0f2ff',
    borderRadius: 5,
    padding: 10,
    width: '80%',
  },
  medicationName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  medicationDosage: {
    fontSize: 14,
    color: 'black',
  },
  medicationUPC: {
    fontSize: 14,
    color: 'black',
  },
  medicationTime: {
    fontSize: 14,
    color: 'gray',
  },
  editProfileButton: {
    backgroundColor: grey,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignSelf: 'center',
    marginTop: 20,
  },
  editProfileButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginRight: 20,
  },
  defaultImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: getRandomColor(),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 20,
  },
  infoBox: {
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: 10,
  },
  hiddenItemContainer: {
    alignItems: 'flex-end',
    borderRadius: 5,
    width: screenWidth * 0.85,
    padding: 10,
  },
  hiddenItemButton: {
    padding: 5,
    borderRadius: 5,
    width: screenWidth * 0.15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButton: {
    marginBottom: 8,
    backgroundColor: '#ffb200',
  },
  deleteButton: {
    backgroundColor: 'red',
  },
  hiddenItemButtonText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 12,
    paddingVertical: 4
  },
});



export default ChildInfo;