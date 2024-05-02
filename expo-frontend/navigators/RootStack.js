import * as React from 'react';

import { Colors } from '../components/styles';
const tertiary = Colors.tertiary; // Import the missing tertiary variable

// React navigation
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Login from '../screens/Login';
import Signup from '../screens/Signup';
import Welcome from '../screens/Welcome';
import UpdateProfile from '../screens/UpdateProfile';

import WeightWarning from '../components/modal/WeightWarning';

const Stack = createStackNavigator();

// Credentials context
import { CredentialsContext } from '../components/CredentialsContext';

const RootStack = () => {
    return (
        <CredentialsContext.Consumer>
            {({storedCredentials}) => (
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
                            <>
                                <Stack.Screen name="Welcome" component={Welcome} />
                                <Stack.Screen name="UpdateProfile" component={UpdateProfile} />
                                <Stack.Screen name="Login" component={Login} />
                                <Stack.Screen name="Signup" component={Signup} />
                            </>   

                        <Stack.Screen
                            name="WeightWarning"
                            component={WeightWarning}
                            options={{ presentation: 'modal' }}
                        />
                    </Stack.Navigator>
                </NavigationContainer>
            )}
        </CredentialsContext.Consumer>
    );
}

export default RootStack;