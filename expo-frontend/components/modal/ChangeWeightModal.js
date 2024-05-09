import React, { useState } from "react";
import { View, Button, Text, Modal } from "react-native";

import { WeightModal, PageTitle, WeightModalButton, ButtonText } from "../styles";

import Octicons from '@expo/vector-icons/Octicons';

const ChangeWeightModal = (navigation, route) => {
    const [visible, setVisible] = useState(true);

    const {childInfo} = route.params;
    
    return (
        <Modal visible={visible} animationType='slide' transparent={true}>
            <WeightModal>
                <PageTitle style={{ color: "black" }}>Update Information</PageTitle>
                <Octicons name="alert" size={50} color="black" style={{ alignSelf: 'center', marginVertical: 10 }} />
                <Text>If you do not update the weight, dosing information may not be accurate.</Text>
                <Text>Continue without updating?</Text>
                <View style={{ flexDirection: "column", justifyContent: "center", marginTop: 20 }}>
                    <WeightModalButton onPress={() => setVisible(false)} title="Continue" style={{ backgroundColor: '#9F9F9F' }} >
                        <Text style={{ fontSize: 20, color: "white" }}>Continue</Text>
                    </WeightModalButton>
                    <WeightModalButton onPress={() => {navigation.navigate("UpdateProfile", { childInfo: childInfo})}} title="Update Weight" style={{ backgroundColor: '#FEB624' }} >
                        <Text style={{ fontSize: 20, color: "black" }}>Update Profile</Text>
                    </WeightModalButton>
                </View>
            </WeightModal>
        </Modal>
  );
};

export default ChangeWeightModal;