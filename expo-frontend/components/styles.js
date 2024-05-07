import styled from 'styled-components'
import { View, Text, Image, TextInput, TouchableOpacity, Dimensions } from 'react-native';
import Constants from 'expo-constants';

const StatusBarHeight = Constants.statusBarHeight;
const { height, width } = Dimensions.get('window');

// Colors
export const Colors = {
    primary: "#ffffff",
    secondary: "#E5E7EB",
    tertiary: "#1F2937",
    darkLight: "#9CA3AF",
    brand: "#0070CA",
    green: "#10B981",
    red: "#EF4444",
    grey: "#9F9F9F",
    yellow: "#FDB623",
};

const { primary, secondary, tertiary, darkLight, brand, green, red,grey,yellow } = Colors;

export const ConfirmationContainer = styled.View`
  width: 100%;
  height: 45%;
  top: 55%;
  padding: 22px;
  margin: 0 auto;
  border-radius: 40px 40px 40px 40px;
  background-color: #FFF2CC;
  
`;

export const TextContainer = styled.View`
  margin-bottom: 16px;
`;

export const ConfirmationTitle = styled.Text`
  color: #0E0E0E;
  font-size: 32px;
  font-weight: 500;
  line-height: 32px;
  text-align: center;
`;

export const ConfirmationText = styled.Text`
  color: #0E0E0E;
  font-size: 20px;
  font-weight: 400;
  line-height: 20px;
  text-align: left;
  margin-top: 15px;
`;


export const StyledContainer = styled.View`
    flex: 1;
    padding: 25px;
    justify-content: center;
    align-items: center;
    padding-top: ${StatusBarHeight + 30}px;
    background-color: ${primary};
    height: ${height}px;
    overflow: visible;
`;

export const InnerContainer = styled.View`
    flex: 1;
    width: 100%;
    justify-content: center;
    align-items: center;
    height: ${height}px;
    padding-bottom: 10px;
`;

export const WelcomeContainer = styled(InnerContainer)`
    padding: 25px;
    padding-top: 10px;
    justify-content: center;
`;

export const Avatar = styled.Image`
    width: 100px;
    height: 100px;
    margin: auto;
    border-radius: 50px;
    border-width: 2px;
    border-color: ${secondary};
    margin-top: 20px;
    margin-bottom: 10px;
`;

export const WelcomeImage = styled.Image`
    height: 50%;
    min-width: 100%;
`;

export const PageLogo = styled.Image`
    width: ${width*0.5}px;
    height: ${height*0.25}px;
`;

export const PageTitle = styled.Text`
    font-size: 30px;
    text-align: center;
    font-weight: bold;
    color: ${brand};
    padding: 10px;

    ${(props) => props.welcome && `
        font-size: 35px;
    `}
`;

export const SubTitle = styled.Text`
    font-size: 18px;
    margin-bottom: 20px;
    letter-spacing: 1px;
    font-weight: bold;
    color: ${tertiary};

    ${(props) => props.welcome && `
        margin-bottom: 5px;
        font-weight: normal;
    `}
`;

export const StyledFormArea = styled.View`
    width: 90%;
`;

export const StyledTextInput = styled.TextInput`
    background-color: ${secondary};
    padding: 15px;
    padding-left: 55px;
    padding-right: 55px;
    border-radius: 5px;
    font-size: 16px;
    height: 60px;
    margin-vertical: 3px;
    margin-bottom: 10px;
    color: ${tertiary};
`;

export const StyledInputLabel = styled.Text`
    color: ${tertiary};
    font-size: 13px;
    text-align: left;
`;

export const LeftIcon = styled.View`
    left: 15px;
    top: 38px;
    position: absolute;
    z-index: 1;
`;

export const RightIcon = styled.TouchableOpacity`
    right: 15px;
    top: 38px;
    position: absolute;
    z-index: 1;
`;

export const StyledButton = styled.TouchableOpacity`
    padding: 15px;
    background-color: ${yellow};
    justify-content: center;
    border-radius: 5px;
    margin-vertical: 5px;
    height: 60px;
    align-items: center;

    ${(props) => props.google == true && `
        background-color: ${green};
        flex-direction: row;
        justify-content: center;
    `}
`;

export const StyledButtonConfirmation1 = styled.TouchableOpacity`
    padding: 15px;
    background-color: ${grey};
    justify-content: center;
    border-radius: 5px;
    margin-vertical: 5px;
    height: 60px;
    align-items: center;
    margin-top: 35px;

    ${(props) => props.google == true && `
        background-color: ${green};
        flex-direction: row;
        justify-content: center;
    `}
`;
export const StyledButtonConfirmation2 = styled.TouchableOpacity`
    padding: 15px;
    background-color: ${yellow};
    justify-content: center;
    border-radius: 5px;
    margin-vertical: 5px;
    height: 60px;
    align-items: center;
    margin-top: 35px;

    ${(props) => props.google == true && `
        background-color: ${green};
        flex-direction: row;
        justify-content: center;
    `}
`;

export const ButtonText = styled.Text`
    color: ${primary};
    font-size: 16px;

    ${(props) => props.google == true && `
        padding-left: 25px;
    `}
`;

export const MessageBox = styled.Text`
    text-align: center;
    font-size: 13px;
    color: ${props => props.type == 'SUCCESS' ? green : red};
`;

export const Line = styled.View`
    height: 1px;
    width: 100%;
    background-color: ${darkLight};
    margin-vertical: 10px;
`;

export const ExtraView = styled.View`
    justify-content: center;
    flex-direction: row;
    align-items: center;
    padding: 10px;
`;

export const ExtraText = styled.Text`
    justify-content: center;
    align-content: center;
    color: ${tertiary};
    font-size: 15px;
`;

export const TextLink = styled.TouchableOpacity`
    justify-content: center;
    align-items: center;
`;

export const TextLinkContent = styled.Text`
    color: ${brand};
    font-size: 15px;
`;

export const ModalContent = styled.Modal`
    height: 25%;
    width: 100%;
    background-color: #25292e;
    border-top-right-radius: 18px;
    border-top-left-radius: 18px;
    position: absolute;
    bottom: 0;
`;

export const WeightModal = styled.View`
    padding: 20px;
    height: 50%;
    width: 100%;
    background-color: #FFF3CC;
    border-top-right-radius: 18px;
    border-top-left-radius: 18px;
    position: absolute;
    bottom: 0;
`;

export const WeightModalButton = styled.TouchableOpacity`
    justify-content: center;
    border-radius: 5px;
    height: 60px;
    align-items: center;
    margin-vertical: 5px;
`;