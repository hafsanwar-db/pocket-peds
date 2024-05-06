import * as React from 'react';

import { Colors } from '../components/styles';
const tertiary = Colors.tertiary; // Import the missing tertiary variable

// React navigation
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Login from '../screens/Login';
import Signup from '../screens/Signup';
import Welcome from '../screens/Welcome';
import ScanBarcode from '../screens/ScanBarcode';
import ShowUPC from '../screens/ShowUPC';
import  CalculatingScreen  from '../screens/CalculatingScreen';
import  ShowData  from '../screens/ShowData';
import DoseSettings from '../screens/DoseSettings';
import MyCalendar from '../screens/Calendar';
import ConfirmationScreen from '../screens/ConfirmationScreen';
import { navigationRef } from '../NavigationService';
import UpdateProfile from '../screens/UpdateProfile';
import BottomNavigation from './BottomNavigation';

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
                    },
                    headerLeft: null
                }}
                initialRouteName='BottomNavigation'
            >
                <Stack.Screen name="BottomNavigation" component={BottomNavigation} />
                <Stack.Screen name="Login">
                    {props => <Login reminderInterval={reminderInterval}
                    setReminderInterval={setReminderInterval}
                    handleLocalPushNotification={handleLocalPushNotification} {...props}/>}
                </Stack.Screen>
                <Stack.Screen name="Signup" component={Signup}/>

                <Stack.Screen
                    name="WeightWarning"
                    component={WeightWarning}
                    options={{ presentation: 'modal' }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default RootStack;