import {Animated, FlatList, StyleSheet, Dimensions, View} from 'react-native';
import React, {useRef, useState} from 'react';
import Slides from './slides';
import SlideItem from '../components/SlideItem';
import Pagination from '../components/Pagination';


const Slider = () => {
  const imageList = ['avatar1', 'avatar2', 'avatar3', 'avatar4', 'avatar5', 'avatar6'];
  const {height, width} = Dimensions.get('screen');
  const [index, setIndex] = useState(0);
  const [image, setImage] = useState("");

  const scrollX = useRef(new Animated.Value(0)).current;

  const handleOnScroll = event => {
    Animated.event(
      [
        {
          nativeEvent: {
            contentOffset: {
              x: scrollX,
            },
          },
        },
      ],
      {
        useNativeDriver: false,
      },
    )(event);
  };

  const handleOnViewableItemsChanged = ({viewableItems}) => {
      const listIndex = viewableItems[0];
      console.log(listIndex)
    // setImage(imageList[viewableItems[0].index - 1])
    // setIndex(viewableItems[0].index);
  };

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  return (
    <View style={{height: 0.25*height, marginBottom:20}}>
      <View>
      <FlatList
        data={Slides}
        renderItem={({item}) => <SlideItem item={item} />}
        horizontal
        pagingEnabled
        snapToAlignment="center"
        showsHorizontalScrollIndicator={false}
        onScroll={handleOnScroll}
        onViewableItemsChanged={handleOnViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
      />
      <Pagination data={Slides} scrollX={scrollX} index={index} />
      </View>
    </View>
  );
};

export default Slider;

const styles = StyleSheet.create({});