import { BUTTON_ICON_HIT_SLOP, BUTTON_ICON_SIZE } from "@/constants/style";
import useSpeech from "@/hooks/useSeech";
import { commonStyles as cs } from "@/styles/common";
import { AntDesign } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useCallback } from "react";
import { Pressable } from "react-native";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface SpeechButtonProps {
  text: string;
}

/**
 * A button component that plays a synthesized speech version of the provided text when pressed.
 *
 * @param {SpeechButtonProps} props - The props for the SpeechButton component.
 * @param {string} props.text - The text to be converted to speech and played.
 *
 * When pressed, the button triggers the `textToSpeech` function with the given text and Turkish locale ("tr-TR").
 * While the speech is being generated and played, a loading indicator is shown.
 * Otherwise, a sound icon is displayed.
 */
const SpeechButton = ({ text }: SpeechButtonProps) => {
  const speech = useSpeech(text);

  const pressed = useSharedValue(0);

  const handlePress = useCallback(() => {
    speech.play();
  }, [text]);

  const vibrate = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, []);

  const onPressIn = useCallback(() => {
    "worklet";
    pressed.value = 1;
    runOnJS(vibrate)();
  }, []);

  const onPressOut = useCallback(() => {
    "worklet";
    pressed.value = 0;
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pressed.value ? 0.9 : 1 }],
  }));

  return (
    <AnimatedPressable
      style={[animatedStyle, cs.speechButton]}
      onPress={handlePress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      hitSlop={BUTTON_ICON_HIT_SLOP}
      disabled={speech.loading}
    >
      <AntDesign
        name={"sound"}
        size={BUTTON_ICON_SIZE}
        color={speech.loading ? "#eee" : "#1a237e"}
      />
    </AnimatedPressable>
  );
};

SpeechButton.displayName = "SpeechButton";

export default React.memo(SpeechButton);
