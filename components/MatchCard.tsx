import * as QuickText from "@/components/QuickText";
import React, { useEffect } from "react";
import { Dimensions, StyleSheet, TouchableOpacity, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming
} from "react-native-reanimated";

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

const ANGLE = 4;
const TIME = 100;
const EASING = Easing.elastic(1.5);
const TIMES = 7;

const MatchCard =({
    word,
    selected,
    matched,
    error,
    onPress,
  }: {
    word: string;
    selected: boolean;
    matched: boolean;
    error: boolean;
    onPress: () => void;
  })  => {
    // shared value for rotation
    const rotation = useSharedValue(0);
  
    // whenever `error` becomes true, run the wobble sequence
    useEffect(() => {
      if (error) {
        rotation.value = withSequence(
          // start by rotating to -ANGLE
          withTiming(-ANGLE, { duration: 50, easing: EASING }),
          // wobble back and forth 7 times
          withRepeat(
            withTiming(ANGLE, {
              duration: TIME,
              easing: EASING,
            }),
            TIMES,
            true
          ),
          // finally return to 0
          withTiming(0, { duration: 50, easing: EASING })
        );
      }
    }, [error, rotation]);
  
    // apply rotation to the card’s style
    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ rotateZ: `${rotation.value}deg` }],

    }));
  
    return (
      <AnimatedTouchableOpacity
        style={[
          styles.card,
          selected && styles.selected,
          matched && styles.matched,
          error && styles.error,
          animatedStyle,
        ]}
        onPress={onPress}
        disabled={matched}
      >
        <View>
          <QuickText.BodyText
            style={{
              color:
                selected || matched || error ? "white" : "black",
            }}
          >
            {word}
          </QuickText.BodyText>
        </View>
      </AnimatedTouchableOpacity>
    );
  }


  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
    },
    card: {
      padding: 16,
      borderRadius: 16,
      backgroundColor: "#fff",
      borderWidth: 1,
      borderColor: "#ebebeb",
      justifyContent: "center",
      alignItems: "center",
      flexGrow: 1,
      minWidth: Dimensions.get("window").width / 2 - 32,
    },
    selected: {
      backgroundColor: "#0b57d0",
      borderColor: "#0b57d0",
    },
    matched: {
      backgroundColor: "#4fc805",
    },
    error: {
      backgroundColor: "#ff0000",
      borderColor: "#ff0000",
    },
  });
  
  MatchCard.displayName = "MatchCard";

  export default React.memo(MatchCard, (prevProps, nextProps) => {
    return  prevProps.selected === nextProps.selected &&
    prevProps.matched === nextProps.matched &&
    prevProps.error === nextProps.error;
  });