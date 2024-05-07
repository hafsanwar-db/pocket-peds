import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, StyleSheet, ScrollView, FlatList } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { StyledContainer, InnerContainer, Colors } from '../components/styles';
import axios from 'axios';

const { darkLight, primary, grey } = Colors;

const ChildInfo = ({ route, navigation }) => {
  const { baby } = route.params;
  const [name, setName] = useState(baby.name);
  const [dateOfBirth, setDateOfBirth] = useState(baby.dateOfBirth);
  const [weight, setWeight] = useState(baby.weight);
  const [allergies, setAllergies] = useState(baby.allergies || '');
  const [medications, setMedications] = useState(baby.medications || []);
  const [medicationName, setMedicationName] = useState('');
  const [dosage, setDosage] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleAddMedication = () => {
    const newMedication = { name: medicationName, dosage };
    setMedications([...medications, newMedication]);
    setMedicationName('');
    setDosage('');
  };

  const handleUpdate = async () => {
    const updatedProfile = {
      name,
      dob: dateOfBirth,
      weight,
      allergies,
      medications,
    };

    try {
      const response = await axios.put(`http://127.0.0.1:8000/child-profiles/${baby.id}`, updatedProfile);
      console.log(response.data.message);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  
const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
    justifyContent: 'space-between'
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 20,
  },
  defaultImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#D3D3D3',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 20,
  },
  initials: {
    color: 'black',
    fontSize: 24,
  },
  infoBox: {
    backgroundColor: darkLight,
    borderRadius: 10,
    padding: 10,
  },
  nameText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  detailText: {
    fontSize: 16,
  },
  editButtonBottom: {
    backgroundColor: grey,
    borderRadius: 5,
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  editButtonText: {
    color: 'black',
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginVertical: 5,
  },
  addButton: {
    backgroundColor: primary,
    padding: 10,
    alignItems: 'center',
    borderRadius: 5,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
  },
  medicationItem: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  medicationText: {
    fontSize: 16,
  },
});
}
export default ChildInfo;
