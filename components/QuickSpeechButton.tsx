import { textToSpeech } from "@/lib/texToSpeech";
import { AntDesign } from "@expo/vector-icons";
import { createAudioPlayer } from "expo-audio";
import React, { useCallback } from "react";
import { ActivityIndicator, Pressable } from "react-native";

interface QuickSpeechButtonProps {
  text: string;
}

/**
 * A button component that plays a synthesized speech version of the provided text when pressed.
 *
 * @param {QuickSpeechButtonProps} props - The props for the QuickSpeechButton component.
 * @param {string} props.text - The text to be converted to speech and played.
 *
 * When pressed, the button triggers the `textToSpeech` function with the given text and Turkish locale ("tr-TR").
 * While the speech is being generated and played, a loading indicator is shown.
 * Otherwise, a sound icon is displayed.
 */
const QuickSpeechButton = ({ text }: QuickSpeechButtonProps) => {
  const [loading, setLoading] = React.useState(false);

  const handlePress = useCallback(() => {
    setLoading(true);
    textToSpeech(text, "tr-TR")
      .then(speak)
      .catch((error) => {
        console.error("Error generating speech: ", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [text]);

  const speak = useCallback((uri: string, tries = 1) => {
    try {
      const player = createAudioPlayer(uri);
      player.play();
    } catch (error) {
      console.log("Error playing audio: ", error);
      if (tries < 3) {
        setTimeout(() => {
          speak(uri, tries + 1);
        }, 300);
      }
    }
  }, []);

  return (
    <Pressable onPress={handlePress}>
      {loading ? (
        <ActivityIndicator size="small" color="#1a237e" />
      ) : (
        <AntDesign name="sound" size={20} color="#1a237e" />
      )}
    </Pressable>
  );
};

QuickSpeechButton.displayName = "QuickSpeechButton";

export default React.memo(QuickSpeechButton);
