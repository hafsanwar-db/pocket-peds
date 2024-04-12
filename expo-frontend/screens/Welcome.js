import React, { useState } from 'react';
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

const Welcome = ({navigation}) => {
    return (
        <>
            <StatusBar style="light" />
            <InnerContainer>
                <WelcomeImage resizeMode="cover" source={require('../assets/img/peds-logo.png')} />

                <WelcomeContainer>
                    <PageTitle welcome={true}>Welcome!</PageTitle>
                    <SubTitle welcome={true}>First Name</SubTitle>
                    <SubTitle welcome={true}>Email</SubTitle>

                    <StyledFormArea>
                        <Avatar resizeMode="cover" source={require('../assets/img/peds-logo.png')} />

                        <Line />
                        <StyledButton onPress={() => navigation.navigate('Login')}>
                            <ButtonText>Logout</ButtonText>
                        </StyledButton>

                    </StyledFormArea>
                </WelcomeContainer>
            </InnerContainer>
        </>
    );
};

export default Welcome;