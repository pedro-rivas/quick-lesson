import { scale } from "@/styles/scale";
import { spacing } from "@/styles/spacing";
import * as Haptics from "expo-haptics";
import React from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextStyle,
  ViewStyle,
} from "react-native";
import Animated, {
  interpolate,
  interpolateColor,
  Keyframe,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { MIN_SCALE } from "./Pressable";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
export const BUTTON_HEIGHT = scale.ms(50);

interface ButtonProps {
  onPress: () => void;
  disabled?: boolean;
  title: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
  loading?: boolean;
  secondary?: boolean;
  success?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  onPress,
  disabled,
  title,
  style,
  textStyle,
  loading,
  secondary,
  success,
}) => {
  const pressed = useSharedValue(0);

  const buttonStyle = secondary
    ? styles.secondaryButton
    : success
    ? styles.success
    : styles.button;
  const buttonTextStyle = secondary
    ? styles.secondaryButtonText
    : success
    ? styles.secondaryButtonText
    : styles.buttonText;

  const handlePress = () => {
    onPress();
  };

  const onPressIn = () => {
    "worklet";
    pressed.value = 1;
    runOnJS(vibrate)();
  };

  const onPressOut = () => {
    "worklet";
    pressed.value = 0;
  };

  const vibrate = () => {
    if (!disabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: interpolate(pressed.value, [0, 1], [1, MIN_SCALE]),
      },
    ],
    backgroundColor: success
      ? "#fff"
      : secondary
      ? "#fff"
      : interpolateColor(pressed.value, [0, 1], ["#0b57d0", "#0A51C2"]),
  }));

  const keyframe = new Keyframe({
    0: {
      transform: [{ scale: 1.1 }],
    },
    25: {
      transform: [{ scale: 0.9 }],
    },
    50: {
      transform: [{ scale: 1.05 }],
    },
    100: {
      transform: [{ scale: 1 }],
    },
  });

  return (
    <Animated.View entering={success ? keyframe.duration(600) : undefined} >
      <AnimatedPressable
        onPress={handlePress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        disabled={disabled}
        style={[
          buttonStyle,
          disabled ? styles.disabledButton : styles.enabledButton,
          animatedStyle,
          style,
        ]}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={[buttonTextStyle, textStyle]}>{title}</Text>
        )}
      </AnimatedPressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#0b57d0",
    paddingHorizontal: spacing.m,
    borderRadius: spacing.m,
    alignItems: "center",
    justifyContent: "center",
    height: BUTTON_HEIGHT,
  },
  secondaryButton: {
    paddingHorizontal: spacing.m,
    borderRadius: spacing.m,
    alignItems: "center",
    justifyContent: "center",
    height: BUTTON_HEIGHT,
    borderWidth: 2,
    borderColor: "#ebebeb",
  },
  disabledButton: {
    opacity: 0.5,
  },
  enabledButton: {
    opacity: 1,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  secondaryButtonText: {
    color: "#3D3D3D",
    fontSize: 18,
    fontWeight: "bold",
  },
  success: {
    paddingHorizontal: spacing.m,
    borderRadius: spacing.m,
    alignItems: "center",
    justifyContent: "center",

    height: BUTTON_HEIGHT,
  },
});

export default React.memo(Button, (prevProps, nextProps) => {
  return (
    prevProps.onPress === nextProps.onPress &&
    prevProps.disabled === nextProps.disabled &&
    prevProps.title === nextProps.title &&
    prevProps.loading === nextProps.loading &&
    prevProps.secondary === nextProps.secondary
  );
});
