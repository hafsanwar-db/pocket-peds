import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Calendar from '../screens/Calendar';
import Welcome from '../screens/Welcome';

const Stack = createStackNavigator();

const ClockStack = () => {
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
            initialRouteName='Welcome'
        >
            <Stack.Screen name="Welcome" component={Welcome}  />
            <Stack.Screen name="MyCalendar">
                    {props => <MyCalendar navigation = {props.navigation} {...props} />}
            </Stack.Screen>
        </Stack.Navigator>
    );
};

export default ClockStack;