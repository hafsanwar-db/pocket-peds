import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import UpdateProfile from '../screens/UpdateProfile';
import DoseSettings from '../screens/DoseSettings';

// Import your screen components

const Stack = createStackNavigator();

const PersonStack = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: {
                    backgroundColor: 'transparent'
                },
                headerTransparent: true,
                headerTitle: '', 
                headerLeftContainerStyle: {
                    paddingLeft: 20
                },
                headerLeft: null
            }}
            initialRouteName='UpdateProfile'
        >
            <Stack.Screen name="UpdateProfile" component={UpdateProfile} options={{ headerShown: false }} />
            <Stack.Screen name="DoseSettings" component={DoseSettings} options={{ headerShown: false }} />
        </Stack.Navigator>
    );
};

export default PersonStack;