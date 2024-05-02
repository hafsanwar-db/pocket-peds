import React, { useState, useContext } from 'react';
import { StatusBar } from 'expo-status-bar';

// Import formik
import { Formik } from 'formik';

// Import icons
import { Octicons, Ionicons, Fontisto } from '@expo/vector-icons'; 

import {
    StyledContainer,
    InnerContainer,
    PageLogo,
    PageTitle,
    SubTitle,
    StyledFormArea,
    LeftIcon,
    StyledInputLabel,
    StyledTextInput,
    RightIcon,
    StyledButton,
    ButtonText,
    Colors,
    MessageBox,
    Line,
    ExtraText,
    ExtraView,
    TextLink,
    TextLinkContent
} from '../components/styles';

// Colors
const { primary, secondary, tertiary, darkLight, brand, green, red } = Colors;

import { View, ActivityIndicator } from 'react-native'

// Keyboard Avoiding View
import KeyboardAvoidingWrapper from '../components/KeyboardAvoidingWrapper';

// Axios
import axios from 'axios';

// Async storage
import AsyncStorage from '@react-native-async-storage/async-storage';

// Credentials context
import { CredentialsContext } from '../components/CredentialsContext';

const Login = ({navigation}) => {
    const [hidePassword, setHidePassword] = useState(true);
    const [message, setMessage] = useState();
    const [messageType, setMessageType] = useState();

    // Credentials context
    const {storedCredentials, setStoredCredentials} = useContext(CredentialsContext);

    const handleLogin = (credentials, setSubmitting) => {
        handleMessage(null);
        const url = "http://10.105.226.56:8000/login";

        axios
            .post(url, credentials)
            .then((response) => {
                const result = response.data;
                const {message, status, data} = result;

                if (status !== 'SUCCESS') {
                    handleMessage(message, status);
                }
                else {
                    persistLogin(...data[0], message, status);
                }

                setSubmitting(false);
            })
            .catch((error) => {
                console.log(error)
                setSubmitting(false);
                handleMessage("An error occurred. Please try again.");
            });
    }

    const handleMessage = (message, type = 'FAILED') => {
        setMessage(message);
        setMessageType(type);
    }

    const handleGoogleSignIn = () => {
        handleMessage("Google sign in is in progress.", "SUCCESS");
    }

    const persistLogin = (credentials, message, status) => {
        AsyncStorage
            .setItem('userCredentials', JSON.stringify(credentials))
            .then(() => {
                handleMessage(message, status);
                setStoredCredentials(credentials);
            })
            .catch((error) => {
                console.log(error);
                handleMessage("Persisting login failed.");
            });
    }

    return (
        <KeyboardAvoidingWrapper>
        <StyledContainer>
            <StatusBar style="dark" />  
            <InnerContainer>
                <PageLogo resizeMode="cover" source={require('../assets/img/peds-logo.png')} />
                <PageTitle>Pocket Peds</PageTitle>
                <SubTitle>Login</SubTitle>
                
                <Formik
                    initialValues={{ email: '', password: '' }}
                    onSubmit={(values, {setSubmitting}) => {
                        if (values.email == '' || values.password == '') {
                            handleMessage("Please fill in all fields.");
                            setSubmitting(false);
                        }
                        else {
                            handleLogin(values, setSubmitting);
                        }
                    }}
                >
                    {({handleChange, handleBlur, handleSubmit, values, isSubmitting}) => 
                        <StyledFormArea>

                            <MyTextInput
                                label="Email Address"
                                icon="mail"
                                placeholder="example@gmail.com"
                                placeholderTextColor={darkLight}
                                onChangeText={handleChange('email')}
                                onBlur={handleBlur('email')}
                                values={values.email}
                                keyboardType="email-address"
                            />

                            <MyTextInput
                                label="Password"
                                icon="lock"
                                placeholder="********"
                                placeholderTextColor={darkLight}
                                onChangeText={handleChange('password')}
                                onBlur={handleBlur('password')}
                                values={values.password}
                                secureTextEntry={hidePassword}
                                isPassword={true}
                                hidePassword={hidePassword}
                                setHidePassword={setHidePassword}
                            />

                            <MessageBox type={messageType}>{message}</MessageBox>
                            { !isSubmitting && 
                                <StyledButton onPress={handleSubmit} >
                                    <ButtonText>Login</ButtonText>
                                </StyledButton> 
                            }

                            { isSubmitting && 
                                <StyledButton disabled={true}>
                                    <ActivityIndicator size="large" color={primary}></ActivityIndicator>
                                </StyledButton> 
                            }

                            <Line />
                            <StyledButton google={true} onPress={handleSubmit} >
                                <Fontisto name="google" size={24} color={primary} />
                                <ButtonText google={true}>Sign in with Google</ButtonText>
                            </StyledButton>

                            <ExtraView>
                                <ExtraText>Don't have an account already? </ExtraText>
                                <TextLink onPress={() => navigation.navigate('Signup')}>
                                    <TextLinkContent>Sign up!</TextLinkContent>
                                </TextLink>
                            </ExtraView>

                        </StyledFormArea>
                    }
                </Formik>

            </InnerContainer>
        </StyledContainer>
        </KeyboardAvoidingWrapper>
    );
};

const MyTextInput = ({label, icon, isPassword, hidePassword, setHidePassword, ...props}) => {
    return (
        <View>
            <LeftIcon>
                <Octicons name={icon} size={30} color={brand} />
            </LeftIcon>

            <StyledInputLabel>{label}</StyledInputLabel>

            <StyledTextInput {...props} />

            { isPassword && (
                <RightIcon onPress={() => setHidePassword(!hidePassword)}>
                    <Ionicons name={hidePassword ? 'eye-off-outline' : 'eye-outline'} size={30} color={darkLight} />
                </RightIcon>
            )}
        </View>
    );
}

export default Login;