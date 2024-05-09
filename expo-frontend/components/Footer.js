import { TouchableOpacity, StyleSheet, Dimensions, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";
import React from "react";


height = Dimensions.get("window").height;
width = Dimensions.get("window").width;
const styles = StyleSheet.create({
  container: {
    bottom: 0,
    flexDirection: "row",
    width: width,
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "blue",
    paddingHorizontal: 16,
    paddingVertical: 8,
    height: 0.075 * height,
    backgroundColor: "#3D85C6",
    borderTopRightRadius: 0.1*width,
    borderTopLeftRadius: 0.1*width,
  },
});

const Footer = ({ navigation }) => {
  const handleAlarmIconPress = () => {
    // Navigate to Alarm page
    navigation.navigate("Alarm");
  };

  const handleUserIconPress = () => {
    // Navigate to User page
    navigation.navigate("Child");
  };
  
  const handleScanPress = () =>{
    navigation.navigate("ScanBarcode");
  }

  return (
    <View
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        height: 0.1 * height,
      }}
    >
      <View
        style={{
          backgroundColor: "white",
          flexDirection: "column",
          justifyContent: "flex-end",
          height: "100%",
        }}
      >
        <View style={styles.container}>
          {/* Alarm Icon */}
          <TouchableOpacity
            style={{ paddingHorizontal: 0.1 * width }}
            onPress={handleAlarmIconPress}
          >
            <Ionicons name="alarm-outline" size={36} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress = {handleScanPress}>
            <Image
              source={require("../assets/img/Scan.png")}
              style={{
                height: 0.2 * width,
                width: 0.2 * width,
                marginTop: "-55%",
              }}
            />
          </TouchableOpacity>
          {/* User Icon */}
          <TouchableOpacity
            style={{ paddingHorizontal: 0.1 * width }}
            onPress={handleUserIconPress}
          >
            <Ionicons name="person-outline" size={32} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Footer;
