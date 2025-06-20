import AnimtedBottomContainer from "@/components/AnimatedBottomContainer";
import Button from "@/components/buttons/Button";
import IconButton from "@/components/buttons/IconButton";
import CompleteTheWordPage from "@/components/CompleteTheWordPage";
import * as Layout from "@/components/Layout";
import MatchWordsPage from "@/components/MatchWordsPage";
import ProgressBar from "@/components/ProgressBar";
import SafeAreaView from "@/components/SafeAreaView";
import useTranslation from "@/hooks/useTranslation";
import { useLessonStore } from "@/store/lessonStore";
import * as lessonUtils from "@/utils/lessons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { InteractionManager, StyleSheet } from "react-native";
import PagerView from "react-native-pager-view";

enum LessonType {
  MATCH_WORDS,
  COMPLETE_WORDS,
}

export default function PracticeScreenPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getLessonById } = useLessonStore();
  const lesson = getLessonById(id!);

  const t = useTranslation();

  const [page, setPage] = useState(0);
  const [showComplete, setShowComplete] = useState(false);
  const [partialLoad, setPartialLoad] = useState(true);

  const pagerRef = React.useRef<PagerView>(null);

  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      setPartialLoad(false);
    })
  }, []);

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
    const vocab = lesson.vocabulary;
    const firstCount = Math.floor(vocab.length / 2);
    const firstVocabularyLesson = vocab.slice(0, firstCount);
    const secondVocabularyLesson = vocab.slice(firstCount);

    const wordExercises = lessonUtils.createWordExercises(
      firstVocabularyLesson
    );
    const firstWordExercise = wordExercises.slice(0, firstCount);
    const secondWordExercise = wordExercises.slice(firstCount);

    return [
      {
        type: LessonType.MATCH_WORDS,
        vocabulary: firstVocabularyLesson,
      },
      ...(!partialLoad
        ? [
            ...firstWordExercise.map((exercise) => ({
              type: LessonType.COMPLETE_WORDS,
              exercise,
            })),
            {
              type: LessonType.MATCH_WORDS,
              vocabulary: secondVocabularyLesson,
            },
            ...secondWordExercise.map((exercise) => ({
              type: LessonType.COMPLETE_WORDS,
              exercise,
            })),
          ]
        : []),
    ].filter(Boolean);
  }, [lesson, partialLoad]);

  const progress = useMemo(() => {
    return Math.round((page * 100) / exercises.length);
  }, [page, exercises.length]);

  return (
    <SafeAreaView>
      <Layout.Header>
        <IconButton
          name={'arrow-back'}
          color={"black"}
          onPress={goBack}
        />
        <Layout.Spacer />
        <ProgressBar progress={progress} />
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
                subheading={t("Tap the matching pairs")}
                topic={t("Vocabulary")}
                onComplete={handleComplete}
              />
            );
          }

          if (exercise.type === LessonType.COMPLETE_WORDS) {
            return (
              <CompleteTheWordPage
                key={`page-${index}`}
                exercise={exercise.exercise}
                subheading={t("Complete the word")}
                onComplete={handleComplete}
              />
            );
          }

          return null;
        })}
      </PagerView>
      <Layout.Row padding={16} style={styles.buttonWrapper}>
        {showComplete ? (
          <Button title={t("Continue")} onPress={onNextPage} success />
        ) : (
          <Button title={t("Next")} onPress={onNextPage} secondary disabled={partialLoad} />
        )}
      </Layout.Row>
      <AnimtedBottomContainer show={showComplete} />
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
  buttonWrapper: {
    zIndex: 1,
  },
});
