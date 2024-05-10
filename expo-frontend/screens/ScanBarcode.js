import React, { useState, useEffect } from 'react';
import { StatusBar, Text, View, Button, TextInput, KeyboardAvoidingView, Platform } from 'react-native'; // Import KeyboardAvoidingView and Platform
import { Camera } from 'expo-camera';
import { Octicons, Ionicons, Fontisto } from '@expo/vector-icons';
import { useNavigation, useIsFocused, useFocusEffect } from '@react-navigation/native';
import { StyledContainer, InnerContainer, PageLogo, PageTitle, SubTitle, StyledButton, ButtonText, Colors, ExtraText, ExtraView, TextLink, TextLinkContent } from '../components/styles';
import ip from './ip.js';


const ScanBarcode = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused(); // Use isFocused hook
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [scannedData, setScannedData] = useState(null);
  const [cameraRef, setCameraRef] = useState(null);
  const [barcodeSegment1, setBarcodeSegment1] = useState('');
  const [barcodeSegment2, setBarcodeSegment2] = useState('');
  const [barcodeSegment3, setBarcodeSegment3] = useState('');
  const [barcodeSegment4, setBarcodeSegment4] = useState('');
  const [barcodeSegment5, setBarcodeSegment5] = useState('');

  const handleNavigateBack = () => {
    setScanned(false); // Reset scanned state before navigating back
    navigation.goBack();
  }

  useEffect(() => {
    const requestCameraPermission = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    requestCameraPermission();

    // Clean up any resources if needed
    return () => {
      // Clean up code here if needed
    };
  }, []);

  // Handle barcode scan
  const handleBarCodeScanned = async ({ data }) => {
    console.log('Barcode scanned:', data); // Add this line to check if the function is triggered
    setScanned(true);
    setScannedData(data);

    try {
      // Make API call to process scanned data
      console.log('Making API call for barcode:', data); // Add this line to check if the function is triggered
      const url = `http://${ip}:8000/get_medicine?upc=${encodeURIComponent(data)}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          // You can add any required headers here
        },
      });

      if (response.ok) {
        const responseData = await response.json();
        const { upc, image, name, dosage } = responseData;
        setScannedData({ upc: upc, image: image, name: name, dosage: dosage });
        navigation.navigate('ShowUPC', { scannedData: { upc: upc, image: image, name: name, dosage: dosage } });
      } else {
        console.error(`API call failed for barcode: 0${data}`);
      }
    } catch (error) {
      console.error(`Error while making API call for barcode 0${data}:`, error);
    }
  };

  // Handle manual input submission
  const handleManualInputSubmit = () => {
    const manualInput = `${barcodeSegment1}${barcodeSegment2}${barcodeSegment3}${barcodeSegment4}${barcodeSegment5}`;
    const barcodeRegex = /^3\d{4}\d{4}\d{2}\d$/;
    if (barcodeRegex.test(manualInput)) {
      handleBarCodeScanned({ data: manualInput });
      setBarcodeSegment4('');
    } else {
      alert('Invalid barcode format. Please enter a valid barcode.');
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : null} style={{ flex: 1 }}>
      <StyledContainer>
        {hasPermission === null ? (
          <Text>Requesting for camera permission</Text>
        ) : hasPermission === false ? (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>No access to camera</Text>
            <Button title="Request Camera Access" onPress={handleRequestCameraPermission} />
          </View>
        ) : (
          <View style={{ flex: 1, width: '100%' }}>
            <Camera
              style={{ flex: 1 }}
              type={Camera.Constants.Type.back}
              onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
              ref={ref => setCameraRef(ref)}
              onError={error => console.error(error)}
            />
            {scanned && (
              <Button title="Scan Again" onPress={() => setScanned(false)} />
            )}
          </View>
        )}
        <View style={{ marginTop: 20, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
          <TextInput
            style={{ height: 40, width: 200, borderColor: 'gray', borderWidth: 1, paddingHorizontal: 10, marginRight: 5, textAlign: 'center' }}
            onChangeText={text => setBarcodeSegment4(text)}
            value={barcodeSegment4}
            keyboardType="numeric"
            maxLength={14}
            placeholder="3XXXXXXXXXXXXX"
          />
          </View>
        <Button  title="Submit" onPress={handleManualInputSubmit}/>

        <ExtraView>
          <ExtraText>Don't want to scan? </ExtraText>
          <TextLink onPress={() => navigation.navigate('Login')}>
            <TextLinkContent>Go back to Login</TextLinkContent>
          </TextLink>
        </ExtraView>
      </StyledContainer>
    </KeyboardAvoidingView>
  );
};

export default ScanBarcode;
