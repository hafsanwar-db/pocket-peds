import * as React from 'react';

import { Colors } from '../components/styles';
const tertiary = Colors.tertiary; // Import the missing tertiary variable

// React navigation
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Login from '../screens/Login';
import Signup from '../screens/Signup';
import Welcome from '../screens/Welcome';
import ConfirmationScreen from '../screens/ConfirmationScreen';
import DoseSettings from '../screens/DoseSettings';
import { navigationRef } from '../NavigationService';


const Stack = createStackNavigator();
const RootStack = ({ reminderInterval, setReminderInterval, handleLocalPushNotification }) => {
    
    return (
        <NavigationContainer ref={navigationRef}>
            <Stack.Navigator
                screenOptions={{
                    headerStyle: {
                        backgroundColor: 'transparent'
                    },
                    headerTintColor: tertiary,
                    headerTransparent: true,
                    headerTitle: '', 
                    headerLeftContainerStyle: {
                        paddingLeft: 20
                    }
                }}
                initialRouteName='Login'
            >
                <Stack.Screen name="Login">
                    {props => <Login reminderInterval={reminderInterval}
                    setReminderInterval={setReminderInterval}
                    handleLocalPushNotification={handleLocalPushNotification} />}
                </Stack.Screen>
                <Stack.Screen name="Signup">
                    {props => <Signup {...props} />}
                </Stack.Screen>
                <Stack.Screen name="Welcome">
                    {props => <Welcome {...props} />}
                </Stack.Screen>
                <Stack.Screen name="ConfirmationScreen"> 
                    {props => <ConfirmationScreen {...props} />}
                </Stack.Screen>
                <Stack.Screen name="DoseSettings"> 
                    {props => <DoseSettings {...props} />}
                </Stack.Screen>
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default RootStack;