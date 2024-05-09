import React, { useState } from "react";
import { Button, Modal, View, Text } from "react-native";

import NetInfo from '@react-native-community/netinfo';

import { WeightModal, PageTitle, WeightModalButton, ButtonText } from "../styles";
import Ionicons from '@expo/vector-icons/Ionicons';

const Internet = () => {
    const [isConnected, setIsConnected] = useState(true);
    const [visible, setVisible] = useState(false);

    const unsubscribe = NetInfo.addEventListener(state => {
        console.log('Connection type', state.type);
        console.log('Is connected?', state.isConnected);

        if (state.isConnected != isConnected) {
            setIsConnected(state.isConnected);
            setVisible(!state.isConnected);
        }
    });      

    return (
        <Modal visible={visible} animationType='slide'>
            <Ionicons name="wifi-outline" size={300} color="#FEB624" style={{ alignSelf: 'center', marginVertical: 40, paddingHorizontal: 10 }} />
            <WeightModal style={{ backgroundColor: "#C9DAF8"}}>
                <PageTitle style={{ color: "black" }}>Disconnected</PageTitle>
                <Text>If you do not provide the application with access to the internet, some operations will not be available.</Text>
                <Text>Continue without Internet?</Text>
                <View style={{ flexDirection: "column", justifyContent: "center", marginTop: 20 }}>
                    <WeightModalButton onPress={() => {unsubscribe(); setVisible(false);}} title="Continue" style={{ backgroundColor: '#9F9F9F' }} >
                        <Text style={{ fontSize: 20, color: "white" }}>Continue Offline</Text>
                    </WeightModalButton>
                    <WeightModalButton onPress={() => setVisible(false)} title="Update Weight" style={{ backgroundColor: '#3D85C6' }} >
                        <Text style={{ fontSize: 20, color: "black" }}>Keep Trying to Connect</Text>
                    </WeightModalButton>
                </View>
            </WeightModal>
        </Modal>
    );
}

export default Internet;