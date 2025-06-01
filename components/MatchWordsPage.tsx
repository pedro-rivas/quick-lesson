import * as Layout from "@/components/Layout";
import * as List from "@/components/List";
import MatchCard from "@/components/MatchCard";
import * as Text from "@/components/Text";
import { Lesson } from "@/store/lessonStore";
import * as Haptics from "expo-haptics";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { StyleSheet } from "react-native";

const ERROR_DURATION = 800;

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

interface Word {
  selected: boolean;
  matched: boolean;
  word: string;
  pair: string;
  error: boolean;
}

interface MatchWordsPageProps {
  lesson: Lesson['vocabulary'] | Lesson['phrases']
  subheading: string;
  topic: string;
  onComplete: () => void;
}

const MatchWordsPage = ({ lesson, subheading, topic, onComplete }: MatchWordsPageProps) => {
  const initialVocabulary = useMemo(() => {
    const pairs: Word[] = (lesson || [])
    .map((v) => {
        return {
            ...v,
            word: ('term' in v ? v.term : v.phrase),
        }
    })
      .flatMap((v) => [
        {
          word: v.word,
          pair: v.translation,
          selected: false,
          matched: false,
          error: false,
        },
        {
          word: v.translation,
          pair: v.word,
          selected: false,
          matched: false,
          error: false,
        },
      ])
      .filter((v) => v.word !== v.pair);
    return shuffleArray(pairs);
  }, [lesson]);

  const [vocabulary, setVocabulary] = useState(initialVocabulary);

  const shouldUnselect = useRef(false);

  const handleSelect = useCallback((item: Word) => {
    if (shouldUnselect.current) return;

    Haptics.selectionAsync();

    setVocabulary((prev) => {
      let update = prev.map((v) =>
        v.word === item.word ? { ...v, selected: !v.selected } : v
      );

      const selectedWords = update.filter((v) => v.selected);

      if (selectedWords.length === 2) {
        if (selectedWords[0].pair === selectedWords[1].word) {
          return update.map((v) => ({
            ...v,
            selected: false,
            matched: v.matched
              ? v.matched
              : v.word === selectedWords[0].word ||
                v.word === selectedWords[1].word,
          }));
        }

        // If not, deselect the words
        shouldUnselect.current = true;
        return update.map((v) => ({ ...v, error: v.selected ? true : false }));
      }

      return update;
    });

    if (shouldUnselect.current) {
      setTimeout(() => {
        setVocabulary((prev) =>
          prev.map((v) => ({ ...v, selected: false, error: false }))
        );
        shouldUnselect.current = false;
      }, ERROR_DURATION);
    }
  }, []);

  const renderVocabulary = useCallback((vocabulary: Word[]) => {
    return vocabulary.map((v, index) => (
      <MatchCard
        key={v.word + index}
        word={v.word}
        selected={v.selected}
        matched={v.matched}
        error={v.error}
        onPress={() => handleSelect(v)}
      />
    ));
  }, []);

  const allMatched = useMemo(() => {
    return vocabulary.every((v) => v.matched);
  }, [vocabulary]);

  useEffect(() => {
    if (allMatched) {
        onComplete();
    }
  }, [allMatched])

  return (
    <List.ScrollView style={styles.container}>
      <Text.Subheading>{subheading}</Text.Subheading>
      <Layout.Spacer />
      <Text.BodyText>{topic}</Text.BodyText>
      <Layout.Spacer />
      <Layout.Row gap={16} flexWrap="wrap">
        {renderVocabulary(vocabulary)}
      </Layout.Row>
    </List.ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});

export default React.memo(MatchWordsPage);
