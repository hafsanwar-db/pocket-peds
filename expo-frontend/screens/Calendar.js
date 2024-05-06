import React, { useState, useEffect, memo, useContext, useCallback } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import ip from './ip.js'
import { Agenda } from "react-native-calendars";

const MyCalendar = ({ navigation }) => {
  const [markedDates, setMarkedDates] = useState({});
  //api call to the endpoint
  const getCurrentDate = () => {
    const date = new Date().toLocaleDateString();
    console.log(date)
    formattedDate = date.split("/");
    return formattedDate[2] + "-" + formattedDate[0] + "-" + formattedDate[1];
  };
  const fetchData = async () => {
    try {
      console.log(ip)
      const response = await fetch(
        `http://${ip}:8000/medication-history-all/60c7c2879e2f610c989e4a81`
      ); // hard coded with a childId atm
      const data = await response.json();
      setMarkedDates(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  
  const EmptyDate = memo(() => {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-[20px] text-black">
          No medications 
        </Text>
      </View>
    );
  });

  const MemoizedItem = memo(({item, firstItem}) => {
    return (
      <View
        className="bg-white rounded-lg p-4"
        style={{
          marginTop:firstItem?16:4,
          borderTopWidth: firstItem? 2:0,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 2,
        }}
      >
        <View className = 'flex-1 flex-row  justify-between'>
        <Text className = "text-[16px] font-bold text-black mb-[3px]">{item.time}</Text>
          <Text className = "text-[12px] text-gray-500"> UPC: {item.upc}</Text>
        </View>
        
        <View className = 'flex-1 flex-row  justify-between'>
          <Text className = "text-md"><Text className="font-bold text-[#FDB623]">Name: </Text>{item.name} </Text>
          <Text className = "text-md"><Text className="font-bold text-[#FDB623]"> Dose: </Text>{item.dosage} mg</Text>
        </View>
      </View>
    );
  });
 
  return (
    <View className="h-full bg-white">
      <SafeAreaView className="flex-1 bg-transparent">
        <Agenda
          items={markedDates}
          scrollEnabled={true}
          //to keep the view proper I need to render an extra month for some reason
          futureScrollRange={1}
          //maxDate={getCurrentDate()}
          // Specify how each item should be rendered in agenda
          renderItem={(item, firstItem) => {
            return <MemoizedItem item={item} firstItem={firstItem} />
          }}
          hideExtraDays={true}
          hideKnob={false}
          showClosingKnob={true}
          scrollEventThrottle={16}
          renderEmptyDate={() => {
            console.log("empty date");
            return <View />;
          }}
          theme={{
            selectedDayBackgroundColor: "#FDB623",
            agendaDayTextColor: "black",
            agendaDayNumColor: "black",
            agendaTodayColor: "black",
            agendaKnobColor: "#999593",
            dotColor: "#FDB623",
            todayTextColor: "black",
            todayBackgroundColor: "#ffd98c",
          }}
          renderEmptyData={()=>{return <EmptyDate/>}}
        />
      </SafeAreaView>
      <CustomBackButton navigation={navigation} />
    </View>
  );
};

//button to navigate back, the header needed to be overridden
const CustomBackButton = ({ navigation }) => {
  const handlePress = () => {
    navigation.goBack(); // Navigate to the previous screen
  };

  return (
    <TouchableOpacity
      className="p-[2vh] flex items-center bg-[#FDB623]"
      onPress={handlePress}
    >
      <Text className="text-xl text-white font-bold"> Back to Profile</Text>
    </TouchableOpacity>
  );
};

export default MyCalendar;
