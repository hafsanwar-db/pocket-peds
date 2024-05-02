// ChildProfileScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { StyledFormArea } from '../components/styles';

const UpdateProfile = ({ route }) => {
  const { childName } = route.params; // Get child name from navigation params

  const [childInfo, setChildInfo] = useState({ name: '', weight: '' });

  useEffect(() => {
    // Fetch child info using Axios
    axios.get(`/child-profiles/${childName}`)
      .then((response) => {
        setChildInfo(response.data);
      })
      .catch((error) => {
        console.error('Error fetching child info:', error);
      });
  }, [childName]);

  const formik = useFormik({
    initialValues: {
      weight: childInfo.weight || '',
    },
    validationSchema: Yup.object().shape({
      weight: Yup.number().required('Weight is required'),
    }),
    onSubmit: async (values) => {
      try {
        // Submit form data to the same endpoint
        await axios.post(`/child-profiles/${childName}`, { weight: values.weight });
        console.log('Form submitted successfully!');
      } catch (error) {
        console.error('Error submitting form:', error);
      }
    },
  });

  return (
    <StyledFormArea>
        <Text>Child Name: {childInfo.name}</Text>

        <Text>Child Weight:</Text>
        <TextInput
            onChangeText={formik.handleChange('weight')}
            onBlur={formik.handleBlur('weight')}
            value={formik.values.weight}
            keyboardType="numeric"
        />

        {formik.touched.weight && formik.errors.weight ? (
            <ExtraText>{formik.errors.weight}</ExtraText>
        ) : null}

        <Button title="Submit" onPress={formik.handleSubmit} />
    </StyledFormArea>
  );
};

export default UpdateProfile;