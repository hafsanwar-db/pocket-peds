// ShowData.js
import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

const ShowData = ({ route, navigation }) => {
  const { scannedData, apiData } = route.params;

  const handleStartDosePress = () => {
    navigation.navigate('DoseSettings', { scannedData, apiData });
  };  

  return (
    <View style={styles.container}>
      <Text style={styles.upc}>{scannedData.upc}</Text>
      <Image source={{ uri: scannedData.image }} style={styles.image} />
      <Text style={styles.name}>{scannedData.name}</Text>
      <Text style={styles.dosage}>{apiData.dosage}</Text>
      <TouchableOpacity
        style={styles.startDoseButton}
        onPress={handleStartDosePress}
        activeOpacity={0.7}
      >
        <Text style={styles.buttonText}>Start Dose Now</Text>
      </TouchableOpacity>
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
    width: 150,
    height: 150,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  dosage: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  startDoseButton: {
    backgroundColor: '#FFA500',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default ShowData;
