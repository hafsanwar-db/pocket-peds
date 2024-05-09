import React, { useState, useEffect, useContext } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import axios from 'axios';
import ip from './ip.js';

import Iconicons from 'react-native-vector-icons/Ionicons';

// Keyboard Avoiding View
import KeyboardAvoidingWrapper from '../components/KeyboardAvoidingWrapper';
import { Token } from '../components/Token.js';

import {
  StyledContainer, InnerContainer, PageLogo, PageTitle, SubTitle, StyledFormArea, LeftIcon, StyledInputLabel, StyledTextInput,
  RightIcon, StyledButton, ButtonText, Colors, MessageBox, Line, ExtraText, ExtraView, TextLink, TextLinkContent, WeightModalButton
} from '../components/styles';
import { StatusBar } from 'expo-status-bar';
const { brand, darkLight, primary } = Colors;

// Formik
import { Formik } from 'formik';


const UpdateProfile = ({ navigation, route }) => {
  const { childInfo: routeChildInfo } = route.params || {}; // Get child name from navigation params

  const [childInfo, setChildInfo] = useState({
    name: routeChildInfo?.name || '',
    weight: routeChildInfo?.weight || '',
    age: routeChildInfo?.age || '',
  });
  const [message, setMessage] = useState();
  const [messageType, setMessageType] = useState();

  const {tokenValue} = useContext(Token);

  useEffect(() => {
    const token = tokenValue;
    // Fetch child info using Axios
    axios.get(`http://${ip}:8000/child-profiles/${childName}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        setChildInfo(response.data);
      })
      .catch((error) => {
        console.error('Error fetching child info:', error);
      });
  }, [childName, tokenValue]);

  const handleUpdate = (credentials, setSubmitting) => {
    handleMessage(null);
    const url = `http://${ip}:8000/child-profiles/${childName}`;
    const token = tokenValue;
  
    axios
      .post(url, credentials, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const result = response.data;
        const { message } = result;
  
        handleMessage(message, "SUCCESS");
        setSubmitting(false);
      })
      .catch((error) => {
        console.log(error);
        setSubmitting(false);
        handleMessage("An error occurred. Please try again.");
      });
  };

  const handleMessage = (message, type = 'FAILED') => {
    setMessage(message);
    setMessageType(type);
  };

  return (

<KeyboardAvoidingWrapper>
<StyledContainer>
    <StatusBar style="dark" />  
    <InnerContainer>
        <PageTitle style={{ color: "black", marginBottom: 10 }}>Updating Profile</PageTitle>
        <PageLogo resizeMode="cover" source={require('../assets/img/peds-logo.png')} />
        
        <Formik
            initialValues={{ weight: childInfo.weight || '', name: childInfo.name || '', age: childInfo.age || '' }}
            onSubmit={(values, {setSubmitting}) => {
                if (values.weight == '' || values.name == '' || values.age == '') {
                    handleMessage("Please fill in all fields.");
                    setSubmitting(false);
                }
                else if (isNaN(values.weight) || isNaN(values.age)) {
                    handleMessage("Please enter a valid weight and age.");
                    setSubmitting(false);
                }
                else if (values.weight < 0 || values.age < 0) {
                    handleMessage("Please enter a valid weight and age.");
                    setSubmitting(false);
                }
                else {
                    handleUpdate(values, setSubmitting);
                }
            }}
        >
            {({handleChange, handleBlur, handleSubmit, values, isSubmitting}) => 
                <StyledFormArea>

                    <MyTextInput
                        label="Name"
                        icon={"person-circle-outline"}
                        placeholder="Jane"
                        placeholderTextColor={darkLight}
                        onChangeText={handleChange('name')}
                        onBlur={handleBlur('name')}
                        values={values.weight}
                    />

                    <MyTextInput
                        label="Age (years)"
                        icon={"balloon-outline"}
                        placeholder="6"
                        placeholderTextColor={darkLight}
                        onChangeText={handleChange('age')}
                        onBlur={handleBlur('age')}
                        values={values.weight}
                        keyboardType="numeric"
                    />
                    
                    <MyTextInput
                        label="Weight (lbs)"
                        icon={"scale-outline"}
                        placeholder="45"
                        placeholderTextColor={darkLight}
                        onChangeText={handleChange('weight')}
                        onBlur={handleBlur('weight')}
                        values={values.weight}
                        keyboardType="numeric"
                    />

                    <MessageBox type={messageType}>{message}</MessageBox>
                    { !isSubmitting && 
                        <WeightModalButton onPress={handleSubmit} title="Save Profile" style={{ backgroundColor: '#FEB624' }} >
                            <Text style={{ fontSize: 20, color: "black" }}>Save Profile</Text>
                        </WeightModalButton>
                    }

                    { isSubmitting && 
                        <StyledButton disabled={true}>
                            <ActivityIndicator size="large" color={primary}></ActivityIndicator>
                        </StyledButton> 
                    }

                </StyledFormArea>
            }
        </Formik>

    </InnerContainer>

</StyledContainer>
</KeyboardAvoidingWrapper>

  );
};

const MyTextInput = ({label, icon, isPassword, ...props}) => {
  return (
      <View style={{ margin: 5 }}>
          <LeftIcon>
              <Iconicons name={icon} size={30} color={brand} />
          </LeftIcon>

          <StyledInputLabel>{label}</StyledInputLabel>

          <StyledTextInput {...props} />
      </View>
  );
}


export default UpdateProfile;

