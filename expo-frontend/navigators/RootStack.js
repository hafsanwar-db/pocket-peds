import { React, useState, useEffect, useContext } from "react";
import Footer from "../components/Footer.js";
import { Colors } from "../components/styles";
const tertiary = Colors.tertiary; // Import the missing tertiary variable
import ip from "../screens/ip.js";
import useLocalNotification from "../notifications/useLocalNotification.js"; // Import the missing ip variable
// React navigation
import Carousel from "../screens/Carousel";
import AddChild from "../screens/AddChild";
import Child from "../screens/Child";
import ChildInfo from "../screens/ChildInfo";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Token } from "../components/Token";
import Login from "../screens/Login";
import Signup from "../screens/Signup";
import Welcome from "../screens/Welcome";
import ScanBarcode from "../screens/ScanBarcode";
import ShowUPC from "../screens/ShowUPC";
import CalculatingScreen from "../screens/CalculatingScreen";
import ShowData from "../screens/ShowData";
import DoseSettings from "../screens/DoseSettings";
import MyCalendar from "../screens/Calendar";
import ConfirmationScreen from "../screens/ConfirmationScreen";
import { navigationRef, isReadyRef } from "../NavigationService";
import UpdateProfile from "../screens/UpdateProfile";
import { AppState, View, Dimensions } from "react-native";
import EditMedication from "../screens/EditMedication.js";
import Internet from "../components/modal/Internet.js";

