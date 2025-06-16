import * as Layout from "@/components/Layout";
import * as List from "@/components/List";
import * as Text from "@/components/Text";
import WordButton from "@/components/WordButton";
import { Lesson } from "@/store/lessonStore";
import { shuffleArray } from "@/utils";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { StyleSheet } from "react-native";

export const ERROR_DURATION = 800;
const MATCH_DURATION = 600;
export const HINT_DELAY = 1000;

interface Word {
  selected: boolean;
  matched: boolean;
  word: string;
  pair: string;
  error: boolean;
  disabled: boolean;
  hint: boolean;
}

interface MatchWordsPageProps {
  vocabulary: Lesson["vocabulary"];
  subheading: string;
  topic: string;
  onComplete: () => void;
}

const MatchWordsPage = ({
  vocabulary: lesson,
  subheading,
  topic,
  onComplete,
}: MatchWordsPageProps) => {
  
  const initialVocabulary = useMemo(() => {
    const pairs: Word[] = (lesson || [])
      .map((v) => {
        return {
          ...v,
          word: v.term,
        };
      })
      .flatMap((v) => [
        {
          word: v.word,
          pair: v.translation,
          selected: false,
          matched: false,
          error: false,
          disabled: false,
          hint: false,
        },
        {
          word: v.translation,
          pair: v.word,
          selected: false,
          matched: false,
          error: false,
          disabled: false,
          hint: false,
        },
      ])
      .filter((v) => v.word !== v.pair);
    return shuffleArray(pairs);
  }, [lesson]);

  const [vocabulary, setVocabulary] = useState(initialVocabulary);

  const shouldWait = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hintTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (shouldWait.current) return;

    if (hintTimeout.current) {
      clearTimeout(hintTimeout.current);
    }

    const selectedWords = vocabulary.filter((v) => v.selected);
    const matchedWords = vocabulary.filter((v) => v.matched);
    const errorWords = vocabulary.filter((v) => v.error);

    // Clean up selected words after showing error state
    if (errorWords.length === 2) {
      shouldWait.current = setTimeout(() => {
        setVocabulary((prev) =>
          prev.map((v) => ({ ...v, selected: false, error: false, hint: false }))
        );
        shouldWait.current = null;
      }, ERROR_DURATION);
      return;
    }

    // Disable words that are matched
    if (matchedWords.length === 2) {
      shouldWait.current = setTimeout(() => {
        setVocabulary((prev) =>
          prev.map((v) => ({
            ...v,
            disabled: v.matched ? true : v.disabled,
            matched: false,
            selected: false,
            error: false,
            hint: false,
          }))
        );
        shouldWait.current = null;
      }, MATCH_DURATION);
      return;
    }

    // Show hint
    if (selectedWords.length === 1) {
      hintTimeout.current = setTimeout(() => {
        setVocabulary((prev) => {
          return prev.map((v) => ({
            ...v,
            hint: v.word === selectedWords[0].pair ? true : false,
          }));
        });
        shouldWait.current = null;
      }, HINT_DELAY);
    }
  }, [vocabulary]);

  const handleSelect = useCallback((item: Word) => {
    if (shouldWait.current) return;

    if(hintTimeout.current) {
      clearTimeout(hintTimeout.current);
    }

    setVocabulary((prev) => {
      let update = prev.map((v) =>
        v.word === item.word ? { 
          ...v, 
          selected: !v.selected,
        } : v
      );

      const selectedWords = update.filter((v) => v.selected);

      if (selectedWords.length === 2) {
        // Match
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

        // No match
        return update.map((v) => ({ ...v, error: v.selected ? true : false }));
      }

      return update;
    });
  }, []);

  const renderVocabulary = useCallback((vocabulary: Word[]) => {
    return vocabulary.map((v, index) => (
      <WordButton
        key={v.word + index}
        word={v.word}
        selected={v.selected}
        matched={v.matched}
        error={v.error}
        disabled={v.disabled}
        hint={v.hint}
        onPress={() => handleSelect(v)}
      />
    ));
  }, []);

  const allMatched = useMemo(() => {
    return vocabulary.every((v) => v.disabled || v.matched);
  }, [vocabulary]);

  useEffect(() => {
    if (allMatched) {
      onComplete();
    }
  }, [allMatched]);

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

MatchWordsPage.displayName = "MatchWordsPage";

export default React.memo(MatchWordsPage);
