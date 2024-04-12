import React from 'react';

// Import Screens
import Login from './screens/Login';
import Signup from './screens/Signup';
import Welcome from './screens/Welcome';

// Import RootStack
import RootStack from './navigators/RootStack';

export default function App() {
  return (
    <RootStack />
  );
} 