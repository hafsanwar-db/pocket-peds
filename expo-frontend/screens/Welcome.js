import React, { useState, useContext, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';

// Import icons
import { Octicons, Ionicons, Fontisto } from '@expo/vector-icons'; 

import {
    StyledContainer, InnerContainer, PageLogo, PageTitle, SubTitle, StyledFormArea, LeftIcon, StyledInputLabel, StyledTextInput,
    RightIcon, StyledButton, ButtonText, Colors, MessageBox, Line, ExtraText, ExtraView, TextLink, TextLinkContent, WelcomeContainer,
    Avatar
} from '../components/styles';

// Colors
const { primary, secondary, tertiary, darkLight, brand, green, red } = Colors;
// Async storage
// import AsyncStorage from '@react-native-async-storage/async-storage';

// Credentials and Token context
//import { CredentialsContext } from '../components/CredentialsContext';
import {Token} from '../components/Token';
// Credentials context
// import { CredentialsContext } from '../components/CredentialsContext';

const Welcome = ({navigation, route}) => {
    const {access_token, token_type} = route.params || {};

    /* const {storedCredentials, setStoredCredentials} = useContext(CredentialsContext);
    const {username, email} = storedCredentials;
    const ClearLogin = () => {
        AsyncStorage
            .removeItem('userCredentials')
            .then(() => {
                setStoredCredentials("");
            })
            .catch((error) => console.log(error));
    } */
/*
    useEffect(() => {
        if (access_token == null) {
            navigation.navigate('Login');
        }
    }, []);
*/
    return (
        <>
            <StatusBar style="light" />
            <InnerContainer>
                <WelcomeContainer>
                    <PageTitle welcome={true}>Welcome!</PageTitle>
                    <SubTitle welcome={true}>you filthy animal</SubTitle>

                    <StyledFormArea>
                        <Avatar resizeMode="cover" source={require('../assets/img/peds-logo.png')} />


                        <StyledButton onPress={() => navigation.navigate('ScanBarcode')}>
                            <ButtonText>Scan Barcode</ButtonText>
                        </StyledButton>

                        <Line />
                        {/* <StyledButton onPress={ClearLogin}>
                            <ButtonText>Logout</ButtonText>
    </StyledButton> */}
                    </StyledFormArea>
                    <ExtraView>
                                <ExtraText>Calendar </ExtraText>
                                <TextLink onPress={() => navigation.navigate('MyCalendar')}>
                                    <TextLinkContent>Click Here!</TextLinkContent>
                                </TextLink>
                    </ExtraView>
                </WelcomeContainer>
            </InnerContainer>
        </>
    );
};

export default Welcome;