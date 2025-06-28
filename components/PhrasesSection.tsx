import { LanguageCode } from "@/constants/languages";
import useTranslation from "@/hooks/useTranslation";
import { commonStyles as cs } from "@/styles/common";
import { spacing } from "@/styles/spacing";
import { useTheme } from "@react-navigation/native";
import { useAudioPlayer } from "expo-audio";
import React from "react";
import * as Layout from "./Layout";
import SpeechButton from "./SpeechButton";
import * as Text from "./Text";

export interface Phrase {
  phrase: string;
  transliteration?: string;
  translation: string;
  langCode: LanguageCode;
}

interface PhrasesSectionProps {
  phrases: Phrase[];
}

/**
 * Renders a section displaying a list of quick phrases with their transliterations and translations.
 * Each phrase is shown in a card with an optional transliteration and a sound icon.
 *
 * @param phrases - An array of phrase objects to display. Each object should contain:
 *   - `phrase`: The main phrase text.
 *   - `transliteration` (optional): The transliteration of the phrase.
 *   - `translation`: The translation of the phrase.
 *
 * @returns A React element displaying the phrases, or `null` if no phrases are provided.
 */
const PhrasesSection: React.FC<PhrasesSectionProps> = ({
  phrases,
}) => {
  if (!phrases || phrases.length === 0) {
    return null;
  }

  const t = useTranslation();
  const theme = useTheme();
  const player = useAudioPlayer("");

  const handlePress = (uri: string) => {
    if (uri) {
      player.replace(uri);
      player.seekTo(0);
      setTimeout(() => {
        player.play();
      }, 10);
    }
  };

  return (
    <Layout.Column>
      <Text.H4 bold>{`${phrases.length} ${t("Phrases")}`}</Text.H4>
      <Layout.Column
        mb={spacing.m}
        mt={spacing.m}
        style={[
          cs.border2,
          cs.borderRadius16,
          {
            borderColor: theme.colors.border,
          },
        ]}
      >
        {phrases.map((phrase, idx) => (
          <Layout.Row
            key={idx}
            alignItems={"center"}
            padding={spacing.s}
            style={[
              idx !== phrases.length - 1 && cs.borderBottom2,
              { borderColor: theme.colors.border },
            ]}
          >
            <SpeechButton
              text={phrase.phrase}
              langCode={phrase.langCode}
              onPress={handlePress}
            />
            <Layout.Column ml={12} flexShrink={1}>
              <Layout.Column mb={4}>
                <Text.Body bold>{phrase.phrase + 's'}</Text.Body>
                {phrase?.transliteration ? (
                  <Layout.Row>
                    {phrase.transliteration.split("").map((l) => (
                      <Text.Caption
                        style={[
                          cs.borderBottom1,
                          {
                            borderColor: theme.colors.primary,
                            marginRight: 2,
                          },
                        ]}
                      >
                        {l}
                      </Text.Caption>
                    ))}
                  </Layout.Row>
                ) : null}
              </Layout.Column>
              <Text.Caption>{phrase.translation}</Text.Caption>
            </Layout.Column>
          </Layout.Row>
        ))}
      </Layout.Column>
    </Layout.Column>
  );
};

PhrasesSection.displayName = "PhrasesSection";

export default React.memo(PhrasesSection);
