import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ScanBarcode from '../screens/ScanBarcode';
import ShowUPC from '../screens/ShowUPC';
import ShowData from '../screens/ShowData';
import CalculatingScreen from '../screens/CalculatingScreen';

const Stack = createStackNavigator();

const BarcodeStack = () => {
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
            initialRouteName='ScanBarcode'
        >
            <Stack.Screen name="ScanBarcode" component={ScanBarcode} />
            <Stack.Screen name="ShowUPC" component={ShowUPC} />
            <Stack.Screen name="ShowData" component={ShowData} />
            <Stack.Screen name="CalculatingScreen" component={CalculatingScreen} />
        </Stack.Navigator>
    );
};

export default BarcodeStack;