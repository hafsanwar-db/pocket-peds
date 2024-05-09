import React, { useState, useContext } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import Carousel from "./Carousel";
import { Token } from "../components/Token";
import ip from './ip.js';
import {
  StyledContainer,
  InnerContainer,
  PageTitle,
  Colors,
  MessageBox,
} from "../components/styles";
import Constants from "expo-constants";

import KeyboardAvoidingWrapper from "../components/KeyboardAvoidingWrapper";

const { primary, darkLight } = Colors;
const StatusBarHeight = Constants.statusBarHeight;

const AddChild = ({ navigation }) => {
  const [newProfileName, setNewProfileName] = useState("");
  const [newDateOfBirth, setNewDateOfBirth] = useState("");
  const [newWeight, setNewWeight] = useState("");
  const [newAllergies, setNewAllergies] = useState(null);
  const [newMedications, setNewMedications] = useState("");
  const [sex, setSex] = useState("");
  const [profileImage, setProfileImage] = useState("avatar1");
  const { tokenValue } = useContext(Token);

  const [message, setMessage] = useState();
  const [messageType, setMessageType] = useState();
  

  // const handleImagePicker = async () => {
  //   const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  //   if (status !== "granted") {
  //     alert("Sorry, we need camera roll permissions to select an image.");
  //     return;
  //   }

  const  convertDateFormat = (dateString) => {
    const [month, day, year] = dateString.split('-');
    const newDateString = `${year}-${month}-${day}`;
    return newDateString;
  }
  const calculateAge = (date_of_birth) => {
    const [month, day, year] = date_of_birth.split('-');
    const dob =  Date.parse(year, month, day);
    const currentDate = new Date();
    const diffInMs = currentDate - dob;
    const diffInMonths = Math.floor(diffInMs / (1000 * 60 * 60 * 24 * 30.44));
    console.log(diffInMonths) // Assuming 30.44 days in a month
    return diffInMonths;
  };

  const handleMessage = (message, type = 'FAILED') => {
    setMessage(message);
    setMessageType(type);
  };

  const handleSubmit = async () => {
    const isValidDate = (dateString) => {
      const regex = /^\d{2}-\d{2}-\d{4}$/;
      if (!regex.test(dateString)) {
      return false;
      }
      const month = parseInt(dateString.substring(0, 2));
      const day = parseInt(dateString.substring(3, 5));
      const year = parseInt(dateString.substring(6, 10));
      const date = new Date(year, month - 1, day);
      return (
      date.getFullYear() === year &&
      date.getMonth() === month - 1 &&
      date.getDate() === day
      );
    };

    if (newProfileName.trim() === "" || newDateOfBirth.trim() === "" || newWeight.trim() === "" || sex.trim() === "" || profileImage.trim() === "" ) {
      handleMessage("Please fill in all fields.");
    }

    else if (!isValidDate(newDateOfBirth.trim())) {
      handleMessage("Date of birth is not in the correct format. Please enter a valid date of birth.");
    }

    else if (new Date(newDateOfBirth.trim()) > new Date()) {
      handleMessage("Invalid date of birth. Please enter a valid date of birth.");
    }

    else if (isNaN(newWeight.trim()) || newWeight.trim() < 0) {
      handleMessage("Invalid weight. Please enter a valid weight.");
    }

      
    else{
      const newProfile = {
        name: newProfileName.trim().toLowerCase(),
        age: calculateAge(newDateOfBirth.trim()), // Add the age calculation logic
        date_of_birth: convertDateFormat(newDateOfBirth.trim()),
        weight: newWeight.trim(),
        sex: sex.toLowerCase(), // Add the appropriate sex value
        allergies: newAllergies
          ?.trim()
          .split(",")
          .map((allergy) => allergy?.trim()),
        medications: newMedications
          .trim()
          .split(",")
          .map((medication) => ({name: medication.trim().toLowerCase(),upc: "",dosage: ""})),
        image: profileImage,
      };

      try {
        const token = tokenValue; //await getAccessToken(); // Implement the logic to get the access token
        const response = await axios.post(
          `http://${ip}:8000/child-profiles/`,
          newProfile,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response)
        navigation.goBack();
      } catch (error) {
        console.error("Error adding profile (is the format correct?):", error);
        // Handle the error, show an error message, etc.
      }
    }
  };

  return (
    
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      <Carousel setImage = {setProfileImage}/>
      {/* </TouchableOpacity> */}
      <KeyboardAvoidingWrapper>
      <View style={styles.inputContainer}>
        <View style={styles.textInputContainer}>
          <Text style={styles.textForInput}>Name:</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Enter child name"
            value={newProfileName}
            onChangeText={setNewProfileName}
          />
        </View>

        <View style={styles.textInputContainer}>
          <Text style={styles.textForInput}>Date of Birth:</Text>
          <TextInput
            style={styles.textInput}
            placeholder="MM-DD-YYYY"
            value={newDateOfBirth}
            onChangeText={setNewDateOfBirth}
          />
        </View>
        <View style={styles.textInputContainer}>
          <Text style={styles.textForInput}>Sex:</Text>
          <TextInput
            style={styles.textInput}
            placeholder="female"
            value={sex}
            onChangeText={setSex}
          />
        </View>

        <View style={styles.textInputContainer}>
          <Text style={styles.textForInput}>Weight:</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Enter weight (in lbs)"
            value={newWeight}
            onChangeText={setNewWeight}
          />
        </View>
        <View style={styles.textInputContainer}>
          <Text style={styles.textForInput}>Medications:</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Medicine1, Medicine2 ..."
            value={newMedications}
            onChangeText={setNewMedications}
          />
        </View>
        <View style={styles.textInputContainer}>
          <Text style={styles.textForInput}>Allergies:</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Allergy1, Allergy2 ..."
            value={newAllergies}
            onChangeText={setNewAllergies}
          />
        </View>

        <MessageBox type={messageType}>{message}</MessageBox>

        <View style={{paddingBottom: 10, flexDirection:"row", justifyContent:'center' }}>
        <TouchableOpacity
        style={{
          backgroundColor: primary,
          borderRadius: 15,
          paddingHorizontal: 20,
          paddingVertical: 10,
          alignItems: "center",
          backgroundColor: "#FDB623",
        }}
        onPress={handleSubmit}
      >
        <Text style={{ color: "black", fontSize: 16 }}>Save Profile</Text>
      </TouchableOpacity>
      </View>
        
      </View>
      </KeyboardAvoidingWrapper>
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: StatusBarHeight,
    backgroundColor: "white",
    height: height,
    overflow: "visible",
  },
  inputContainer: {
    width: width,
    paddingLeft: 20,
    paddingRight: 20,
  },
  textInput: {
    flex: 0.65,
    height: 40,
    backgroundColor: "#C4C4C4",
    borderColor: darkLight,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
    textAlign: "center",
  },
  textInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  textForInput: {
    flex: 0.35,
    fontSize: 16,
    marginRight: 10,
    textAlign: "right",
    marginRight: 15,
    color: "#4D4D4D",
  },
});

