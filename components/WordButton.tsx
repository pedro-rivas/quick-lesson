import * as QuickText from "@/components/Text";
import * as Haptics from "expo-haptics";
import React, { useCallback, useEffect } from "react";
import { Dimensions, StyleSheet, TouchableOpacity } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

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

  // whenever `error` becomes true, run the wobble sequence
  useEffect(() => {
    if (error || hint) {
      wobble();
    }
  }, [error, hint, rotation]);

  const wobble = useCallback(() => {
    "worklet";
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
  }));

  return (
    <AnimatedTouchableOpacity
      style={[
        styles.card,
        !collapsed && styles.grow,
        selected && styles.selected,
        matched && styles.matched,
        error && styles.error,
        disabled && styles.disabled,
        // hint && { backgroundColor: '#d7ffb8'},
        animatedStyle,
      ]}
      onPress={handlePress}
      disabled={matched || disabled}
    >
        <QuickText.BodyText
          style={{
            color: selected || matched || error ? "white" : "black",
          }}
        >
          {word}
        </QuickText.BodyText>
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
  selected: {
    backgroundColor: "#0b57d0",
    borderColor: "#0b57d0",
  },
  matched: {
    backgroundColor: "#4fc805",
  },
  error: {
    backgroundColor: "#ff0000",
    borderColor: "#ff0000",
  },
  disabled: {
    opacity: 0.4,
  },
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