height = Dimensions.get("window").height;
width = Dimensions.get("window").width;
const Stack = createStackNavigator();
const RootStack = ({
  reminderInterval,
  setReminderInterval,
  handleLocalPushNotification,
}) => {
  // Notifications.setNotificationHandler({
  //   handleNotification: async () => ({
  //     shouldShowAlert: true,
  //     shouldPlaySound: false,
  //     shouldSetBadge: false
  //   })
  // });


  // all these states and contexts are for JWT tokens
  const [appState, setAppState] = useState(AppState.currentState);
  const [shouldRefresh, setShouldRefresh] = useState(false);
  const { tokenValue } = useContext(Token);
  const [lastRefreshTime, setLastRefreshTime] = useState(0);

  const handleAppStateChange = (nextAppState) => {
    setAppState(nextAppState);
  };

  // Set up navigation listener
  useEffect(() => {
    const onReady = () => {
      isReadyRef.current = true;
    };

    const unsubscribe = navigationRef.current?.addListener("state", onReady);
  }, []);

  //to navigate to login page if app is in background for a certain amount of time
  const navigateToLoginPage = () => {
    if (isReadyRef.current) {
      navigationRef.current?.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    }
  };
  useEffect(() => {
    // Set up app state listener
    //shouldRefresh is true only after the user has logged in
    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );
    if (shouldRefresh) {
      //only for when the app is put on the background, only at that instant
      //this means the user has 15 minutes before they are logged out
      if (appState !== "active") {
        refreshToken();
      }

      // Set up interval to refresh token every 15 minutes when app is in the foreground
      const intervalId = setInterval(() => {
        const currentTime = new Date().getTime();
        const timeSinceLastRefresh = currentTime - (lastRefreshTime || 0);
        if (appState === "active") {
          // Check if 15 minutes have elapsed since the last refresh
          refreshToken();
        } else {
          //if time elapsed in background is greater than 15 minutes, go back to the login screen
          if (timeSinceLastRefresh >= 16 * 60 * 1000) {
            navigateToLoginPage();
          }
        }
      }, 15 * 60 * 1000);

      return () => {
        //unmounting the setInterval hooks and the listeners
        clearInterval(intervalId);
        subscription?.remove();
      };
    }
  }, [appState, shouldRefresh]);

  const refreshToken = async () => {
    try {
      // Make API request to refresh token endpoint
      if (shouldRefresh) {
        const response = await fetch(`http://${ip}:8000/refresh-token`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${tokenValue}`,
          },
        });

        const data = await response.json();

        if (response.ok) {
          setLastRefreshTime(new Date().getTime());
          console.log("Token refresh successful:", data);
        } else {
          console.error("Token refresh failed:", data.error);
        }
      }
    } catch (error) {
      console.error("Error refreshing token, could not make the call:", error);
    }
  };

  return (
    <>
    <Internet />

    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator
        screenOptions={{
          headerBackTitleVisible: false,
          headerStyle: {
            backgroundColor: "transparent",
          },
          headerTintColor: tertiary,
          headerTransparent: true,
          headerTitle: "",
          headerLeftContainerStyle: {
            paddingLeft: 10,
          },
          headerLeft: null
        }}
        initialRouteName="Login"
      >
        <Stack.Screen name="Login">
          {(props) => (
            <Login
              reminderInterval={reminderInterval}
              setReminderInterval={setReminderInterval}
              handleLocalPushNotification={handleLocalPushNotification}
              setShouldRefresh={setShouldRefresh}
              setLastRefreshTime={setLastRefreshTime}
              {...props}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="Signup">
          {(props) => <Signup {...props} />}
        </Stack.Screen>

        {/* this welcome screen is shown after login, its'a a 
                placeholder for profile sections*/}
        <Stack.Screen name="Welcome">
          {(props) => (
            <>
            <View style={{ height: 0.9 * height, backgroundColor: "white" }}>
              <Welcome {...props} />
            </View>
            <Footer navigation={props.navigation} />
          </>
          )}
        </Stack.Screen>
        <Stack.Screen name="ScanBarcode">
          {(props) => (
            <>
              <View style={{ height: 0.9 * height, backgroundColor: "white" }}>
                <ScanBarcode {...props} />
              </View>
              <Footer navigation={props.navigation} />
            </>
          )}
        </Stack.Screen>
        <Stack.Screen name="ShowUPC">
          {(props) => 
           <>
           <View style={{ height: 0.9 * height, backgroundColor: "white" }}>
           <ShowUPC {...props} />
           </View>
           <Footer navigation={props.navigation} />
         </>}
        </Stack.Screen>
        <Stack.Screen name="CalculatingScreen">
          {(props) => 
          <>
           <View style={{ height: 0.9 * height, backgroundColor: "white" }}>
           <CalculatingScreen {...props} />
           </View>
           <Footer navigation={props.navigation} />
         </>}
        </Stack.Screen>
        <Stack.Screen name="ShowData">
          {(props) => 
          <>
          <View style={{ height: 0.9 * height, backgroundColor: "white" }}>
          <ShowData {...props} />
          </View>
          <Footer navigation={props.navigation} />
        </>}
        </Stack.Screen>
        <Stack.Screen name="DoseSettings">
          {(props) => <>
          <View style={{ height: 0.9 * height, backgroundColor: "white" }}>
          <DoseSettings navigation={props.navigation} {...props} />
          </View>
          <Footer navigation={props.navigation} />
        </>}
        </Stack.Screen>
        <Stack.Screen name="MyCalendar" options={{ headerShown: false }}>
          {(props) => <>
          <View style={{ height: 0.9 * height, backgroundColor: "white" }}>
          <MyCalendar navigation={props.navigation} {...props} />
          </View>
          <Footer navigation={props.navigation} />
        </>}
        </Stack.Screen>
        <Stack.Screen name="ConfirmationScreen">
          {(props) => <>
          <View style={{ height: 0.9 * height, backgroundColor: "white" }}>
          <ConfirmationScreen {...props} />
          </View>
          <Footer navigation={props.navigation} />
        </> }
        </Stack.Screen>
        <Stack.Screen name="AddChild">
          {(props) => <>
          <View style={{ height: 0.9 * height, backgroundColor: "white" }}>
          <AddChild {...props} />
          </View>
          <Footer navigation={props.navigation} />
        </> }
        </Stack.Screen>
        <Stack.Screen name="Child">
          {(props) => <>
          <View style={{ height: height, backgroundColor: "white" }}>
          <Child {...props} />
          </View>
        </> }
        </Stack.Screen>
        <Stack.Screen name="ChildInfo">
          {(props) => <>
          <View style={{ height: 0.9 * height, backgroundColor: "white" }}>
          <ChildInfo {...props} />
          </View>
          <Footer navigation={props.navigation} />
        </> }
        </Stack.Screen>
        <Stack.Screen name="EditMedication">
          {(props) => <>
          <View style={{ height: 0.9 * height, backgroundColor: "white" }}>
          <EditMedication {...props} />
          </View>
          <Footer navigation={props.navigation} />
        </> }
        </Stack.Screen>
        <Stack.Screen name="Carousel">
          {(props) => <>
          <View style={{ height: 0.9 * height, backgroundColor: "white" }}>
          <Carousel {...props} />
          </View>
          <Footer navigation={props.navigation} />
        </> }
        </Stack.Screen>
        
        <Stack.Screen
            name="ChangeWeightModal"
            options={{ presentation: 'modal' }}
        > 
          {(props) => <ChangeWeightModal {...props} />}
        </Stack.Screen>        
        {/* <Stack.Screen name="UpdateProfile" component={UpdateProfile} /> */}
        <Stack.Screen name="UpdateProfile">
          {(props) => <>
          <View style={{ height: 0.9 * height, backgroundColor: "white" }}>
          <UpdateProfile navigation={props.navigation} {...props} />
          </View>
          <Footer navigation={props.navigation} />
        </> }
        </Stack.Screen>
        <Stack.Screen name="useLocalNotification">
          {(props) => <>
          <View style={{ height: 0.9 * height, backgroundColor: "white" }}>
          <useLocalNotification {...props} />
          </View>
        </> }
        </Stack.Screen>
      </Stack.Navigator>
      {/*include the component as done in the screens above*/}
    </NavigationContainer>
    </>
  );
};

export default RootStack;
