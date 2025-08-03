import { UNSTABLE_PRESS_DELAY } from "@/styles/common";
import * as Haptics from "expo-haptics";
import React, { useCallback } from "react";
import { PressableProps, Pressable as RNPressable } from "react-native";
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue
} from "react-native-reanimated";

export const MIN_SCALE = 0.98;

const AnimatedPressable = Animated.createAnimatedComponent(RNPressable);

const Pressable = ({ style, onPress, ...props }: PressableProps) => {
  const pressed = useSharedValue(0);

  const onPressIn = useCallback(() => {
    "worklet";
    pressed.value = 1;
    runOnJS(vibrate)();
  }, []);

  const onPressOut = useCallback(() => {
    "worklet";
    pressed.value = 0;
  }, []);

  const vibrate = useCallback(() => {
    if (!props.disabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  }, [props.disabled]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: interpolate(pressed.value, [0, 1], [1, MIN_SCALE]),
      },
    ],
  }));

  return (
    <AnimatedPressable
      unstable_pressDelay={UNSTABLE_PRESS_DELAY}
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      style={[animatedStyle, style]}
      {...props}
    />
  );
};

Pressable.displayName = "Pressable";

export default React.memo(Pressable);
