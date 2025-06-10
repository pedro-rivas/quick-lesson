import AnimatedBottomContainer from "@/components/AnimatedBottomContainer";
import * as Button from "@/components/Button";
import CompleteTheWordPage from "@/components/CompleteTheWordPage";
import * as Layout from "@/components/Layout";
import SafeAreaView from "@/components/layout/SafeAreaView";
import MatchWordsPage from "@/components/MatchWordsPage";
import QuickButton from "@/components/QuickButton";
import * as Text from "@/components/Text";
import useTranslation from "@/hooks/useTranslation";
import { useLessonStore } from "@/store/lessonStore";
import * as lessonUtils from "@/utils/lessons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import { StyleSheet } from "react-native";
import PagerView from "react-native-pager-view";

enum LessonType {
  MATCH_WORDS,
  COMPLETE_WORDS,
}

export default function PracticeScreenPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getLessonById } = useLessonStore();
  const lesson = getLessonById(id!);

  const t = useTranslation()

  const [page, setPage] = useState(0);
  const [showComplete, setShowComplete] = useState(false);

  const pagerRef = React.useRef<PagerView>(null);

  const handleComplete = useCallback(() => {
    setShowComplete(true);
  }, []);

  const goBack = useCallback(() => {
    router.back();
  }, []);

  const onNextPage = useCallback(() => {
    if (pagerRef.current) {
      pagerRef.current.setPage(page + 1);
      setPage((prev) => prev + 1);
      setShowComplete(false);
    }
  }, [page]);


  const exercises = useMemo(() => {
    if (!lesson?.vocabulary) return [];


    // Vocabulary - Match Words
    const vocab = lesson.vocabulary
    const firstCount = Math.floor(vocab.length / 2);
    const firstVocabularyLesson = vocab.slice(0, firstCount);
    const secondVocabularyLesson = vocab.slice(firstCount);

    const wordExercises = lessonUtils.createWordExercises(firstVocabularyLesson);
    const firstWordExercise = wordExercises.slice(0, firstCount);
    const secondWordExercise = wordExercises.slice(firstCount);

    return [
       ...firstWordExercise.map((exercise) => ({
        type: LessonType.COMPLETE_WORDS,
        exercise,
      })),
      {
        type:  LessonType.MATCH_WORDS,
        exercise: firstVocabularyLesson,
      },
      // ...firstWordExercise.map((exercise) => ({
      //   type: LessonType.COMPLETE_WORDS,
      //   exercise,
      // })),
      {
        type: LessonType.MATCH_WORDS,
        vocabulary: secondVocabularyLesson,
      },
         ...secondWordExercise.map((exercise) => ({
        type: LessonType.COMPLETE_WORDS,
        exercise,
      })),
    ].filter(Boolean);
  }, [lesson]);

  return (
    <SafeAreaView>
      <Layout.Header>
        <Button.Icon
          name={"arrow.backward"}
          size={24}
          color={"black"}
          onPress={goBack}
        />
      </Layout.Header>
      <PagerView
        ref={pagerRef}
        style={styles.pagerContainer}
        initialPage={0}
        scrollEnabled={false}
      >
        {exercises.map((exercise, index) => {
          if (exercise.type === LessonType.MATCH_WORDS) {
            return (
              <MatchWordsPage
                key={`page-${index}`}
                vocabulary={exercise.vocabulary}
                subheading={t('Tap the matching pairs')}
                topic={t('Vocabulary')}
                onComplete={handleComplete}
              />
            );
          }

          if (exercise.type === LessonType.COMPLETE_WORDS) {
            return (
              <CompleteTheWordPage
                key={`page-${index}`}
                exercise={exercise.exercise}
                subheading={t('Complete the word')}
                topic={t('Vocabulary')}
                onComplete={handleComplete}
              />
            );
          }

          return null;
        })}
      </PagerView>

      <AnimatedBottomContainer show={showComplete}>
        <Text.Subheading style={{ color: "white" }}>{t('Great job!')}</Text.Subheading>
        <Layout.Spacer />
        <QuickButton title="Next" secondary onPress={onNextPage} />
      </AnimatedBottomContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  pagerContainer: {
    flex: 1,
  },
});
