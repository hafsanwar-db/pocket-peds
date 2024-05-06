import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import axios from 'axios';
import ip from './ip.js';

import Iconicons from 'react-native-vector-icons/Ionicons';

// Keyboard Avoiding View
import KeyboardAvoidingWrapper from '../components/KeyboardAvoidingWrapper';

import {
  StyledContainer, InnerContainer, PageLogo, PageTitle, SubTitle, StyledFormArea, LeftIcon, StyledInputLabel, StyledTextInput,
  RightIcon, StyledButton, ButtonText, Colors, MessageBox, Line, ExtraText, ExtraView, TextLink, TextLinkContent
} from '../components/styles';
import { StatusBar } from 'expo-status-bar';
const { brand, darkLight, primary } = Colors;

// Formik
import { Formik } from 'formik';

import ChangeWeightModal from '../components/modal/WeightWarning.js';


const UpdateProfile = ({ navigation, route }) => {
  const { childName } = route.params || {}; // Get child name from navigation params

  const [childInfo, setChildInfo] = useState({ name: '', weight: '' });
  const [message, setMessage] = useState();
  const [messageType, setMessageType] = useState();

  useEffect(() => {
    // Fetch child info using Axios
    axios.get(`http://${ip}:8000/child-profiles/${childName}`)
      .then((response) => {
        setChildInfo(response.data);
      })
      .catch((error) => {
        console.error('Error fetching child info:', error);
      });
  }, [childName]);

  const handleUpdate = (credentials, setSubmitting) => {
    handleMessage(null);
    const url = `http://${ip}:8000/child-profiles/${childName}`;

    axios
        .post(url, credentials)
        .then((response) => {
            const result = response.data;
            const {message} = result;

            handleMessage(message, "SUCCESS");
            setSubmitting(false);
        })
        .catch((error) => {
            console.log(error)
            setSubmitting(false);
            handleMessage("An error occurred. Please try again.");
        });
  };

  const handleMessage = (message, type = 'FAILED') => {
    setMessage(message);
    setMessageType(type);
  };

  return (

<>
<ChangeWeightModal />
<KeyboardAvoidingWrapper>
<StyledContainer>
    <StatusBar style="dark" />  
    <InnerContainer>
        <SubTitle>{childInfo.name}'s Profile</SubTitle>
        
        <Formik
            initialValues={{ weight: childInfo.weight || '' }}
            onSubmit={(values, {setSubmitting}) => {
                if (values.weight == '') {
                    handleMessage("Please fill in all fields.");
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
                        label="Weight (lbs)"
                        icon={"scale-outline"}
                        placeholder="0"
                        placeholderTextColor={darkLight}
                        onChangeText={handleChange('weight')}
                        onBlur={handleBlur('weight')}
                        values={values.weight}
                        keyboardType="numeric"
                    />

                    <MessageBox type={messageType}>{message}</MessageBox>
                    { !isSubmitting && 
                        <StyledButton onPress={handleSubmit} >
                            <ButtonText>Update Weight</ButtonText>
                        </StyledButton> 
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

</>
  );
};

const MyTextInput = ({label, icon, isPassword, ...props}) => {
  return (
      <View>
          <LeftIcon>
              <Iconicons name={icon} size={30} color={brand} />
          </LeftIcon>

          <StyledInputLabel>{label}</StyledInputLabel>

          <StyledTextInput {...props} />
      </View>
  );
}


export default UpdateProfile;