import {Animated, FlatList, StyleSheet, Dimensions, View} from 'react-native';
import React, {useRef, useState, useEffect} from 'react';
import Slides from './slides';
import SlideItem from '../components/SlideItem';
import Pagination from '../components/Pagination';

const Slider = ({setImage, initialImage}) => {
  const imageList = ['avatar1', 'avatar2', 'avatar3', 'avatar4', 'avatar5', 'avatar6'];
  const {height, width} = Dimensions.get('screen');
  const [index, setIndex] = useState(0);
  const [currentImage, setCurrentImage] = useState(initialImage);

  const scrollX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Find the index of the initial image in the imageList array
    const initialImageIndex = imageList.findIndex(image => image === initialImage);
    if (initialImageIndex !== -1) {
      // Set the index state to the index of the initial image
      setIndex(initialImageIndex);
    }
  }, [initialImage, imageList]);

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
    setImage(imageList[viewableItems[0].item.id - 1]);
    setIndex(viewableItems[0].index);
    setCurrentImage(imageList[viewableItems[0].index]);
  };

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  return (
    <View style={{marginTop:10, height: 0.2*height, marginBottom:20}}>
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
          initialScrollIndex={index} // Set initial scroll index
          getItemLayout={(data, index) => ({
            length: width, // Width of a single item
            offset: width * index, // Offset of the item
            index, // Index of the item
          })}
        />
        <Pagination data={Slides} scrollX={scrollX} index={index} />
      </View>
    </View>
  );
};

export default Slider;

const styles = StyleSheet.create({});
