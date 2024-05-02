
import React from 'react';
import { Picker } from '@react-native-picker/picker';
import { View, Button } from 'react-native';

export const ReminderPickerButton = ({ reminderInterval, setReminderInterval, onPress }) => {
  return (
    <>
      <Picker
        selectedValue={reminderInterval}
        onValueChange={(itemValue) => setReminderInterval(itemValue)}
      >
        <Picker.Item label="Every 4 sec" value={0.001} />
        <Picker.Item label="Every 1 hour" value={1} />
        <Picker.Item label="Every 2 hours" value={2} />
        <Picker.Item label="Every 4 hours" value={4} />
        <Picker.Item label="Every 8 hours" value={8} />
        
      </Picker>
      <Button title="Save" onPress={() => onPress(reminderInterval)} />
    </>
  );
};

export default ReminderPickerButton;