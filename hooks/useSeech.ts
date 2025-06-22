import { LanguageCode } from "@/constants/languages";
import { textToSpeech } from "@/lib/texToSpeech";
import React, { useEffect } from "react";

const useSpeech = (text: string, langCode: LanguageCode) => {
  const [loading, setLoading] = React.useState<boolean>(true);
  const [uri, setUri] = React.useState<string | null>(null);

  useEffect(() => {
    textToSpeech(text, langCode)
      .then((val) => {
        setUri(val);
      })
      .catch((error) => {
        console.error("Error generating speech: ", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [text]);


  return {
    loading,
    uri,
  };
};

export default useSpeech;
