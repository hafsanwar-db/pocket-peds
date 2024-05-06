import { TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";
import React from "react";

const Footer = ({ navigation }) => {
  return (
    <View className="absolute bottom-0 flex-row w-[100vw] justify-between items-center bg-blue-500 px-4 py-2">
      {/* Alarm Icon */}
      <TouchableOpacity className="pl-[10vw]">
        <Ionicons name="alarm-outline" size={24} color="white" />
      </TouchableOpacity>
      <TouchableOpacity>
        <Image
          source={require("../assets/img/peds-logo.png")}
          className="h-[10vh] w-[20vw] mt-[-5vh]"
        />
      </TouchableOpacity>
      {/* User Icon */}
      <TouchableOpacity
        className="pr-[10vw]"
        onPress={() => navigation.navigate("Profile")}
      >
        <Ionicons name="person-outline" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};
