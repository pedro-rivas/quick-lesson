import useTranslation from "@/hooks/useTranslation";
import React, { useCallback, useEffect, useMemo } from "react";
import { LayoutChangeEvent, StyleSheet } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BUTTON_HEIGHT } from "./buttons/Button";
import * as Layout from "./Layout";
import * as Text from "./Text";

interface AnimatedBottomContainerProps {
  show: boolean;
}

const AnimatedBottomContainer = ({ show }: AnimatedBottomContainerProps) => {
  const insets = useSafeAreaInsets();
  const t = useTranslation();

  const height = useSharedValue(0);
  const hide = useSharedValue(1);
  const opacity = useSharedValue(0);

  useEffect(() => {
    setTimeout(() => {
      animateHide(show);
    }, 10);
  }, [show]);

  const animateHide = useCallback((value: boolean) => {
    "worklet";
    hide.value = withTiming(value ? 0 : 1, {
      duration: 150,
    });
  }, []);

  const animateOpacity = useCallback(() => {
    "worklet";
    opacity.value = 1;
  }, []);

  const onLayout = useCallback((event: LayoutChangeEvent) => {
    height.value = event.nativeEvent.layout.height;
    setTimeout(animateOpacity, 300);
  }, []);

  const memoizedStyles = useMemo(
    () => ({
      height: BUTTON_HEIGHT + insets.bottom,
    }),
    [insets]
  );

  const animatedStyles = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      {
        translateY: interpolate(hide.value, [0, 1], [0, height.value]),
      },
    ],
  }));

  return (
    <Animated.View
      onLayout={onLayout}
      style={[animatedStyles, styles.container]}
    >
      <Text.Subheading style={styles.text}>{t("Great job!")}</Text.Subheading>
      <Layout.Spacer />
      <Layout.View style={memoizedStyles} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    bottom: 0,
    width: "100%",
    position: "absolute",
    zIndex: 0,
    backgroundColor: "#58cc02",
    padding: 16,
  },
  text: {
    color: "white",
  },
});

AnimatedBottomContainer.displayName = "AnimatedBottomContainer";

export default React.memo(AnimatedBottomContainer, (prevProps, nextProps) => {
  return prevProps.show === nextProps.show;
});
