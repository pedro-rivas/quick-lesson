import { IconSymbol, IconSymbolName } from "@/components/ui/IconSymbol";
import * as Haptics from "expo-haptics";
import React from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  ViewStyle,
} from "react-native";
import Animated, {
  interpolate,
  interpolateColor,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const MIN_SCALE = 0.99;
const BUTTON_HEIGHT = 50;

interface ButtonProps {
  onPress: () => void;
  disabled?: boolean;
  title: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
  loading?: boolean;
  secondary?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  onPress,
  disabled,
  title,
  style,
  textStyle,
  loading,
  secondary,
}) => {
  const pressed = useSharedValue(0);

  const buttonStyle = secondary ? styles.secondaryButton : styles.button;
  const buttonTextStyle = secondary
    ? styles.secondaryButtonText
    : styles.buttonText;

  const onPressIn = () => {
    "worklet";
    pressed.value = 1;
    runOnJS(vibrate)();
  };

  const onPressOut = () => {
    "worklet";
    pressed.value = 0;
    runOnJS(onPress)();
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
    backgroundColor: interpolateColor(
      pressed.value,
      [0, 1],
      ["#0b57d0", "#0A51C2"]
    ),
  }));

  return (
    <AnimatedPressable
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      disabled={disabled}
      style={[
        buttonStyle,
        disabled ? styles.disabledButton : styles.enabledButton,
        style,
        animatedStyle,
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color="#fff" />
      ) : (
        <Text style={[buttonTextStyle, textStyle]}>{title}</Text>
      )}
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#0b57d0",
    paddingHorizontal: 16,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    height: BUTTON_HEIGHT,
  },
  secondaryButton: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    height: BUTTON_HEIGHT,
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
    color: "#23b1fc",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default React.memo(Button, (prevProps, nextProps) => {
  return (
    prevProps.onPress === nextProps.onPress &&
    prevProps.disabled === nextProps.disabled &&
    prevProps.title === nextProps.title &&
    prevProps.loading === nextProps.loading
  );
});

interface IconButtonProps {
  name: IconSymbolName;
  style?: StyleProp<TextStyle>;
  color?: string;
  size?: number;
  onPress: () => void;
  disabled?: boolean;
  width?: number;
  height?: number;
}

const BUTTON_ICON_SIZE = 24;
const BUTTON_ICON_HEIGHT = 40;
const BUTTON_ICON_HIT_SLOP = { top: 10, bottom: 10, left: 10, right: 10 }

export const IconButton = React.memo(
  ({
    name,
    style,
    color = "black",
    size = BUTTON_ICON_SIZE,
    onPress,
    disabled,
    width = BUTTON_ICON_HEIGHT,
    height = BUTTON_ICON_HEIGHT,
  }: IconButtonProps) => {
    const pressed = useSharedValue(0);

    const onPressIn = () => {
      "worklet";
      pressed.value = 1;
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    };

    const onPressOut = () => {
      "worklet";
      pressed.value = 0;
      runOnJS(onPress)();
    };

    const animatedStyle = useAnimatedStyle(() => ({
      width: width,
      height: height,
      justifyContent: "center",
      alignItems: "center",
      borderRadius: width,
      transform: [
        {
          scale: interpolate(pressed.value, [0, 1], [1, MIN_SCALE]),
        },
      ],
      backgroundColor: interpolateColor(
        pressed.value,
        [0, 1],
        ["#fff", "#E0E0E0"]
      ),
    }));

    return (
      <AnimatedPressable
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        disabled={disabled}
        style={animatedStyle}
        hitSlop={BUTTON_ICON_HIT_SLOP}
      >
        <IconSymbol
          name={name}
          size={size}
          color={color}
          style={style}
        />
      </AnimatedPressable>
    );
  }
);
