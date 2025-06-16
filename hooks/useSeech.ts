import { textToSpeech } from "@/lib/texToSpeech";
import { useAudioPlayer } from "expo-audio";
import React, { useEffect } from "react";

const useSpeech = (text: string) => {
  const [audioSource, setAudioSource] = React.useState<string | null>(null);

  const player = useAudioPlayer(audioSource);

  useEffect(() => {
    textToSpeech(text, "tr-TR")
      .then((val) => {
        setAudioSource(val);
      })
      .catch((error) => {
        console.error("Error generating speech: ", error);
      })
      .finally(() => {});
  }, [text]);

  const play = React.useCallback(() => {
    if (audioSource) {
       player.seekTo(0);
    }
  }, [audioSource, player]);

  return {
    play,
  };
};

export default useSpeech;
