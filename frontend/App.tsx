import React, { useEffect } from 'react';
import {StyleSheet, Text, SafeAreaView, Platform} from 'react-native';
import SplashScreen from 'react-native-splash-screen';

const App = () => {

  useEffect(() => {
    if (Platform.OS === 'android') {
      SplashScreen.hide();
    }
  }, []);

  return (
    <SafeAreaView style={styles.container}>
        <Text style={styles.text}>Hello, World!</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  text: {
    fontSize: 25,
    fontWeight: '500',
  },
});

export default App;