// CalculatingScreen.js
import React, { useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ip from './ip.js';
const CalculatingScreen = ({ route }) => {
  const { scannedData } = route.params;
  const navigation = useNavigation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log(`http://${ip}:8000/dummy-data`)
        const response = await fetch(`http://${ip}:8000/dummy-data`);
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        navigation.navigate('ShowData', { scannedData, apiData: data });
      } catch (error) {
        console.error('Error fetching data:', error);
        // Handle error here
      }
    };

    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <Image source={require('../assets/img/calculating.png')} style={styles.image} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
  },
});

export default CalculatingScreen;