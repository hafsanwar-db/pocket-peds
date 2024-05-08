import {
    Image,
    StyleSheet,
    Text,
    View,
    Dimensions,
    Animated,
    Easing,
  } from 'react-native';
  import React from 'react';
  
  const {width, height} = Dimensions.get('screen');
  
  const SlideItem = ({item}) => {
    const translateYImage = new Animated.Value(-20);

    Animated.timing(translateYImage, {
      toValue: 0,
      duration: 1000,
      useNativeDriver: true,
      easing: Easing.bounce,
    }).start();
  
    return (
      <View style={styles.container}>
        <Image
          source={item.img}
          resizeMode='contain'
          style={[
            styles.image,
            // {
            //   transform: [
            //     {
            //       translateY: translateYImage,
            //     },
            //   ],
            // },
          ]}
        />
      </View>
    );
  };
  
  export default SlideItem;
  
  const styles = StyleSheet.create({
    container: {
      width : width,
      alignItems: 'center',
    },
    image: {
      flex: 1,
      width: 0.3*width,
    },
  });