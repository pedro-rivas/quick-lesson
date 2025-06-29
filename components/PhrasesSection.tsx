import { LanguageCode } from "@/constants/languages";
import useTranslation from "@/hooks/useTranslation";
import { useThemedStyles } from "@/providers/ThemeContext";
import { commonStyles as cs } from "@/styles/common";
import { spacing } from "@/styles/spacing";
import { useAudioPlayer } from "expo-audio";
import React from "react";
import * as Layout from "./Layout";
import * as List from "./List";
import VocabularyRow from "./VocabularyRow";

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
const PhrasesSection: React.FC<PhrasesSectionProps> = ({ phrases }) => {
  if (!phrases || phrases.length === 0) {
    return null;
  }

  const t = useTranslation();
  const themedStyles = useThemedStyles();
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
    <List.ScrollView style={cs.p_h_m} showsVerticalScrollIndicator={false}>
      <Layout.Header.Section title={`${phrases.length} ${t("Phrases")}`} />
      <Layout.Column mb={spacing.m} style={themedStyles.section}>
        {phrases.map((phrase, idx) => (
          <VocabularyRow
            key={idx}
            vocab={{
              term: phrase.phrase,
              transliteration: phrase.transliteration,
              translation: phrase.translation,
              langCode: phrase.langCode,
            }}
            idx={idx}
            vocabs={phrases.length}
            onPress={handlePress}
          />
        ))}
      </Layout.Column>
    </List.ScrollView>
  );
};

PhrasesSection.displayName = "PhrasesSection";

export default React.memo(PhrasesSection);
