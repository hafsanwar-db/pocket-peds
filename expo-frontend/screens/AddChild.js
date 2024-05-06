import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';


import {
  StyledContainer,
  InnerContainer,
  PageTitle,
  Colors,
} from '../components/styles';

import KeyboardAvoidingWrapper from '../components/KeyboardAvoidingWrapper';

const { primary, darkLight } = Colors;

const AddChild = ({ navigation, route }) => {
  const [newProfileName, setNewProfileName] = useState('');
  const [newDateOfBirth, setNewDateOfBirth] = useState('');
  const [newWeight, setNewWeight] = useState('');
  const [newAllergies, setNewAllergies] = useState('');
  const [newMedications, setNewMedications] = useState('');
  const [profileImage, setProfileImage] = useState(null);

   const handleImagePicker = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to select an image.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.cancelled) {
      setProfileImage(result.uri);
    }
  };

  const handleSubmit = async () => {
    if (newProfileName.trim() !== '') {
      const newProfile = {
        name: newProfileName.trim(),
        age: newDateOfBirth.trim(), // Add the age calculation logic
        date_of_birth: newDateOfBirth.trim(),
        weight: parseFloat(newWeight.trim()),
        sex: 'unknown', // Add the appropriate sex value
        allergies: newAllergies.trim().split(',').map(allergy => allergy.trim()),
        medications: newMedications.trim().split(',').map(medication => medication.trim()),
      };
  
      try {
        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NjM4OTMzMDU0NmE0MDJmNWRmNWMyODIifQ.hTvOG8NbX3IkjF7bTlnJbO1ux_QoYmoIqhju8pA7mEg" //await getAccessToken(); // Implement the logic to get the access token
        const response = await axios.post('http://127.0.0.1:8000/child-profiles/', newProfile, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response.data.message);
        route.params.addProfile(newProfile);
        navigation.goBack();
      } catch (error) {
        console.error('Error adding profile:', error);
        // Handle the error, show an error message, etc.
      }
    }
  };

  
  return (
    <KeyboardAvoidingWrapper>
      <StyledContainer>
        <StatusBar style="dark" />
        <InnerContainer>
          <PageTitle>Add </PageTitle>

          <TouchableOpacity
            style={{
              alignSelf: 'center',
              marginBottom: 20,
            }}
            onPress={handleImagePicker}
          >
            {profileImage ? (
              <Image
                source={{ uri: profileImage }}
                style={{ width: 100, height: 100, borderRadius: 50 }}
              />
            ) : (
              <View
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 50,
                  backgroundColor: darkLight,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text style={{ color: 'white', fontSize: 16 }}>Upload Image</Text>
              </View>
            )}
          </TouchableOpacity>

          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
            <Text style={{ fontSize: 16, marginRight: 10 }}>Name:</Text>
            <TextInput
              style={{
                flex: 1,
                height: 40,
                borderColor: darkLight,
                borderWidth: 1,
                borderRadius: 5,
                paddingHorizontal: 10,
              }}
              placeholder="Enter child name"
              value={newProfileName}
              onChangeText={setNewProfileName}
            />
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
            <Text style={{ fontSize: 16, marginRight: 10 }}>Date of Birth:</Text>
            <TextInput
              style={{
                flex: 1,
                height: 40,
                borderColor: darkLight,
                borderWidth: 1,
                borderRadius: 5,
                paddingHorizontal: 10,
              }}
              placeholder="YYYY-MM-DD"
              value={newDateOfBirth}
              onChangeText={setNewDateOfBirth}
            />
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
            <Text style={{ fontSize: 16, marginRight: 10 }}>Weight:</Text>
            <TextInput
              style={{
                flex: 1,
                height: 40,
                borderColor: darkLight,
                borderWidth: 1,
                borderRadius: 5,
                paddingHorizontal: 10,
              }}
              placeholder="Enter weight"
              value={newWeight}
              onChangeText={setNewWeight}
            />
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
            <Text style={{ fontSize: 16, marginRight: 10 }}>Allergies:</Text>
            <TextInput
              style={{
                flex: 1,
                height: 40,
                borderColor: darkLight,
                borderWidth: 1,
                borderRadius: 5,
                paddingHorizontal: 10,
              }}
              placeholder="Enter allergies"
              value={newAllergies}
              onChangeText={setNewAllergies}
            />
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
            <Text style={{ fontSize: 16, marginRight: 10 }}>Medications:</Text>
            <TextInput
              style={{
                flex: 1,
                height: 40,
                borderColor: darkLight,
                borderWidth: 1,
                borderRadius: 5,
                paddingHorizontal: 10,
              }}
              placeholder="Enter medications"
              value={newMedications}
              onChangeText={setNewMedications}
            />
          </View>

          <TouchableOpacity
            style={{
              backgroundColor: primary,
              borderRadius: 5,
              paddingHorizontal: 20,
              paddingVertical: 10,
              alignItems: 'center',
              backgroundColor: 'orange',
            }}
            onPress={handleSubmit}
          >
            <Text style={{ color: 'black', fontSize: 16 }}>Save Profile</Text>
          </TouchableOpacity>
        </InnerContainer>
      </StyledContainer>
    </KeyboardAvoidingWrapper>
  );
};
const handleSubmit = async () => {
  if (newProfileName.trim() !== '') {
    const newProfile = {
      name: newProfileName.trim(),
      dateOfBirth: newDateOfBirth.trim(),
      weight: newWeight.trim(),
      allergies: newAllergies.trim(),
      medications: newMedications.trim(),
      image: profileImage,
    };

    // try {
    //   const response = await axios.post('http://127.0.0.1:5000/api/adduser', newProfile);
    //   console.log(response.data.message);
    //   route.params.addProfile(newProfile);
    //   navigation.goBack();
    // } catch (error) {
    //   console.error('Error adding profile:', error);
    //   // Handle the error, show an error message, etc.
    // }
  }
};

export default AddChild;