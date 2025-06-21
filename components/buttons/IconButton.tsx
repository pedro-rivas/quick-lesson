import { BUTTON_ICON_HEIGHT, BUTTON_ICON_HIT_SLOP, BUTTON_ICON_SIZE } from "@/constants/style";
import * as Haptics from "expo-haptics";
import React from "react";
import { Pressable, StyleProp, TextStyle, ViewStyle } from "react-native";
import Animated, {
  interpolate,
  interpolateColor,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { IconSymbol } from "../ui/IconSymbol";
import { IconSymbolName } from "../ui/icons";

const MIN_SCALE = 0.98;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface IconButtonProps {
  name: IconSymbolName;
  style?: StyleProp<TextStyle>;
  color?: string;
  size?: number;
  onPress: () => void;
  disabled?: boolean;
  width?: number;
  height?: number;
  animatedStyle?: StyleProp<ViewStyle>;
}

const IconButton = ({
  name,
  style,
  color = "black",
  size = BUTTON_ICON_SIZE,
  onPress,
  disabled,
  width = BUTTON_ICON_HEIGHT,
  height = BUTTON_ICON_HEIGHT,
  animatedStyle: outterAnimatedStyle,
}: IconButtonProps) => {
  const pressed = useSharedValue(0);

  const handlePress = () => {
    onPress?.();
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
      onPress={handlePress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      disabled={disabled}
      style={[animatedStyle, outterAnimatedStyle]}
      hitSlop={BUTTON_ICON_HIT_SLOP}
    >
      <IconSymbol name={name} size={size} color={color} style={style} />
    </AnimatedPressable>
  );
};

IconButton.displayName = "IconButton";

export default IconButton;
