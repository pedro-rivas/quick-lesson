import { textToSpeech } from "@/lib/texToSpeech";
import { useAudioPlayer } from "expo-audio";
import React, { useEffect } from "react";

const useSpeech = (text: string) => {
  const [loading, setLoading] = React.useState<boolean>(true);

  const player = useAudioPlayer();

  useEffect(() => {
    textToSpeech(text, "tr-TR")
      .then((val) => {
        player.replace(val);
      })
      .catch((error) => {
        console.error("Error generating speech: ", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [text]);

  const play = React.useCallback(() => {
    try {
      player.seekTo(0);
      player.play();
    } catch (error) {
      console.error("Error playing audio: ", error);
    }
  }, [player]);

  return {
    play,
    loading,
  };
};

export default useSpeech;
