import React, { useState, useContext } from 'react';
import { StatusBar } from 'expo-status-bar';

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
    TextLinkContent,
    WelcomeContainer,
    WelcomeImage,
    Avatar
} from '../components/styles';

// Colors
const { primary, secondary, tertiary, darkLight, brand, green, red } = Colors;
// Async storage
import AsyncStorage from '@react-native-async-storage/async-storage';

// Credentials context
import { CredentialsContext } from '../components/CredentialsContext';

const Welcome = ({navigation}) => {
    const {storedCredentials, setStoredCredentials} = useContext(CredentialsContext);
    const {username, email} = storedCredentials;

    const ClearLogin = () => {
        AsyncStorage
            .removeItem('userCredentials')
            .then(() => {
                setStoredCredentials("");
            })
            .catch((error) => console.log(error));
    }

    return (
        <>
            <StatusBar style="light" />
            <InnerContainer>
                <WelcomeContainer>
                    <PageTitle welcome={true}>Welcome {username}!</PageTitle>
                    <SubTitle welcome={true}>{email}</SubTitle>

                    <StyledFormArea>
                        <Avatar resizeMode="cover" source={require('../assets/img/peds-logo.png')} />


                        <StyledButton onPress={() => navigation.navigate('ScanBarcode')}>
                            <ButtonText>Scan Barcode</ButtonText>
                        </StyledButton>

                        <Line />
                        <StyledButton onPress={ClearLogin}>
                            <ButtonText>Logout</ButtonText>
                        </StyledButton>
                    </StyledFormArea>
                </WelcomeContainer>
            </InnerContainer>
        </>
    );
};

export default Welcome;
