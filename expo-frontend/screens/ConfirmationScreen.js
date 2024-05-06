
import React, {useState} from 'react';
import { View, Text, Button, Modal } from 'react-native';
import {
  ConfirmationContainer,
  ConfirmationTitle,
  ConfirmationText,
  ButtonText,
  StyledButton,
  StyledButtonConfirmation1,
  StyledButtonConfirmation2
} from '../components/styles';

const ConfirmationScreen = ({ route }) => {
  const medicineName = route.params.medicineName;
  const [isConfirmationVisible, setConfirmationVisible] = useState(true); // Set confirmation modal to be initially visible
  const handleConfirm = (confirmed) => {
    if (confirmed) {
      // Remove something from the database
      
    }
    // Close the confirmation modal
    setConfirmationVisible(false);
  };


  

  return (
    <Modal
      visible={isConfirmationVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={() => handleConfirm(false)}
    >
      <ConfirmationContainer>
      
        <ConfirmationTitle>
          Update Information
        </ConfirmationTitle>

        <ConfirmationText>
          Are you sure you want to stop giving {medicineName} to [Child's Name]?
        </ConfirmationText>

        <StyledButtonConfirmation1  onPress={() => handleConfirm(true)}>
            <ButtonText>Yes</ButtonText>
        </StyledButtonConfirmation1>

        <StyledButtonConfirmation2  onPress={() => handleConfirm(false)}>
            <ButtonText>No</ButtonText>
        </StyledButtonConfirmation2>

      </ConfirmationContainer>

    </Modal>
    
  );
};

const removeMedication = () => {
  // Remove medication from local state
  const updatedList = [...medicationList];
  // Logic to remove medication from the list
  setMedicationList(updatedList);

  // Make API call to update backend database
  // Example: axios.delete(`/medications/${medicationId}`);

  // Show visual confirmation
  // Example: showToastMessage("Medication removed successfully");
  Alert.alert(
    "Success",
    "Medication removed successfully",
  );
};

export default ConfirmationScreen;

