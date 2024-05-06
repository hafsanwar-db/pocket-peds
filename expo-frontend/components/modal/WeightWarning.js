import React from "react";
import { Button, Text } from "react-native";

import { ModalContent, PageTitle } from "../styles";

import Octicons from '@expo/vector-icons/Octicons';

const ChangeWeightModal = () => {
    const [visible, setVisible] = useState(true);
    
    return (
        <ModalContent visible={visible} animationType='slide'>
            <PageTitle>Update Information</PageTitle>
            <Octicons name="alert" size={24} color="black" />
            <Text>If you do not update the weight, dosing information may not be accurate.</Text>
            <Button onPress={() => navigation.goBack()} title="Go Back" color="#ADD8E6" />
            <Button onPress={() => setVisible(false)} title="Update Weight" color="#ADD8E6" />
        </ModalContent>
  );
};

export default ChangeWeightModal;
