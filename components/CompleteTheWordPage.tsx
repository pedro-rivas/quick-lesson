import * as Layout from "@/components/Layout";
import * as Text from "@/components/Text";
import { VocabularyItem } from "@/store/lessonStore";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { StyleSheet, useWindowDimensions } from "react-native";
import Animated, { LinearTransition } from "react-native-reanimated";
import { HINT_DELAY } from "./MatchWordsPage";
import QuickSpeechButton from "./SpeechButton";
import WordButton from "./WordButton";

const cleanWord = (word: string) => {
  return word.replaceAll(" ", "").toLocaleLowerCase();
};

interface CompleteTheWordPageProps {
  exercise: {
    word: VocabularyItem;
    letters: string[];
  };
  subheading: string;
  onComplete: () => void;
}

const CompleteTheWordPage = ({
  exercise,
  subheading,
  onComplete,
}: CompleteTheWordPageProps) => {
  const word = exercise.word.term;
  const translatedWord = exercise.word.translation;

  const { width } = useWindowDimensions();

  const initalLetters = useMemo(() => {
    return exercise.letters.map((l) => ({
      id: Date.now() + Math.random().toString(36).substring(2, 15),
      word: l,
      pair: "",
      selected: false,
      matched: false,
      error: false,
      disabled: false,
      hint: false,
    }));
  }, [exercise]);

  const [letters, setLetters] = React.useState(initalLetters);
  const [selectedLetters, setSelectedLetters] = React.useState<{
    [key: string]: (typeof initalLetters)[0];
  }>({});

  const selectedWordArr = useMemo(
    () => Object.values(selectedLetters),
    [selectedLetters]
  );

  const hintTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const shouldWait = useRef(false);

  const selectedLettersRef = useRef(selectedLetters);
  selectedLettersRef.current = selectedLetters;

  useEffect(() => {
    showHint();

    return () => {
      if (hintTimeout.current) {
        clearTimeout(hintTimeout.current);
      }
    };
  }, []);

  useEffect(() => {
    if (shouldWait.current) return;

    setLetters(() => {
      return initalLetters.filter((l) => {
        return !Object.values(selectedLetters).some((sl) => sl.id === l.id);
      });
    });

    showHint();
  }, [selectedLetters]);

  const showHint = useCallback(() => {
    if (shouldWait.current) return;
    const _selectedLetters = selectedLettersRef.current;
    const targetWord = word.replaceAll(" ", "").toLocaleLowerCase().split("");
    const nextLetterIndex = Object.keys(_selectedLetters).length;
    const nextLetter = targetWord[nextLetterIndex];

    if (!nextLetter) {
      return;
    }

    shouldWait.current = true;

    hintTimeout.current = setTimeout(() => {
      setLetters((prev) => {
        return prev.map((v) => ({
          ...v,
          hint: v.word === targetWord[nextLetterIndex],
        }));
      });
      shouldWait.current = false;
    }, HINT_DELAY);
  }, []);

  const handleLetterPress = useCallback((letter: (typeof initalLetters)[0]) => {
    if (shouldWait.current) return;

    if (hintTimeout.current) {
      clearTimeout(hintTimeout.current);
    }

    const _selectedLetters = selectedLettersRef.current;

    if (!_selectedLetters[letter.id]) {
      const targetWord = cleanWord(word).split("");
      const currentIndex = Object.keys(_selectedLetters).length;

      // Check if the letter is correct
      if (letter.word === targetWord[currentIndex]) {
        setSelectedLetters((prev) => ({
          ...prev,
          [letter.id]: letter,
        }));
      } else {
        setLetters((prev) => {
          return prev.map((l) => {
            if (l.id === letter.id) {
              return { ...l, error: true };
            }
            return l;
          });
        });
      }
    }
  }, []);

  const renderLetters = useCallback((letters: typeof initalLetters) => {
    return letters.map((letter) => (
      <Animated.View key={`${letter.id}`} layout={LinearTransition}>
        <WordButton
          {...letter}
          collapsed
          onPress={() => handleLetterPress(letter)}
        />
      </Animated.View>
    ));
  }, []);

  const renderSelectedLetters = useCallback((word: typeof initalLetters) => {
    return (
      <Layout.Row
        flexWrap="wrap"
        gap={8}
        style={[styles.selectedWordContainer, { width: width - 32 }]}
      >
        {word.map((letter) => (
          <Layout.View key={letter.id} style={styles.selectedWord}>
            <Text.H3 style={{ color: "white" }}>{letter.word}</Text.H3>
          </Layout.View>
        ))}
      </Layout.Row>
    );
  }, []);

  useEffect(() => {
    const completedWord = Object.values(selectedLetters)
      .map((l) => l.word)
      .join("")
      .toLocaleLowerCase();

    const cleanedWord = cleanWord(word);

    if (completedWord === cleanedWord) {
      console.log("Word completed:", completedWord);
      onComplete();
    }
  }, [selectedLetters]);

  return (
    <Layout.View style={styles.container}>
      <Layout.Column>
        <Text.Subheading>{subheading}</Text.Subheading>
        <Layout.Spacer />
        <Layout.Row alignItems="center">
          <QuickSpeechButton text={word}/>
          <Layout.Spacer size={'s'}/>
          <Text.AnimatedText
            text={[word, translatedWord]}
            texOnly
            speed={5000}
            animation={"fade"}
            style={{
              fontSize: 18,
            }}
          />
        </Layout.Row>
        <Layout.Spacer />
        <Layout.Row style={styles.wordContainer} flexWrap="wrap" gap={8}>
          <WordsPlaceholder word={cleanWord(word)} />
          {renderSelectedLetters(selectedWordArr)}
        </Layout.Row>
      </Layout.Column>
      <Layout.Row flexWrap="wrap" gap={16}>
        {renderLetters(letters)}
      </Layout.Row>
    </Layout.View>
  );
};

const WordsPlaceholder = React.memo(({ word }: { word: string }) => {
  const { width } = useWindowDimensions();
  return (
    <Layout.Row
      flexWrap="wrap"
      gap={8}
      style={[styles.placeholderContainer, { width: width - 32 }]}
    >
      {word.split("").map((letter, index) => {
        return (
          <Layout.View
            key={`placeholder-${index}`}
            style={styles.wordPlaceholder}
          >
            <Text.H3 style={{ opacity: 0 }}>{letter}</Text.H3>
          </Layout.View>
        );
      })}
    </Layout.Row>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: "space-between",
  },
  wordContainer: {
    marginBottom: 32,
    marginTop: 16,
  },
  selectedWord: {
    borderWidth: 1,
    borderColor: "#0b57d0",
    padding: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "#0b57d0",
  },
  wordPlaceholder: {
    borderWidth: 1,
    padding: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    opacity: 0.2,
    backgroundColor: "lightgray",
  },
  placeholderContainer: {
    zIndex: -1,
  },
  selectedWordContainer: {
    position: "absolute",
  },
});

CompleteTheWordPage.displayName = "CompleteTheWordPage";

export default CompleteTheWordPage;
