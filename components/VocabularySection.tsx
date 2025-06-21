import { LanguageCode } from "@/constants/languages";
import useTranslation from "@/hooks/useTranslation";
import { commonStyles } from "@/styles/common";
import { spacing } from "@/styles/spacing";
import { useTheme } from "@react-navigation/native";
import { useAudioPlayer } from "expo-audio";
import React from "react";
import * as Layout from "./Layout";
import SpeechButton from "./SpeechButton";
import * as Text from "./Text";

interface VocabularyItem {
  term: string;
  transliteration?: string;
  translation: string;
}

interface VocabularySectionProps {
  vocabulary: VocabularyItem[];
  langCode: LanguageCode;
}

/**
 * Renders a section displaying a list of vocabulary terms, each with its term, optional transliteration, and translation.
 * If the vocabulary list is empty or undefined, nothing is rendered.
 *
 * @param vocabulary - An array of vocabulary objects, each containing a term, optional transliteration, and translation.
 * @returns A React element displaying the vocabulary section, or null if no vocabulary is provided.
 */
const VocabularySection: React.FC<VocabularySectionProps> = ({
  vocabulary,
  langCode,
}) => {
  const theme = useTheme();
  const t = useTranslation();
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

  if (!vocabulary || vocabulary.length === 0) {
    return null;
  }

  return (
    <Layout.Column>
      <Text.H4 bold>{`${vocabulary.length} ${t("Words")}`}</Text.H4>
      <Layout.Column
        mb={spacing.m}
        mt={spacing.m}
        style={[
          commonStyles.border2,
          commonStyles.borderRadius16,
          {
            borderColor: theme.colors.border,
          },
        ]}
      >
        {vocabulary.map((vocab, idx) => (
          <Layout.Row
            key={idx}
            alignItems={"center"}
            padding={spacing.s}
            style={[
              idx !== vocabulary.length - 1 && commonStyles.borderBottom2,
              { borderColor: theme.colors.border },
            ]}
          >
            <SpeechButton
              text={vocab.term}
              langCode={langCode}
              onPress={handlePress}
            />
            <Layout.Column ml={12}>
              <Layout.Column mb={4}>
                <Text.Body bold>{vocab.term}</Text.Body>
                {vocab?.transliteration ? (
                  <Layout.Row>
                    {vocab.transliteration.split("").map((l) => (
                      <Text.Caption
                        style={[
                          commonStyles.borderBottom1,
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
              <Text.Caption>{vocab.translation}</Text.Caption>
            </Layout.Column>
          </Layout.Row>
        ))}
      </Layout.Column>
    </Layout.Column>
  );
};

VocabularySection.displayName = "VocabularySection";

export default React.memo(VocabularySection);
