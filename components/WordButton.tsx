import * as Haptics from "expo-haptics";
import React, { useCallback, useEffect } from "react";
import { Dimensions, StyleSheet, TouchableOpacity } from "react-native";
import Animated, {
  Easing,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

const withTimeout = (cb: () => void) => setTimeout(cb, 10);

const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);

const ANGLE = 4;
const TIME = 100;
const EASING = Easing.elastic(1.5);
const TIMES = 7;

interface WordButtonProps {
  word: string;
  selected: boolean;
  matched: boolean;
  disabled: boolean;
  error: boolean;
  hint: boolean;
  onPress: () => void;
  collapsed?: boolean;
}

const WordButton = ({
  word,
  selected,
  matched,
  error,
  disabled,
  hint,
  collapsed,
  onPress,
}: WordButtonProps) => {
  // shared value for rotation
  const rotation = useSharedValue(0);
  const hintValue = useSharedValue(0);
  const isSelected = useSharedValue(0);
  const hasError = useSharedValue(0);
  const isMatched = useSharedValue(0);

  // whenever `error` becomes true, run the wobble sequence
  useEffect(() => {
    if (error) {
      withTimeout(wobble);
    }
  }, [error, rotation]);

  useEffect(() => {
    if (hint) {
      withTimeout(hintAnimation);
    }
  }, [hint]);

  useEffect(() => {
    withTimeout(() => selectAnimation(selected));
  }, [selected]);

  useEffect(() => {
    if (matched) {
      withTimeout(matchAnimation);
    }
  }, [matched]);

  const matchAnimation = useCallback(() => {
    "worklet";
    isMatched.value = withSequence(
      withTiming(1, { duration: 100, easing: Easing.linear }),
      withTiming(0, { duration: 800, easing: Easing.linear }),
      withTiming(0, { duration: 100, easing: Easing.linear })
    );
  }, [isSelected]);

  const selectAnimation = useCallback(
    (select: boolean) => {
      "worklet";
      isSelected.value = select ? 1 : 0;
    },
    [isSelected]
  );

  const hintAnimation = useCallback(() => {
    "worklet";
    hintValue.value = withSequence(
      withTiming(1, { duration: 500, easing: Easing.linear }),
      withTiming(1, { duration: 500, easing: Easing.linear }),
      withTiming(0, { duration: 500, easing: Easing.linear })
    );
  }, [hintValue]);

  const wobble = useCallback(() => {
    "worklet";
    hasError.value = withSequence(
      withTiming(1, { duration: 100 }),
      withTiming(1, { duration: 800 }),
      withTiming(0, { duration: 100 })
    );
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
  }, [rotation]);

  const handlePress = useCallback(() => {
    onPress();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, [onPress]);

  // apply rotation to the card’s style
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotateZ: `${rotation.value}deg` }],
    backgroundColor: isMatched.value
      ? "#4fc805"
      : hasError.value
      ? "#ff0000"
      : isSelected.value
      ? "#0b57d0"
      : interpolateColor(hintValue.value, [0, 1], ["#fff", "#d7ffb8"]),
  }));

  const animatedTextStyle = useAnimatedStyle(() => ({
    color: isMatched.value
      ? "#fff"
      : hasError.value
      ? "white"
      : isSelected.value
      ? "white"
      : interpolateColor(isSelected.value, [0, 1], ["black", "white"]),
  }));

  return (
    <AnimatedTouchableOpacity
      style={[
        styles.card,
        !collapsed && styles.grow,
        disabled && styles.disabled,
        animatedStyle,
      ]}
      onPress={handlePress}
      disabled={matched || disabled}
    >
      <Animated.Text style={[styles.text, animatedTextStyle]}>
        {word}
      </Animated.Text>
    </AnimatedTouchableOpacity>
  );
};

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
    borderBottomWidth: 2,
    borderColor: "#ebebeb",
    justifyContent: "center",
    alignItems: "center",
  },
  grow: {
    flexGrow: 1,
    width: Dimensions.get("window").width / 2 - 32,
  },
  disabled: {
    opacity: 0.4,
  },
  text: {
    fontSize: 16,
  }
});

WordButton.displayName = "WordButton";

export default React.memo(WordButton, (prevProps, nextProps) => {
  return (
    prevProps.selected === nextProps.selected &&
    prevProps.matched === nextProps.matched &&
    prevProps.error === nextProps.error &&
    prevProps.disabled === nextProps.disabled &&
    prevProps.hint === nextProps.hint
  );
});
