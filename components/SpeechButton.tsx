import useSpeech from "@/hooks/useSeech";
import { AntDesign } from "@expo/vector-icons";
import React, { useCallback } from "react";
import { ActivityIndicator, Pressable } from "react-native";

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
  const [loading, setLoading] = React.useState(false);
  const speech = useSpeech(text);

  const handlePress = useCallback(() => {
    speech.play();
  }, [text]);

  return (
    <Pressable onPress={handlePress}>
      {loading ? (
        <ActivityIndicator size="small" color="#1a237e" />
      ) : (
        <AntDesign name={'sound'} size={20} color="#1a237e" />
      )}
    </Pressable>
  );
};

SpeechButton.displayName = "SpeechButton";

export default React.memo(SpeechButton);
