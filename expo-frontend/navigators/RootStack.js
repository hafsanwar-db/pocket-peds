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
                <Stack.Screen name="ScanBarcode">
                    {props => <ScanBarcode {...props} />}
                </Stack.Screen>
                <Stack.Screen name="ShowUPC">
                    {props => <ShowUPC {...props} />}
                </Stack.Screen>
                <Stack.Screen name="CalculatingScreen">
                    {props => <CalculatingScreen {...props} />}
                </Stack.Screen>
                <Stack.Screen name="ShowData">
                    {props => <ShowData {...props} />}
                </Stack.Screen>
                <Stack.Screen name="DoseSettings">
                    {props => <DoseSettings {...props} />}
                </Stack.Screen>
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default RootStack;