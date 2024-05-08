import React, { useState, useContext } from 'react';
import { StatusBar } from 'expo-status-bar';
import Footer from '../components/Footer';
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

// Credentials and Token context
import { CredentialsContext } from '../components/CredentialsContext';
import {Token} from '../components/Token';

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
                    <ExtraView>
                                <ExtraText>Calendar </ExtraText>
                                <TextLink onPress={() => navigation.navigate('MyCalendar')}>
                                    <TextLinkContent>Click Here!</TextLinkContent>
                                </TextLink>
                                <ExtraText>Carousel </ExtraText>
                                <TextLink onPress={() => navigation.navigate('Carousel')}>
                                    <TextLinkContent>Click Here!</TextLinkContent>
                                </TextLink>
                    </ExtraView>
                </WelcomeContainer>
            </InnerContainer>

        </>
    );
};

export default Welcome;
