import React, { useState } from "react";
import { Button, Modal, View, Text } from "react-native";

import { ModalContent } from "../styles";
import NetInfo from '@react-native-community/netinfo';

const Internet = () => {
    const [isConnected, setIsConnected] = useState(true);

    const unsubscribe = NetInfo.addEventListener(state => {
        console.log('Connection type', state.type);
        console.log('Is connected?', state.isConnected);

        if (state.isConnected != isConnected) {
            setIsConnected(state.isConnected);
        }
    });      

    return (
        <Modal visible={!isConnected} animationType='slide'>
            <ModalContent>
                <Text>You are not connected to the internet! Some features of the app are disabled.</Text>
                <Button
                    onPress={unsubscribe}
                    title="Continue Offline"
                    color="#ADD8E6"
                    accessibilityLabel="Continue using PocketPeds offline."
                />
            </ModalContent>
        </Modal>
    );
}

export default Internet;