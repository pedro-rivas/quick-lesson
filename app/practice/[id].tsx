import QuickSafeAreaView from "@/components/layout/QuickSafeAreaView";
import MatchCard from "@/components/MatchCard";
import QuickButton from "@/components/QuickButton";
import * as QuickLayout from "@/components/QuickLayout";
import * as QuickText from "@/components/QuickText";
import * as QuickList from "@/components/QuikList";
import { useLessonStore } from "@/store/lessonStore";
import { useLocalSearchParams } from "expo-router";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { StyleSheet } from "react-native";
import Animated, {
    SlideInDown,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface Word {
  selected: boolean;
  matched: boolean;
  word: string;
  pair: string;
  error: boolean;
}

const ERROR_DURATION = 800;

function shuffleArray<T>(arr: T[]): T[] {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1)); 
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  

export default function PracticeScreenPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getLessonById } = useLessonStore();
  const lesson = getLessonById(id!);

  const insets = useSafeAreaInsets();

  const initialVocabulary = useMemo(() => {
    const pairs: Word[] = (lesson?.vocabulary || []).flatMap((v) => [
      { word: v.term, pair: v.translation, selected: false, matched: false, error: false },
      { word: v.translation, pair: v.term, selected: false, matched: false, error: false },
    ]).filter((v) => v.word !== v.pair);
    return shuffleArray(pairs);
  }, [lesson]);
  
  const [vocabulary, setVocabulary] = useState(initialVocabulary);

  const shouldUnselect = useRef(false);

  const handleSelect = useCallback((item: Word,) => {
    if (shouldUnselect.current) {
        return;
    }

    setVocabulary((prev) => {
        let update = prev.map((v) =>
            v.word === item.word ? { ...v, selected: !v.selected } : v
          )

          const selectedWords = update.filter((v) => v.selected);

          if (selectedWords.length === 2) {
            if (selectedWords[0].pair === selectedWords[1].word) {
                return update.map((v) => ({ 
                    ...v, 
                    selected: false,
                    matched:v.matched ? v.matched : v.word === selectedWords[0].word || v.word === selectedWords[1].word 
                }));
            }

            // If not, deselect the words
            shouldUnselect.current = true;
            return update.map((v) => ({ ...v, 
                error: v.selected ? true : false 
            }));
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

  const renderVocabulary = useCallback(
    (vocabulary: Word[]) => {
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
    },
    []
  );

  const allMatched = useMemo(() => {
    return vocabulary.every((v) => v.matched);
  }, [vocabulary]);

  return (
    <QuickSafeAreaView>
      <QuickList.ScrollView style={styles.container}>
        <QuickText.Subheading>Tap the matching pairs</QuickText.Subheading>
        <QuickLayout.Spacer />
        <QuickText.BodyText>Vocabulary</QuickText.BodyText>
        <QuickLayout.Spacer />
        <QuickLayout.Column gap={16} style={{ flexWrap: "wrap", flexDirection: "row", }}>
            {renderVocabulary(vocabulary)}
        </QuickLayout.Column>
      </QuickList.ScrollView>
      {
        allMatched ?
        <Animated.View entering={SlideInDown} style={{ 
            backgroundColor: "#4fc805",
            position: "absolute", bottom: 0, left: 0, right: 0, padding: 16,
            paddingBottom: insets.bottom + 16,
            }}>
                <QuickText.Subheading style={{ color: "white" }}>Great job!</QuickText.Subheading>
            <QuickLayout.Spacer />
            <QuickButton title="Next" secondary onPress={() => {}} />
          </Animated.View>
          : null
      }

    </QuickSafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});
