import React from "react";
import { Button, Text } from "react-native";

import { ModalContent, PageTitle } from "../styles";
import UpdateProfile from "../../screens/UpdateProfile";

import Octicons from '@expo/vector-icons/Octicons';

const ChangeWeightModal = ({ route }) => {
    
    const { childName } = route.params;
    return (
        <ModalContent>
            <PageTitle>Update Information</PageTitle>
            <Octicons name="alert" size={24} color="black" />
            <Text>If you do not update the weight, dosing information may not be accurate.</Text>
            <Button onPress={() => navigation.goBack()} title="Go Back" color="#ADD8E6" />
            <Button onPress={() => navigation.navigate(UpdateProfile, {childName: childName})} title="Update Weight" color="#ADD8E6" />
        </ModalContent>
  );
};

export default ChangeWeightModal;