export default AddChild;
{/* <TouchableOpacity
            style={{
              alignSelf: 'center',
              marginBottom: 20,
              borderWidth: 1,
              borderColor: 'red',
            }}
            // onPress={handleImagePicker}
          > */}
      {/* {profileImage ? (
            //   <Image
            //     source={{ uri: profileImage }}
            //     style={{ width: 100, height: 100, borderRadius: 50 }}
            //   />
            // ) : (
            //   <View
            //     style={{
            //       width: 100,
            //       height: 100,
            //       borderRadius: 50,
            //       backgroundColor: darkLight,
            //       alignItems: 'center',
            //       justifyContent: 'center',
            //     }}
            //   >
            //     <Text style={{ color: 'white', fontSize: 16 }}>Upload Image</Text>
            //   </View>
            )} */}

  // const handleImagePicker = async () => {
  //   const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  //   if (status !== "granted") {
  //     alert("Sorry, we need camera roll permissions to select an image.");
  //     return;
  //   }

  //   let result = await ImagePicker.launchImageLibraryAsync({
  //     mediaTypes: ImagePicker.MediaTypeOptions.Images,
  //     allowsEditing: true,
  //     aspect: [1, 1],
  //     quality: 1,
  //   });

  //   if (!result.cancelled) {
  //     setProfileImage(result.uri);
  //   }
  // };