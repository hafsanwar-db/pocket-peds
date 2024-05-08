import React, { useState, useEffect, useContext } from 'react';
import { View, ScrollView, TouchableOpacity, Text, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import {Token} from '../components/Token';
import {
  StyledContainer,
  InnerContainer,
  PageTitle,
  SubTitle,
  Colors,
} from '../components/styles';
import KeyboardAvoidingWrapper from '../components/KeyboardAvoidingWrapper';
import axios from 'axios';


const { primary, darkLight } = Colors;

const Child = ({ navigation }) => {
  const [profiles, setProfiles] = useState([]);
  const {tokenValue} = useContext(Token);
  useEffect(() => {
    fetchProfiles();
  }, []); // Empty dependency array ensures the effect runs only once
  
  // Fetch and format the data
  const fetchProfiles = async () => {
    try {
      const token = tokenValue;
      const response = await axios.get('http://127.0.0.1:8000/child-profiles/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("DATA: ", response);
  
      //PRObably don't need to end all the data?
      const formattedData = response.data.map(item => {
        return {
          id: item?._id,
          name: item?.name,
          image: item?.image // Add the image field if available in the data
        };
      });
  
      console.log("PROFILE: ", formattedData);
      setProfiles(formattedData);
    } catch (error) {
      console.error('Error fetching profiles:', error);
    }
  };

  const renderProfileItem = (item) => (
    <TouchableOpacity
      key={item.id}
      style={{ alignItems: 'center', marginBottom: 20 }}
      onPress={() => navigation.navigate('ChildInfo', { name: item.name })}
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
          source={item.image ? { uri: item.image } : null} // Show image if available
          style={{ width: '100%', height: '100%' }}
          resizeMode="cover"
        />
      </View>
      <Text style={{ fontSize: 16 }}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderAddProfileButton = () => (
    <TouchableOpacity
      style={{ alignItems: 'center', marginBottom: 20 }}
      onPress={() => navigation.navigate('AddChild', { addProfile })}
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
          <PageTitle>Child Screen</PageTitle>
          <SubTitle>Children</SubTitle>
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
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