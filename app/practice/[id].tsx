import QuickSafeAreaView from "@/components/layout/QuickSafeAreaView";
import * as QuickLayout from "@/components/QuickLayout";
import * as QuickText from "@/components/QuickText";
import * as QuickList from "@/components/QuikList";
import { useLessonStore } from "@/store/lessonStore";
import { useLocalSearchParams } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import { Dimensions, StyleSheet, TouchableOpacity, View } from "react-native";
import Animated from "react-native-reanimated";

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

interface Word {
  selected: boolean;
  matched: boolean;
  word: string;
  pair: string;
  error: boolean;
}

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

  const initialVocabulary = useMemo(() => {
    const pairs: Word[] = (lesson?.vocabulary || []).flatMap((v) => [
      { word: v.term, pair: v.translation, selected: false, matched: false, error: false },
      { word: v.translation, pair: v.term, selected: false, matched: false, error: false },
    ]);
    return shuffleArray(pairs);
  }, [lesson]);
  
  const [vocabulary, setVocabulary] = useState(initialVocabulary);

  const handleSelect = useCallback((item: Word,) => {
    let shouldUnselect = false;

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
            shouldUnselect = true;
            return update.map((v) => ({ ...v, 
                error: v.selected ? true : false 
            }));
          }

        return update;
    });

    if (shouldUnselect) {
        setTimeout(() => {
            setVocabulary((prev) =>
                prev.map((v) => ({ ...v, selected: false, error: false }))
            );
        }, 1000);
    }
  }, []);

  const renderVocabulary = useCallback(
    (vocabulary: Word[]) => {
      return vocabulary.map((v) => (
        <AnimatedTouchableOpacity 
            key={v.word}
            style={[styles.card, v.selected && styles.selected, v.matched && styles.matched,
                v.error && styles.error
            ]}
            onPress={() => handleSelect(v)}
            disabled={v.matched}
          >
            <View>
              <QuickText.BodyText style={{ 
                color: v.selected || v.matched || v.error ? "white" : "black" 
                }}>{v.word}</QuickText.BodyText>
            </View>
          </AnimatedTouchableOpacity>
      ));
    },
    []
  );

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
    </QuickSafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ebebeb",
    justifyContent: "center",
    alignItems: "center",
    flexGrow: 1,
    minWidth: Dimensions.get("window").width / 2 - 32,
  },
  selected: {
    backgroundColor: "#0b57d0",
    borderColor: "#0b57d0",
  },
  matched: {
    backgroundColor: "#4fc805",
  },
  error: {
    backgroundColor: "#ff0000",
    borderColor: "#ff0000",
  },
});
