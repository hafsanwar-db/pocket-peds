import React, { useState } from 'react';
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

import { View } from 'react-native'

// Keyboard Avoiding View
import KeyboardAvoidingWrapper from '../components/KeyboardAvoidingWrapper';

const Signup = ({navigation}) => {
    const [hidePassword, setHidePassword] = useState(true);

    return (
        <KeyboardAvoidingWrapper>
        <StyledContainer>
            <StatusBar style="dark" />
            <InnerContainer>
                <PageTitle>Pocket Peds</PageTitle>
                <SubTitle>Register today!</SubTitle>
                
                <Formik
                    initialValues={{ name: '', email: '', password: '' }}
                    onSubmit={(values) => {
                        console.log(values);
                        navigation.navigate('Welcome');
                    }}
                >
                    {({handleChange, handleBlur, handleSubmit, values}) => 
                        <StyledFormArea>

                            <MyTextInput
                                label="First Name"
                                icon="person"
                                placeholder="Rick"
                                placeholderTextColor={darkLight}
                                onChangeText={handleChange('name')}
                                onBlur={handleBlur('email')}
                                values={values.name}
                            />

                            <MyTextInput
                                label="Email Address"
                                icon="mail"
                                placeholder="astley@yahoo.com"
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

                            <MyTextInput
                                label="Confirm Password"
                                icon="lock"
                                placeholder="********"
                                placeholderTextColor={darkLight}
                                onChangeText={handleChange('confirmPassword')}
                                onBlur={handleBlur('confirmPassword')}
                                values={values.password}
                                secureTextEntry={hidePassword}
                                isPassword={true}
                                hidePassword={hidePassword}
                                setHidePassword={setHidePassword}
                            />

                            <MessageBox>...</MessageBox>
                            <StyledButton onPress={handleSubmit} >
                                <ButtonText>Login</ButtonText>
                            </StyledButton>

                            <Line />
                            <StyledButton google={true} onPress={handleSubmit} >
                                <Fontisto name="google" size={24} color={primary} />
                                <ButtonText google={true}>Sign in with Google</ButtonText>
                            </StyledButton>

                            <ExtraView>
                                <ExtraText>Already have an account? </ExtraText>
                                <TextLink onPress={() => navigation.navigate('Login')}>
                                    <TextLinkContent>Login</TextLinkContent>
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

export default Signup;