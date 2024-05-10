import React, { useState, useEffect, useContext } from 'react';
import { View, ScrollView, TouchableOpacity, Text, Image, Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import {Token} from '../components/Token';
import { useIsFocused } from '@react-navigation/native'
import {
  StyledContainer,
  InnerContainer,
  PageTitle,
  SubTitle,
  Colors,
} from '../components/styles';
import KeyboardAvoidingWrapper from '../components/KeyboardAvoidingWrapper';
import axios from 'axios';
import ip from './ip.js';

const {height, width} = Dimensions.get('window');

const imageList = [
  require('../assets/img/avatar1.png'),
  require('../assets/img/avatar2.png'),
  require('../assets/img/avatar3.png'),
  require('../assets/img/avatar4.png'),
  require('../assets/img/avatar5.png'),
  require('../assets/img/avatar6.png')
];
const imageMap = {'avatar1': imageList[0], 'avatar2': imageList[1], 'avatar3': imageList[2], 'avatar4': imageList[3], 'avatar5': imageList[4], 'avatar6': imageList[5]};


const Child = ({ navigation }) => {
  const [profiles, setProfiles] = useState([]);
  const {tokenValue} = useContext(Token);
  const isFocused = useIsFocused();
  const [name, setName] = useState('');

  useEffect(() => {
    fetchProfiles();
  }, [isFocused]); // Empty dependency array ensures the effect runs only once

  useEffect(() => {
    const token = tokenValue;
    // Fetch child info using Axios

    axios.get(`http://${ip}:8000/user-profile/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        console.log("get name: ", response.data);
        setName(response.data.username);
      })
      .catch((error) => {
        console.error('Error fetching user profile:', error);
      });
  }, [tokenValue]);
  
  // Fetch and format the data
  const fetchProfiles = async () => {
    try {
      const token = tokenValue;
      const response = await axios.get(`http://${ip}:8000/all-child-profiles/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // console.log("DATA: ", response.data);
  
      //PRObably don't need to end all the data?
      const formattedData = response.data.map(item => {
        return {
          id: item._id,
          name: item.name.charAt(0).toUpperCase() + item.name.slice(1), // Capitalize the first letter of the name
          image: imageMap[item.image] // Add the image field if available in the data
        };
      });
  
      // console.log("PROFILE: ", formattedData);
      setProfiles(formattedData);
    } catch (error) {
      console.error('Error fetching profiles:', error);
    }
  };

  const renderProfileItem = (item) => {
    return (
    <TouchableOpacity
      key={item.id}
      style={{ alignItems: 'center', marginBottom: 20 }}
      onPress={() => {
        navigation.navigate('ChildInfo', { name: item.name })
      }}
    >
      <View style={{
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: item.image ? 'transparent' : '#D3D3D3', // Default gray if no image
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        borderWidth: 2,  // Black border
        borderColor: 'black'
        
      }}>
        <Image
          source={item.image} // Show image if available
          style={{ width: '100%', height: '100%' }}
          resizeMode="cover"
        />
      </View>
      <Text style={{ fontSize: 16 }}>{item.name}</Text>
    </TouchableOpacity>
  )
};

  const renderAddProfileButton = () => (
    <TouchableOpacity
      style={{ alignItems: 'center', marginBottom: 20 }}
      onPress={() => navigation.navigate('AddChild')}
    >
      <View
        style={{
          width: 80,
          height: 80,
          borderRadius: 40,
          backgroundColor: 'gray',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Ionicons name="add" size={60} color="black" />
      </View>
      <Text style={{ fontSize: 16, color: 'black' }}>Add Child</Text>
    </TouchableOpacity>
  );

  const addProfile = (newProfile) => {
    const newProfileId = (profiles.length + 1).toString();
    const updatedProfile = { ...newProfile, id: newProfileId };
    setProfiles([...profiles, updatedProfile]);
  };

  return (
    <KeyboardAvoidingWrapper>
      <StyledContainer>
        <StatusBar style="dark" />
        <InnerContainer>
          
        <View style={{ textAlign: 'left' }}>
          <Text style={{
            fontWeight: "bold",
            color: "#0070CA",
            fontSize: 30,
            marginBottom: 5,
          }}>{name},</Text>

          <Text style={{
            textAlign:'left',
            fontSize:26,
            marginBottom:0.05*height,
          }}>Who are you dosing for?</Text>
        </View>
          <ScrollView contentContainerStyle={{ flexGrow: 1 , width: 0.65*width}}>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', columnGap: 0.2*width}}>
              {profiles.map((item) => renderProfileItem(item))}
              {renderAddProfileButton()}
            </View>
          </ScrollView>
        </InnerContainer>
      </StyledContainer>
    </KeyboardAvoidingWrapper>
  );
};

export default Child;