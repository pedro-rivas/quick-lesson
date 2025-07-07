import useTranslation from "@/hooks/useTranslation";
import { useAudioPlayer } from "expo-audio";
import { useRouter } from "expo-router";
import React, { useCallback, useMemo } from "react";
import LessonContentWrapper from "./LessonContentWrapper";
import VocabularyRow, { Vocab } from "./VocabularyRow";

interface VocabularySectionProps {
  vocabulary: Vocab[];
  id: string;
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
  id,
}) => {
  const t = useTranslation();
  const player = useAudioPlayer("");
  const router = useRouter();

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
    <LessonContentWrapper
      title={`${vocabulary.length} ${t("Words")}`}
      buttonText={t("Practice Vocabulary")}
      onButtonPress={() => router.push(`/practice/${id}`)}
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
    </LessonContentWrapper>
  );
};

VocabularySection.displayName = "VocabularySection";

export default React.memo(VocabularySection);
