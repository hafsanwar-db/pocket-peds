import React, { useState, useContext, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
// Import formik
import { Formik } from "formik";

// Import icons
import { Octicons, Ionicons, Fontisto } from "@expo/vector-icons";

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
} from "../components/styles";

// Colors
const { primary, secondary, tertiary, darkLight, brand, green, red } = Colors;

import { View, ActivityIndicator } from "react-native";

// Keyboard Avoiding View
import KeyboardAvoidingWrapper from "../components/KeyboardAvoidingWrapper";
import ReminderPickerButton from "../notifications/ReminderPickerButton";

// Axios
import axios from "axios";

// Credentials context
//import { CredentialsContext } from '../components/CredentialsContext';
import { Token } from "../components/Token";
import ip from "./ip.js";

const Login = ({
  setLastRefreshTime,
  setShouldRefresh,
  navigation,
  reminderInterval,
  setReminderInterval,
  handleLocalPushNotification,
}) => {
  const [hidePassword, setHidePassword] = useState(true);
  const [message, setMessage] = useState();
  const [messageType, setMessageType] = useState();
  //for JWT tokens, updates whenever the user logs in
  const { updateToken } = useContext(Token);
  // Credentials context
  //const {storedCredentials, setStoredCredentials} = useContext(CredentialsContext);
  useEffect(() => {
    console.log("does this run");
    setShouldRefresh(false);
  }, []);
  const handleLogin = async (credentials, setSubmitting) => {
    handleMessage(null);
    const url = `http://${ip}:8000/login`;
    try {
      const response = await axios.post(url, credentials);
      const result = response.data;
      const { access_token, token_type } = result;

      if (access_token !== undefined) {
        // Update the token first
        updateToken(result["access_token"]);

        // Then navigate to the next screen
        setSubmitting(false);
        setLastRefreshTime(new Date().getTime());
        setShouldRefresh(true);
        navigation.navigate("Child", { ...result });
      } else {
        handleMessage("Login failed. Please try again later.");
        setSubmitting(false);
      }
      console.log(result);
    } catch (error) {
      console.log(error);
      setSubmitting(false);
      handleMessage("An error occurred. Please try again.");
    }
  };

  const handleMessage = (message, type = "FAILED") => {
    setMessage(message);
    setMessageType(type);
  };
  /* 
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
    */

  return (
    <KeyboardAvoidingWrapper>
      <StyledContainer>
        <StatusBar style="dark" />
        <InnerContainer>
          <PageLogo
            resizeMode="cover"
            source={require("../assets/img/peds-logo.png")}
          />
          <PageTitle>Pocket Peds</PageTitle>

          <Formik
            initialValues={{ username: "", password: "" }}
            onSubmit={(values, { setSubmitting }) => {
              if (values.username == "" || values.password == "") {
                handleMessage("Please fill in all fields.");
                setSubmitting(false);
              } else {
                handleLogin(values, setSubmitting);
              }
            }}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              isSubmitting,
            }) => (
              <StyledFormArea>
                <MyTextInput
                  label="Username"
                  icon={"person"}
                  placeholder="pocket123"
                  placeholderTextColor={darkLight}
                  onChangeText={handleChange("username")}
                  onBlur={handleBlur("username")}
                  values={values.username}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />

                <MyTextInput
                  label="Password"
                  icon="lock"
                  placeholder="********"
                  placeholderTextColor={darkLight}
                  onChangeText={handleChange("password")}
                  onBlur={handleBlur("password")}
                  values={values.password}
                  secureTextEntry={hidePassword}
                  isPassword={true}
                  hidePassword={hidePassword}
                  setHidePassword={setHidePassword}
                  autoCapitalize="none"
                />
                {/* <ReminderPickerButton
                                reminderInterval={reminderInterval}
                                setReminderInterval={setReminderInterval}
                                onPress={handleLocalPushNotification}
                            /> */}

                <MessageBox type={messageType}>{message}</MessageBox>
                {!isSubmitting && (
                  <StyledButton onPress={handleSubmit}>
                    <ButtonText>Login</ButtonText>
                  </StyledButton>
                )}

                {isSubmitting && (
                  <StyledButton disabled={true}>
                    <ActivityIndicator
                      size="large"
                      color={primary}
                    ></ActivityIndicator>
                  </StyledButton>
                )}

                <Line />

                {/* <StyledButton google={true} onPress={handleSubmit} >
                                <Fontisto name="google" size={24} color={primary} />
                                <ButtonText google={true}>Sign in with Google</ButtonText>
                            </StyledButton> */}

                <ExtraView>
                  <ExtraText>Don't have an account already? </ExtraText>
                  <TextLink onPress={() => navigation.navigate("Signup")}>
                    <TextLinkContent>Sign up!</TextLinkContent>
                  </TextLink>
                </ExtraView>
                {/* <ExtraView>
                                <ExtraText>Calendar</ExtraText>
                                <TextLink onPress={() => navigation.navigate('MyCalendar')}>
                                    <TextLinkContent>Click Here!</TextLinkContent>
                                </TextLink>
                            </ExtraView> */}
              </StyledFormArea>
            )}
          </Formik>
        </InnerContainer>
      </StyledContainer>
    </KeyboardAvoidingWrapper>
  );
};

const MyTextInput = ({
  label,
  icon,
  isPassword,
  hidePassword,
  setHidePassword,
  ...props
}) => {
  return (
    <View>
      <LeftIcon>
        <Octicons name={icon} size={30} color={brand} />
      </LeftIcon>

      <StyledInputLabel>{label}</StyledInputLabel>

      <StyledTextInput {...props} />

      {isPassword && (
        <RightIcon onPress={() => setHidePassword(!hidePassword)}>
          <Ionicons
            name={hidePassword ? "eye-off-outline" : "eye-outline"}
            size={30}
            color={darkLight}
          />
        </RightIcon>
      )}
    </View>
  );
};

export default Login;
