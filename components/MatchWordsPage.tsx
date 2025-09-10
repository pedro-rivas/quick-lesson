import * as Layout from "@/components/Layout";
import * as List from "@/components/List";
import * as Text from "@/components/Text";
import WordButton from "@/components/WordButton";
import { LanguageCode } from "@/constants/languages";
import { Lesson } from "@/store/lessonStore";
import { commonStyles as cs } from "@/styles/common";
import { spacing } from "@/styles/spacing";
import { shuffleArray } from "@/utils";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { StyleSheet } from "react-native";

export const HINT_DELAY = 1000;

interface Word {
  selected: boolean;
  matched: boolean;
  word: string;
  pair: string;
  error: boolean;
  hint: boolean;
  disabled: boolean;
  langCode?: LanguageCode;
}

interface MatchWordsPageProps {
  vocabulary: Lesson["vocabulary"];
  subheading: string;
  topic: string;
  onComplete: () => void;
  onSpeechPress: (uri: string) => void;
}

const MatchWordsPage = ({
  vocabulary: vocabs,
  subheading,
  topic,
  onComplete,
  onSpeechPress,
}: MatchWordsPageProps) => {
  const initialVocabulary = useMemo(() => {
    const pairs: Word[] = (vocabs || [])
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
          langCode: v.langCode,
          selected: false,
          matched: false,
          error: false,
          hint: false,
          disabled: false,
        },
        {
          word: v.translation,
          pair: v.word,
          selected: false,
          matched: false,
          error: false,
          hint: false,
          disabled: false,
        },
      ])
      .filter((v) => v.word !== v.pair);
    return shuffleArray(pairs);
  }, [vocabs]);

  const [vocabulary, setVocabulary] = useState(initialVocabulary);

  const handleSelect = useCallback((item: Word, uri?: string) => {
    if (uri) {
      onSpeechPress(uri);
    }

    setVocabulary((prev) => {
      let update = prev.map((v) => ({
        ...v,
        error: false,
        hint: false,
        selected: v.word === item.word ? !v.selected : v.selected,
      }));

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
        return update.map((v) => ({ ...v, error: v.selected ? true : false, selected: false }));
      }

      // Show hint 
      if (selectedWords.length === 1) {
        update = update.map((v) => ({
          ...v,
          hint: v.word === selectedWords[0].pair ? true : false,
        }));
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
        hint={v.hint}
        disabled={v.disabled}
        onPress={(uri) => handleSelect(v, uri)}
        langCode={v?.langCode}
      />
    ));
  }, []);

  const allMatched = useMemo(() => {
    return vocabulary.every((v) =>  v.matched);
  }, [vocabulary]);

  useEffect(() => {
    if (allMatched) {
      onComplete();
    }
  }, [allMatched]);

  return (
    <Layout.Column flex={1} collapsable={false}>
      <List.ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <Text.Subheading>{subheading}</Text.Subheading>
        <Layout.Spacer />
        <Text.Body>{topic}</Text.Body>
        <Layout.Spacer />
        <Layout.Row gap={spacing.m} flexWrap="wrap">
          {renderVocabulary(vocabulary)}
        </Layout.Row>
      </List.ScrollView>
    </Layout.Column>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    ...cs.f_1,
    padding: spacing.m,
  },
});

MatchWordsPage.displayName = "MatchWordsPage";

export default React.memo(MatchWordsPage);
