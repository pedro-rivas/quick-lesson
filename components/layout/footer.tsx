import useTheme from "@/hooks/useTheme";
import { spacing } from "@/styles/spacing";
import { hexToRgba } from "@/utils";
import { LinearGradient } from "expo-linear-gradient";
import React, { PropsWithChildren, useImperativeHandle } from "react";
import { StyleSheet } from "react-native";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BUTTON_HEIGHT } from "../buttons/Button";

export interface LayoutFooterGradientRef {
  hide: () => void;
  show: () => void;
}

export const Gradient = React.forwardRef(
  ({ children }: PropsWithChildren, ref) => {
    const { background } = useTheme().colors;
    const insets = useSafeAreaInsets();

    const y = useSharedValue(0);

    const hide = () => {
      "worklet";
      y.value = withTiming(BUTTON_HEIGHT + insets.bottom + spacing.m);
    };

    const show = () => {
      "worklet";
      y.value = withTiming(0);
    };

    useImperativeHandle(ref, () => ({
      hide,
      show,
    }));

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ translateY: y.value }],
    }));

    return (
      <Animated.View style={[styles.container, animatedStyle]}>
        <LinearGradient
          colors={[hexToRgba(background, 0), background, background]}
          style={styles.gradient}
        >
          {children}
        </LinearGradient>
      </Animated.View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    zIndex: 1000,
    left: 0,
    right: 0,
    bottom: 0,
  },
  gradient: {
    paddingHorizontal: spacing.m,
    paddingTop: spacing.xl,
    width: "100%",
  },
});
