import React from "react";
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
      style={{
        backgroundColor: "#4fc805",
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        padding: 16,
        paddingBottom: insets.bottom + 16,
      }}
    >
      {children}
    </Animated.View>
  );
};

AnimatedBottomContainer.displayName = "AnimatedBottomContainer";

export default React.memo(AnimatedBottomContainer, (prevProps, nextProps) => {
  return prevProps.show === nextProps.show;
});
