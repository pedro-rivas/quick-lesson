import React from "react";
import { StyleSheet } from "react-native";
import Animated, { SlideInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface AnimatedBottomContainerProps {
  children: React.ReactNode;
  show: boolean;
}

const AnimatedBottomContainer = ({
  children,
  show,
}: AnimatedBottomContainerProps) => {
  const insets = useSafeAreaInsets();

  if (!show) return null;

  return (
    <Animated.View
      entering={SlideInDown}
      style={[styles.container, { paddingBottom: insets.bottom + 16 }]}
    >
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#4fc805",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
  },
});

AnimatedBottomContainer.displayName = "AnimatedBottomContainer";

export default React.memo(AnimatedBottomContainer, (prevProps, nextProps) => {
  return prevProps.show === nextProps.show;
});
