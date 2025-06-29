import useTranslation from "@/hooks/useTranslation";
import { useThemedStyles } from "@/providers/ThemeContext";
import { commonStyles as cs } from "@/styles/common";
import { spacing } from "@/styles/spacing";
import { useAudioPlayer } from "expo-audio";
import React, { useCallback, useMemo } from "react";
import * as Layout from "./Layout";
import * as List from "./List";
import VocabularyRow, { Vocab } from "./VocabularyRow";

interface VocabularySectionProps {
  vocabulary: Vocab[];
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
}) => {
  const themedStyles = useThemedStyles();
  const t = useTranslation();
  const player = useAudioPlayer("");

  const handlePress = useCallback(
    (uri: string) => {
      if (uri) {
        player.replace(uri);
        player.seekTo(0);
        setTimeout(() => {
          player.play();
        }, 10);
      }
    },
    [player]
  );

  const vocabs = useMemo(() => vocabulary?.length, [vocabulary]);

  if (!vocabulary || vocabulary.length === 0) {
    return null;
  }

  return (
    <List.ScrollView style={cs.p_h_m} showsVerticalScrollIndicator={false}>
      <Layout.Header.Section title={`${vocabulary.length} ${t("Words")}`} />
      <Layout.Column mb={spacing.m} style={themedStyles.section}>
        {vocabulary.map((vocab, idx) => (
          <VocabularyRow
            key={idx}
            vocab={vocab}
            idx={idx}
            vocabs={vocabs}
            onPress={handlePress}
          />
        ))}
      </Layout.Column>
    </List.ScrollView>
  );
};

VocabularySection.displayName = "VocabularySection";

export default React.memo(VocabularySection);
