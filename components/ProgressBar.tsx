import React, { useEffect } from "react";
import { StyleSheet } from "react-native";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from "react-native-reanimated";

const BAR_HEIGHT = 15;
const BORDER_RADIUS = 10;

const ProgressBar = ({ progress }: { progress: number }) => {
  const animProgress = useSharedValue(progress);

  useEffect(() => {
    setTimeout(() => {
      animProgress.value = withSpring(progress, {
        damping: 10,
        stiffness: 100,
        mass: 1,
        overshootClamping: true,
        restSpeedThreshold: 0.01,
        restDisplacementThreshold: 0.01,
      });
    }, 10);
  }, [progress]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: `${animProgress.value}%`,
      height: BAR_HEIGHT,
      backgroundColor: "#93d333",
    };
  }, [progress]);

  return (
    <Animated.View style={styles.container}>
      <Animated.View style={animatedStyle} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexShrink: 1,
    width: "100%",
    backgroundColor: "#E0E0E0",
    borderRadius: BORDER_RADIUS,
    overflow: "hidden",
  },
});

ProgressBar.displayName = "ProgressBar";

export default React.memo(ProgressBar, (prevProps, nextProps) => {
  return prevProps.progress === nextProps.progress;
});
