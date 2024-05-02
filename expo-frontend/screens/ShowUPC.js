import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Import navigation hooks

const ShowUPC = ({ route, navigation }) => {
  const { scannedData } = route.params;
  const [rescanPressed, setRescanPressed] = useState(false);
  const [confirmPressed, setConfirmPressed] = useState(false);
  // const navigation = useNavigation(); // Get navigation object

  const handleRescanPress = () => {
    // Navigate to ScanBarcode screen
    navigation.navigate('ScanBarcode');
  };

  const handleConfirmPress = () => {
    setConfirmPressed(true);
    // Add your confirm logic here
    navigation.navigate('CalculatingScreen', { scannedData });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.upc}>{scannedData.upc}</Text>
      <Image source={{ uri: scannedData.mediaUrl }} style={styles.image} />
      <Text style={styles.name}>{scannedData.name}</Text>
      <Text style={styles.description}>
        For ages 2 to 11 years old{'\n'}
        For weights 24 to 95 lbs (10.8 to 43.1 kg)
      </Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.buttonView, rescanPressed && styles.buttonPressed]}
          onPress={handleRescanPress}
          activeOpacity={0.7}
        >
          <Text style={styles.buttonText}>Rescan</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.buttonView,
            styles.confirmButton,
            confirmPressed && styles.buttonPressed,
          ]}
          onPress={handleConfirmPress}
          activeOpacity={0.7}
        >
          <Text style={styles.buttonText}>Confirm</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.confirmText}>
        Confirming the correct product will{'\n'}ensure correct dosing information.{'\n'}
        Please confirm to continue.
      </Text>
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
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
    marginBottom: 20,
  },
  buttonView: {
    backgroundColor: '#D3D3D3',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonPressed: {
    opacity: 0.7,
  },
  confirmButton: {
    backgroundColor: '#FFA500',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  confirmText: {
    fontSize: 16,
    textAlign: 'center',
  },
});

export default ShowUPC;
 