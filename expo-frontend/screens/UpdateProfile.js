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
import { Formik, Field } from 'formik';


const UpdateProfile = ({ navigation, route }) => {
  const { name = '' } = route.params; // Get child name from navigation params

  const [childInfo, setChildInfo] = useState({
    name: name,
    weight: '',
    age: '',
  });
  const [message, setMessage] = useState();
  const [messageType, setMessageType] = useState();

  const {tokenValue} = useContext(Token);

  useEffect(() => {
    const token = tokenValue;
    // Fetch child info using Axios
    console.log(name);

    axios.get(`http://${ip}:8000/child-profiles/${name.toLowerCase()}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        setChildInfo(response.data);
        console.log("UPDATE PROFILE: ", response.data);
      })
      .catch((error) => {
        console.error('Error fetching child info:', error);
      });
  }, [name, tokenValue]);

  const handleUpdate = (credentials, setSubmitting) => {
    handleMessage(null);
    const url = `http://${ip}:8000/child-profiles/${name.toLowerCase()}`;
    const token = tokenValue;
  
    axios
      .put(url, credentials, {
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

        {/* INSERT THE CAROUSEL HERE */}
        <PageLogo resizeMode="cover" source={require('../assets/img/peds-logo.png')} />
        
        <Formik
            initialValues={{ weight: childInfo?.weight || '', name: childInfo?.name || '', age: childInfo?.age || '' }}
            enableReinitialize
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
                    values.name = values.name.toLowerCase();
                    handleUpdate(values, setSubmitting);
                }
            }}
        >
            {({handleChange, handleBlur, handleSubmit, values, isSubmitting}) => 
                <StyledFormArea>

                    <MyFormikTextInput
                      label="Name"
                      icon="person-circle-outline"
                      name="name"
                      placeholder="Jane"
                      isPassword={false}
                      value={values.name} // Use values.name from Formik
                      onChange={handleChange('name')}
                      onBlur={handleBlur('name')}
                    />

                    <MyFormikTextInput
                      label="Age (years)"
                      icon="balloon-outline"
                      name="age"
                      placeholder="6"
                      keyboardType="numeric"
                      value={values.age} // Use values.name from Formik
                      onChange={handleChange('age')}
                      onBlur={handleBlur('age')}
                    />

                    <MyFormikTextInput
                      label="Weight (lbs)"
                      icon="scale-outline"
                      name="weight"
                      placeholder="45"
                      keyboardType="numeric"
                      onChange={handleChange('weight')}
                      onBlur={handleBlur('weight')}
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

// MyFormikTextInput component
const MyFormikTextInput = ({ label, icon, isPassword, value, onChange, onBlur, ...props }) => {
  return (
    <View style={{ margin: 5 }}>
      <LeftIcon>
        <Iconicons name={icon} size={30} color={brand} />
      </LeftIcon>

      <StyledInputLabel>{label}</StyledInputLabel>

      <StyledTextInput
        value={value}
        onChangeText={onChange}
        onBlur={onBlur}
        placeholder={props.placeholder}
        secureTextEntry={isPassword}
      />
    </View>
  );
};

export default UpdateProfile;

