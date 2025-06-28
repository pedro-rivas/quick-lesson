import useTranslation from "@/hooks/useTranslation";
import { commonStyles } from "@/styles/common";
import { spacing } from "@/styles/spacing";
import { useTheme } from "@react-navigation/native";
import { useAudioPlayer } from "expo-audio";
import React, { useMemo } from "react";
import * as Layout from "./Layout";
import * as Text from "./Text";
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

  const vocabs = useMemo(() => vocabulary?.length, [vocabulary]);

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
          <VocabularyRow
            key={idx}
            vocab={vocab}
            idx={idx}
            vocabs={vocabs}
            onPress={handlePress}
          />
        ))}
      </Layout.Column>
    </Layout.Column>
  );
};

VocabularySection.displayName = "VocabularySection";

export default React.memo(VocabularySection);
