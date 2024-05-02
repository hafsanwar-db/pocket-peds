import * as React from 'react';

import { Colors } from '../components/styles';
const tertiary = Colors.tertiary; // Import the missing tertiary variable

// React navigation
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Login from '../screens/Login';
import Signup from '../screens/Signup';
import Welcome from '../screens/Welcome';
import MyCalendar from '../screens/Calendar';

const Stack = createStackNavigator();
const RootStack = () => {
    return (
        <NavigationContainer>
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
                    {props => <Login {...props} />}
                </Stack.Screen>
                <Stack.Screen name="Signup">
                    {props => <Signup {...props} />}
                </Stack.Screen>
                <Stack.Screen name="Welcome">
                    {props => <Welcome {...props} />}
                </Stack.Screen>
                <Stack.Screen name="MyCalendar" options={{ headerShown: false }}>
                    {props => <MyCalendar navigation = {props.navigation} {...props} />}
                </Stack.Screen>
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default RootStack;